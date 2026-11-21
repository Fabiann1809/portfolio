"use client";

import { useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import { hero } from "@/data/hero";
import { useLoader, useLoaderProgress } from "@/components/loader/LoaderProvider";
import { useHeroActive } from "@/hooks/useHeroActive";
import { useHeroTint } from "@/hooks/useHeroTint";
import { usePortraitMask } from "@/hooks/usePortraitMask";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSlotRect } from "@/hooks/useSlotRect";
import { hasWebGL } from "@/lib/webgl";
import { useHeroStage } from "./HeroStageContext";
import { GridWall } from "./scene/GridWall";
import { HeroRig } from "./scene/HeroRig";

const noopSubscribe = () => () => {};

/**
 * The hero's own WebGL canvas, absolute behind the photo and the DOM text: the wireframe grid
 * wall (the photo itself is a plain image). It renders only while the hero is on screen, the tab is visible and the journey has not
 * faded the hero out; with reduced motion it draws one static frame (demand) per change.
 */
export function HeroScene() {
  const stage = useHeroStage();
  const webgl = useSyncExternalStore(noopSubscribe, hasWebGL, () => true);
  const reduced = useReducedMotion();
  const active = useHeroActive(stage);
  const tint = useHeroTint();
  const { loaded } = useLoader();
  const { rect: slot, version } = useSlotRect(stage);
  const { mask, progress } = usePortraitMask(webgl);
  useLoaderProgress("hero", progress, webgl);

  if (!webgl) return null;
  const frameloop = !active ? "never" : reduced ? "demand" : "always";
  const redrawKey = `${version}|${active}|${reduced}|${loaded}|${mask ? 1 : 0}`;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      <Canvas
        dpr={[1, hero.scene.maxDpr]}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        frameloop={frameloop}
        flat
        style={{ pointerEvents: "none" }}
      >
        <HeroRig loaded={loaded} reduced={reduced} redrawKey={redrawKey} />
        {mask && <GridWall slot={slot} mask={mask} tint={tint} />}
      </Canvas>
    </div>
  );
}
