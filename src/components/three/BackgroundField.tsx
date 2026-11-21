"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import type { Group } from "three";
import { getScrollState, getVelocity } from "@/lib/scrollStore";

interface BackgroundFieldProps {
  color: string;
  count?: number;
  animated: boolean;
}

// Deterministic PRNG so render stays pure.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Sparse particle field behind everything: drifts with scroll progress, stretches with velocity. */
export function BackgroundField({ color, count = 600, animated }: BackgroundFieldProps) {
  const group = useRef<Group>(null);
  const energy = useRef(0);

  const positions = useMemo(() => {
    const rand = mulberry32(7);
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      data[i * 3] = (rand() - 0.5) * 18;
      data[i * 3 + 1] = (rand() - 0.5) * 22;
      data[i * 3 + 2] = -1 - rand() * 8;
    }
    return data;
  }, [count]);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g || !animated) return;
    const { progress } = getScrollState();
    energy.current = MathUtils.damp(energy.current, Math.min(1, Math.abs(getVelocity()) / 60), 4, delta);

    g.position.y = progress * 8;
    g.rotation.x = progress * 0.6;
    g.rotation.y += delta * (0.015 + energy.current * 0.25);
    g.scale.y = 1 + energy.current * 0.5;
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color={color} size={0.035} sizeAttenuation transparent opacity={0.55} depthWrite={false} />
      </points>
    </group>
  );
}
