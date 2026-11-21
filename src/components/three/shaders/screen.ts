/**
 * Curved CRT screen. One ShaderMaterial per screen; the same shader draws the small curved
 * screen with its bezel and the filled full-bleed backdrop (uFill -> 1: no bend, no bezel).
 */
export const screenVertexShader = /* glsl */ `
  uniform float uCurve;
  uniform float uSize;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    p.z -= uCurve * uSize * dot(p.xy, p.xy);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

export const screenFragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uHasTexture;
  uniform float uTexAspect;
  uniform float uPlaneAspect;
  uniform float uCurve;
  uniform float uSmear;
  uniform float uRgb;
  uniform float uScan;
  uniform float uVignette;
  uniform float uFill;
  uniform float uOpacity;
  uniform float uTime;
  uniform float uBezel;
  uniform float uDim;
  uniform float uSeed;
  uniform float uDrift;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uBg;
  uniform vec3 uFg;
  varying vec2 vUv;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
      mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float sdRoundBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  // Generated visual used when a chapter has no image: accent gradient, soft noise, faint grid.
  vec3 pattern(vec2 uv) {
    vec2 q = uv * vec2(uPlaneAspect, 1.0) * 2.2 + uSeed * 7.0;
    float n = vnoise(q + uTime * 0.04) * 0.6 + vnoise(q * 2.3 - uTime * 0.03) * 0.4;
    vec3 col = mix(mix(uBg, uColorA, 0.16), mix(uBg, uColorB, 0.36), smoothstep(0.0, 1.0, uv.y * 0.7 + n * 0.55));
    col = mix(col, uColorA, 0.22 * smoothstep(0.55, 1.0, n));
    vec2 g = abs(fract(uv * vec2(uPlaneAspect, 1.0) * 14.0) - 0.5);
    col = mix(col, uFg, smoothstep(0.47, 0.5, max(g.x, g.y)) * 0.06);
    return col;
  }

  vec3 visual(vec2 uv) {
    // Cover mapping + slow drift/zoom.
    vec2 s = uPlaneAspect > uTexAspect ? vec2(1.0, uTexAspect / uPlaneAspect) : vec2(uPlaneAspect / uTexAspect, 1.0);
    vec2 c = (uv - 0.5) * s / (1.0 + 0.05 * uFill) + 0.5;
    c += vec2(sin(uDrift + uSeed), cos(uDrift * 0.8 + uSeed)) * 0.012 * uFill;
    if (uHasTexture > 0.5) return texture2D(uTexture, clamp(c, 0.0, 1.0)).rgb;
    return pattern(c);
  }

  void main() {
    vec2 p = (vUv - 0.5) * vec2(uPlaneAspect, 1.0);
    vec2 halfSize = vec2(uPlaneAspect * 0.5, 0.5);
    float bez = uBezel * 0.04;
    float rad = 0.075 * uBezel;

    float dOuter = sdRoundBox(p, halfSize, rad);
    float dInner = sdRoundBox(p, halfSize - bez, max(rad - bez * 0.4, 0.0));
    float outer = 1.0 - smoothstep(-0.0025, 0.0025, dOuter);
    float inner = 1.0 - smoothstep(-0.003, 0.003, dInner);
    if (outer <= 0.001) discard;

    // Barrel warp of the screen content.
    vec2 w = p / (halfSize - bez);
    w *= 1.0 + uCurve * 0.16 * dot(w, w);
    vec2 uv = w * 0.5 + 0.5;

    // Horizontal row smear driven by scroll speed.
    float tt = floor(uTime * 18.0);
    float row = floor(uv.y * 90.0);
    float jitter = hash21(vec2(row, tt + uSeed)) - 0.5;
    float band = step(0.72, hash21(vec2(floor(uv.y * 14.0), tt * 0.5 + uSeed)));
    float shift = jitter * uSmear * 0.2 * (0.35 + band * 1.65) + sin(uv.y * 7.0 + uTime * 3.0) * uSmear * 0.018;
    uv.x += shift;

    vec3 col;
    col.r = visual(uv + vec2(uRgb, 0.0)).r;
    col.g = visual(uv).g;
    col.b = visual(uv - vec2(uRgb, 0.0)).b;

    float scan = 0.5 + 0.5 * sin(uv.y * 520.0);
    col *= 1.0 - uScan * (1.0 - uFill * 0.6) * scan;
    col += (hash21(uv * 600.0 + uTime) - 0.5) * (0.02 + uSmear * 0.05);

    float vig = smoothstep(1.45, 0.3, length(w * vec2(0.9, 1.0)));
    col *= mix(1.0 - uVignette, 1.0, vig);
    col = mix(col, uBg, uDim);

    // Bezel: dark rounded frame with a soft inner shadow and a faint rim light.
    float rim = smoothstep(-bez, 0.0, dOuter);
    vec3 bezelCol = vec3(0.035) + vec3(0.05) * rim;
    float edgeShadow = smoothstep(0.0, 0.03, -dInner);
    col *= mix(0.6, 1.0, edgeShadow);
    vec3 outCol = mix(bezelCol, col, inner);

    gl_FragColor = vec4(outCol, outer * uOpacity);
    #include <colorspace_fragment>
  }
`;

/** Dark ambient backdrop: radial falloff plus a faint perspective grid that drifts with the journey. */
export const ambientVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.9999, 1.0);
  }
`;

export const ambientFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform float uAspect;
  uniform vec3 uColor;
  uniform vec3 uBg;
  uniform vec3 uFg;
  varying vec2 vUv;

  void main() {
    vec2 c = (vUv - 0.5) * vec2(uAspect, 1.0);
    float r = length(c);
    vec3 col = uBg;
    col = mix(col, uColor, 0.08 * smoothstep(1.1, 0.0, r));

    // Grid on a dome: lines converge towards the horizon at the top.
    float depth = 1.0 / max(0.12, vUv.y + 0.35);
    vec2 g = vec2(c.x * depth * 2.0, depth * 1.6 + uScroll * 0.35 + uTime * 0.01);
    vec2 f = abs(fract(g) - 0.5);
    float line = smoothstep(0.485, 0.5, max(f.x, f.y));
    col = mix(col, uFg, line * 0.05 * smoothstep(0.9, 0.2, r));

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;
