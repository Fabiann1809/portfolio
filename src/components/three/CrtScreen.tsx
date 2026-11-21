"use client";

import { crtFragmentShader, crtVertexShader } from "./shaders/crt";

// PLACEHOLDER mesh: replace with the real CRT screen.
export function CrtScreen() {
  return (
    <mesh>
      <planeGeometry args={[3, 2]} />
      <shaderMaterial vertexShader={crtVertexShader} fragmentShader={crtFragmentShader} />
    </mesh>
  );
}
