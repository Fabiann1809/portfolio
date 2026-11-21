/**
 * Curved CRT screen. One ShaderMaterial per screen; the same shader draws the small curved
 * screen with its glossy bezel and the filled full-bleed backdrop (uFill -> 1: no bend, no
 * bezel). A second material (uReflect = 1) draws the mirrored copy on the studio floor.
 */
export const screenVertexShader = /* glsl */ `
  uniform float uCurve;
  uniform float uSize;
  varying vec2 vUv;
  varying float vWorldY;
  void main() {
    vUv = uv;
    vec3 p = position;
    p.z -= uCurve * uSize * dot(p.xy, p.xy);
    vec4 world = modelMatrix * vec4(p, 1.0);
    vWorldY = world.y;
    gl_Position = projectionMatrix * viewMatrix * world;
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
  uniform float uBezelSize;
  uniform float uDim;
  uniform float uBlur;
  uniform float uGlow;
  uniform float uSeed;
  uniform float uDrift;
  uniform float uReflect;
  uniform float uFloorY;
  uniform float uReflectLen;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uBg;
  uniform vec3 uFg;
  varying vec2 vUv;
  varying float vWorldY;

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

  // Outward normal (2D) of the rounded box outline.
  vec2 boxNormal(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    vec2 s = vec2(p.x < 0.0 ? -1.0 : 1.0, p.y < 0.0 ? -1.0 : 1.0);
    if (q.x > 0.0 && q.y > 0.0) return normalize(q) * s;
    return q.x > q.y ? vec2(s.x, 0.0) : vec2(0.0, s.y);
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

  vec3 visualBias(vec2 uv, float bias) {
    // Cover mapping + slow drift/zoom.
    vec2 s = uPlaneAspect > uTexAspect ? vec2(1.0, uTexAspect / uPlaneAspect) : vec2(uPlaneAspect / uTexAspect, 1.0);
    vec2 c = (uv - 0.5) * s / (1.0 + 0.05 * uFill) + 0.5;
    c += vec2(sin(uDrift + uSeed), cos(uDrift * 0.8 + uSeed)) * 0.012 * uFill;
    if (uHasTexture > 0.5) return texture2D(uTexture, clamp(c, 0.0, 1.0), bias).rgb;
    return pattern(c);
  }

  vec3 visual(vec2 uv) {
    return visualBias(uv, uBlur);
  }

  void main() {
    if (uReflect > 0.5 && vWorldY > uFloorY) discard;

    vec2 p = (vUv - 0.5) * vec2(uPlaneAspect, 1.0);
    vec2 halfSize = vec2(uPlaneAspect * 0.5, 0.5);
    float bez = uBezel * uBezelSize;
    float rad = 0.09 * uBezel;

    float dOuter = sdRoundBox(p, halfSize, rad);
    float dInner = sdRoundBox(p, halfSize - bez, max(rad * 0.55, 0.0));
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

    // RGB fringe: horizontal split plus a radial part that grows towards the corners.
    vec2 off = vec2(uRgb, 0.0) + w * uRgb * 1.6;
    vec3 col;
    col.r = visual(uv + off).r;
    col.g = visual(uv).g;
    col.b = visual(uv - off).b;

    // Bloom-ish glow: a very blurred copy added on top (screens only, not full-bleed).
    if (uBezel > 0.01 && uGlow > 0.0 && uHasTexture > 0.5) {
      vec3 bloom = visualBias(uv, 5.0);
      col += bloom * bloom * uGlow * uBezel * 1.4 + bloom * uGlow * 0.25 * uBezel;
    }

    float scan = 0.5 + 0.5 * sin(uv.y * 520.0);
    col *= 1.0 - uScan * (1.0 - uFill * 0.6) * scan;
    col += (hash21(uv * 600.0 + uTime) - 0.5) * (0.02 + uSmear * 0.05);

    float vig = smoothstep(1.45, 0.3, length(w * vec2(0.9, 1.0)));
    col *= mix(1.0 - uVignette, 1.0, vig);
    col = mix(col, uBg, uDim);

    // Glass: soft diagonal sheen and a faint corner reflection of the studio light.
    float sheen = smoothstep(0.35, 1.0, dot(w, normalize(vec2(-1.0, 1.15))));
    col += vec3(0.045) * sheen * uBezel * (1.0 - 0.5 * smoothstep(0.0, 1.2, length(w)));
    float edgeShadow = smoothstep(0.0, 0.035, -dInner);
    col *= mix(0.45, 1.0, edgeShadow);

    // Bezel: thick glossy black plastic. A bevel highlight streak near the outer edge, a
    // broad softbox reflection from the top-left, and a dark inner lip against the glass.
    float depthIn = clamp(-dOuter / max(bez, 0.0001), 0.0, 1.0);
    vec2 n = boxNormal(p, halfSize, rad);
    float lit = max(dot(n, normalize(vec2(-0.55, 0.85))), 0.0);
    float streak = smoothstep(0.02, 0.2, depthIn) * (1.0 - smoothstep(0.2, 0.42, depthIn));
    float outerRim = (1.0 - smoothstep(0.0, 0.12, depthIn));
    vec3 bezelCol = vec3(0.012);
    bezelCol += vec3(0.5) * pow(lit, 3.0) * streak;
    bezelCol += vec3(0.16) * pow(lit, 2.0) * outerRim;
    bezelCol += vec3(0.05) * lit * smoothstep(0.35, 0.8, depthIn);
    bezelCol += vec3(0.03) * (1.0 - lit) * outerRim;
    float lip = smoothstep(0.82, 1.0, depthIn);
    bezelCol = mix(bezelCol, vec3(0.0), lip * 0.8);
    bezelCol += vec3(0.1) * pow(max(dot(-n, normalize(vec2(-0.55, 0.85))), 0.0), 2.0) * lip * (1.0 - lip * 0.5);

    vec3 outCol = mix(bezelCol, col, inner);

    float alpha = outer * uOpacity;
    if (uReflect > 0.5) alpha *= 1.0 - smoothstep(0.0, uReflectLen, uFloorY - vWorldY);

    gl_FragColor = vec4(outCol, alpha);
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
