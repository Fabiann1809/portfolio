"use client";

import { useEffect, useRef, useState } from "react";
import type { ExperienceEntry } from "@/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ExperienceListProps {
  entries: ExperienceEntry[];
  label: string;
}

/**
 * Compact vertical timeline: period, title, organization · place, full description.
 * The accent line fills as you scroll (up to the viewport middle) and each dot lights when the line reaches it.
 */
export function ExperienceList({ entries, label }: ExperienceListProps) {
  const reduced = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [reached, setReached] = useState(-1);

  useEffect(() => {
    const list = listRef.current;
    const fill = fillRef.current;
    if (!list || !fill) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = list.getBoundingClientRect();
      const line = reduced ? Infinity : window.innerHeight * 0.6 - rect.top;
      const progress = Math.min(1, Math.max(0, line / rect.height));
      fill.style.transform = `scaleY(${progress})`;
      let last = -1;
      dotRefs.current.forEach((dot, i) => {
        if (dot && dot.getBoundingClientRect().top - rect.top <= line) last = i;
      });
      setReached(last);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  return (
    <ol ref={listRef} aria-label={label} className="relative font-sans">
      <span aria-hidden="true" className="absolute top-2 bottom-2 left-[5px] w-px bg-line" />
      <span
        ref={fillRef}
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-[5px] w-px origin-top bg-emphasis"
        style={{ transform: "scaleY(0)", boxShadow: "0 0 8px color-mix(in srgb, var(--emphasis) 70%, transparent)" }}
      />
      {entries.map((entry, i) => (
        <li key={entry.id} className="relative pb-9 pl-9 last:pb-0">
          <span
            ref={(el) => {
              dotRefs.current[i] = el;
            }}
            aria-hidden="true"
            className={`absolute top-1.5 left-0 size-[11px] rounded-full border transition-[background-color,border-color,transform] duration-500 ${
              i <= reached ? "scale-110 border-emphasis bg-emphasis" : "border-line bg-background"
            }`}
          />
          {entry.period && <p className="mono-label text-[10px] text-muted">{entry.period}</p>}
          <h4 className="mt-1 text-xl leading-tight font-bold md:text-2xl">{entry.title}</h4>
          <p className="mt-1 text-sm text-emphasis md:text-base">
            {entry.organization}
            {entry.place && <span> · {entry.place}</span>}
          </p>
          {entry.description && <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{entry.description}</p>}
        </li>
      ))}
    </ol>
  );
}
