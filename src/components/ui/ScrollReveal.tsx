"use client";

import { useEffect, useRef, useState } from "react";
import type { ElementType } from "react";
import { journeyConfig } from "@/data/chapters";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ScrollRevealProps {
  children: React.ReactNode;
  as?: "div" | "h2" | "h3" | "p" | "ul" | "ol" | "li" | "form";
  /** Delay in ms before the reveal starts (single mode). */
  delay?: number;
  /** Reveal direct children one after another instead of the element itself. */
  stagger?: boolean;
  className?: string;
}

/**
 * Fades in, rises and un-blurs when it enters the viewport (once).
 * Styles live in globals.css ([data-reveal]); reduced motion gets a quick plain fade.
 */
export function ScrollReveal({ children, as = "div", delay = 0, stagger = false, className }: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // No IntersectionObserver (old browsers): never leave content hidden.
    if (typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Very tall targets can never reach 10% visible, so also accept 10% of the viewport.
        const vh = entry.rootBounds?.height ?? window.innerHeight;
        if (entry.isIntersecting && (entry.intersectionRatio >= 0.1 || entry.intersectionRect.height >= vh * 0.1)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: [0, 0.1], rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = as as ElementType;
  return (
    <Tag
      ref={ref}
      className={className}
      data-reveal={stagger ? "group" : "item"}
      data-shown={shown}
      data-reduced={reduced}
      style={{
        "--reveal-stagger": journeyConfig.overlay.stagger + "ms",
        "--reveal-rise": journeyConfig.overlay.rise + "px",
        ...(!stagger && delay ? { transitionDelay: reduced ? undefined : delay + "ms" } : null),
      } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
