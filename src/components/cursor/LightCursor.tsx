"use client";

import { useEffect, useRef } from "react";
import { hero } from "@/data/hero";
import { useFinePointer } from "@/hooks/useFinePointer";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const FOLLOW_SECONDS = 0.06;
const INTERACTIVE = "a, button, summary, [role='radio'], [role='button'], [data-cursor='hover']";
const TEXT_FIELD = "input, textarea, select, [contenteditable='true']";

type Mode = "hidden" | "light" | "ring" | "hover";

/**
 * Custom pointer: a glowing "light" dot over the hero, a subtle ring elsewhere (grows on
 * links / buttons). Only on fine pointers and without reduced motion; text fields keep the
 * native cursor. Position and mode are written straight to the DOM (no React re-render).
 */
export function LightCursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;

    const root = document.documentElement;
    root.dataset.lightCursor = "true";

    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let frame = 0;
    let last = 0;
    let placed = false;
    let mode: Mode = "hidden";

    const setMode = (next: Mode) => {
      if (next === mode) return;
      mode = next;
      el.dataset.mode = next;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const k = 1 - Math.exp(-dt / FOLLOW_SECONDS);
      pos.x += (target.x - pos.x) * k;
      pos.y += (target.y - pos.y) * k;
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      const settled = Math.abs(target.x - pos.x) < 0.1 && Math.abs(target.y - pos.y) < 0.1;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      target.x = event.clientX;
      target.y = event.clientY;
      if (!placed) {
        pos.x = target.x;
        pos.y = target.y;
        placed = true;
      }
      const node = event.target instanceof Element ? event.target : null;
      if (!node || node.closest(TEXT_FIELD)) setMode("hidden");
      else if (node.closest(INTERACTIVE)) setMode("hover");
      else if (node.closest("[data-light-zone]")) setMode("light");
      else setMode("ring");
      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };
    const onLeave = () => setMode("hidden");
    const onDown = () => (el.dataset.pressed = "true");
    const onUp = () => delete el.dataset.pressed;

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      delete root.dataset.lightCursor;
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={ref} aria-hidden="true" data-mode="hidden" className="light-cursor">
      <span className="light-cursor__dot" />
      <span className="light-cursor__label">{hero.lightLabel}</span>
    </div>
  );
}
