/**
 * "White studio" backdrop shown while screens are shrunk: a bright cyclorama wall with a soft
 * gray falloff, a horizon where a glossy floor begins, and faint monospace code drifting across
 * floor (in perspective) and wall. Drawn as one full-viewport quad.
 */
export const studioVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.9998, 1.0);
  }
`;

export const studioFragmentShader = /* glsl */ `
  uniform sampler2D uText;
  uniform float uHasText;
  uniform float uAmount;
  uniform float uAspect;
  uniform float uTime;
  uniform float uScroll;
  uniform float uHorizon;
  uniform float uFloorScale;
  uniform float uWallScale;
  uniform float uFloorOpacity;
  uniform float uWallOpacity;
  uniform float uTintStrength;
  uniform vec3 uCenter;
  uniform vec3 uEdge;
  uniform vec3 uFloorFar;
  uniform vec3 uFloorNear;
  uniform vec3 uTextColor;
  uniform vec3 uTint;
  varying vec2 vUv;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  void main() {
    vec2 c = (vUv - 0.5) * vec2(uAspect, 1.0);
    float r = length(c);
    float y = vUv.y;
    float h = uHorizon;

    // Wall: overexposed centre, gray falloff at the edges.
    vec3 wall = mix(uCenter, uEdge, smoothstep(0.05, 0.95, r * 1.12));
    wall += vec3(0.07) * exp(-r * r * 5.0);

    // Soft floor / wall blend with a faint bright horizon line.
    float floorMask = 1.0 - smoothstep(h - 0.02, h + 0.02, y);
    float dy = max(h - y, 0.0);
    vec3 floorCol = mix(uFloorFar, uFloorNear, smoothstep(0.0, h, dy));
    // Glossy sheen: the bright wall reflected near the horizon, strongest in the middle.
    floorCol += vec3(0.06) * exp(-r * r * 3.0) * (1.0 - smoothstep(0.0, 0.22, dy));
    float hz = (y - h) * 70.0;
    float horizon = exp(-hz * hz) * 0.05;

    vec3 col = mix(wall, floorCol, floorMask) + horizon;

    // Code text on the floor (perspective) and, much fainter, on the wall.
    float depth = 1.0 / (dy + 0.055);
    vec2 fuv = vec2(c.x * depth * uFloorScale, depth * uFloorScale * 0.5 + uScroll);
    float floorFade = smoothstep(0.012, 0.16, dy) * (1.0 - smoothstep(0.55, 1.0, dy / h));
    float floorText = texture2D(uText, fuv).a * floorFade * floorMask * uFloorOpacity;

    vec2 wuv = vec2(c.x * uWallScale * 0.6 + 0.3, c.y * uWallScale * 0.6 + uScroll * 0.35);
    float wallFade = smoothstep(0.95, 0.15, r) * (1.0 - floorMask) * smoothstep(h, h + 0.08, y);
    float wallText = texture2D(uText, wuv).a * wallFade * uWallOpacity;

    float text = (floorText + wallText) * uHasText;
    col = mix(col, uTextColor, clamp(text, 0.0, 1.0));

    col = mix(col, uTint, uTintStrength * (0.5 + 0.5 * exp(-r * r * 2.0)));
    col *= 1.0 - 0.1 * smoothstep(0.7, 1.4, r);
    col += (hash21(vUv * 900.0 + uTime) - 0.5) * 0.018;

    gl_FragColor = vec4(col, uAmount);
    #include <colorspace_fragment>
  }
`;
