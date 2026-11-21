import { education, educationTitle } from "@/data/education";
import { TimelineRow } from "@/components/rows/TimelineRow";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function Education() {
  return (
    <section id="education" className="px-[var(--edge-x)] py-24 md:py-32">
      <SectionLabel>{educationTitle}</SectionLabel>
      <ul className="mt-10">
        {education.map((entry, i) => (
          <TimelineRow
            key={entry.id}
            index={i}
            row={{
              title: entry.title,
              organization: entry.institution,
              period: entry.period,
              note: entry.description,
            }}
          />
        ))}
      </ul>
    </section>
  );
}
