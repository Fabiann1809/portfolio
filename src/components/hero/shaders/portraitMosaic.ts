/**
 * Portrait as a voxel mosaic. The vertex stage lifts a relief (head / shoulders ellipsoids) out
 * of the plane, turns it toward the cursor and projects it in pixel space (no camera object);
 * the fragment stage quantizes the photo into rounded tiles, tints them from the luminance,
 * adds row glitches, bright streaks, an RGB fringe and the scan-in / bottom dissolve.
 */
export const portraitMosaicVertex = /* glsl */ `
uniform vec2 uRes;      // CSS px
uniform vec2 uSlot;     // slot size, CSS px
uniform vec2 uCenter;   // slot center from the screen center, CSS px, y up
uniform vec2 uPivot;    // rotation pivot in portrait uv (y up)
uniform vec2 uRot;      // yaw, pitch (rad)
uniform float uFocal;   // camera distance, CSS px
uniform float uDepth;   // relief height, fraction of the slot width
varying vec2 vUv;
varying vec3 vN;
varying vec2 vScreen;   // projected position, CSS px from the screen center, y up

float ell(vec2 uv, vec2 c, vec2 r) {
  vec2 q = (uv - c) / r;
  return sqrt(max(0.0, 1.0 - dot(q, q)));
}

// Relief in slot-width units: head (face + hair) and shoulders.
float relief(vec2 uv) {
  float head = ell(uv, vec2(0.5, 0.68), vec2(0.27, 0.3));
  float face = ell(uv, vec2(0.52, 0.6), vec2(0.18, 0.2));
  float body = ell(uv, vec2(0.5, 0.06), vec2(0.62, 0.36));
  return (0.55 * head + 0.3 * face + 0.35 * body) * uDepth;
}

mat3 rotation(vec2 rot) {
  float cy = cos(rot.x), sy = sin(rot.x), cx = cos(rot.y), sx = sin(rot.y);
  mat3 yaw = mat3(cy, 0.0, -sy, 0.0, 1.0, 0.0, sy, 0.0, cy);
  mat3 pitch = mat3(1.0, 0.0, 0.0, 0.0, cx, sx, 0.0, -sx, cx);
  return pitch * yaw;
}

void main() {
  vUv = uv;
  float ratio = uSlot.y / uSlot.x;
  float e = 0.004;
  float dzdx = (relief(uv + vec2(e, 0.0)) - relief(uv - vec2(e, 0.0))) / (2.0 * e);
  float dzdy = (relief(uv + vec2(0.0, e)) - relief(uv - vec2(0.0, e))) / (2.0 * e * ratio);
  mat3 R = rotation(uRot);
  vN = R * normalize(vec3(-dzdx, -dzdy, 1.0));

  vec3 local = vec3((uv - uPivot) * uSlot, relief(uv) * uSlot.x);
  vec3 r = R * local;
  vec2 pivotPx = uCenter + (uPivot - 0.5) * uSlot;
  float persp = uFocal / max(1.0, uFocal - r.z);
  vec2 screen = (pivotPx + r.xy) * persp;
  vScreen = screen;
  gl_Position = vec4(screen / (uRes * 0.5), 0.0, 1.0);
}
`;

export const portraitMosaicFragment = /* glsl */ `
precision highp float;

uniform sampler2D uMap;
uniform vec2 uSlot;       // CSS px
uniform float uCell;      // tile size, CSS px
uniform float uTime;
uniform float uReveal;
uniform float uGap;
uniform float uRadius;
uniform float uContrast;
uniform float uGamma;
uniform float uGlitch;
uniform float uFringe;    // CSS px
uniform float uBottomFade;
uniform vec3 uShadow;
uniform vec3 uMid;
uniform vec3 uHigh;
uniform vec3 uStreak;
uniform vec2 uLightPx;    // from the screen center, CSS px, y up
uniform float uLightOn;
uniform float uLightRadius; // CSS px
uniform float uLightGain;
varying vec2 vUv;
varying vec3 vN;
varying vec2 vScreen;

float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}
float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

// Premultiplied sample, so transparent texels never bleed their color.
vec4 tap(vec2 uv) {
  vec4 c = texture2D(uMap, uv);
  return vec4(c.rgb * c.a, c.a);
}
float luma(vec4 t) {
  return dot(t.rgb, vec3(0.299, 0.587, 0.114)) / max(t.a, 0.05);
}
vec3 tint(float l) {
  vec3 c = mix(uShadow, uMid, smoothstep(0.0, 0.55, l));
  return mix(c, uHigh, smoothstep(0.5, 1.0, l));
}

void main() {
  vec2 grid = uSlot / uCell;
  vec2 gcoord = vUv * grid;
  vec2 id = floor(gcoord);
  vec2 f = fract(gcoord);

  // Glitch windows: rows of tiles slide sideways for a moment.
  float step10 = floor(uTime * 10.0);
  float burst = step(0.72, hash11(floor(uTime * 1.6) + 3.0));
  float rate = (0.004 + 0.05 * burst) * uGlitch;
  float rowShift = step(1.0 - rate, hash21(vec2(id.y, step10))) * (hash21(vec2(id.y, step10 + 7.0)) - 0.5) * 0.14;

  vec2 cuv = (id + 0.5) / grid + vec2(rowShift, 0.0);
  vec2 hd = 0.3 / grid;
  vec4 avg = 0.25 * (tap(cuv + vec2(-hd.x, -hd.y)) + tap(cuv + vec2(hd.x, -hd.y)) + tap(cuv + vec2(-hd.x, hd.y)) + tap(cuv + hd));
  float present = step(0.45, avg.a);
  float lum = luma(avg);
  vec2 fo = vec2(uFringe / uSlot.x, 0.0);
  float lumR = luma(tap(cuv + fo));
  float lumB = luma(tap(cuv - fo));

  // Tone curve and relief lighting (tiles facing the light are brighter).
  vec3 lum3 = clamp((vec3(lumR, lum, lumB) - 0.5) * uContrast + 0.5, 0.0, 1.0);
  lum3 = pow(lum3, vec3(uGamma));
  vec3 L = normalize(vec3(uLightPx - vScreen, 0.6 * uSlot.x));
  float facing = max(dot(normalize(vN), L), 0.0);
  float prox = exp(-dot(vScreen - uLightPx, vScreen - uLightPx) / (uLightRadius * uLightRadius));
  lum3 = lum3 * (0.7 + 0.5 * facing) + uLightGain * uLightOn * prox;
  vec3 col = vec3(tint(lum3.r).r, tint(lum3.g).g, tint(lum3.b).b);

  // Rounded tile with a gap, slightly brighter on its upper edge.
  vec2 q = abs(f - 0.5) - vec2(0.5 - uGap * 0.5 - uRadius);
  float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRadius;
  float aa = max(fwidth(d), 0.001);
  float tile = 1.0 - smoothstep(-aa, aa, d);
  col *= 0.9 + 0.2 * f.y;

  // Bottom dissolve: tiles drop out and dim toward the bottom edge.
  float fade = smoothstep(0.0, uBottomFade, vUv.y);
  float keep = step(hash21(id + 3.1), fade * 1.2);
  col *= mix(0.4, 1.0, fade);

  // Scan-in from the top with a bright front.
  float sweep = uReveal * 1.4 - (1.0 - vUv.y);
  float shown = step(hash21(id + 9.7), smoothstep(0.0, 0.22, sweep));
  float front = smoothstep(0.0, 0.025, sweep) * (1.0 - smoothstep(0.025, 0.1, sweep));
  col += uHigh * front * 0.5;

  float alpha = tile * present * keep * shown;

  // Streaks: thin bright horizontal fragments, mostly during glitch windows.
  float srow = floor(vUv.y * uSlot.y / 2.0);
  float stime = floor(uTime * 14.0);
  float on = step(1.0 - (0.0022 + 0.016 * burst) * uGlitch, hash21(vec2(srow, stime)));
  float x0 = hash21(vec2(srow, stime + 3.0)) * 0.7;
  float len = 0.06 + 0.3 * hash21(vec2(srow, stime + 5.0));
  float seg = step(x0, vUv.x) * step(vUv.x, x0 + len);
  float edge = smoothstep(0.0, 0.08, vUv.x) * (1.0 - smoothstep(0.92, 1.0, vUv.x)) * smoothstep(0.02, 0.2, vUv.y);
  float streak = on * seg * edge * step(0.01, uGlitch) * clamp(uReveal * 2.0 - 1.0, 0.0, 1.0);

  col = mix(col, uStreak, streak);
  alpha = max(alpha, streak * 0.8);

  gl_FragColor = vec4(col, alpha);
  #include <colorspace_fragment>
}
`;
