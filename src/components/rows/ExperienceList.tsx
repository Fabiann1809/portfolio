import type { ExperienceEntry } from "@/types";

interface ExperienceListProps {
  entries: ExperienceEntry[];
  label: string;
}

/** Compact vertical timeline: dot + line, period, title, organization · place, full description. */
export function ExperienceList({ entries, label }: ExperienceListProps) {
  return (
    <ol aria-label={label} className="font-sans">
      {entries.map((entry, i) => (
        <li key={entry.id} className="relative pb-9 pl-9 last:pb-0">
          {i < entries.length - 1 && (
            <span aria-hidden="true" className="absolute top-3 bottom-0 left-[5px] w-px bg-emphasis/40" />
          )}
          <span aria-hidden="true" className="absolute top-1.5 left-0 size-[11px] rounded-full bg-emphasis" />
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
