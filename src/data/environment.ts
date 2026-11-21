import type { EnvironmentConfig } from "@/types";

/**
 * Look of the "white studio" shown behind the screens during transitions, and the shared
 * tunables of the procedural chapter scenes. Palettes are keyed by the site backdrop theme.
 */
export const environment: EnvironmentConfig = {
  horizon: 0.4,
  floorY: -0.38,
  reflection: { opacity: 0.3, length: 0.42 },
  shadow: { opacity: 0.38, width: 0.96, height: 0.05 },
  text: {
    lines: [
      "const journey = createJourney({ chapters, smooth: 0.34 });",
      "function step(time, delta) { damp(state, 'value', raw, 0.34, delta); }",
      "export const poses = screens.map(() => ({ r: 0, fill: 0 }));",
      "uniform float uFill; // 0 = curved screen, 1 = full bleed",
      "vec3 col = mix(uBg, uAccent, smoothstep(0.0, 1.0, n));",
      "scene.add(new Mesh(plane, material)); renderer.render(scene, camera);",
      "@theme { --color-primary: #ee5a22; --font-display: Doto; }",
      "type Chapter = { id: string; layout: 'backdrop' | 'stream' };",
      "if (pose.fill > 0.98) { material.opacity = 1.0; }",
      "useFrame((state, dt) => { mesh.rotation.z += dt * 0.02; });",
      "float scan = 0.5 + 0.5 * sin(uv.y * 520.0); col *= 1.0 - scan;",
      "await fetch('/api/contact', { method: 'POST', body });",
      "export function phase(f, [a, b]) { return ease(clamp01((f - a) / (b - a))); }",
      "git commit -m 'feat(journey): crt transitions between sections'",
      "<Canvas dpr={[1, 1.5]} frameloop={visible ? 'always' : 'never'} />",
      "// TODO swap generated scene for a recorded video",
    ],
    fontSize: 22,
    lineHeight: 34,
    textureSize: 1024,
    floorScale: 0.55,
    wallScale: 1.1,
    floorOpacity: 0.34,
    wallOpacity: 0.09,
    scrollSpeed: 0.9,
    idleSpeed: 0.012,
  },
  palettes: {
    ink: {
      center: "#e3e7ec",
      edge: "#aeb5bd",
      floorFar: "#dde1e6",
      floorNear: "#b6bcc4",
      text: "#2a3038",
      tint: "#9db4d6",
      tintStrength: 0.06,
      isDarkText: true,
    },
    bone: {
      center: "#fbf8f1",
      edge: "#d9d3c5",
      floorFar: "#f6f1e6",
      floorNear: "#cfc8b8",
      text: "#3a362c",
      tint: "#ffe9c4",
      tintStrength: 0.05,
      isDarkText: true,
    },
  },
  target: { maxWidth: 1280, maxHeight: 720 },
  scene: {
    darkExposure: 1,
    lightExposure: 1.1,
    travelPerVh: 1.4,
    idleTravel: 0.18,
    dustCount: 260,
  },
  coldBase: "#2b4468",
};
