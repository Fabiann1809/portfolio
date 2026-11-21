/**
 * Wireframe wall: a barrel-distorted rectangular grid whose cells split (quadtree, up to 3
 * levels) where the silhouette mask is high, so the grid gets dense around the figure.
 * Lines are anti-aliased from analytic pixel widths, flicker per cell, shift in RGB toward the
 * edges and brighten near the cursor light.
 */
export const gridWallVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const gridWallFragment = /* glsl */ `
precision highp float;

uniform vec2 uRes;          // CSS px
uniform float uPx;          // device px per CSS px
uniform float uTime;
uniform float uReveal;
uniform vec4 uSlot;         // portrait slot in screen uv (x0, y0, w, h), y up
uniform vec4 uMaskDom;      // mask domain in portrait coordinates (x, y, w, h)
uniform sampler2D uMask;
uniform vec3 uBg;
uniform vec3 uGlow;
uniform vec3 uLine;
uniform vec3 uHot;
uniform vec2 uLight;        // screen uv, y up
uniform float uLightOn;
uniform float uLightRadius;
uniform float uLightGain;
uniform float uBaseCols;
uniform float uCellAspect;
uniform float uCurve;
uniform float uLineWidth;   // CSS px
uniform float uLineAlpha;
uniform vec3 uThr;
uniform float uSplit;
uniform float uFlicker;
uniform float uVignette;
uniform float uEdgeFringe;  // CSS px
varying vec2 vUv;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float aspect() { return uRes.x / uRes.y; }

// Squared radius, 0 at the center and 1 at the corners.
float r2n(vec2 s) {
  float a = aspect();
  return dot(s, s) / (0.25 * (a * a + 1.0));
}

vec2 invDistort(vec2 w) {
  vec2 s = w;
  for (int i = 0; i < 3; i++) s = w / (1.0 + uCurve * r2n(s));
  return s;
}

float maskAt(vec2 screenUv) {
  vec2 q = (screenUv - uSlot.xy) / uSlot.zw;
  vec2 m = (q - uMaskDom.xy) / uMaskDom.zw;
  if (m.x < 0.0 || m.y < 0.0 || m.x > 1.0 || m.y > 1.0) return 0.0;
  return texture2D(uMask, m).r;
}

// Mask at the screen position of the center of the wall cell (id, level multiplier m).
float cellMask(vec2 id, float m, vec2 cellSize, vec2 ext) {
  vec2 wc = (id + 0.5) / m * cellSize - ext;
  vec2 sc = invDistort(wc);
  return maskAt(sc / vec2(aspect(), 1.0) + 0.5);
}

float lineMask(vec2 g, vec2 w, float halfWidth) {
  vec2 f = fract(g);
  vec2 d = min(f, 1.0 - f) / w;
  float dpx = min(d.x, d.y);
  return 1.0 - smoothstep(halfWidth - 0.5, halfWidth + 0.5, dpx);
}

void main() {
  float a = aspect();
  vec2 s = (vUv - 0.5) * vec2(a, 1.0);
  float rr = r2n(s);

  // Wall coordinates: barrel distortion, then grid cells (rectangular).
  vec2 w = s * (1.0 + uCurve * rr);
  vec2 ext = vec2(a * 0.5, 0.5) * (1.0 + uCurve);
  float cw = a / uBaseCols;
  vec2 cellSize = vec2(cw, cw * uCellAspect);
  vec2 p = (w + ext) / cellSize;
  vec2 dp = fwidth(p);

  // Quadtree: a cell splits while the mask at its center is above the threshold of its level.
  vec2 id0 = floor(p);
  vec2 id1 = floor(p * 2.0);
  vec2 id2 = floor(p * 4.0);
  float m0 = cellMask(id0, 1.0, cellSize, ext);
  float m1 = cellMask(id1, 2.0, cellSize, ext);
  float m2 = cellMask(id2, 4.0, cellSize, ext);
  float r0 = hash21(id0);
  float s0 = max(step(uThr.x, m0 + (r0 - 0.5) * 0.1), step(1.0 - uSplit, r0));
  float s1 = s0 * step(uThr.y, m1 + (hash21(id1 + 3.7) - 0.5) * 0.12);
  float s2 = s1 * step(uThr.z, m2 + (hash21(id2 + 7.1) - 0.5) * 0.12);
  float level = s0 + s1 + s2;
  float mult = exp2(level);

  vec2 g = p * mult;
  vec2 wpx = dp * mult;
  float halfWidth = 0.5 * uLineWidth * uPx;

  // Per-channel lines: red / blue shift outward / inward toward the screen edges.
  vec2 sh = (vUv - 0.5) * 2.0 * uEdgeFringe * rr * uPx;
  vec3 lm = vec3(
    lineMask(g + sh * wpx, wpx, halfWidth),
    lineMask(g, wpx, halfWidth),
    lineMask(g - sh * wpx, wpx, halfWidth)
  );

  // Per-cell flicker: a few cells dim for an instant.
  vec2 cid = floor(g);
  float ch = hash21(cid + level * 11.0);
  float tick = floor(uTime * 5.0 + ch * 40.0);
  float flick = 1.0 - uFlicker * 0.7 * step(0.94, hash21(vec2(ch * 91.0, tick)));
  float levelDim = mix(1.0, 0.72, level / 3.0);

  // Cursor light: lines near it brighten and turn hot.
  vec2 dl = (vUv - uLight) * vec2(a, 1.0);
  float lightK = uLightOn * exp(-dot(dl, dl) / (uLightRadius * uLightRadius));
  float alpha = uLineAlpha * flick * levelDim * (1.0 + uLightGain * lightK);

  // Scan-in from the center once the loader leaves.
  float reveal = 1.0 - smoothstep(uReveal * 1.7 - 0.3, uReveal * 1.7, sqrt(rr));
  alpha *= reveal;

  vec3 lineCol = mix(uLine, uHot, clamp(lightK * 1.2, 0.0, 1.0));
  float center = 1.0 - sqrt(rr);
  vec3 bg = mix(uBg, uGlow, 0.7 * center * center);
  vec3 col = mix(bg, lineCol, clamp(lm * alpha, 0.0, 1.0));

  col *= 1.0 - uVignette * smoothstep(0.3, 1.0, rr);
  col += (hash21(gl_FragCoord.xy + fract(uTime) * 91.7) - 0.5) * 0.025;

  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`;
