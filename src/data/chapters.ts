import type { Chapter, JourneyConfig, StreamItem } from "@/types";
import { featuredProjects, projectsSectionId } from "@/data/projects";

/**
 * Ordered chapters of the site. Ids match the section ids and the navigation entries.
 * `transition` describes the zone placed before the chapter (always the sphere pass-and-expand).
 * Each backdrop chapter uses a procedural `scene`; set `visual` to an image or video URL to replace it.
 */
export const chapters: Chapter[] = [
  { id: "hero", layout: "backdrop", generated: "hero" },
  { id: "about", layout: "backdrop", scene: { kind: "tunnel", tint: "primary" }, transition: { lengthVh: 170 } },
  { id: projectsSectionId, layout: "stream", transition: { lengthVh: 170 } },
  { id: "testimonials", layout: "backdrop", scene: { kind: "corridor", tint: "#6f9bff" }, transition: { lengthVh: 170 } },
  { id: "experience", layout: "backdrop", scene: { kind: "grid", tint: "primary" }, transition: { lengthVh: 170 } },
  { id: "education", layout: "backdrop", scene: { kind: "grid", tint: "accent", variant: 1 }, transition: { lengthVh: 170 } },
  { id: "extra", layout: "backdrop", scene: { kind: "tunnel", tint: "accent", variant: 1, speed: 0.8 }, transition: { lengthVh: 170 } },
  { id: "contact", layout: "backdrop", scene: { kind: "corridor", tint: "accent", variant: 1 }, transition: { lengthVh: 170 } },
];

/** Screens of "stream" chapters, keyed by chapter id. */
export const chapterStreams: Record<string, StreamItem[]> = {
  [projectsSectionId]: featuredProjects.map((project) => ({ id: project.id, visual: project.image })),
};

/** Every timing / easing / look constant of the scroll journey lives here. */
export const journeyConfig: JourneyConfig = {
  leadVh: 0.5,
  maxDelta: 1 / 20,
  smooth: { journey: 0.34, position: 0.22, shape: 0.2, smear: 0.22 },
  phases: {
    shrink: [0, 0.45],
    stream: [0.08, 0.9],
    expand: [0.4, 1],
    streamInner: [0.05, 0.95],
  },
  stream: {
    pathAngle: 38,
    tilt: 1.1,
    radius: 1.7,
    spacing: 1.2,
    scale: 1,
    shiftX: 0.02,
    shiftXNarrow: 0.04,
    narrowPx: 1100,
    columnPx: 430,
    viewRange: 1.9,
    bend: { bulge: 0.035, corner: 0.035 },
    yaw: 7,
    variation: { yaw: 0.08, pitch: 0.02, roll: 0.02 },
    glitch: { inStart: 0.25, inEnd: 1.1, exit: 0.25, strength: 1, shift: 0.15, rgb: 0.03 },
    expand: { rise: 0.22, bulgeHold: 0.8, overshoot: 0.16 },
  },
  screen: { widthRatio: 0.53, maxHeightRatio: 0.7, aspect: 1.6, overscan: 1.04 },
  fx: { smearGain: 0.9, rgbBase: 0.0012, rgbGain: 0.014, scan: 0.1, vignette: 0.3, dimFilled: 0.5, drift: 0.05, blurFilled: 1.1, tear: 0.004, tearGain: 0.06 },
  overlay: { stagger: 70, rise: 24 },
  lenis: { lerp: 0.08, wheelMultiplier: 0.9, jumpDuration: 2.2 },
};
