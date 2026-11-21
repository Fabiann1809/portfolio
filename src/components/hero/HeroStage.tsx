"use client";

import { useRef } from "react";
import { useHeroFade } from "@/hooks/useHeroFade";
import { useStudioLight } from "@/hooks/useStudioLight";
import { cycleBackdrop } from "@/lib/theme";

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
      className="relative isolate flex min-h-svh flex-col overflow-hidden bg-background pb-20 journey:fixed journey:inset-0 journey:h-svh journey:pb-0 md:block"
    >
      {children}
    </div>
  );
}
