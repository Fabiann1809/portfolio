import { chapters, chapterStreams, journeyConfig } from "@/data/chapters";
import type { GeneratedVisual, PhaseRange, ProceduralScene } from "@/types";

/**
 * Pure model of the scroll journey. The journey is one scalar J in [0, screens - 1]:
 * integer values mean "screen k rests at the centre", the fraction is the progress of the
 * interval k -> k + 1. Intervals are either transition zones between chapters or movements
 * inside a stream chapter. Nothing here touches the DOM or three.js.
 */

export interface ScreenDef {
  id: string;
  chapterId: string;
  chapterIndex: number;
  layout: "backdrop" | "stream";
  visual?: string;
  generated?: GeneratedVisual;
  scene?: ProceduralScene;
}

export interface Interval {
  kind: "zone" | "stream";
  expand: boolean;
  shrinkFrom: boolean;
  expandTo: boolean;
}

export interface ScreenPose {
  /** Signed distance from the centre in screens (negative: exited top-left, positive: incoming). */
  r: number;
  /** 0 = curved screen, 1 = fills the viewport. */
  fill: number;
  opacity: number;
  /** Draw order bias: lower is drawn first. */
  layer: number;
}

export const screens: ScreenDef[] = chapters.flatMap((chapter, chapterIndex): ScreenDef[] => {
  if (chapter.layout === "stream") {
    return (chapterStreams[chapter.id] ?? []).map((item) => ({
      id: item.id,
      chapterId: chapter.id,
      chapterIndex,
      layout: "stream" as const,
      visual: item.visual,
    }));
  }
  return [{ id: chapter.id, chapterId: chapter.id, chapterIndex, layout: "backdrop" as const, visual: chapter.visual, generated: chapter.generated, scene: chapter.scene }];
});

export const intervals: Interval[] = screens.slice(0, -1).map((from, k) => {
  const to = screens[k + 1];
  if (from.chapterIndex === to.chapterIndex) {
    return { kind: "stream", expand: false, shrinkFrom: false, expandTo: false };
  }
  return {
    kind: "zone",
    expand: chapters[to.chapterIndex].transition?.mode === "expand",
    shrinkFrom: from.layout === "backdrop",
    expandTo: to.layout === "backdrop",
  };
});

export const maxJourney = Math.max(0, screens.length - 1);

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Eased 0..1 progress of f inside a phase range. */
export function phase(f: number, [start, end]: PhaseRange) {
  return easeInOutCubic(clamp01((f - start) / (end - start)));
}

/** Chapter id that is current for a (raw) journey value. Switches at the midpoint of a zone. */
export function chapterAt(journey: number): string {
  const index = Math.min(screens.length - 1, Math.max(0, Math.round(journey)));
  return screens[index]?.chapterId ?? chapters[0].id;
}

/** First screen index and screen count of a chapter. */
export function chapterScreens(chapterId: string): { first: number; count: number } {
  const first = screens.findIndex((screen) => screen.chapterId === chapterId);
  const count = screens.filter((screen) => screen.chapterId === chapterId).length;
  return { first, count };
}

export const poses: ScreenPose[] = screens.map(() => ({ r: 0, fill: 0, opacity: 1, layer: 0 }));

/**
 * Writes the pose of every screen for journey value J into `poses` and returns the
 * (eased) stream coordinate G: the screen index that currently sits at the centre.
 */
export function samplePoses(journey: number): number {
  const { phases } = journeyConfig;
  const count = screens.length;
  if (count < 2) {
    poses[0] = { r: 0, fill: screens[0]?.layout === "backdrop" ? 1 : 0, opacity: 1, layer: 0 };
    return 0;
  }

  const j = Math.min(maxJourney, Math.max(0, journey));
  const k = Math.min(count - 2, Math.floor(j));
  const f = j - k;
  const iv = intervals[k];

  let g = k;
  if (iv.expand) {
    if (f >= 1) g = k + 1;
  } else {
    g = k + phase(f, iv.kind === "zone" ? phases.stream : phases.streamInner);
  }

  for (let s = 0; s < count; s++) {
    const pose = poses[s];
    const layout = screens[s].layout;
    pose.r = s - g;
    pose.fill = layout === "backdrop" && s === 0 && j <= 0 ? 1 : 0;
    pose.opacity = 1;
    pose.layer = 0;

    if (layout === "backdrop") {
      if (s === k && !iv.expand) pose.fill = iv.shrinkFrom ? 1 - phase(f, phases.shrink) : 0;
      else if (s === k + 1 && !iv.expand) pose.fill = iv.expandTo ? phase(f, phases.expand) : 0;
      else if (s === k || s === k + 1) pose.fill = 1; // expand mode: both ends are full backdrops
      else pose.fill = 0;
    }

    if (iv.expand && (s === k || s === k + 1)) {
      if (s === k) {
        if (layout === "stream") pose.fill = phase(f, phases.expandSelf);
        pose.opacity = 1 - phase(f, phases.expandSelfOut);
        pose.layer = 1;
      } else {
        pose.r = 0;
        pose.fill = screens[s].layout === "backdrop" ? 1 : 0;
        pose.opacity = phase(f, phases.expandNextIn);
        pose.layer = 0;
      }
    } else if (iv.expand) {
      pose.opacity = 1 - phase(f, [0.05, 0.4]);
    }
  }
  return g;
}

/**
 * Per-frame values published by the rendered screens (already damped), read by the studio
 * environment and the procedural scenes. Plain mutable fields, no React state.
 */
export const live = {
  /** Damped fill x opacity of each screen (1 = a full-bleed backdrop covers the viewport). */
  cover: screens.map(() => 0),
  /** 0 = backdrop fully covers the viewport, 1 = nothing covers it (studio fully visible). */
  studio: 1,
};

/** Recomputes `live.studio` from the published covers. */
export function updateStudio() {
  let max = 0;
  for (const value of live.cover) max = Math.max(max, value);
  live.studio = 1 - clamp01(max);
}

/** True when the screen is close enough to the centre (and opaque enough) to be drawn. */
export function screenInView(index: number): boolean {
  const pose = poses[index];
  return Math.abs(pose.r) < 2.4 && pose.opacity > 0.002;
}

/**
 * True when the screen's render target must be refreshed: it is in view and not hidden
 * behind another screen that already fills the viewport.
 */
export function screenActiveForTarget(index: number): boolean {
  if (!screenInView(index)) return false;
  const pose = poses[index];
  if (pose.fill >= 0.5) return true;
  for (let other = 0; other < poses.length; other++) {
    if (other === index) continue;
    const p = poses[other];
    if (p.fill >= 0.999 && p.opacity >= 0.999) return false;
  }
  return true;
}
