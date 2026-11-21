"use client";

import { useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { damp } from "maath/easing";
import { MathUtils } from "three";
import { hero } from "@/data/hero";
import { lightState } from "@/lib/studioLight";
import { heroRig as rig } from "@/lib/heroRig";
import type { SlotRect } from "@/types";

const { head, revealSeconds } = hero.scene;
const DEG = Math.PI / 180;

interface HeroRigProps {
  slot: React.RefObject<SlotRect>;
  /** The preloader has left: start the scan-in. */
  loaded: boolean;
  /** Static frame: no time, no head movement, scene fully revealed. */
  reduced: boolean;
  /** Changes whenever a static frame has to be drawn again. */
  redrawKey: string;
}

/**
 * Updates the shared per-frame values before the meshes read them: time, scan-in, damped light
 * state and the head turn (toward the cursor, or an idle sway without one).
 */
export function HeroRig({ slot, loaded, reduced, redrawKey }: HeroRigProps) {
  const invalidate = useThree((state) => state.invalidate);
  // A demand-mode canvas (reduced motion) redraws when the layout, the tone or the activity change.
  useEffect(() => invalidate(), [invalidate, redrawKey]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    rig.width = state.size.width;
    rig.height = state.size.height;
    rig.dpr = state.viewport.dpr;
    rig.lightX = (lightState.x - 0.5) * rig.width;
    rig.lightY = (0.5 - lightState.y) * rig.height;

    if (reduced) {
      rig.time = 0;
      rig.reveal = 1;
      rig.yaw = 0;
      rig.pitch = 0;
      rig.lightOn = 0;
      return;
    }
    rig.time += dt;
    rig.reveal = loaded ? Math.min(1, rig.reveal + dt / revealSeconds) : 0;
    damp(rig, "lightOn", lightState.active ? 1 : 0, 0.25, dt);

    // Head: look at the cursor (relative to the head), or sway gently without one.
    const s = slot.current;
    const headX = s.x + s.w / 2 - rig.width / 2;
    const headY = rig.height / 2 - (s.y + s.h * 0.38);
    const dx = MathUtils.clamp((rig.lightX - headX) / (rig.width * 0.5), -1, 1);
    const dy = MathUtils.clamp((rig.lightY - headY) / (rig.height * 0.5), -1, 1);
    const sway = head.idleSwayDeg * DEG;
    const idleYaw = Math.sin(rig.time * 0.6) * sway;
    const idlePitch = Math.sin(rig.time * 0.45 + 1.3) * sway * 0.4;
    damp(rig, "yaw", MathUtils.lerp(idleYaw, dx * head.maxYawDeg * DEG, rig.lightOn), head.followSeconds, dt);
    damp(rig, "pitch", MathUtils.lerp(idlePitch, -dy * head.maxPitchDeg * DEG, rig.lightOn), head.followSeconds, dt);
  }, -1);

  return null;
}
