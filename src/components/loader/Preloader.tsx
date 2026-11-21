"use client";

import { useEffect, useRef, useState } from "react";
import { loader } from "@/data/loader";
import { useLenisInstance } from "@/components/layout/SmoothScroll";
import { prefersReducedMotion } from "@/lib/motion";
import { useLoader } from "./LoaderProvider";

const { timings } = loader;

type Phase = "loading" | "exiting" | "done";

const pad = (n: number) => String(n).padStart(3, "0");

export function Preloader() {
  const { getProgress, completeLoading } = useLoader();
  const [phase, setPhase] = useState<Phase>("loading");
  const [exitMs, setExitMs] = useState(timings.exitMs);
  const [reduced, setReduced] = useState(false);
  const dotRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lenis = useLenisInstance();
  const locked = phase !== "done";

  // Freeze scrolling while the overlay is visible: stop Lenis, or swallow input without it.
  useEffect(() => {
    if (!locked) return;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    lenis?.stop();
    const block = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const opts = { capture: true, passive: false } as const;
    if (!lenis) {
      window.addEventListener("wheel", block, opts);
      window.addEventListener("touchmove", block, opts);
    }
    return () => {
      root.style.overflow = prevOverflow;
      lenis?.start();
      window.removeEventListener("wheel", block, opts);
      window.removeEventListener("touchmove", block, opts);
    };
  }, [locked, lenis]);

  // Loading: ease the counter toward real progress, then move to "exiting". A timer (not rAF)
  // guarantees the exit even if animation frames are throttled or progress never completes.
  useEffect(() => {
    const timers: number[] = [];
    const start = performance.now();
    let last = start;
    let value = 0;
    let frame = 0;
    let finished = false;

    const paint = (v: number) => {
      const pct = Math.round(v * 100);
      if (dotRef.current) dotRef.current.style.left = v * 100 + "%";
      if (counterRef.current) counterRef.current.textContent = pad(pct);
      trackRef.current?.setAttribute("aria-valuenow", String(pct));
    };
    paint(0);

    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(frame);
      paint(1);
      timers.push(window.setTimeout(() => {
          const prefersReduced = prefersReducedMotion();
          setExitMs(prefersReduced ? timings.reducedExitMs : timings.exitMs);
          setReduced(prefersReduced);
          setPhase("exiting");
        }, timings.holdMs));
    };

    const tick = (now: number) => {
      const elapsed = now - start;
      const dt = now - last;
      last = now;

      const target = elapsed >= timings.maxWaitMs ? 1 : getProgress();
      // Ease toward the real progress; the clock cap keeps 100% from arriving before minDisplayMs.
      const eased = value + (target - value) * (1 - Math.exp(-dt / timings.smoothingMs));
      const cap = Math.min(1, elapsed / timings.minDisplayMs);
      value = Math.max(value, Math.min(eased, cap));

      if (target >= 1 && cap >= 1 && value > 0.995) {
        finish();
        return;
      }
      paint(value);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    timers.push(window.setTimeout(finish, timings.maxWaitMs + 500));

    return () => {
      finished = true;
      cancelAnimationFrame(frame);
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [getProgress]);

  // Exiting: runs on its own so it cannot be cancelled by the loading effect re-running.
  useEffect(() => {
    if (phase !== "exiting") return;
    completeLoading();
    const id = window.setTimeout(() => setPhase("done"), exitMs);
    return () => window.clearTimeout(id);
  }, [phase, exitMs, completeLoading]);

  if (phase === "done") return null;
  const leaving = phase === "exiting";
  const stateClass = leaving
    ? reduced
      ? "pointer-events-none opacity-0"
      : "pointer-events-none -translate-y-full"
    : "translate-y-0 opacity-100";

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black font-mono text-neutral-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${stateClass}`}
      style={{ transitionProperty: "transform, opacity", transitionDuration: exitMs + "ms" }}
    >
      <p className="mb-6 text-xs tracking-[0.5em] uppercase">{loader.label}</p>
      <div
        ref={trackRef}
        role="progressbar"
        aria-label={loader.ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        className="relative h-px w-56 bg-neutral-700"
      >
        <span
          ref={dotRef}
          className="absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--color-accent)"
          style={{ left: "0%" }}
        />
      </div>
      <span ref={counterRef} aria-hidden="true" className="mt-5 text-[10px] tracking-[0.3em] text-neutral-500">
        000
      </span>
    </div>
  );
}
