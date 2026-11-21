"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import { motion } from "@/data/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Creates the Lenis instance (null when the user prefers reduced motion, so native
 * scroll is used).
 */
export function useLenis(): Lenis | null {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  // Only a trigger: the hydration snapshot is false, so the real value is read inside the effect.
  const reducedSnapshot = useReducedMotion();

  useEffect(() => {
    const clearClasses = () =>
      document.documentElement.classList.remove("lenis", "lenis-smooth", "lenis-stopped", "lenis-scrolling");

    if (prefersReducedMotion()) {
      clearClasses();
      return;
    }

    const instance = new Lenis({
      lerp: motion.lenis.lerp,
      smoothWheel: true,
      wheelMultiplier: motion.lenis.wheelMultiplier,
      syncTouch: true,
      syncTouchLerp: 0.1,
    });
    let frame = requestAnimationFrame(function raf(time) {
      instance.raf(time);
      frame = requestAnimationFrame(raf);
    });
    setLenis(instance);

    return () => {
      cancelAnimationFrame(frame);
      instance.destroy();
      clearClasses();
      setLenis(null);
    };
  }, [reducedSnapshot]);

  return lenis;
}
