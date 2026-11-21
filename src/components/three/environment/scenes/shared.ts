import { createContext, useContext } from "react";
import type { MutableRefObject } from "react";
import { Color } from "three";
import { useFrame } from "@react-three/fiber";
import type { RootState } from "@react-three/fiber";
import { environment } from "@/data/environment";
import { getScrollState } from "@/lib/scrollStore";
import type { ProceduralScene, ThemeColors } from "@/types";

/** Colors every procedural scene derives from its spec and the active theme. */
export interface SceneColors {
  /** Single saturated accent (emissive strips, lights). */
  tint: Color;
  /** Desaturated body color of surfaces. */
  base: Color;
  /** Fog / far distance color. */
  fog: Color;
  light: boolean;
  exposure: number;
}

export interface SceneContextValue {
  spec: ProceduralScene;
  colors: SceneColors;
  /** True while the scene is rendered this frame. */
  active: MutableRefObject<boolean>;
  /** Aspect ratio (width / height) of the render target. */
  aspect: MutableRefObject<number>;
}

export const SceneContext = createContext<SceneContextValue | null>(null);

export function useSceneContext(): SceneContextValue {
  const ctx = useContext(SceneContext);
  if (!ctx) throw new Error("Procedural scene used outside <ProceduralVisual>");
  return ctx;
}

function luminance(color: Color) {
  return 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
}

const hsl = { h: 0, s: 0, l: 0 };

/** Accent from tokens (or a hex), a desaturated body color and a fog color; brighter on light themes. */
export function resolveSceneColors(spec: ProceduralScene, theme: ThemeColors): SceneColors {
  const tintValue = spec.tint === "primary" ? theme.primary : spec.tint === "accent" ? theme.accent : spec.tint;
  const tint = new Color(tintValue);
  const light = luminance(new Color(theme.background)) > 0.35;
  tint.getHSL(hsl);
  const base = new Color().setHSL(hsl.h, 0.1, light ? 0.34 : 0.17);
  const fog = new Color().setHSL(hsl.h, light ? 0.12 : 0.35, light ? 0.62 : 0.018);
  return {
    tint,
    base,
    fog,
    light,
    exposure: light ? environment.scene.lightExposure : environment.scene.darkExposure,
  };
}

/** Camera travel along the scene, driven by the page scroll (plus a slow idle drift). */
export function sceneTravel(spec: ProceduralScene, time: number): number {
  const vh = typeof window === "undefined" ? 1 : window.innerHeight || 1;
  const speed = spec.speed ?? 1;
  return (getScrollState().scroll / vh) * environment.scene.travelPerVh * speed + time * environment.scene.idleTravel * speed;
}

/** `useFrame` that only runs while the scene is being rendered (runs before the render pass). */
export function useSceneFrame(callback: (state: RootState, delta: number, travel: number) => void) {
  const { active, spec } = useSceneContext();
  useFrame((state, delta) => {
    if (!active.current) return;
    callback(state, delta, sceneTravel(spec, state.clock.elapsedTime));
  }, -2);
}
