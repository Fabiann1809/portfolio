"use client";

import { useEffect } from "react";
import { lightVars, restingLight } from "@/lib/studioLight";
import type { LightPoint } from "@/lib/studioLight";
import { prefersReducedMotion } from "@/lib/motion";

const FOLLOW_SECONDS = 0.14;

/**
 * Drives the studio light of `stage`: the pointer sets a target, a rAF loop damps the light
 * toward it and writes CSS variables on the stage (no React re-render per move). Touch and
 * reduced motion keep the light at rest (touch drags only nudge it).
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

    const write = () => {
      const rect = el.getBoundingClientRect();
      const vars = lightVars(current, rect.width || 1, rect.height || 1);
      for (const name in vars) el.style.setProperty(name, vars[name]);
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
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
      if (event.pointerType === "touch") {
        // Touch: only a light nudge around the resting position.
        target.x = restingLight.x + (x - 0.5) * 0.25;
        target.y = restingLight.y + (y - 0.5) * 0.2;
      } else {
        target.x = x;
        target.y = y;
      }
      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    const onResize = () => write();
    write();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, [stage]);
}
