import { Color, DoubleSide, ShaderMaterial } from "three";
import type { SceneColors } from "./shared";

/**
 * Cheap shaded material for instanced architecture: headlight shading from the camera,
 * emissive accent trim along the face borders, optional vertical light slits, exponential fog.
 */
const vertex = /* glsl */ `
  varying vec3 vN;
  varying vec3 vP;
  varying vec2 vUv;
  void main() {
    mat4 m = modelMatrix;
    #ifdef USE_INSTANCING
      m = m * instanceMatrix;
    #endif
    vec4 wp = m * vec4(position, 1.0);
    vP = wp.xyz;
    vN = normalize(mat3(m) * normal);
    vUv = uv;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uTint;
  uniform vec3 uFog;
  uniform float uFogDensity;
  uniform float uExposure;
  uniform float uTrim;
  uniform float uSlit;
  uniform float uHeadlight;
  uniform float uTime;
  varying vec3 vN;
  varying vec3 vP;
  varying vec2 vUv;

  void main() {
    float d = length(vP);
    vec3 L = normalize(-vP);
    float diff = max(dot(normalize(vN), L), 0.0);
    float atten = 1.0 / (1.0 + d * d * 0.012);
    vec3 col = uBase * (0.12 + diff * atten * uHeadlight);

    // Emissive trim along the borders of each face.
    float e = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
    float trim = smoothstep(0.07, 0.025, e) * uTrim;
    col += uTint * trim * 1.6;

    // Vertical light slit (pillars): a thin lit line down the middle of the face.
    float slit = smoothstep(0.035, 0.012, abs(vUv.x - 0.5)) * step(0.06, vUv.y) * step(vUv.y, 0.94);
    col += uTint * slit * uSlit * 1.8;

    float fog = 1.0 - exp(-d * d * uFogDensity);
    col = mix(col * uExposure, uFog, clamp(fog, 0.0, 1.0));
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

export interface SolidOptions {
  fogDensity: number;
  trim: number;
  slit: number;
  headlight?: number;
}

export function createSolidMaterial(colors: SceneColors, options: SolidOptions): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    side: DoubleSide,
    uniforms: {
      uBase: { value: colors.base.clone() },
      uTint: { value: colors.tint.clone() },
      uFog: { value: colors.fog.clone() },
      uFogDensity: { value: options.fogDensity },
      uExposure: { value: colors.exposure },
      uTrim: { value: options.trim },
      uSlit: { value: options.slit },
      uHeadlight: { value: options.headlight ?? 2.4 },
      uTime: { value: 0 },
    },
  });
}

export function applySolidColors(material: ShaderMaterial, colors: SceneColors) {
  (material.uniforms.uBase.value as Color).copy(colors.base);
  (material.uniforms.uTint.value as Color).copy(colors.tint);
  (material.uniforms.uFog.value as Color).copy(colors.fog);
  material.uniforms.uExposure.value = colors.exposure;
}
