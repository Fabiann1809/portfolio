"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { damp } from "maath/easing";
import { Color, MathUtils, SRGBColorSpace, TextureLoader } from "three";
import type { Mesh, ShaderMaterial, Texture } from "three";
import { journeyConfig } from "@/data/chapters";
import { getJourneyState, stepJourney } from "@/lib/journey";
import { poses } from "@/lib/journeyModel";
import type { ScreenDef } from "@/lib/journeyModel";
import { screenFragmentShader, screenVertexShader } from "./shaders/screen";

interface JourneyScreenProps {
  index: number;
  def: ScreenDef;
  primary: string;
  accent: string;
}

const { stream, screen, fx, smooth } = journeyConfig;

/**
 * One curved CRT screen of the journey. Its pose (stream position, fill, opacity) comes from
 * the shared journey model; every value is damped per frame before it reaches the mesh.
 */
export function JourneyScreen({ index, def, primary, accent }: JourneyScreenProps) {
  const mesh = useRef<Mesh>(null);
  const material = useRef<ShaderMaterial>(null);
  const texture = useRef<Texture | null>(null);
  const seen = useRef(false);
  const cur = useRef({ x: 0, y: 0, z: 0, w: 1, h: 1, sc: 1, rx: 0, ry: 0, rz: 0, fill: 0, opacity: 0 });

  const seed = (index * 0.37 + 0.11) % 1;
  const uniforms = useMemo(
    () => ({
      uTexture: { value: null as Texture | null },
      uHasTexture: { value: 0 },
      uTexAspect: { value: screen.aspect },
      uPlaneAspect: { value: screen.aspect },
      uCurve: { value: 0 },
      uSize: { value: 1 },
      uSmear: { value: 0 },
      uRgb: { value: fx.rgbBase },
      uScan: { value: fx.scan },
      uVignette: { value: fx.vignette },
      uFill: { value: 0 },
      uOpacity: { value: 0 },
      uTime: { value: 0 },
      uBezel: { value: 1 },
      uDim: { value: 0 },
      uSeed: { value: seed },
      uDrift: { value: 0 },
      uColorA: { value: new Color(index % 2 === 0 ? primary : accent) },
      uColorB: { value: new Color(index % 2 === 0 ? accent : primary) },
    }),
    [index, seed, primary, accent],
  );

  useEffect(() => {
    if (!def.visual) return;
    let cancelled = false;
    new TextureLoader().load(
      def.visual,
      (loaded) => {
        if (cancelled) {
          loaded.dispose();
          return;
        }
        loaded.colorSpace = SRGBColorSpace;
        texture.current = loaded;
        const img = loaded.image as { width: number; height: number };
        const mat = material.current;
        if (mat) {
          mat.uniforms.uTexture.value = loaded;
          mat.uniforms.uHasTexture.value = 1;
          mat.uniforms.uTexAspect.value = img.width / img.height;
        }
      },
      undefined,
      () => {},
    );
    return () => {
      cancelled = true;
      texture.current?.dispose();
      texture.current = null;
    };
  }, [def.visual]);

  useFrame((state, delta) => {
    stepJourney(state.clock.elapsedTime, delta);
    const m = mesh.current;
    const mat = material.current;
    if (!m || !mat) return;

    const pose = poses[index];
    const visible = Math.abs(pose.r) < 2.4 && pose.opacity > 0.002;
    m.visible = visible;
    if (!visible) {
      seen.current = false;
      return;
    }

    const dt = Math.min(delta, journeyConfig.maxDelta);
    const vp = state.viewport;
    const c = cur.current;
    const k = 1 - pose.fill;
    const dist = Math.min(Math.abs(pose.r), 2);

    const restW = Math.min(vp.width * screen.widthRatio, vp.height * screen.maxHeightRatio * screen.aspect);
    const restH = restW / screen.aspect;
    const target = {
      x: pose.r * stream.offsetX * vp.width * k,
      y: -pose.r * stream.offsetY * vp.height * k,
      z: -dist * stream.depth * k,
      w: MathUtils.lerp(restW, vp.width * screen.overscan, pose.fill),
      h: MathUtils.lerp(restH, vp.height * screen.overscan, pose.fill),
      sc: 1 - stream.scaleFalloff * dist * k,
      rx: -pose.r * stream.tiltX * k,
      ry: -pose.r * stream.tiltY * k,
      rz: pose.r * stream.tiltZ * k,
      fill: pose.fill,
      opacity: pose.opacity,
    };

    if (!seen.current) {
      Object.assign(c, target);
      seen.current = true;
    } else {
      damp(c, "x", target.x, smooth.position, dt);
      damp(c, "y", target.y, smooth.position, dt);
      damp(c, "z", target.z, smooth.position, dt);
      damp(c, "rx", target.rx, smooth.position, dt);
      damp(c, "ry", target.ry, smooth.position, dt);
      damp(c, "rz", target.rz, smooth.position, dt);
      damp(c, "sc", target.sc, smooth.shape, dt);
      damp(c, "w", target.w, smooth.shape, dt);
      damp(c, "h", target.h, smooth.shape, dt);
      damp(c, "fill", target.fill, smooth.shape, dt);
      damp(c, "opacity", target.opacity, smooth.shape, dt);
    }

    m.position.set(c.x, c.y, c.z);
    m.rotation.set(c.rx, c.ry, c.rz);
    m.scale.set(c.w * c.sc, c.h * c.sc, 1);
    m.renderOrder = pose.layer;

    const journey = getJourneyState();
    const un = mat.uniforms;
    un.uTime.value = state.clock.elapsedTime;
    un.uSize.value = c.w * c.sc;
    un.uPlaneAspect.value = c.w / c.h;
    un.uFill.value = c.fill;
    un.uOpacity.value = c.opacity;
    un.uCurve.value = screen.curve * Math.pow(Math.max(0, 1 - c.fill), 1.5);
    un.uBezel.value = 1 - MathUtils.smoothstep(c.fill, 0.35, 0.95);
    un.uDim.value = fx.dimFilled * c.fill;
    un.uSmear.value = journey.smear;
    un.uRgb.value = fx.rgbBase + journey.smear * fx.rgbGain;
    un.uDrift.value = journey.drift + state.clock.elapsedTime * 0.05;
  });

  return (
    <mesh ref={mesh} visible={false}>
      <planeGeometry args={[1, 1, 40, 40]} />
      <shaderMaterial
        ref={material}
        vertexShader={screenVertexShader}
        fragmentShader={screenFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
