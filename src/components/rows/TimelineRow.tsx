import { ScrollReveal } from "@/components/ui/ScrollReveal";

export interface TimelineRowData {
  title: string;
  organization: string;
  period: string;
  /** Small tag after the organization (e.g. contract type). */
  tag?: string;
  note?: string;
}

/**
 * Ruled row: index, title, organization, years and a short note. The accent line sweeps in on hover.
 */
export function TimelineRow({ row, index }: { row: TimelineRowData; index: number }) {
  return (
    <ScrollReveal as="li" className="group relative border-t border-line last:border-b">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-emphasis transition-transform duration-500 group-hover:scale-x-100"
      />
      <div className="grid gap-x-8 gap-y-3 py-7 md:grid-cols-[4rem_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.8fr)] md:items-baseline md:py-9">
        <span className="mono-label text-muted transition-colors group-hover:text-emphasis">{String(index + 1).padStart(2, "0")}</span>
        <h3 className="giant-title text-[clamp(30px,4vw,60px)] transition-transform duration-500 group-hover:translate-x-2">{row.title}</h3>
        <p className="mono-label">
          {row.organization}
          {row.tag && <span className="ml-3 text-muted">{row.tag}</span>}
        </p>
        <p className="mono-label text-muted md:text-right">{row.period}</p>
        {row.note && <p className="max-w-2xl text-sm text-muted md:col-start-2 md:col-end-5">{row.note}</p>}
      </div>
    </ScrollReveal>
  );
}
