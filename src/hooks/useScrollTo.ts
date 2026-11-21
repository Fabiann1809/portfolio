"use client";

import { useCallback } from "react";
import { useLenisInstance } from "@/components/layout/SmoothScroll";
import { usePinnedLayout } from "@/hooks/usePinnedLayout";
import { journeyConfig } from "@/data/chapters";

interface ScrollToOptions {
  /** Extra offset in px added to the target position. */
  offset?: number;
  /** Subtract the fixed navbar height (default true). */
  nav?: boolean;
}

/**
 * Smooth-scrolls to an element id or element, via Lenis when available. Sections are real DOM
 * placed right after their transition zone, so this lands on the start of the chapter.
 */
export function useScrollTo() {
  const lenis = useLenisInstance();
  const journey = usePinnedLayout();

  return useCallback(
    (target: string | HTMLElement, { offset = 0, nav = true }: ScrollToOptions = {}) => {
      const el = typeof target === "string" ? document.getElementById(target) : target;
      if (!el) return;
      const navHeight = nav ? (document.querySelector("header")?.offsetHeight ?? 0) : 0;
      const total = offset - navHeight;
      if (lenis) {
        lenis.scrollTo(
          el,
          journey ? { offset: total, duration: journeyConfig.lenis.jumpDuration } : { offset: total },
        );
      } else {
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + total, behavior: "instant" });
      }
    },
    [lenis, journey],
  );
}
