"use client";

import { useCallback } from "react";
import { useLenisInstance } from "@/components/layout/SmoothScroll";

interface ScrollToOptions {
  /** Extra offset in px added to the target position. */
  offset?: number;
  /** Subtract the fixed navbar height (default true). */
  nav?: boolean;
}

/** Smooth-scrolls to an element id or element, via Lenis when available. */
export function useScrollTo() {
  const lenis = useLenisInstance();

  return useCallback(
    (target: string | HTMLElement, { offset = 0, nav = true }: ScrollToOptions = {}) => {
      const el = typeof target === "string" ? document.getElementById(target) : target;
      if (!el) return;
      const navHeight = nav ? (document.querySelector("header")?.offsetHeight ?? 0) : 0;
      const total = offset - navHeight;
      if (lenis) {
        lenis.scrollTo(el, { offset: total });
      } else {
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + total, behavior: "instant" });
      }
    },
    [lenis],
  );
}
