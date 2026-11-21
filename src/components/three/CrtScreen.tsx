"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Color, MathUtils, SRGBColorSpace, TextureLoader } from "three";
import type { Group, ShaderMaterial, Texture } from "three";
import { getSectionOffset, getVelocity } from "@/lib/scrollStore";
import { crtFragmentShader, crtVertexShader } from "./shaders/crt";

interface CrtScreenProps {
  image: string;
  index: number;
  /** Id of the registered pinned section that drives this screen. */
  sectionId: string;
  /** Placeholder color used while the image is missing. */
  tint: string;
}

const ASPECT = 16 / 10;
/** Scroll distance (in viewport heights) around the centre where the screen rests. */
const HOLD = 0.2;

/**
 * A curved CRT screen living in world space of the shared background canvas.
 * Its position is derived every frame from the pinned section's scroll offset:
 * it enters diagonally from the bottom-right, rests centred, then leaves top-left.
 */
export function CrtScreen({ image, index, sectionId, tint }: CrtScreenProps) {
  const group = useRef<Group>(null);
  const material = useRef<ShaderMaterial>(null);
  const intensity = useRef(0);
  const viewport = useThree((state) => state.viewport);
  const [texture, setTexture] = useState<Texture | null>(null);

  useEffect(() => {
    let cancelled = false;
    new TextureLoader().load(
      image,
      (loaded) => {
        if (cancelled) {
          loaded.dispose();
          return;
        }
        loaded.colorSpace = SRGBColorSpace;
        setTexture(loaded);
      },
      undefined,
      () => {},
    );
    return () => {
      cancelled = true;
    };
  }, [image]);

  useEffect(() => () => texture?.dispose(), [texture]);

  const uniforms = useMemo(
    () => ({
      uMap: { value: null as Texture | null },
      uHasMap: { value: 0 },
      uTime: { value: 0 },
      uIntensity: { value: 0 },
      uAlpha: { value: 1 },
      uTint: { value: new Color(tint) },
    }),
    [tint],
  );

  const width = Math.min(viewport.width * 0.5, viewport.height * 0.64 * ASPECT);
  const height = width / ASPECT;

  useFrame((state, delta) => {
    const g = group.current;
    const mat = material.current;
    if (!g || !mat) return;

    const offset = getSectionOffset(sectionId);
    if (offset === null) {
      g.visible = false;
      return;
    }
    const u = offset - index;
    // d: 0 while resting, 1 when fully off screen. f keeps the direction (-1 incoming, +1 outgoing).
    const d = Math.max(0, (Math.abs(u) - HOLD) / (1 - HOLD));
    if (d >= 1) {
      g.visible = false;
      return;
    }
    g.visible = true;
    const f = Math.sign(u) * d;
    const eased = Math.sign(f) * MathUtils.smootherstep(Math.abs(f), 0, 1);

    g.position.set(-eased * viewport.width * 0.65, eased * viewport.height * 0.75, 0);
    g.rotation.set(-eased * 0.3, eased * 0.7, -eased * 0.15);
    g.scale.setScalar(1 - d * 0.2);

    intensity.current = MathUtils.damp(intensity.current, Math.min(1, Math.abs(getVelocity()) / 60), 5, delta);
    const un = mat.uniforms;
    un.uMap.value = texture;
    un.uHasMap.value = texture ? 1 : 0;
    un.uTime.value = state.clock.elapsedTime;
    un.uIntensity.value = intensity.current;
    un.uAlpha.value = 1 - MathUtils.smoothstep(d, 0.6, 1);
  });

  return (
    <group ref={group} visible={false}>
      <mesh scale={[width, height, 1]}>
        <planeGeometry args={[1, 1, 24, 24]} />
        <shaderMaterial
          ref={material}
          vertexShader={crtVertexShader}
          fragmentShader={crtFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
