"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color } from "three";
import type { ShaderMaterial } from "three";
import { getJourneyState, stepJourney } from "@/lib/journey";
import { ambientFragmentShader, ambientVertexShader } from "./shaders/screen";

/** Dark full-viewport backdrop behind the screens (radial falloff + faint drifting grid). */
export function AmbientBackdrop({ color }: { color: string }) {
  const material = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uAspect: { value: 1 },
      uColor: { value: new Color(color) },
    }),
    [color],
  );

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
