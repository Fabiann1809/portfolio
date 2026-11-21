"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Color, Vector2, Vector3, Vector4 } from "three";
import type { DataTexture, ShaderMaterial } from "three";
import { hero } from "@/data/hero";
import { MASK_DOMAIN } from "@/lib/heroMask";
import { lightState } from "@/lib/studioLight";
import { heroRig as rig } from "@/lib/heroRig";
import type { HeroTint, SlotRect } from "@/types";
import { gridWallFragment, gridWallVertex } from "../shaders/gridWall";

const { grid } = hero.scene;

interface GridWallProps {
  slot: React.RefObject<SlotRect>;
  mask: DataTexture;
  tint: HeroTint;
}

/** Fullscreen wireframe wall (see shaders/gridWall.ts): drawn first, behind the portrait. */
export function GridWall({ slot, mask, tint }: GridWallProps) {
  const material = useRef<ShaderMaterial>(null);
  const invalidate = useThree((state) => state.invalidate);

  const uniforms = useMemo(
    () => ({
      uRes: { value: new Vector2(1, 1) },
      uPx: { value: 1 },
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uSlot: { value: new Vector4(0, 0, 1, 1) },
      uMaskDom: { value: new Vector4(MASK_DOMAIN.x, MASK_DOMAIN.y, MASK_DOMAIN.w, MASK_DOMAIN.h) },
      uMask: { value: mask },
      uBg: { value: new Color() },
      uGlow: { value: new Color() },
      uLine: { value: new Color() },
      uHot: { value: new Color() },
      uLight: { value: new Vector2(0.3, 0.78) },
      uLightOn: { value: 0 },
      uLightRadius: { value: grid.lightRadius },
      uLightGain: { value: grid.lightGain },
      uBaseCols: { value: grid.baseCols },
      uCellAspect: { value: grid.cellAspect },
      uCurve: { value: grid.curve },
      uLineWidth: { value: grid.lineWidthPx },
      uLineAlpha: { value: grid.lineAlpha },
      uThr: { value: new Vector3(...grid.splitThresholds) },
      uSplit: { value: grid.randomSplit },
      uFlicker: { value: grid.flicker },
      uVignette: { value: grid.vignette },
      uEdgeFringe: { value: grid.edgeFringePx },
    }),
    [mask],
  );

  useEffect(() => {
    uniforms.uBg.value.set(tint.bg);
    uniforms.uGlow.value.set(tint.glow);
    uniforms.uLine.value.set(tint.line);
    uniforms.uHot.value.set(tint.hot);
    invalidate();
  }, [uniforms, tint, invalidate]);

  useFrame(() => {
    const u = material.current?.uniforms;
    const s = slot.current;
    if (!u) return;
    u.uRes.value.set(rig.width, rig.height);
    u.uPx.value = rig.dpr;
    u.uTime.value = rig.time;
    u.uReveal.value = rig.reveal;
    u.uSlot.value.set(s.x / rig.width, 1 - (s.y + s.h) / rig.height, s.w / rig.width, s.h / rig.height);
    u.uLight.value.set(lightState.x, 1 - lightState.y);
    u.uLightOn.value = rig.lightOn;
  });

  return (
    <mesh frustumCulled={false} renderOrder={-2}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={gridWallVertex}
        fragmentShader={gridWallFragment}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}
