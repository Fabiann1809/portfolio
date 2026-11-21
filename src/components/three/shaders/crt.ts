/** Curvature of the screen: edges are pushed back along z (object space units). */
export const CRT_BEND = 0.35;

export const crtVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    p.z -= ${CRT_BEND.toFixed(3)} * dot(p.xy, p.xy);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

/**
 * Light CRT look: barrel warp, scanlines, chromatic aberration, vignette.
 * uIntensity (0..1, driven by scroll velocity) boosts aberration, noise and a rolling band.
 */
export const crtFragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uHasMap;
  uniform float uTime;
  uniform float uIntensity;
  uniform float uAlpha;
  uniform vec3 uTint;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  vec3 sampleScreen(vec2 uv, float ca) {
    if (uHasMap > 0.5) {
      return vec3(
        texture2D(uMap, uv + vec2(ca, 0.0)).r,
        texture2D(uMap, uv).g,
        texture2D(uMap, uv - vec2(ca, 0.0)).b
      );
    }
    // Placeholder when the project image is missing: tinted gradient with a grid.
    vec3 base = mix(uTint * 0.25, uTint, uv.y);
    vec2 g = abs(fract(uv * vec2(16.0, 10.0)) - 0.5);
    float grid = smoothstep(0.47, 0.5, max(g.x, g.y));
    return base + grid * 0.12;
  }

  void main() {
    vec2 c = vUv - 0.5;
    vec2 uv = c * (1.0 + dot(c, c) * 0.1) + 0.5;
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
      #include <colorspace_fragment>
      return;
    }

    float ca = 0.0015 + uIntensity * 0.012;
    vec3 col = sampleScreen(uv, ca);

    float scan = 0.5 + 0.5 * sin(uv.y * 900.0 + uTime * 2.0);
    col *= 1.0 - (0.12 + uIntensity * 0.12) * scan;

    float band = smoothstep(0.0, 0.08, fract(uv.y - uTime * 0.08)) * 0.04 * uIntensity;
    col += band;
    col += (hash(uv * 400.0 + uTime) - 0.5) * (0.03 + uIntensity * 0.08);

    float vig = smoothstep(0.85, 0.25, length(c) * 1.2);
    col *= mix(0.55, 1.0, vig);

    gl_FragColor = vec4(col, uAlpha);
    #include <colorspace_fragment>
  }
`;
