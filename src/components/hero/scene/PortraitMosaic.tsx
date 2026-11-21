"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Color, MathUtils, Vector2 } from "three";
import type { ShaderMaterial, Texture } from "three";
import { hero } from "@/data/hero";
import { heroRig as rig } from "@/lib/heroRig";
import type { HeroTint, SlotRect } from "@/types";
import { portraitMosaicFragment, portraitMosaicVertex } from "../shaders/portraitMosaic";

const { mosaic, head } = hero.scene;
/** Rotation pivot in portrait uv (y up): the neck line, so the bust turns around it. */
const PIVOT: [number, number] = [0.5, 0.55];
/** Below this stage width tiles use the touch size. */
const MOBILE_WIDTH = 768;

interface PortraitMosaicProps {
  slot: React.RefObject<SlotRect>;
  map: Texture;
  tint: HeroTint;
}

/** The portrait as a pixel / voxel mosaic on a subdivided plane (see shaders/portraitMosaic.ts). */
export function PortraitMosaic({ slot, map, tint }: PortraitMosaicProps) {
  const material = useRef<ShaderMaterial>(null);
  const invalidate = useThree((state) => state.invalidate);

  const uniforms = useMemo(
    () => ({
      uMap: { value: map },
      uRes: { value: new Vector2(1, 1) },
      uSlot: { value: new Vector2(1, 1) },
      uCenter: { value: new Vector2() },
      uPivot: { value: new Vector2(...PIVOT) },
      uRot: { value: new Vector2() },
      uFocal: { value: 1000 },
      uDepth: { value: mosaic.depth },
      uCell: { value: mosaic.cellPx },
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uGap: { value: mosaic.gap },
      uRadius: { value: mosaic.radius },
      uContrast: { value: mosaic.contrast },
      uGamma: { value: mosaic.gamma },
      uGlitch: { value: mosaic.glitch },
      uFringe: { value: mosaic.fringePx },
      uBottomFade: { value: mosaic.bottomFade },
      uShadow: { value: new Color() },
      uMid: { value: new Color() },
      uHigh: { value: new Color() },
      uStreak: { value: new Color() },
      uLightPx: { value: new Vector2() },
      uLightOn: { value: 0 },
      uLightRadius: { value: 300 },
      uLightGain: { value: mosaic.lightGain },
    }),
    [map],
  );

  useEffect(() => {
    uniforms.uShadow.value.set(tint.shadow);
    uniforms.uMid.value.set(tint.mid);
    uniforms.uHigh.value.set(tint.high);
    uniforms.uStreak.value.set(tint.streak);
    invalidate();
  }, [uniforms, tint, invalidate]);

  useFrame(({ size }) => {
    const u = material.current?.uniforms;
    const s = slot.current;
    if (!u) return;
    const compact = size.width < MOBILE_WIDTH;
    const scale = MathUtils.clamp(size.width / 1440, mosaic.cellScale[0], mosaic.cellScale[1]);
    u.uRes.value.set(size.width, size.height);
    u.uSlot.value.set(s.w, s.h);
    u.uCenter.value.set(s.x + s.w / 2 - size.width / 2, size.height / 2 - (s.y + s.h / 2));
    u.uRot.value.set(rig.yaw, rig.pitch);
    u.uFocal.value = size.height * head.focal;
    u.uCell.value = compact ? mosaic.cellPxMobile : mosaic.cellPx * scale;
    u.uTime.value = rig.time;
    u.uReveal.value = rig.reveal;
    u.uGlitch.value = rig.time === 0 ? 0 : mosaic.glitch;
    u.uLightPx.value.set(rig.lightX, rig.lightY);
    u.uLightOn.value = rig.lightOn;
    u.uLightRadius.value = mosaic.lightRadius * s.h;
  });

  return (
    <mesh frustumCulled={false} renderOrder={0}>
      <planeGeometry args={[1, 1, mosaic.segments[0], mosaic.segments[1]]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={portraitMosaicVertex}
        fragmentShader={portraitMosaicFragment}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}
