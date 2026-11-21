import type { Chapter, JourneyConfig, StreamItem } from "@/types";
import { projects, projectsSectionId } from "@/data/projects";

/**
 * Ordered chapters of the site. Ids match the section ids and the navigation entries.
 * `transition` describes the zone placed before the chapter.
 * PLACEHOLDER: no visuals yet, a generated gradient is used. Set `visual` to an image path.
 */
export const chapters: Chapter[] = [
  { id: "hero", layout: "backdrop" },
  { id: "about", layout: "backdrop", transition: { mode: "stream", lengthVh: 170 } },
  { id: projectsSectionId, layout: "stream", transition: { mode: "stream", lengthVh: 150 } },
  { id: "testimonials", layout: "backdrop", transition: { mode: "expand", lengthVh: 170 } },
  { id: "experience", layout: "backdrop", transition: { mode: "stream", lengthVh: 170 } },
  { id: "education", layout: "backdrop", transition: { mode: "stream", lengthVh: 150 } },
  { id: "extra", layout: "backdrop", transition: { mode: "stream", lengthVh: 150 } },
  { id: "contact", layout: "backdrop", transition: { mode: "stream", lengthVh: 150 } },
];

/** Screens of "stream" chapters, keyed by chapter id. */
export const chapterStreams: Record<string, StreamItem[]> = {
  [projectsSectionId]: projects.map((project) => ({ id: project.id, visual: project.image })),
};

/** Every timing / easing / look constant of the scroll journey lives here. */
export const journeyConfig: JourneyConfig = {
  leadVh: 0.5,
  maxDelta: 1 / 20,
  smooth: { journey: 0.34, position: 0.16, shape: 0.2, smear: 0.22 },
  phases: {
    shrink: [0, 0.35],
    stream: [0.2, 0.8],
    expand: [0.65, 1],
    streamInner: [0.1, 0.9],
    expandSelf: [0.08, 0.85],
    expandNextIn: [0.75, 0.9],
    expandSelfOut: [0.85, 1],
  },
  stream: {
    offsetX: 0.66,
    offsetY: 0.72,
    depth: 0.5,
    scaleFalloff: 0.12,
    tiltX: 0.16,
    tiltY: 0.28,
    tiltZ: 0.05,
  },
  screen: { widthRatio: 0.58, maxHeightRatio: 0.66, aspect: 1.6, curve: 0.6, overscan: 1.04 },
  fx: { smearGain: 0.9, rgbBase: 0.0012, rgbGain: 0.014, scan: 0.14, vignette: 0.55, dimFilled: 0.5, drift: 0.05 },
  lenis: { lerp: 0.08, wheelMultiplier: 0.9, jumpDuration: 2.2 },
};

