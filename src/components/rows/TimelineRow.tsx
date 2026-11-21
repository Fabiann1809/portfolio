import Image from "next/image";
import type { ExperienceEntry } from "@/types";
import { experienceLabels } from "@/data/experience";

interface TimelineRowProps {
  entry: ExperienceEntry;
  index: number;
  active: boolean;
  /** The line below this item is filled (focus is further down). */
  filled: boolean;
  last: boolean;
  /** Reduced motion: everything fully visible, no transitions. */
  plain: boolean;
  setRef: (el: HTMLLIElement | null) => void;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter((word) => word.length > 2)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

/** Timeline item: numbered circle on the line, org + date pill, title, subtitle, tag chips and collapsed notes. */
export function TimelineRow({ entry, index, active, filled, last, plain, setRef }: TimelineRowProps) {
  const t = plain ? "" : "transition-[opacity,background-color,border-color,color] duration-500";
  return (
    <li ref={setRef} className={`relative pl-14 ${last ? "" : "pb-12"} ${t} ${active || plain ? "opacity-100" : "opacity-35"}`}>
      {!last && (
        <>
          <span aria-hidden="true" className="absolute top-4 left-4 h-full w-px bg-line" />
          <span
            aria-hidden="true"
            className={`absolute top-4 left-4 h-full w-px origin-top bg-emphasis ${plain ? "" : "transition-transform duration-700"} ${filled ? "scale-y-100" : "scale-y-0"}`}
          />
        </>
      )}
      <span
        aria-hidden="true"
        className={`mono-label absolute top-0 left-0 flex size-8 items-center justify-center rounded-full border ${t} ${
          active ? "border-emphasis bg-emphasis text-background" : "border-line bg-background text-muted"
        }`}
      >
        {index + 1}
      </span>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span
          aria-hidden="true"
          className="mono-label relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-surface text-[10px] text-muted"
        >
          {entry.logo ? <Image src={entry.logo} alt="" width={36} height={36} className="size-full object-cover" /> : initials(entry.organization)}
        </span>
        <p className="min-w-[9rem] flex-1 text-sm font-bold">{entry.organization}</p>
        <span className="mono-label shrink-0 rounded-full border border-line px-3 py-1 text-[10px] text-muted">{entry.period}</span>
      </div>

      <h4 className="mt-3 font-display text-xl font-extrabold tracking-tight md:text-2xl">{entry.title}</h4>
      {entry.subtitle && <p className="mt-1 text-sm text-muted">{entry.subtitle}</p>}

      {entry.tags && entry.tags.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {entry.tags.map((tag) => (
            <li key={tag} className="mono-label rounded-full bg-surface px-2.5 py-1 text-[10px] text-emphasis">
              {tag}
            </li>
          ))}
        </ul>
      )}

      {entry.notes && entry.notes.length > 0 && (
        <details className="group mt-3">
          <summary className="mono-label inline-flex cursor-pointer list-none items-center gap-2 text-muted marker:hidden hover:text-emphasis [&::-webkit-details-marker]:hidden">
            <span aria-hidden="true" className="inline-block transition-transform group-open:rotate-90">▸</span>
            {experienceLabels.details}
          </summary>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted marker:text-emphasis">
            {entry.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </details>
      )}
    </li>
  );
}
