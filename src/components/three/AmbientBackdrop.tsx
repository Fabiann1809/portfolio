"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color } from "three";
import type { ShaderMaterial } from "three";
import type { ThemeColors } from "@/types";
import { getJourneyState, stepJourney } from "@/lib/journey";
import { ambientFragmentShader, ambientVertexShader } from "./shaders/screen";

/** Full-viewport backdrop behind the screens, tinted from the theme (radial falloff + faint grid). */
export function AmbientBackdrop({ theme }: { theme: ThemeColors }) {
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
    const mat = material.current;
    if (!mat) return;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uScroll.value = getJourneyState().value;
    mat.uniforms.uAspect.value = state.viewport.aspect;
  });

  return (
    <mesh renderOrder={-10} frustumCulled={false}>
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
