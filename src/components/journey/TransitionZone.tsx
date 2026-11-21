"use client";

import { useEffect, useRef } from "react";
import { chapters } from "@/data/chapters";
import { usePinnedLayout } from "@/hooks/usePinnedLayout";
import { registerTrack } from "@/lib/journey";

/**
 * Empty scroll spacer between two sections. While it scrolls past, the canvas runs the
 * transition into the chapter `chapterId`. Absent in the flow layout (mobile / reduced motion).
 */
export function TransitionZone({ chapterId }: { chapterId: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const journey = usePinnedLayout();

  useEffect(() => {
    const el = ref.current;
    if (!journey || !el) return;
    return registerTrack("zone", el, 1);
  }, [journey]);

  const lengthVh = chapters.find((chapter) => chapter.id === chapterId)?.transition?.lengthVh;
  if (!journey || !lengthVh) return null;
  return <div ref={ref} aria-hidden="true" data-zone={chapterId} style={{ height: lengthVh + "vh" }} />;
}
