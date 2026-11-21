import type { Chapter, JourneyConfig, StreamItem } from "@/types";
import { featuredProjects, projectsSectionId } from "@/data/projects";

/**
 * Ordered chapters of the site. Ids match the section ids and the navigation entries.
 * `transition` describes the zone placed before the chapter.
 * Each backdrop chapter uses a procedural `scene`; set `visual` to an image or video URL to replace it.
 */
export const chapters: Chapter[] = [
  { id: "hero", layout: "backdrop", generated: "hero" },
  { id: projectsSectionId, layout: "stream", transition: { mode: "conveyor", lengthVh: 150 } },
  { id: "about", layout: "backdrop", scene: { kind: "tunnel", tint: "primary" }, transition: { mode: "conveyor-fill", lengthVh: 170 } },
  { id: "testimonials", layout: "backdrop", scene: { kind: "corridor", tint: "#6f9bff" }, transition: { mode: "vertical-pan", lengthVh: 150 } },
  { id: "experience", layout: "backdrop", scene: { kind: "grid", tint: "primary" }, transition: { mode: "vertical-pan", lengthVh: 150 } },
  { id: "education", layout: "backdrop", scene: { kind: "grid", tint: "accent", variant: 1 }, transition: { mode: "vertical-pan", lengthVh: 150 } },
  { id: "extra", layout: "backdrop", scene: { kind: "tunnel", tint: "accent", variant: 1, speed: 0.8 }, transition: { mode: "vertical-pan", lengthVh: 150 } },
  { id: "contact", layout: "backdrop", scene: { kind: "corridor", tint: "accent", variant: 1 }, transition: { mode: "fly-in", lengthVh: 170 } },
];

/** Screens of "stream" chapters, keyed by chapter id. */
export const chapterStreams: Record<string, StreamItem[]> = {
  [projectsSectionId]: featuredProjects.map((project) => ({ id: project.id, visual: project.image })),
};

/** Every timing / easing / look constant of the scroll journey lives here. */
export const journeyConfig: JourneyConfig = {
  leadVh: 0.5,
  maxDelta: 1 / 20,
  smooth: { journey: 0.34, position: 0.22, shape: 0.2, smear: 0.22, transition: 0.06 },
  phases: {
    shrink: [0, 0.4],
    stream: [0.08, 0.78],
    expand: [0.66, 1],
    streamInner: [0.05, 0.95],
    pan: [0.04, 0.96],
    flyIn: [0.04, 0.96],
  },
  stream: {
    pathAngle: 36,
    spacing: 0.95,
    scale: 1,
    shiftX: 0.07,
    shiftXNarrow: 0.15,
    narrowPx: 1100,
    depth: 0.45,
    scaleFalloff: 0.05,
    tiltX: 0.1,
    tiltY: 0.22,
    tiltZ: 0.05,
    bend: { x: 0.075, y: 0.05, corner: 0.06 },
    variation: { yaw: 0.2, pitch: 0.14, roll: 0.07, bend: 0.35 },
  },
  screen: { widthRatio: 0.58, maxHeightRatio: 0.66, aspect: 1.6, overscan: 1.04 },
  transitions: {
    pan: { roll: 0.15, zoom: 0.24, overlap: 0.004 },
    flyIn: { startScale: 0.16, yaw: 0.9, roll: 0.4, depth: 3.5, outZoom: 0.06, outRoll: 0.05, outDim: 0.55 },
  },
  fx: { smearGain: 0.9, rgbBase: 0.0012, rgbGain: 0.014, scan: 0.1, vignette: 0.3, dimFilled: 0.5, drift: 0.05, blurFilled: 1.1, tear: 0.004, tearGain: 0.06 },
  lenis: { lerp: 0.08, wheelMultiplier: 0.9, jumpDuration: 2.2 },
};
