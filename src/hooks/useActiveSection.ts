"use client";

import { useEffect, useState } from "react";
import { subscribe } from "@/lib/scrollStore";

/** Fraction of the viewport height, from the top, where the probe line sits. */
const PROBE_RATIO = 0.4;

/**
 * Returns the id of the last section whose top is at or above the probe line.
 * Works for sections taller than the viewport (e.g. the pinned Projects section).
 * At the very bottom of the page the last section is always active.
 */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? "");
  const key = ids.join("|");

  useEffect(() => {
    const sectionIds = key.split("|").filter(Boolean);
    let frame = 0;

    const compute = () => {
      frame = 0;
      const probe = window.innerHeight * PROBE_RATIO;
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

      let current = sectionIds[0] ?? "";
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
      setActive((prev) => (prev === current ? prev : current));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };

    const unsubscribe = subscribe(schedule);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    compute();

    return () => {
      unsubscribe();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [key]);

  return active;
}
