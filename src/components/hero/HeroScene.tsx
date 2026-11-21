"use client";

import { useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import { hero } from "@/data/hero";
import { useLoader, useLoaderProgress } from "@/components/loader/LoaderProvider";
import { useHeroActive } from "@/hooks/useHeroActive";
import { useHeroTint } from "@/hooks/useHeroTint";
import { usePortraitTexture } from "@/hooks/usePortraitTexture";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSlotRect } from "@/hooks/useSlotRect";
import { hasWebGL } from "@/lib/webgl";
import { useHeroStage } from "./HeroStageContext";
import { GridWall } from "./scene/GridWall";
import { HeroRig } from "./scene/HeroRig";
import { PortraitMosaic } from "./scene/PortraitMosaic";

const noopSubscribe = () => () => {};

/**
 * The hero's own WebGL canvas, absolute behind the DOM text: wireframe grid wall + portrait
 * mosaic. It renders only while the hero is on screen, the tab is visible and the journey has not
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
  const { map, mask, progress } = usePortraitTexture(webgl);
  useLoaderProgress("hero", progress, webgl);


  if (!webgl) return null;
  const frameloop = !active ? "never" : reduced ? "demand" : "always";
  const redrawKey = `${version}|${active}|${reduced}|${loaded}|${map ? 1 : 0}`;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      <Canvas
        dpr={[1, hero.scene.maxDpr]}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        frameloop={frameloop}
        flat
        style={{ pointerEvents: "none" }}
      >
        <HeroRig slot={slot} loaded={loaded} reduced={reduced} redrawKey={redrawKey} />
        {map && mask && (
          <>
            <GridWall slot={slot} mask={mask} tint={tint} />
            <PortraitMosaic slot={slot} map={map} tint={tint} />
          </>
        )}
      </Canvas>
    </div>
  );
}
