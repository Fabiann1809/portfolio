"use client";

import { useEffect } from "react";
import { hero } from "@/data/hero";
import { lightState, proximity, restingLight } from "@/lib/studioLight";
import type { LightPoint, Offset } from "@/lib/studioLight";
import { prefersReducedMotion } from "@/lib/motion";

const FOLLOW_SECONDS = 0.14;

interface Layout {
  width: number;
  height: number;
  /** Letter wrappers with the center of each, relative to the stage (px). */
  letters: Array<{ el: HTMLElement; center: Offset }>;
}

/**
 * Drives the hero light of `stage`: the pointer sets a target, a rAF loop damps the light toward
 * it, publishes it to `lightState` (read by the WebGL scene) and writes --light-x / --light-y plus
 * the per-letter --t. No React re-render per move. Touch and reduced motion keep the light at rest.
 */
export function useStudioLight(stage: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = stage.current;
    if (!el) return;

    const target: LightPoint = { ...restingLight };
    const current: LightPoint = { ...restingLight };
    let frame = 0;
    let last = 0;
    const reduced = prefersReducedMotion();
    let layout: Layout = { width: 1, height: 1, letters: [] };
    lightState.x = restingLight.x;
    lightState.y = restingLight.y;
    lightState.active = false;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const letters = Array.from(el.querySelectorAll<HTMLElement>("[data-letter-box]")).map((box) => {
        const r = box.getBoundingClientRect();
        return { el: box, center: { x: r.left + r.width / 2 - rect.left, y: r.top + r.height / 2 - rect.top } };
      });
      layout = { width: rect.width || 1, height: rect.height || 1, letters };
    };

    const write = () => {
      const { width, height } = layout;
      lightState.x = current.x;
      lightState.y = current.y;
      el.style.setProperty("--light-x", current.x * 100 + "%");
      el.style.setProperty("--light-y", current.y * 100 + "%");
      if (lightState.active && !reduced) {
        const light = { x: current.x * width, y: current.y * height };
        const radius = hero.studio.letterRadius * width;
        for (const letter of layout.letters) {
          letter.el.style.setProperty("--t", proximity(light, letter.center, radius).toFixed(3));
        }
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const k = 1 - Math.exp(-dt / FOLLOW_SECONDS);
      current.x += (target.x - current.x) * k;
      current.y += (target.y - current.y) * k;
      write();
      const settled = Math.abs(target.x - current.x) < 0.0005 && Math.abs(target.y - current.y) < 0.0005;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (reduced || event.pointerType === "touch") return;
      const rect = el.getBoundingClientRect();
      target.x = Math.min(1, Math.max(0, (event.clientX - rect.left) / (rect.width || 1)));
      target.y = Math.min(1, Math.max(0, (event.clientY - rect.top) / (rect.height || 1)));
      lightState.active = true;
      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    const refresh = () => {
      measure();
      write();
    };
    refresh();
    const observer = new ResizeObserver(refresh);
    observer.observe(el);
    document.fonts?.ready.then(refresh);
    // Entrance transitions move the boxes while they play; re-measure when each one ends.
    el.addEventListener("transitionend", measure);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      el.removeEventListener("transitionend", measure);
      window.removeEventListener("pointermove", onMove);
      lightState.active = false;
    };
  }, [stage]);
}
