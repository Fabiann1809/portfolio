"use client";

import { useEffect } from "react";
import { usePinnedLayout } from "@/hooks/usePinnedLayout";

/**
 * The page `<main>`. Flags the journey layout on <html> so styles (light text over the dark
 * canvas, for main and footer alike) apply only while the WebGL journey is active.
 */
export function JourneyRoot({ children }: { children: React.ReactNode }) {
  const journey = usePinnedLayout();

  useEffect(() => {
    const root = document.documentElement;
    if (journey) root.dataset.journey = "true";
    return () => {
      delete root.dataset.journey;
    };
  }, [journey]);

  return <main className="relative z-10">{children}</main>;
}
