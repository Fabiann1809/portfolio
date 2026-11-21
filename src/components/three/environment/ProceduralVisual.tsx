"use client";

/* eslint-disable react-hooks/immutability -- three.js uniforms and objects are mutated per frame by design */

import { useEffect, useMemo, useRef } from "react";
import { createPortal, useFrame } from "@react-three/fiber";
import { LinearFilter, LinearMipmapLinearFilter, PerspectiveCamera, SRGBColorSpace, Scene, WebGLRenderTarget } from "three";
import type { Texture } from "three";
import { environment } from "@/data/environment";
import { stepJourney } from "@/lib/journey";
import { screenActiveForTarget } from "@/lib/journeyModel";
import type { ProceduralScene, ThemeColors } from "@/types";
import { CorridorScene } from "./scenes/CorridorScene";
import { GridScene } from "./scenes/GridScene";
import { SceneContext, resolveSceneColors } from "./scenes/shared";
import { TunnelScene } from "./scenes/TunnelScene";

interface ProceduralUniforms {
  uTexture: { value: Texture | null };
  uHasTexture: { value: number };
  uTexAspect: { value: number };
}

interface ProceduralVisualProps {
  index: number;
  spec: ProceduralScene;
  theme: ThemeColors;
  /** Uniform objects of the screen material that receive the render target texture. */
  uniforms: ProceduralUniforms;
}

const MIN_ASPECT = 1.3;
const MAX_ASPECT = 2.4;

/**
 * Renders a procedural scene into a capped render target that the journey screen uses as its
 * texture (so the same scene shows in the small CRT screen and the full-bleed backdrop).
 * The target is allocated on first use and the scene is only drawn while its screen is active.
 */
export function ProceduralVisual({ index, spec, theme, uniforms }: ProceduralVisualProps) {
  const active = useRef(false);
  const aspect = useRef(16 / 9);
  const target = useRef<WebGLRenderTarget | null>(null);
  const size = useRef({ width: 0, height: 0 });

  const scene = useMemo(() => new Scene(), []);
  const camera = useMemo(() => new PerspectiveCamera(62, 16 / 9, 0.1, 120), []);
  const colors = useMemo(() => resolveSceneColors(spec, theme), [spec, theme]);
  const context = useMemo(() => ({ spec, colors, active, aspect }), [spec, colors]);

  useEffect(() => {
    scene.background = colors.fog;
  }, [scene, colors]);

  useEffect(
    () => () => {
      target.current?.dispose();
      target.current = null;
      uniforms.uTexture.value = null;
      uniforms.uHasTexture.value = 0;
    },
    [uniforms],
  );

  // Decide whether the scene is needed this frame (before the scene objects update).
  useFrame((state, delta) => {
    stepJourney(state.clock.elapsedTime, delta);
    active.current = screenActiveForTarget(index);
  }, -3);

  // Render into the target once the scene objects have updated (priority < 0 keeps auto render on).
  useFrame((state) => {
    if (!active.current) return;
    const { gl } = state;
    const dpr = Math.min(state.viewport.dpr, 1.5);
    const winAspect = Math.min(MAX_ASPECT, Math.max(MIN_ASPECT, state.size.width / Math.max(1, state.size.height)));
    const width = Math.max(320, Math.min(environment.target.maxWidth, Math.round(state.size.width * dpr)));
    const height = Math.max(180, Math.min(environment.target.maxHeight, Math.round(width / winAspect)));

    let rt = target.current;
    if (!rt) {
      rt = new WebGLRenderTarget(width, height, {
        depthBuffer: true,
        generateMipmaps: true,
        minFilter: LinearMipmapLinearFilter,
        magFilter: LinearFilter,
      });
      rt.texture.colorSpace = SRGBColorSpace;
      target.current = rt;
      size.current = { width, height };
      uniforms.uTexture.value = rt.texture;
      uniforms.uHasTexture.value = 1;
    } else if (size.current.width !== width || size.current.height !== height) {
      rt.setSize(width, height);
      size.current = { width, height };
    }
    aspect.current = width / height;
    uniforms.uTexAspect.value = aspect.current;
    if (camera.aspect !== aspect.current) {
      camera.aspect = aspect.current;
      camera.updateProjectionMatrix();
    }

    const previous = gl.getRenderTarget();
    gl.setRenderTarget(rt);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(previous);
  }, -1);

  return createPortal(
    <SceneContext.Provider value={context}>
      {spec.kind === "tunnel" && <TunnelScene />}
      {spec.kind === "corridor" && <CorridorScene />}
      {spec.kind === "grid" && <GridScene />}
    </SceneContext.Provider>,
    scene,
  );
}
