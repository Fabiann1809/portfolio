"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import type { ExperienceEntry } from "@/types";
import { experienceLabels } from "@/data/experience";

interface TimelineRowProps {
  entry: ExperienceEntry;
  index: number;
  active: boolean;
  /** Focus has reached this item (its number circle is lit). */
  reached: boolean;
  last: boolean;
  /** Reduced motion: everything fully visible, no transitions or animations. */
  plain: boolean;
  setRef: (el: HTMLLIElement | null) => void;
}

const sans = "font-[family-name:var(--font-geist-sans)]";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter((word) => word.length > 2)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

/** Timeline item: numbered circle on the scrubbed line, then a card with org, date pill, title, subtitle, tags and notes. */
export function TimelineRow({ entry, index, active, reached, last, plain, setRef }: TimelineRowProps) {
  const innerRef = useRef<HTMLLIElement | null>(null);
  const [entered, setEntered] = useState(false);
  const [open, setOpen] = useState(false);
  const notesId = useId();
  const visible = plain || entered;

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setEntered(true));
      return () => cancelAnimationFrame(id);
    }
    const observer = new IntersectionObserver(
      ([item]) => {
        if (item.isIntersecting) {
          setEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const ease = plain ? "" : "transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]";
  const delay = plain ? undefined : `${Math.min(index, 4) * 70}ms`;

  return (
    <li
      ref={(el) => {
        innerRef.current = el;
        setRef(el);
      }}
      className={`relative pl-14 ${last ? "" : "pb-8"} ${ease} ${visible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}`}
      style={{ transitionDelay: delay }}
    >
      {!last && (
        <>
          <span aria-hidden="true" className="absolute top-4 left-4 h-full w-px bg-line" />
          <span
            aria-hidden="true"
            className="absolute top-4 left-4 h-full w-px origin-top bg-emphasis will-change-transform"
            style={{
              transform: plain ? "none" : "scaleY(var(--f, 0))",
              boxShadow: "0 0 8px color-mix(in srgb, var(--emphasis) 70%, transparent)",
            }}
          />
        </>
      )}

      <span
        aria-hidden="true"
        className={`mono-label absolute top-0 left-0 flex size-8 items-center justify-center rounded-full border ${
          plain ? "" : "transition-[background-color,border-color,color,transform] duration-500"
        } ${reached ? "border-emphasis bg-emphasis text-background" : "border-line bg-background text-muted"} ${
          active && !plain ? "scale-110" : ""
        }`}
      >
        {active && !plain && <span className="absolute inset-0 animate-ping rounded-full bg-emphasis/50" />}
        <span className="relative">{index + 1}</span>
      </span>

      <div
        className={`rounded-xl border p-4 ${
          plain ? "" : "origin-left transition-[transform,border-color,box-shadow,opacity] duration-500 hover:-translate-y-1"
        } ${active || plain ? "border-line opacity-100" : "border-transparent opacity-50"} ${
          active && !plain ? "scale-[1.02]" : ""
        } hover:border-emphasis hover:opacity-100 hover:shadow-[0_0_24px_-6px_color-mix(in_srgb,var(--emphasis)_55%,transparent)]`}
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span
            aria-hidden="true"
            className="mono-label relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-surface text-[10px] text-muted"
          >
            {entry.logo ? <Image src={entry.logo} alt="" width={36} height={36} className="size-full object-cover" /> : initials(entry.organization)}
          </span>
          <p className={`${sans} min-w-[9rem] flex-1 text-sm font-semibold`}>{entry.organization}</p>
          <span className="mono-label shrink-0 rounded-full border border-line px-3 py-1 text-[10px] text-muted">{entry.period}</span>
        </div>

        <h4 className="giant-title mt-4 text-3xl text-foreground md:text-4xl">{entry.title}</h4>
        {entry.subtitle && <p className={`${sans} mt-2 text-sm text-muted`}>{entry.subtitle}</p>}

        {entry.tags && entry.tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {entry.tags.map((tag, t) => (
              <li
                key={tag}
                className={`mono-label rounded-full bg-surface px-2.5 py-1 text-[10px] text-emphasis ${
                  plain ? "" : visible ? "tag-pop" : "opacity-0"
                }`}
                style={plain ? undefined : { animationDelay: `${350 + t * 90}ms` }}
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        {entry.notes && entry.notes.length > 0 && (
          <div className="mt-3">
            <button
              type="button"
              aria-expanded={open}
              aria-controls={notesId}
              onClick={() => setOpen((v) => !v)}
              className="mono-label inline-flex cursor-pointer items-center gap-2 text-muted hover:text-emphasis"
            >
              <span aria-hidden="true" className={`inline-block ${plain ? "" : "transition-transform duration-300"} ${open ? "rotate-90" : ""}`}>
                ▸
              </span>
              {experienceLabels.details}
            </button>
            <div
              id={notesId}
              inert={!open}
              className={`grid ${plain ? "" : "transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"} ${
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <ul className={`${sans} min-h-0 list-disc space-y-1 overflow-hidden pl-5 text-sm text-muted marker:text-emphasis ${open ? "mt-2" : ""}`}>
                {entry.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}
