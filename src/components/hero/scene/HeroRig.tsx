"use client";

import { useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { damp } from "maath/easing";
import { hero } from "@/data/hero";
import { heroRig as rig } from "@/lib/heroRig";

const { revealSeconds } = hero.scene;
/** Where the highlight rests without a mouse (top-left, as on touch devices). */
const REST = { x: 0.3, y: 0.22 };

/** Latest pointer position over the canvas (module scope: written by events, read per frame). */
const pointer = { x: REST.x, y: REST.y, active: false };

interface HeroRigProps {
  /** The preloader has left: start the scan-in. */
  loaded: boolean;
  /** Static frame: no time, no pointer highlight, wall fully revealed. */
  reduced: boolean;
  /** Changes whenever a static frame has to be drawn again. */
  redrawKey: string;
}

/**
 * Updates the shared per-frame values before the wall reads them: time, scan-in and the pointer
 * highlight (a damped copy of the mouse position over the canvas, no state).
 */
export function HeroRig({ loaded, reduced, redrawKey }: HeroRigProps) {
  const invalidate = useThree((state) => state.invalidate);
  const element = useThree((state) => state.gl.domElement);
  // A demand-mode canvas (reduced motion) redraws when the layout, the tone or the activity change.
  useEffect(() => invalidate(), [invalidate, redrawKey]);

  useEffect(() => {
    rig.lightX = REST.x;
    rig.lightY = REST.y;
    rig.lightOn = 0;
    if (reduced) return;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const r = element.getBoundingClientRect();
      pointer.x = Math.min(1, Math.max(0, (event.clientX - r.left) / (r.width || 1)));
      pointer.y = Math.min(1, Math.max(0, (event.clientY - r.top) / (r.height || 1)));
      pointer.active = true;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [element, reduced]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    rig.width = state.size.width;
    rig.height = state.size.height;
    rig.dpr = state.viewport.dpr;

    if (reduced) {
      rig.time = 0;
      rig.reveal = 1;
      rig.lightOn = 0;
      return;
    }
    rig.time += dt;
    rig.reveal = loaded ? Math.min(1, rig.reveal + dt / revealSeconds) : 0;
    damp(rig, "lightX", pointer.active ? pointer.x : REST.x, 0.14, dt);
    damp(rig, "lightY", pointer.active ? pointer.y : REST.y, 0.14, dt);
    damp(rig, "lightOn", pointer.active ? 1 : 0, 0.25, dt);
  }, -1);

  return null;
}
