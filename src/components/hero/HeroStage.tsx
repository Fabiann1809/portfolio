"use client";

import { useRef } from "react";
import { hero } from "@/data/hero";
import { useHeroFade } from "@/hooks/useHeroFade";
import { useStudioLight } from "@/hooks/useStudioLight";
import { cycleBackdrop } from "@/lib/theme";

const { studio } = hero;
/** Name layout tunables from data/hero.ts, read by .hero-name in globals.css. */
const stageVars = {
  "--name-em": studio.nameWidthEm,
  "--name-fit": studio.nameFit,
  "--name-clear": studio.introClearancePx + "px",
  "--name-rise": studio.nameRiseEm,
  "--name-center-n": studio.nameCenterY,
  "--name-center": studio.nameCenterY + "%",
  "--name-tracking": studio.nameTracking + "em",
  "--letter-stagger": studio.letterStaggerMs + "ms",
} as React.CSSProperties;

const INTERACTIVE = "a, button, input, textarea, select, [role='radio'], [role='radiogroup']";

/**
 * Container of the hero scene. Owns the studio light (CSS vars), the click-to-cycle-backdrop
 * behaviour and, in the journey layout, the scroll fade into the screen texture.
 */
export function HeroStage({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useStudioLight(ref);
  useHeroFade(ref);

  function onClick(event: React.MouseEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest(INTERACTIVE)) return;
    if (window.getSelection()?.toString()) return;
    cycleBackdrop();
  }

  return (
    <div
      ref={ref}
      data-light-zone="true"
      onClick={onClick}
      style={stageVars}
      className="hero-stage relative isolate flex min-h-svh flex-col overflow-hidden bg-background pb-20 journey:fixed journey:inset-0 journey:h-svh journey:pb-0 md:block"
    >
      {children}
    </div>
  );
}
