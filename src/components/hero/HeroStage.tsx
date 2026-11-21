"use client";

import { useRef } from "react";
import { useStudioLight } from "@/hooks/useStudioLight";
import { cycleBackdrop } from "@/lib/theme";

const INTERACTIVE = "a, button, input, textarea, select, [role='radio'], [role='radiogroup']";

/**
 * Container of the hero scene. Owns the studio light (CSS vars), the click-to-cycle-backdrop
 * behaviour.
 */
export function HeroStage({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useStudioLight(ref);

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
      className="studio-hero relative isolate flex min-h-svh flex-col overflow-hidden bg-background pb-8 xl:block xl:pb-0"
    >
      {children}
    </div>
  );
}
