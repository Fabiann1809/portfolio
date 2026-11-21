"use client";

import { useEffect, useRef, useState } from "react";
import type { ExperienceEntry } from "@/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TimelineRow } from "./TimelineRow";

/** Height from a row's top to its number circle center (circle is size-8). */
const CIRCLE_CENTER = 16;

/**
 * Vertical timeline. The accent line is scrubbed by scroll (each row sets its own --f, 0..1, as the
 * viewport center passes it); the item nearest the viewport center is focused.
 */
export function Timeline({ entries, label }: { entries: ExperienceEntry[]; label: string }) {
  const reduced = useReducedMotion();
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [focus, setFocus] = useState(0);

  useEffect(() => {
    let frame = 0;
    const compute = () => {
      frame = 0;
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestDistance = Infinity;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const fill = Math.min(1, Math.max(0, (mid - (rect.top + CIRCLE_CENTER)) / rect.height));
        el.style.setProperty("--f", fill.toFixed(4));
        const distance = mid >= rect.top && mid <= rect.bottom ? 0 : Math.min(Math.abs(rect.top - mid), Math.abs(rect.bottom - mid));
        if (distance < bestDistance) {
          bestDistance = distance;
          best = i;
        }
      });
      setFocus(best);
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
  }, [entries.length]);

  return (
    <ol aria-label={label}>
      {entries.map((entry, i) => (
        <TimelineRow
          key={entry.id}
          entry={entry}
          index={i}
          active={i === focus}
          reached={i <= focus}
          last={i === entries.length - 1}
          plain={reduced}
          setRef={(el) => {
            itemRefs.current[i] = el;
          }}
        />
      ))}
    </ol>
  );
}
