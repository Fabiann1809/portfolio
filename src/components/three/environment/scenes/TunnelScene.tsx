"use client";

/* eslint-disable react-hooks/immutability -- three.js uniforms and objects are mutated per frame by design */

import { useEffect, useMemo, useRef } from "react";
import { BackSide, BoxGeometry, InstancedMesh, Matrix4, PlaneGeometry, ShaderMaterial } from "three";
import { applyGlowColors, createGlowMaterial } from "./glow";
import { useSceneContext, useSceneFrame } from "./shared";
import { applySolidColors, createSolidMaterial } from "./solidMaterial";

const HALF_W = 2.7;
const HALF_H = 1.75;
const MODULES = 20;
const PIECES = 4;

const shellVertex = /* glsl */ `
  varying vec3 vP;
  varying vec3 vN;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vP = wp.xyz;
    vN = normal;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

/** PCB-like greebles on the corridor shell: tiles, chips with pins, traces with vias, light strips. */
const shellFragment = /* glsl */ `
  uniform float uTravel;
  uniform float uSeed;
  uniform float uFogDensity;
  uniform float uExposure;
  uniform vec3 uBase;
  uniform vec3 uTint;
  uniform vec3 uFog;
  varying vec3 vP;
  varying vec3 vN;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  void main() {
    vec3 n = abs(normalize(vN));
    if (n.z > 0.5) discard;
    vec3 P = vP;
    bool flatFace = n.y > 0.5;
    float along = P.z - uTravel;
    vec2 g = flatFace ? vec2(P.x, along) : vec2(P.y, along);
    vec2 q = g * 1.5;
    vec2 cell = floor(q);
    vec2 f = fract(q);
    float h = hash(cell + uSeed);

    vec3 col = uBase * (0.5 + 0.35 * hash(cell * 1.7 + 3.0));
    float seam = min(min(f.x, 1.0 - f.x), min(f.y, 1.0 - f.y));
    col *= 0.5 + 0.5 * smoothstep(0.0, 0.05, seam);
    float em = 0.0;

    if (h > 0.72) {
      vec2 a = abs(f - 0.5);
      float m = max(a.x, a.y);
      col = mix(col, uBase * 1.6, step(m, 0.28) * 0.85);
      float pins = step(0.5, fract(f.x * 8.0)) * step(0.28, m) * step(m, 0.36) * step(min(a.x, a.y), 0.3);
      em += pins * 0.7 * step(0.7, hash(cell + 7.0));
    } else if (h < 0.4) {
      float lane = floor(f.x * 4.0);
      float lx = abs(fract(f.x * 4.0) - 0.5);
      float on = step(0.5, hash(vec2(cell.x * 4.0 + lane, cell.y + uSeed)));
      float tr = step(lx, 0.035) * on;
      col += uBase * 0.9 * tr;
      float via = smoothstep(0.12, 0.08, length(vec2(lx, fract(f.y * 2.0) - 0.5) * vec2(1.0, 0.5))) * on;
      em += via * step(0.78, hash(cell + lane));
    }

    // Light strips: ceiling centre line and a dashed wall line.
    float dash = step(fract(along * 0.35), 0.72);
    if (flatFace && P.y > 0.0) em += smoothstep(0.12, 0.04, abs(P.x)) * (0.55 + 0.45 * dash);
    if (!flatFace) em += smoothstep(0.05, 0.02, abs(P.y + 0.15)) * dash;
    if (flatFace && P.y < 0.0) col *= 0.7;

    float d = length(P);
    vec3 N = normalize(vN);
    float facing = abs(dot(normalize(-P), N));
    float atten = 1.0 / (1.0 + d * d * 0.01);
    vec3 lit = col * (0.18 + (0.4 + 0.9 * facing) * atten * 2.2) * uExposure + uTint * em * 1.7;
    float fog = clamp(1.0 - exp(-d * d * uFogDensity), 0.0, 1.0);
    gl_FragColor = vec4(mix(lit, uFog, fog), 1.0);
    #include <colorspace_fragment>
  }
`;

const matrix = new Matrix4();

function setBox(mesh: InstancedMesh, index: number, x: number, y: number, z: number, sx: number, sy: number, sz: number) {
  matrix.makeScale(sx, sy, sz);
  matrix.setPosition(x, y, z);
  mesh.setMatrixAt(index, matrix);
}

/** Symmetrical corridor of repeated mechanical modules with PCB greebles, fog to the end. */
export function TunnelScene() {
  const { colors, spec } = useSceneContext();
  const variant = spec.variant ?? 0;
  const spacing = 2.6 + variant * 0.7;
  const length = MODULES * spacing;
  const ribs = useRef<InstancedMesh>(null);
  const bars = useRef<InstancedMesh>(null);

  const fogDensity = colors.light ? 0.0009 : 0.0016;
  const boxGeometry = useMemo(() => new BoxGeometry(1, 1, 1), []);
  const shellGeometry = useMemo(() => new BoxGeometry(HALF_W * 2, HALF_H * 2, length), [length]);
  const glowGeometry = useMemo(() => new PlaneGeometry(18, 10), []);
  const solid = useMemo(() => createSolidMaterial(colors, { fogDensity, trim: 1, slit: 0 }), [colors, fogDensity]);
  const barMaterial = useMemo(() => createSolidMaterial(colors, { fogDensity, trim: 2.5, slit: 0 }), [colors, fogDensity]);
  const glow = useMemo(() => createGlowMaterial(colors, 0.4), [colors]);
  const shell = useMemo(
    () =>
      new ShaderMaterial({
        side: BackSide,
        vertexShader: shellVertex,
        fragmentShader: shellFragment,
        uniforms: {
          uTravel: { value: 0 },
          uSeed: { value: variant * 13.7 },
          uFogDensity: { value: fogDensity },
          uExposure: { value: colors.exposure },
          uBase: { value: colors.base.clone() },
          uTint: { value: colors.tint.clone() },
          uFog: { value: colors.fog.clone() },
        },
      }),
    [colors, variant, fogDensity],
  );

  useEffect(() => {
    applySolidColors(solid, colors);
    applySolidColors(barMaterial, colors);
    applyGlowColors(glow, colors);
  }, [solid, barMaterial, glow, colors]);

  useEffect(
    () => () => {
      boxGeometry.dispose();
      shellGeometry.dispose();
      glowGeometry.dispose();
      solid.dispose();
      barMaterial.dispose();
      glow.dispose();
      shell.dispose();
    },
    [boxGeometry, shellGeometry, glowGeometry, solid, barMaterial, glow, shell],
  );

  useSceneFrame((state, _delta, travel) => {
    shell.uniforms.uTravel.value = travel;
    glow.uniforms.uTime.value = state.clock.elapsedTime;
    const frames = ribs.current;
    const lightBars = bars.current;
    if (!frames || !lightBars) return;
    for (let i = 0; i < MODULES; i++) {
      const z = -((((i * spacing - travel) % length) + length) % length) - 0.6;
      const full = i % 2 === 0;
      const base = i * PIECES;
      if (full) {
        setBox(frames, base, -(HALF_W - 0.3), 0, z, 0.6, HALF_H * 2, 0.55);
        setBox(frames, base + 1, HALF_W - 0.3, 0, z, 0.6, HALF_H * 2, 0.55);
        setBox(frames, base + 2, 0, HALF_H - 0.22, z, HALF_W * 2, 0.44, 0.55);
        setBox(frames, base + 3, 0, -(HALF_H - 0.22), z, HALF_W * 2, 0.44, 0.55);
        setBox(lightBars, i * 2, 0, 0, z, 0, 0, 0);
        setBox(lightBars, i * 2 + 1, 0, 0, z, 0, 0, 0);
      } else {
        for (let p = 0; p < PIECES; p++) setBox(frames, base + p, 0, 0, z, 0, 0, 0);
        // Slim light bars across floor and ceiling on the in-between modules.
        setBox(lightBars, i * 2, 0, HALF_H - 0.05, z, HALF_W * 1.5, 0.08, 0.12);
        setBox(lightBars, i * 2 + 1, 0, -(HALF_H - 0.05), z, HALF_W * 1.5, 0.08, 0.12);
      }
    }
    frames.instanceMatrix.needsUpdate = true;
    lightBars.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <mesh geometry={shellGeometry} material={shell} position={[0, 0, -length / 2]} frustumCulled={false} />
      <instancedMesh ref={ribs} args={[boxGeometry, solid, MODULES * PIECES]} frustumCulled={false} />
      <instancedMesh ref={bars} args={[boxGeometry, barMaterial, MODULES * 2]} frustumCulled={false} />
      <mesh geometry={glowGeometry} material={glow} position={[0, 0, -length + 1.2]} />
    </>
  );
}
