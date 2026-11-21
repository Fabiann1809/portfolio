import { chapters, chapterStreams, journeyConfig } from "@/data/chapters";
import type { GeneratedVisual, PhaseRange, ProceduralScene } from "@/types";

/**
 * Pure model of the scroll journey. The journey is one scalar J in [0, screens - 1]:
 * integer values mean "screen k rests at the centre", the fraction is the progress of the
 * interval k -> k + 1. Screens are mounted on a big rotating sphere: J drives the rotation, each
 * screen sits at an angular distance `r` (in panels) from the centre along a tilted great circle.
 * A backdrop screen shrinks into a panel when it leaves and expands when it arrives
 * (pass-and-expand). Nothing here touches the DOM or three.js.
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
  /** Both screens belong to the same stream chapter. */
  inner: boolean;
  /** The leaving screen is a full-bleed backdrop that shrinks into a sphere panel. */
  shrinkFrom: boolean;
  /** The entering screen is a backdrop that expands and flattens at the front of the sphere. */
  expandTo: boolean;
}

export interface ScreenPose {
  /** Signed distance from the centre along the great circle, in panels (negative: left the front towards the top-left, positive: still coming from the bottom-right). */
  r: number;
  /** 0 = bent panel on the sphere, 1 = fills the viewport. */
  fill: number;
  opacity: number;
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
  return {
    inner: from.chapterIndex === to.chapterIndex,
    shrinkFrom: from.layout === "backdrop",
    expandTo: to.layout === "backdrop",
  };
});

/** Every screen stays on the sphere, so the journey reads as one continuous diagonal carousel. */
const chained: boolean[] = screens.map(() => true);

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

const makePose = (): ScreenPose => ({ r: 0, fill: 0, opacity: 1 });

export const poses: ScreenPose[] = screens.map(makePose);

/**
 * Writes the pose of every screen for journey value J into `poses` and returns the
 * (eased) sphere coordinate G: the screen index that currently sits at the front.
 */
export function samplePoses(journey: number): number {
  const { phases } = journeyConfig;
  const count = screens.length;
  if (count < 2) {
    Object.assign(poses[0], makePose(), { fill: screens[0]?.layout === "backdrop" ? 1 : 0 });
    return 0;
  }

  const j = Math.min(maxJourney, Math.max(0, journey));
  const k = Math.min(count - 2, Math.floor(j));
  const f = j - k;
  const iv = intervals[k];
  // Blend of linear and eased rotation: the carousel never stops between sections (no cut).
  const eased = phase(f, iv.inner ? phases.streamInner : phases.stream);
  const g = k + eased + (f - eased) * phases.carousel;

  for (let s = 0; s < count; s++) {
    const pose = Object.assign(poses[s], makePose());
    pose.r = s - g;
    if (screens[s].layout === "backdrop") {
      if (s === k) pose.fill = iv.shrinkFrom ? 1 - phase(f, phases.shrink) : 0;
      else if (s === k + 1) pose.fill = iv.expandTo ? phase(f, phases.expand) : 0;
    }
    if (s !== k && s !== k + 1 && !chained[s]) pose.opacity = 0;
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
  return Math.abs(pose.r) < journeyConfig.stream.viewRange && pose.opacity > 0.002;
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
    if (other !== index && poses[other].fill >= 0.999 && poses[other].opacity >= 0.999) return false;
  }
  return true;
}
