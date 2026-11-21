"use client";

import { Canvas } from "@react-three/fiber";
import { CrtScreen } from "./CrtScreen";

export function Scene() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <CrtScreen />
      </Canvas>
    </div>
  );
}
