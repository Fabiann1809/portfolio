"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color } from "three";
import type { Mesh, ShaderMaterial } from "three";
import type { ThemeColors } from "@/types";
import { getJourneyState, stepJourney } from "@/lib/journey";
import { live } from "@/lib/journeyModel";
import { ambientFragmentShader, ambientVertexShader } from "./shaders/screen";

/** Full-viewport backdrop behind the screens, tinted from the theme (radial falloff + faint grid). */
export function AmbientBackdrop({ theme }: { theme: ThemeColors }) {
  const mesh = useRef<Mesh>(null);
  const material = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uAspect: { value: 1 },
      uColor: { value: new Color() },
      uBg: { value: new Color() },
      uFg: { value: new Color() },
    }),
    [],
  );

  useEffect(() => {
    uniforms.uColor.value.set(theme.primary);
    uniforms.uBg.value.set(theme.background);
    uniforms.uFg.value.set(theme.foreground);
  }, [uniforms, theme]);

  useFrame((state, delta) => {
    stepJourney(state.clock.elapsedTime, delta);
    if (mesh.current) mesh.current.visible = live.studio < 0.99;
    const mat = material.current;
    if (!mat) return;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uScroll.value = getJourneyState().value;
    mat.uniforms.uAspect.value = state.viewport.aspect;
  });

  return (
    <mesh ref={mesh} renderOrder={-10} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={ambientVertexShader}
        fragmentShader={ambientFragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}
