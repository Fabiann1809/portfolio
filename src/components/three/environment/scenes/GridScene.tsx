"use client";

/* eslint-disable react-hooks/immutability -- three.js uniforms and objects are mutated per frame by design */

import { useEffect, useMemo } from "react";
import { Color, DoubleSide, PlaneGeometry, ShaderMaterial } from "three";
import { useSceneContext, useSceneFrame } from "./shared";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/**
 * Dark wireframe room (analytic ray / plane intersection) with barrel distortion, a slow
 * drift and glowing line crossings. Calm on purpose: it sits behind long text sections.
 */
const fragment = /* glsl */ `
  uniform float uTime;
  uniform float uTravel;
  uniform float uAspect;
  uniform float uSeed;
  uniform float uExposure;
  uniform vec3 uTint;
  uniform vec3 uBase;
  uniform vec3 uFog;
  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float gridLine(vec2 g, float width) {
    vec2 f = abs(fract(g) - 0.5);
    vec2 w = fwidth(g) * 0.5 + width;
    vec2 l = smoothstep(0.5 - w, vec2(0.5), f);
    return max(l.x, l.y);
  }

  void main() {
    vec2 uv = (vUv - 0.5) * vec2(uAspect, 1.0);
    uv *= 1.0 + 0.16 * dot(uv, uv);

    vec3 ro = vec3(sin(uTime * 0.07 + uSeed) * 0.25, cos(uTime * 0.05 + uSeed) * 0.12, 0.0);
    vec3 rd = normalize(vec3(uv, -0.95));
    vec2 room = vec2(2.4, 1.5);

    float tx = rd.x != 0.0 ? ((rd.x > 0.0 ? room.x : -room.x) - ro.x) / rd.x : 1e5;
    float ty = rd.y != 0.0 ? ((rd.y > 0.0 ? room.y : -room.y) - ro.y) / rd.y : 1e5;
    float t = min(tx, ty);
    vec3 hit = ro + rd * t;
    bool sideWall = tx < ty;
    vec2 g = sideWall ? vec2(hit.y, hit.z - uTravel) : vec2(hit.x, hit.z - uTravel);

    float minor = gridLine(g * 2.0, 0.014);
    float major = gridLine(g * 0.5, 0.02);
    float dist = t;
    float fade = 1.0 / (1.0 + dist * 0.22);

    vec3 col = uBase * 0.05;
    col += uTint * minor * 0.3 * fade;
    col += uTint * major * 1.0 * fade;

    // Glowing crossings of the major lines.
    vec2 cell = floor(g * 0.5);
    vec2 f = fract(g * 0.5) - 0.5;
    float node = smoothstep(0.07, 0.0, length(f)) * step(0.82, hash(cell + uSeed));
    col += uTint * node * 2.4 * fade;

    // Slow scanning pulse travelling down the room.
    float pulse = smoothstep(0.06, 0.0, abs(fract(hit.z * 0.04 - uTime * 0.03) - 0.5) - 0.44);
    col += uTint * pulse * 0.1 * (major + minor * 0.5) * fade;

    // Haze towards the vanishing point.
    float haze = exp(-dist * 0.16);
    col = mix(uFog, col, haze);
    col += uTint * 0.12 * exp(-dot(uv, uv) * 14.0);

    col *= uExposure;
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

export function GridScene() {
  const { colors, spec, aspect } = useSceneContext();
  const geometry = useMemo(() => new PlaneGeometry(2, 2), []);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        side: DoubleSide,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uTravel: { value: 0 },
          uAspect: { value: 1.78 },
          uSeed: { value: (spec.variant ?? 0) * 5.3 + 1.7 },
          uExposure: { value: colors.exposure },
          uTint: { value: new Color().copy(colors.tint) },
          uBase: { value: new Color().copy(colors.base) },
          uFog: { value: new Color().copy(colors.fog) },
        },
      }),
    [colors, spec.variant],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useSceneFrame((state, _delta, travel) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uTravel.value = travel * 0.5;
    material.uniforms.uAspect.value = aspect.current;
  });

  return <mesh geometry={geometry} material={material} frustumCulled={false} />;
}
