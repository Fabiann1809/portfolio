import { damp } from "maath/easing";
import { journeyConfig } from "@/data/chapters";
import { getScrollState } from "@/lib/scrollStore";
import { chapterAt, clamp01, maxJourney, samplePoses } from "@/lib/journeyModel";

/**
 * Runtime of the scroll journey: measures the scroll tracks in the DOM, maps scroll to the
 * raw journey value and damps it once per frame. Canvas and DOM overlays both read the
 * same damped state, so they never disagree. No React state is involved.
 */

type TrackKind = "zone" | "stream";

interface Track {
  kind: TrackKind;
  /** How much the journey value advances over the whole track. */
  span: number;
  el: HTMLElement;
  start: number;
  end: number;
  top: number;
}

export interface JourneyState {
  /** Raw journey value computed from the scroll position. */
  raw: number;
  /** Damped journey value (drives everything visual). */
  value: number;
  /** Eased stream coordinate: index of the screen at the centre. */
  stream: number;
  /** 0..1 smear intensity derived from the journey speed. */
  smear: number;
  /** Slow drift value for filled backdrops. */
  drift: number;
}

const state: JourneyState = { raw: 0, value: 0, stream: 0, smear: 0, drift: 0 };
const tracks: Track[] = [];
const frameListeners = new Set<() => void>();
const layoutListeners = new Set<() => void>();
let initialised = false;
let lastTime = -1;
let observer: ResizeObserver | null = null;

export function getJourneyState(): JourneyState {
  return state;
}

function measure() {
  const vh = window.innerHeight || 1;
  const scrollY = window.scrollY;
  for (const track of tracks) {
    const rect = track.el.getBoundingClientRect();
    track.top = rect.top + scrollY;
    track.start = track.kind === "zone" ? track.top - journeyConfig.leadVh * vh : track.top;
    track.end = track.top + rect.height - vh;
  }
  tracks.sort((a, b) => a.top - b.top);
  layoutListeners.forEach((fn) => fn());
}

/** Registers a scroll track element. Zones advance the journey by 1, streams by `span`. */
export function registerTrack(kind: TrackKind, el: HTMLElement, span = 1): () => void {
  const track: Track = { kind, span, el, start: 0, end: 1, top: 0 };
  tracks.push(track);
  if (!observer) {
    observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener("resize", measure);
  }
  observer.observe(el);
  measure();

  return () => {
    const index = tracks.indexOf(track);
    if (index >= 0) tracks.splice(index, 1);
    observer?.unobserve(el);
    if (tracks.length === 0 && observer) {
      observer.disconnect();
      observer = null;
      window.removeEventListener("resize", measure);
      initialised = false;
    }
  };
}

/** Raw (undamped) journey value for a scroll position. */
export function rawJourneyAt(scroll: number): number {
  let total = 0;
  for (const track of tracks) {
    const length = track.end - track.start;
    if (length <= 0) continue;
    total += track.span * clamp01((scroll - track.start) / length);
  }
  return Math.min(maxJourney, total);
}

export function getRawJourney(): number {
  return rawJourneyAt(getScrollState().scroll);
}

export function getActiveChapterId(): string {
  return chapterAt(getRawJourney());
}

/** Called after a re-measure (resize, content change). */
export function subscribeJourneyLayout(listener: () => void): () => void {
  layoutListeners.add(listener);
  return () => {
    layoutListeners.delete(listener);
  };
}

/** Called once per rendered frame, right after the journey state was stepped. */
export function subscribeJourneyFrame(listener: () => void): () => void {
  frameListeners.add(listener);
  return () => {
    frameListeners.delete(listener);
  };
}

/**
 * Advances the damped state. Idempotent per frame time, so any number of useFrame callbacks
 * can call it without caring about subscription order.
 */
export function stepJourney(time: number, delta: number) {
  if (time === lastTime) return;
  lastTime = time;
  const dt = Math.min(delta, journeyConfig.maxDelta);
  const { smooth, fx } = journeyConfig;

  const scroll = getScrollState().scroll;
  state.raw = rawJourneyAt(scroll);
  if (!initialised) {
    state.value = state.raw;
    initialised = true;
  }

  const previous = state.value;
  damp(state, "value", state.raw, smooth.journey, dt);
  state.stream = samplePoses(state.value);

  const speed = dt > 0 ? Math.abs(state.value - previous) / dt : 0;
  damp(state, "smear", Math.min(1, speed * fx.smearGain), smooth.smear, dt);
  state.drift = (scroll / (window.innerHeight || 1)) * fx.drift;

  frameListeners.forEach((fn) => fn());
}
