"use client";

import { useEffect, useRef, useState } from "react";
import type { ElementType } from "react";

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
 * Styles live in globals.css ([data-reveal]); prefers-reduced-motion gets a plain fade.
 */
export function ScrollReveal({ children, as = "div", delay = 0, stagger = false, className }: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
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
      style={!stagger && delay ? { transitionDelay: delay + "ms" } : undefined}
    >
      {children}
    </Tag>
  );
}
