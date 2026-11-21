"use client";

import { useCallback, useRef, useState } from "react";
import { hero } from "@/data/hero";
import { useHeroFade } from "@/hooks/useHeroFade";
import { HeroStageContext } from "./HeroStageContext";

const { studio } = hero;
/** Layout tunables from data/hero.ts, read by the hero rules in globals.css. */
const stageVars = {
  "--portrait-h": studio.portraitHeight + "%",
  "--block-center": studio.blockCenterY + "%",
  "--photo-fade": studio.photoBottomFade * 100 + "%",
  "--photo-scan": studio.photoScanAlpha,
  "--photo-vignette": studio.photoVignette,
} as React.CSSProperties;

/**
 * Container of the hero scene. In the journey layout it also owns the scroll fade into the
 * screen texture (see useHeroFade). Shares the stage element with the scene through context.
 */
export function HeroStage({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<HTMLElement | null>(null);
  const setRef = useCallback((el: HTMLDivElement | null) => {
    ref.current = el;
    setStage(el);
  }, []);
  useHeroFade(ref);

  return (
    <div
      ref={setRef}
      data-hero-stage="true"
      data-hero-live="true"
      style={stageVars}
      className="hero-stage relative isolate flex min-h-svh flex-col overflow-hidden bg-background pb-20 journey:fixed journey:inset-0 journey:h-svh journey:pb-0 lg:block"
    >
      <HeroStageContext.Provider value={stage}>{children}</HeroStageContext.Provider>
    </div>
  );
}
