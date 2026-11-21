"use client";

import { useEffect, useState } from "react";

/** Fraction of the viewport height, from the top, where the probe line sits. */
const PROBE_RATIO = 0.4;

/**
 * Returns the id of the current section: the last section whose top is at or above a probe line
 * (or the last one when the page is scrolled to the bottom). Works for tall pinned sections too.
 */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? "");
  const key = ids.join("|");

  useEffect(() => {
    const sectionIds = key.split("|").filter(Boolean);
    let frame = 0;

    const compute = () => {
      frame = 0;
      let current = sectionIds[0] ?? "";
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
      setActive((prev) => (prev === current ? prev : current));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [key]);

  return active;
}
