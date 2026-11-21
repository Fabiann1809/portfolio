/**
 * Frameless warped panel of the rotating sphere. One ShaderMaterial per screen: the vertex shader bends a subdivided
 * plane like a slice of a cylinder / sphere (uBendX, uBendY, uCornerCurl: edges and corners curl
 * away from the camera), the fragment shader draws the picture with scanlines, an RGB fringe,
 * horizontal tearing at the edges that grows with scroll speed, and a 1px antialiased edge.
 * uFill -> 1: the bend is 0 and the same shader draws the full-bleed backdrop.
 */
export const screenVertexShader = /* glsl */ `
  uniform float uSize;
  uniform float uBendX;
  uniform float uBendY;
  uniform float uCornerCurl;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    vec2 u = p.xy * 2.0;
    p.z -= uSize * (uBendX * u.x * u.x + uBendY * u.y * u.y + uCornerCurl * u.x * u.x * u.y * u.y);
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(p, 1.0);
  }
`;

export const screenFragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uHasTexture;
  uniform float uTexAspect;
  uniform float uPlaneAspect;
  uniform float uSmear;
  uniform float uRgb;
  uniform float uScan;
  uniform float uVignette;
  uniform float uFill;
  uniform float uOpacity;
  uniform float uTime;
  uniform float uDim;
  uniform float uBlur;
  uniform float uSeed;
  uniform float uDrift;
  uniform float uTear;
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
    if (uHasTexture > 0.5) return texture2D(uTexture, clamp(c, 0.0, 1.0), uBlur).rgb;
    return pattern(c);
  }

  void main() {
    // Horizontal row tearing: strongest at the left / right edges, grows with scroll speed.
    float tt = floor(uTime * 18.0);
    float row = floor(vUv.y * 90.0);
    float jitter = hash21(vec2(row, tt + uSeed)) - 0.5;
    float band = step(0.72, hash21(vec2(floor(vUv.y * 14.0), tt * 0.5 + uSeed)));
    float edgeAmt = smoothstep(0.35, 1.0, abs(vUv.x - 0.5) * 2.0);
    float shift = jitter * uTear * (0.35 + band * 1.65) * (0.2 + 0.8 * edgeAmt) * (1.0 - 0.85 * uFill);

    vec2 uv = vUv + vec2(shift, 0.0);

    // Crisp 1px antialiased edge on the (torn) silhouette; no border, no frame.
    vec2 e = min(uv, 1.0 - uv) / max(fwidth(vUv), vec2(1e-5));
    float edge = clamp(min(e.x, e.y), 0.0, 1.0);
    if (edge <= 0.001) discard;

    // RGB fringe: horizontal split plus a radial part that grows towards the corners.
    vec2 w = (uv - 0.5) * 2.0;
    vec2 off = vec2(uRgb, 0.0) + w * uRgb * 1.6;
    vec3 col;
    col.r = visual(uv + off).r;
    col.g = visual(uv).g;
    col.b = visual(uv - off).b;

    float scan = 0.5 + 0.5 * sin(uv.y * 520.0);
    col *= 1.0 - uScan * (1.0 - uFill * 0.6) * scan;
    col += (hash21(uv * 600.0 + uTime) - 0.5) * (0.02 + uSmear * 0.05);

    float vig = smoothstep(1.45, 0.3, length(w * vec2(0.9, 1.0)) * 0.7);
    col *= mix(1.0 - uVignette, 1.0, vig);
    col = mix(col, uBg, uDim);

    gl_FragColor = vec4(col, edge * uOpacity);
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
