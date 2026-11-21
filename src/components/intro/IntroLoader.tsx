"use client";

import { useEffect, useRef, useState } from "react";
import { intro } from "@/data/intro";
import { useIntro } from "./IntroProvider";
import { Sparkles, type PenTip } from "./Sparkles";

const SESSION_KEY = "intro-played";
const { timings } = intro;
const STEP_MS = timings.letterMs - timings.letterOverlapMs;
const LETTERS_END = STEP_MS * (intro.letters.length - 1) + timings.letterMs;
const FILL_END = LETTERS_END + timings.fillMs;
const TOTAL_MS = FILL_END + timings.flourishMs;

type Phase = "playing" | "exiting" | "done";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export function IntroLoader() {
  const { completeIntro } = useIntro();
  const [phase, setPhase] = useState<Phase>("playing");
  const [exitMs, setExitMs] = useState(timings.exitMs);
  const [filled, setFilled] = useState(false);
  const letterRefs = useRef<(SVGPathElement | null)[]>([]);
  const flourishRef = useRef<SVGPathElement>(null);
  const tipRef = useRef<PenTip>({ x: 0, y: 0, active: false });

  useEffect(() => {
    const forced = new URLSearchParams(window.location.search).get("intro") === "1";
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // storage unavailable: play every time
    }
    const skip = seen && !forced;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    // Lenis (mounted elsewhere) listens to wheel/touch on window: swallow them while visible.
    const block = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const opts = { capture: true, passive: false } as const;
    window.addEventListener("wheel", block, opts);
    window.addEventListener("touchmove", block, opts);
    const unlock = () => {
      root.style.overflow = prevOverflow;
      window.removeEventListener("wheel", block, opts);
      window.removeEventListener("touchmove", block, opts);
    };

    let drawn = false;
    let ready = false;
    let exited = false;
    let frame = 0;
    const timers: number[] = [];

    const exit = (ms: number) => {
      if (exited) return;
      exited = true;
      cancelAnimationFrame(frame);
      tipRef.current.active = false;
      setExitMs(ms);
      setPhase("exiting");
      completeIntro();
      timers.push(
        window.setTimeout(() => {
          unlock();
          setPhase("done");
        }, ms),
      );
    };
    const tryExit = () => {
      if (drawn && ready) exit(reduced || skip ? timings.reducedExitMs : timings.exitMs);
    };

    const pageReady = Promise.all([
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) =>
            window.addEventListener("load", () => resolve(), { once: true }),
          ),
      document.fonts ? document.fonts.ready : Promise.resolve(),
    ]);
    pageReady.then(() => {
      ready = true;
      tryExit();
    });

    // Safety net: never trap the visitor behind the intro.
    timers.push(window.setTimeout(() => exit(timings.exitMs), timings.maxWaitMs));

    if (skip || reduced) {
      // No drawing: show the finished name and leave quickly.
      letterRefs.current.forEach((p) => p?.style.setProperty("stroke-dashoffset", "0"));
      flourishRef.current?.style.setProperty("stroke-dashoffset", "0");
      timers.push(
        window.setTimeout(
          () => {
            setFilled(true);
            drawn = true;
            tryExit();
          },
          skip ? 0 : 300,
        ),
      );
    } else {
      const start = performance.now();
      const point = new DOMPoint();
      const tick = (now: number) => {
        const t = now - start;
        let active: SVGPathElement | null = null;
        let progress = 0;

        letterRefs.current.forEach((path, i) => {
          if (!path) return;
          const p = clamp01((t - i * STEP_MS) / timings.letterMs);
          path.style.strokeDashoffset = String(1 - p);
          if (p > 0 && p < 1) {
            active = path;
            progress = p;
          }
        });
        const fp = clamp01((t - FILL_END) / timings.flourishMs);
        const flourish = flourishRef.current;
        if (flourish) {
          flourish.style.strokeDashoffset = String(1 - fp);
          if (fp > 0 && fp < 1) {
            active = flourish;
            progress = fp;
          }
        }
        if (t >= LETTERS_END) setFilled(true);

        const tip = tipRef.current;
        const el = active as SVGPathElement | null;
        const ctm = el?.getScreenCTM();
        if (el && ctm) {
          const pt = el.getPointAtLength(progress * el.getTotalLength());
          point.x = pt.x;
          point.y = pt.y;
          const screen = point.matrixTransform(ctm);
          tip.x = screen.x;
          tip.y = screen.y;
          tip.active = true;
        } else {
          tip.active = false;
        }

        if (t >= TOTAL_MS) {
          drawn = true;
          tip.active = false;
          tryExit();
          return;
        }
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(frame);
      timers.forEach((id) => window.clearTimeout(id));
      unlock();
    };
  }, [completeIntro]);

  if (phase === "done") return null;
  const leaving = phase === "exiting";

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-neutral-950 text-neutral-100 ease-out ${
        leaving ? "pointer-events-none -translate-y-3 opacity-0" : "translate-y-0 opacity-100"
      }`}
      style={{
        transitionProperty: "opacity, transform",
        transitionDuration: exitMs + "ms",
      }}
    >
      <p className="mb-2 text-sm tracking-widest uppercase opacity-70">{intro.greeting}</p>
      <svg viewBox={intro.viewBox} className="w-[min(80vw,28rem)]" fill="none">
        <g
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            fill: "currentColor",
            fillOpacity: filled ? 1 : 0,
            transition: `fill-opacity ${timings.fillMs}ms ease-out`,
          }}
        >
          {intro.letters.map((letter, i) => (
            <path
              key={i}
              ref={(el) => {
                letterRefs.current[i] = el;
              }}
              d={letter.d}
              pathLength={1}
              style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
            />
          ))}
        </g>
        <path
          ref={flourishRef}
          d={intro.flourish}
          pathLength={1}
          stroke="var(--color-primary)"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
        />
      </svg>
      <Sparkles tipRef={tipRef} />
    </div>
  );
}
