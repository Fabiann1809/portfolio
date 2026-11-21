"use client";

import { useEffect, useState } from "react";
import { subscribe } from "@/lib/scrollStore";
import { getActiveChapterId, subscribeJourneyLayout } from "@/lib/journey";
import { usePinnedLayout } from "@/hooks/usePinnedLayout";

/** Fraction of the viewport height, from the top, where the probe line sits (flow layout). */
const PROBE_RATIO = 0.4;

/**
 * Returns the id of the current section.
 * Journey layout: the chapter whose expanded section is current (switches at the midpoint of
 * a transition). Flow layout: the last section whose top is at or above a probe line.
 */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? "");
  const journey = usePinnedLayout();
  const key = ids.join("|");

  useEffect(() => {
    const sectionIds = key.split("|").filter(Boolean);
    let frame = 0;

    const compute = () => {
      frame = 0;
      let current = sectionIds[0] ?? "";

      if (journey) {
        const id = getActiveChapterId();
        if (sectionIds.includes(id)) current = id;
      } else {
        const probe = window.innerHeight * PROBE_RATIO;
        const atBottom =
          window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
        if (atBottom) {
          for (let i = sectionIds.length - 1; i >= 0; i--) {
            if (document.getElementById(sectionIds[i])) {
              current = sectionIds[i];
              break;
            }
          }
        } else {
          for (const id of sectionIds) {
            const el = document.getElementById(id);
            if (el && el.getBoundingClientRect().top <= probe) current = id;
          }
        }
      }
      setActive((prev) => (prev === current ? prev : current));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };

    const unsubscribe = subscribe(schedule);
    const unsubscribeLayout = journey ? subscribeJourneyLayout(schedule) : () => {};
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();

    return () => {
      unsubscribe();
      unsubscribeLayout();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [key, journey]);

  return active;
}
