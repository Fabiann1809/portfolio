"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

interface PinnedProgressOptions {
  /** When false the callback gets 1 once (static layout) and no frame loop runs. */
  enabled: boolean;
  /** Easing speed of the damped value (higher is snappier). */
  damping?: number;
  /** Frames are skipped while the track is farther than this many px outside the viewport. */
  margin?: number;
}

/**
 * Progress (0..1) of a tall track element through its own pinned scroll length (0 when its top is
 * at the viewport top, 1 when its bottom reaches the viewport bottom). Calls `onFrame` with a damped
 * value and the raw one every animation frame while the track is near the viewport. Writes go
 * straight to the DOM through the callback, never through React state.
 */
export function usePinnedProgress(
  track: RefObject<HTMLElement | null>,
  onFrame: (damped: number, raw: number, dt: number) => void,
  { enabled, damping = 8, margin = 200 }: PinnedProgressOptions,
) {
  const frameRef = useRef(onFrame);
  useEffect(() => {
    frameRef.current = onFrame;
  });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    if (!enabled) {
      frameRef.current(1, 1, 0);
      return;
    }
    let raf = 0;
    let cur = -1;
    let prev = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      const r = el.getBoundingClientRect();
      if (r.bottom > -margin && r.top < window.innerHeight + margin) {
        const raw = clamp01(-r.top / Math.max(1, r.height - window.innerHeight));
        cur = cur < 0 ? raw : cur + (raw - cur) * Math.min(1, dt * damping);
        frameRef.current(cur, raw, dt);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [track, enabled, damping, margin]);
}
