"use client";

import { useCallback, useRef, useState } from "react";
import { hero } from "@/data/hero";
import { useHeroFade } from "@/hooks/useHeroFade";
import { useStudioLight } from "@/hooks/useStudioLight";
import { cycleBackdrop } from "@/lib/theme";
import { HeroStageContext } from "./HeroStageContext";

const { studio } = hero;
/** Layout tunables from data/hero.ts, read by the hero rules in globals.css. */
const stageVars = {
  "--name-em": studio.nameWidthEm,
  "--name-fit": studio.nameFit,
  "--name-rise": studio.nameRiseEm,
  "--name-center-n": studio.nameCenterY,
  "--name-center": studio.nameCenterY + "%",
  "--name-tracking": studio.nameTracking + "em",
  "--letter-stagger": studio.letterStaggerMs + "ms",
  "--portrait-top": studio.portraitTop + "%",
  "--portrait-h": studio.portraitHeight + "%",
  "--block-center-n": studio.blockCenterY,
  "--block-center": studio.blockCenterY + "%",
} as React.CSSProperties;

const INTERACTIVE = "a, button, input, textarea, select, [role='radio'], [role='radiogroup']";

/**
 * Container of the hero scene. Owns the light cursor state (CSS vars + shared state for the WebGL
 * scene), the click-to-cycle-tone behaviour and, in the journey layout, the scroll fade into the
 * screen texture. Shares the stage element with the scene through context.
 */
export function HeroStage({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<HTMLElement | null>(null);
  const setRef = useCallback((el: HTMLDivElement | null) => {
    ref.current = el;
    setStage(el);
  }, []);
  useStudioLight(ref);
  useHeroFade(ref);

  function onClick(event: React.MouseEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest(INTERACTIVE)) return;
    if (window.getSelection()?.toString()) return;
    cycleBackdrop();
  }

  return (
    <div
      ref={setRef}
      data-hero-stage="true"
      data-light-zone="true"
      onClick={onClick}
      style={stageVars}
      className="hero-stage relative isolate flex min-h-svh flex-col overflow-hidden bg-background pb-20 journey:fixed journey:inset-0 journey:h-svh journey:pb-0 lg:block"
    >
      <HeroStageContext.Provider value={stage}>{children}</HeroStageContext.Provider>
    </div>
  );
}
