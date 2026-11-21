"use client";

import { useEffect } from "react";
import { hero } from "@/data/hero";
import { lightVars, parallaxOffsets, parallaxVars, proximity, restingLight } from "@/lib/studioLight";
import type { LightPoint, Offset } from "@/lib/studioLight";
import { prefersReducedMotion } from "@/lib/motion";

const FOLLOW_SECONDS = 0.14;

interface Layout {
  width: number;
  height: number;
  /** Letter wrappers with the center of each, relative to the stage (px). */
  letters: Array<{ el: HTMLElement; center: Offset }>;
  /** Portrait box relative to the stage (px), without the parallax shift. */
  portrait: { el: HTMLElement; left: number; top: number; width: number; height: number } | null;
}

/**
 * Drives the studio light of `stage`: the pointer sets a target, a rAF loop damps the light
 * toward it and writes CSS variables (light position, shadows, parallax, per-letter --t, key
 * light position on the portrait). No React re-render per move. Touch and reduced motion keep
 * the light at rest: no parallax, letters stay at their static proximity.
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
    // True once a mouse / pen moved: only then parallax and per-letter lighting are live.
    let fine = false;
    let shift = { name: { x: 0, y: 0 }, person: { x: 0, y: 0 } };
    let layout: Layout = { width: 1, height: 1, letters: [], portrait: null };

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const letters = Array.from(el.querySelectorAll<HTMLElement>("[data-letter-box]")).map((box) => {
        const r = box.getBoundingClientRect();
        return {
          el: box,
          center: {
            x: r.left + r.width / 2 - rect.left - shift.name.x,
            y: r.top + r.height / 2 - rect.top - shift.name.y,
          },
        };
      });
      const box = el.querySelector<HTMLElement>("[data-portrait-box]");
      let portrait: Layout["portrait"] = null;
      if (box) {
        const r = box.getBoundingClientRect();
        portrait = {
          el: box,
          left: r.left - rect.left - shift.person.x,
          top: r.top - rect.top - shift.person.y,
          width: r.width || 1,
          height: r.height || 1,
        };
      }
      layout = { width: rect.width || 1, height: rect.height || 1, letters, portrait };
    };

    const write = () => {
      const { width, height } = layout;
      const vars = lightVars(current, width, height);
      const offsets = parallaxOffsets(current, fine && !reduced);
      shift = { name: offsets.name, person: offsets.person };
      Object.assign(vars, parallaxVars(offsets));
      for (const name in vars) el.style.setProperty(name, vars[name]);

      if (fine && !reduced) {
        const light = { x: current.x * width, y: current.y * height };
        const radius = hero.studio.letterRadius * width;
        for (const letter of layout.letters) {
          letter.el.style.setProperty("--t", proximity(light, letter.center, radius).toFixed(3));
        }
      }
      const p = layout.portrait;
      if (p) {
        const kx = ((current.x * width - p.left - offsets.person.x) / p.width) * 100;
        const ky = ((current.y * height - p.top - offsets.person.y) / p.height) * 100;
        p.el.style.setProperty("--key-x", kx.toFixed(1) + "%");
        p.el.style.setProperty("--key-y", ky.toFixed(1) + "%");
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
      if (reduced) return;
      if (!layout.width || !layout.height) return;
      const rect = el.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / (rect.width || 1)));
      const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / (rect.height || 1)));
      if (event.pointerType === "touch") {
        // Touch: only a light nudge around the resting position.
        target.x = restingLight.x + (x - 0.5) * 0.25;
        target.y = restingLight.y + (y - 0.5) * 0.2;
      } else {
        fine = true;
        target.x = x;
        target.y = y;
      }
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
    };
  }, [stage]);
}
