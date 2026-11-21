"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ScrambleTextProps {
  text: string;
  /** Delay in ms once the element is in view. */
  delay?: number;
  /** Total reveal duration in ms (kept short and subtle). */
  duration?: number;
  className?: string;
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>";

/**
 * Types the text in with a short scramble the first time it enters the viewport.
 * The real text is always in the DOM (screen readers, selection, no-JS); the scramble only
 * rewrites the visible text node. Reduced motion skips it entirely.
 */
export function ScrambleText({ text, delay = 0, duration = 600, className }: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const enabled = !reduced;

  useEffect(() => {
    const el = ref.current;
    const node = el?.firstChild;
    if (!enabled || !el || !node) return;

    let frame = 0;
    let timer = 0;
    const length = text.length;
    node.nodeValue = text.replace(/\S/g, " ");

    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const resolved = Math.floor(t * length * 1.15);
        let out = "";
        for (let i = 0; i < length; i++) {
          const ch = text[i];
          out += ch === " " || i < resolved ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        node.nodeValue = out;
        if (t < 1) frame = requestAnimationFrame(tick);
        else node.nodeValue = text;
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        timer = window.setTimeout(run, delay);
      },
      { threshold: 0.2 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
      node.nodeValue = text;
    };
  }, [enabled, text, delay, duration]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
