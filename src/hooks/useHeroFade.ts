"use client";

import { useEffect } from "react";
import { usePinnedLayout } from "@/hooks/usePinnedLayout";

/** Scroll range (in viewport heights) over which the hero DOM fades into its screen texture. */
const FADE_FROM = 0.02;
const FADE_TO = 0.32;

/** Writes the fade state to the stage element (visibility, pointer events, live flag). */
function writeFade(el: HTMLElement, opacity: number) {
  const hidden = opacity < 0.01;
  el.style.opacity = opacity >= 1 ? "" : String(opacity);
  el.style.visibility = hidden ? "hidden" : "";
  el.style.pointerEvents = opacity < 0.3 ? "none" : "";
  if (hidden) delete el.dataset.heroLive;
  else el.dataset.heroLive = "true";
}

/**
 * In the journey layout the hero stage is fixed and fades out as the scroll starts, handing
 * over to the curved screen (whose texture mimics the hero) that then shrinks.
 */
export function useHeroFade(stage: React.RefObject<HTMLElement | null>) {
  const journey = usePinnedLayout();

  useEffect(() => {
    const el = stage.current;
    if (!journey || !el) return;

    const update = () => {
      const vh = window.innerHeight || 1;
      const t = Math.min(1, Math.max(0, (window.scrollY / vh - FADE_FROM) / (FADE_TO - FADE_FROM)));
      const opacity = 1 - t * t * (3 - 2 * t);
      writeFade(el, opacity);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      writeFade(el, 1);
    };
  }, [journey, stage]);
}
