import { chapters, chapterStreams, journeyConfig } from "@/data/chapters";
import type { GeneratedVisual, PhaseRange, ProceduralScene, TransitionMode } from "@/types";

/**
 * Pure model of the scroll journey. The journey is one scalar J in [0, screens - 1]:
 * integer values mean "screen k rests at the centre", the fraction is the progress of the
 * interval k -> k + 1. Each interval has a mode (conveyor, conveyor-fill, vertical-pan,
 * fly-in) that decides how its two screens move. Nothing here touches the DOM or three.js.
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
  mode: TransitionMode;
  /** Both screens belong to the same stream chapter. */
  inner: boolean;
  /** The leaving screen is a full-bleed backdrop that bends into a conveyor panel. */
  shrinkFrom: boolean;
  /** The entering screen is a backdrop that scales up and flattens at the end of the conveyor. */
  expandTo: boolean;
}

export interface ScreenPose {
  /** Signed distance from the centre along the conveyor, in panels (negative: exited top-left, positive: incoming). */
  r: number;
  /** 0 = bent panel, 1 = fills the viewport. */
  fill: number;
  opacity: number;
  /** Draw order bias: lower is drawn first. */
  layer: number;
  /** 1 when the panel follows the conveyor lane (side shift, per-panel variation). */
  lane: number;
  /** Vertical offset in filled-screen heights (vertical pan). */
  oy: number;
  /** Camera roll (radians) and zoom applied around the viewport centre. */
  roll: number;
  zoom: number;
  /** Extra yaw (radians) and depth (world units behind the plane). */
  yaw: number;
  depth: number;
  /** Share of the picture dimmed towards the background. */
  dim: number;
  /** Which edge touches a neighbour at a pan seam: 1 = top, -1 = bottom, 0 = none. */
  seam: number;
  /** 0..1 intensity of the seam glitch band. */
  glitch: number;
  /** True while two screens must stay glued together (pan, fly-in): damped with a short time. */
  direct: boolean;
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

const isConveyor = (mode: TransitionMode) => mode === "conveyor" || mode === "conveyor-fill";

/** Transition mode that leads into screen `s` (always the conveyor inside a stream chapter). */
function modeInto(s: number): TransitionMode {
  const from = screens[s - 1];
  const to = screens[s];
  if (from.chapterIndex === to.chapterIndex) return "conveyor";
  return chapters[to.chapterIndex].transition?.mode ?? "conveyor";
}

export const intervals: Interval[] = screens.slice(0, -1).map((from, k) => {
  const to = screens[k + 1];
  const mode = modeInto(k + 1);
  return {
    mode,
    inner: from.chapterIndex === to.chapterIndex,
    shrinkFrom: isConveyor(mode) && from.layout === "backdrop",
    expandTo: mode === "conveyor-fill" && to.layout === "backdrop",
  };
});

/** Screens that ride the conveyor: stream panels plus the backdrops directly before / after a stream. */
const chained: boolean[] = screens.map((screen, s) => {
  if (screen.layout === "stream") return true;
  const before = s > 0 && screens[s - 1].layout === "stream" && isConveyor(modeInto(s));
  const after = s < screens.length - 1 && screens[s + 1].layout === "stream" && isConveyor(modeInto(s + 1));
  return before || after;
});

export const maxJourney = Math.max(0, screens.length - 1);

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

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

const makePose = (): ScreenPose => ({
  r: 0,
  fill: 0,
  opacity: 1,
  layer: 0,
  lane: 1,
  oy: 0,
  roll: 0,
  zoom: 1,
  yaw: 0,
  depth: 0,
  dim: 0,
  seam: 0,
  glitch: 0,
  direct: false,
});

export const poses: ScreenPose[] = screens.map(makePose);

/**
 * Writes the pose of every screen for journey value J into `poses` and returns the
 * (eased) conveyor coordinate G: the screen index that currently sits at the centre.
 */
export function samplePoses(journey: number): number {
  const { phases, transitions } = journeyConfig;
  const count = screens.length;
  if (count < 2) {
    Object.assign(poses[0], makePose(), { fill: screens[0]?.layout === "backdrop" ? 1 : 0 });
    return 0;
  }

  const j = Math.min(maxJourney, Math.max(0, journey));
  const k = Math.min(count - 2, Math.floor(j));
  const f = j - k;
  const iv = intervals[k];
  const conveyor = isConveyor(iv.mode);

  let g = k;
  if (conveyor) g = k + phase(f, iv.inner ? phases.streamInner : phases.stream);
  else if (f >= 1) g = k + 1;

  for (let s = 0; s < count; s++) {
    const pose = Object.assign(poses[s], makePose());
    const layout = screens[s].layout;
    pose.r = s - g;
    pose.fill = layout === "backdrop" && s === 0 && j <= 0 ? 1 : 0;

    if (conveyor) {
      if (layout === "backdrop") {
        if (s === k) pose.fill = iv.shrinkFrom ? 1 - phase(f, phases.shrink) : 0;
        else if (s === k + 1) pose.fill = iv.expandTo ? phase(f, phases.expand) : 0;
      }
      if (s !== k && s !== k + 1 && !chained[s]) pose.opacity = 0;
      continue;
    }

    // Vertical pan / fly-in: only the two screens of the interval exist.
    if (s !== k && s !== k + 1) {
      pose.opacity = 0;
      continue;
    }
    pose.r = 0;
    pose.direct = true;
    pose.fill = 1;
    const leaving = s === k;

    if (iv.mode === "vertical-pan") {
      const t = phase(f, phases.pan);
      const bell = Math.sin(Math.PI * t);
      pose.oy = leaving ? t : t - 1 + transitions.pan.overlap;
      pose.roll = transitions.pan.roll * bell;
      pose.zoom = 1 + transitions.pan.zoom * bell;
      pose.seam = leaving ? -1 : 1;
      pose.glitch = Math.sqrt(bell);
    } else {
      const t = phase(f, phases.flyIn);
      const fly = transitions.flyIn;
      if (leaving) {
        pose.zoom = 1 - fly.outZoom * t;
        pose.roll = fly.outRoll * t;
        pose.dim = fly.outDim * t;
      } else {
        const grow = clamp01((t - 0.15) / 0.85);
        pose.fill = grow * grow * (3 - 2 * grow);
        pose.lane = 0;
        pose.zoom = lerp(fly.startScale, 1, t);
        pose.yaw = (1 - t) * fly.yaw;
        pose.roll = (1 - t) * fly.roll;
        pose.depth = (1 - t) * fly.depth;
        pose.opacity = clamp01(t / 0.12);
        pose.layer = 1;
      }
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

/** Conveyor distance beyond which a panel is certainly outside the viewport. */
const VIEW_RANGE = 1.75;

/** True when the screen is close enough to the centre (and opaque enough) to be drawn. */
export function screenInView(index: number): boolean {
  const pose = poses[index];
  return Math.abs(pose.r) < VIEW_RANGE && pose.opacity > 0.002;
}

/** True when `other` fully hides `pose` (a filled, centred, opaque screen drawn at least as late). */
function covers(other: ScreenPose, pose: ScreenPose): boolean {
  return (
    other.fill >= 0.999 &&
    other.opacity >= 0.999 &&
    other.zoom >= 0.995 &&
    Math.abs(other.oy) < 0.02 &&
    other.layer >= pose.layer
  );
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
    if (other !== index && covers(poses[other], pose)) return false;
  }
  return true;
}
