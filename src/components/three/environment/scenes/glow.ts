import { AdditiveBlending, Color, ShaderMaterial } from "three";
import type { SceneColors } from "./shared";

/** Additive radial light with an optional vertical streak, used at the end of tunnels and halls. */
export function createGlowMaterial(colors: SceneColors, streak: number): ShaderMaterial {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: {
      uTint: { value: colors.tint.clone() },
      uIntensity: { value: colors.light ? 0.7 : 1 },
      uStreak: { value: streak },
      uTime: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uTint;
      uniform float uIntensity;
      uniform float uStreak;
      uniform float uTime;
      varying vec2 vUv;
      void main() {
        vec2 c = vUv - 0.5;
        float r = length(c);
        float core = exp(-r * r * 90.0);
        float halo = exp(-r * r * 9.0);
        float beam = exp(-abs(c.x) * 38.0) * exp(-abs(c.y) * 2.2) * uStreak;
        float flicker = 0.96 + 0.04 * sin(uTime * 2.1);
        vec3 col = (vec3(1.0) * core * 1.4 + uTint * (halo * 0.9 + beam * 0.8)) * uIntensity * flicker;
        gl_FragColor = vec4(col, 1.0);
        #include <colorspace_fragment>
      }
    `,
  });
}

export function applyGlowColors(material: ShaderMaterial, colors: SceneColors) {
  (material.uniforms.uTint.value as Color).copy(colors.tint);
  material.uniforms.uIntensity.value = colors.light ? 0.7 : 1;
}
