"use client";

/* eslint-disable react-hooks/immutability -- three.js uniforms and objects are mutated per frame by design */

import { useEffect, useMemo, useRef } from "react";
import { AdditiveBlending, BackSide, BoxGeometry, BufferAttribute, BufferGeometry, Color, InstancedMesh, Matrix4, PlaneGeometry, Points, ShaderMaterial } from "three";
import { environment } from "@/data/environment";
import { applyGlowColors, createGlowMaterial } from "./glow";
import { useSceneContext, useSceneFrame } from "./shared";
import type { SceneColors } from "./shared";
import { applySolidColors, createSolidMaterial } from "./solidMaterial";

const HALL_W = 6.2;
const HALL_H = 4.6;
const PILLAR_X = 4.3;
const MODULES = 16;

const hallVertex = /* glsl */ `
  varying vec3 vP;
  varying vec3 vN;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vP = wp.xyz;
    vN = normal;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

/** Hall shell: polished floor with the light streaking along it, dim ceiling and wall panels. */
const hallFragment = /* glsl */ `
  uniform float uTravel;
  uniform float uLength;
  uniform float uFogDensity;
  uniform float uExposure;
  uniform vec3 uBase;
  uniform vec3 uTint;
  uniform vec3 uFog;
  varying vec3 vP;
  varying vec3 vN;

  void main() {
    vec3 n = abs(normalize(vN));
    if (n.z > 0.5) discard;
    vec3 P = vP;
    float along = P.z - uTravel;
    float far = clamp(-P.z / uLength, 0.0, 1.0);
    vec3 col;
    float em = 0.0;

    if (n.y > 0.5 && P.y < 0.0) {
      // Floor: dark glossy tiles; the end light reflects as a long streak.
      vec2 t = abs(fract(vec2(P.x * 0.25, along * 0.2)) - 0.5);
      float seam = smoothstep(0.47, 0.5, max(t.x, t.y));
      col = uBase * (0.28 - 0.1 * seam);
      float streak = exp(-P.x * P.x * 0.35 / (1.0 + (-P.z) * 0.03)) * (0.12 + 0.88 * smoothstep(0.1, 1.0, far));
      em += streak * 0.75 + seam * 0.05 * smoothstep(0.2, 1.0, far);
    } else if (n.y > 0.5) {
      // Ceiling: dark, with long light slits between the beams.
      col = uBase * 0.2;
      em += smoothstep(0.12, 0.04, abs(abs(P.x) - 1.6)) * 0.35;
    } else {
      // Walls: tall panels, dim, lit towards the light.
      float panel = abs(fract(along * 0.22) - 0.5);
      col = uBase * (0.34 + 0.12 * smoothstep(0.45, 0.5, panel) + 0.35 * far * far);
      col *= 0.6 + 0.4 * smoothstep(-${HALL_H.toFixed(1)}, ${HALL_H.toFixed(1)}, P.y);
    }

    float d = length(P);
    float atten = 1.0 / (1.0 + d * d * 0.004);
    vec3 lit = col * (0.35 + atten * 1.6) * uExposure + uTint * em;
    float fog = clamp(1.0 - exp(-d * d * uFogDensity), 0.0, 1.0);
    gl_FragColor = vec4(mix(lit, uFog, fog), 1.0);
    #include <colorspace_fragment>
  }
`;

const dustVertex = /* glsl */ `
  uniform float uScale;
  attribute float aSize;
  varying float vFade;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uScale / max(0.1, -mv.z);
    vFade = smoothstep(46.0, 8.0, -mv.z) * smoothstep(0.2, 2.0, -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const dustFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uAlpha;
  varying float vFade;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, r) * vFade * uAlpha;
    gl_FragColor = vec4(uColor * a, a);
    #include <colorspace_fragment>
  }
`;

const matrix = new Matrix4();

function setBox(mesh: InstancedMesh, index: number, x: number, y: number, z: number, sx: number, sy: number, sz: number) {
  matrix.makeScale(sx, sy, sz);
  matrix.setPosition(x, y, z);
  mesh.setMatrixAt(index, matrix);
}

function hallFog(colors: SceneColors) {
  return colors.fog.clone().lerp(colors.tint, colors.light ? 0.05 : 0.2);
}

/** Cold architectural hall: pillars and beams receding to a bright light, drifting dust. */
export function CorridorScene() {
  const { colors, spec } = useSceneContext();
  const variant = spec.variant ?? 0;
  const spacing = 4.2 + variant * 1.1;
  const length = MODULES * spacing;
  const dustCount = environment.scene.dustCount;
  const pillars = useRef<InstancedMesh>(null);
  const beams = useRef<InstancedMesh>(null);
  const dust = useRef<Points>(null);

  const fogDensity = colors.light ? 0.0006 : 0.0011;
  const hallColors = useMemo<SceneColors>(() => ({ ...colors, fog: hallFog(colors) }), [colors]);

  const boxGeometry = useMemo(() => new BoxGeometry(1, 1, 1), []);
  const hallGeometry = useMemo(() => new BoxGeometry(HALL_W * 2, HALL_H * 2, length), [length]);
  const glowGeometry = useMemo(() => new PlaneGeometry(26, 15), []);
  const pillarMaterial = useMemo(() => createSolidMaterial(hallColors, { fogDensity, trim: 0.15, slit: 1, headlight: 1.4 }), [hallColors, fogDensity]);
  const beamMaterial = useMemo(() => createSolidMaterial(hallColors, { fogDensity, trim: 0.35, slit: 0, headlight: 1.2 }), [hallColors, fogDensity]);
  const glow = useMemo(() => createGlowMaterial(colors, 1), [colors]);
  const hall = useMemo(
    () =>
      new ShaderMaterial({
        side: BackSide,
        vertexShader: hallVertex,
        fragmentShader: hallFragment,
        uniforms: {
          uTravel: { value: 0 },
          uLength: { value: length },
          uFogDensity: { value: fogDensity },
          uExposure: { value: colors.exposure },
          uBase: { value: colors.base.clone() },
          uTint: { value: colors.tint.clone() },
          uFog: { value: hallColors.fog.clone() },
        },
      }),
    [colors, hallColors, length, fogDensity],
  );

  const dustGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    const positions = new Float32Array(dustCount * 3);
    const sizes = new Float32Array(dustCount);
    let seed = 7 + variant * 31;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < dustCount; i++) {
      positions[i * 3] = (rnd() - 0.5) * HALL_W * 1.6;
      positions[i * 3 + 1] = (rnd() - 0.5) * HALL_H * 1.6;
      positions[i * 3 + 2] = -rnd() * 42;
      sizes[i] = 0.5 + rnd() * 1.6;
    }
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    geometry.setAttribute("aSize", new BufferAttribute(sizes, 1));
    return geometry;
  }, [dustCount, variant]);

  const dustMaterial = useMemo(
    () =>
      new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        vertexShader: dustVertex,
        fragmentShader: dustFragment,
        uniforms: {
          uScale: { value: 60 },
          uColor: { value: new Color().copy(colors.tint).lerp(new Color(1, 1, 1), 0.5) },
          uAlpha: { value: colors.light ? 0.35 : 0.7 },
        },
      }),
    [colors],
  );

  useEffect(() => {
    applySolidColors(pillarMaterial, hallColors);
    applySolidColors(beamMaterial, hallColors);
    applyGlowColors(glow, colors);
  }, [pillarMaterial, beamMaterial, glow, colors, hallColors]);

  useEffect(
    () => () => {
      boxGeometry.dispose();
      hallGeometry.dispose();
      glowGeometry.dispose();
      dustGeometry.dispose();
      pillarMaterial.dispose();
      beamMaterial.dispose();
      glow.dispose();
      hall.dispose();
      dustMaterial.dispose();
    },
    [boxGeometry, hallGeometry, glowGeometry, dustGeometry, pillarMaterial, beamMaterial, glow, hall, dustMaterial],
  );

  useSceneFrame((state, _delta, travel) => {
    const time = state.clock.elapsedTime;
    hall.uniforms.uTravel.value = travel;
    glow.uniforms.uTime.value = time;
    dustMaterial.uniforms.uScale.value = state.size.height * 0.1;
    if (dust.current) {
      // Dust wraps along the travel direction and drifts slowly sideways / up.
      dust.current.position.z = (travel * 0.6) % 42;
      dust.current.position.y = Math.sin(time * 0.15) * 0.15;
      dust.current.position.x = Math.cos(time * 0.11) * 0.2;
    }
    const columns = pillars.current;
    const arches = beams.current;
    if (!columns || !arches) return;
    for (let i = 0; i < MODULES; i++) {
      const z = -((((i * spacing - travel) % length) + length) % length) - 0.5;
      setBox(columns, i * 2, -PILLAR_X, 0, z, 1.1, HALL_H * 2, 1.1);
      setBox(columns, i * 2 + 1, PILLAR_X, 0, z, 1.1, HALL_H * 2, 1.1);
      setBox(arches, i, 0, HALL_H - 0.6, z, HALL_W * 2, 0.7, 0.9);
    }
    columns.instanceMatrix.needsUpdate = true;
    arches.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <mesh geometry={hallGeometry} material={hall} position={[0, 0, -length / 2]} frustumCulled={false} />
      <instancedMesh ref={pillars} args={[boxGeometry, pillarMaterial, MODULES * 2]} frustumCulled={false} />
      <instancedMesh ref={beams} args={[boxGeometry, beamMaterial, MODULES]} frustumCulled={false} />
      <mesh geometry={glowGeometry} material={glow} position={[0, 0.4, -length + 1]} />
      <points ref={dust} geometry={dustGeometry} material={dustMaterial} frustumCulled={false} />
    </>
  );
}
