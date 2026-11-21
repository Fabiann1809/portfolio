import { experience, experienceTitle, experienceTypeLabels } from "@/data/experience";
import { TimelineRow } from "@/components/rows/TimelineRow";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function Experience() {
  return (
    <section id="experience" className="px-[var(--edge-x)] py-24 md:py-32">
      <SectionLabel>{experienceTitle}</SectionLabel>
      <ul className="mt-10">
        {experience.map((entry, i) => (
          <TimelineRow
            key={entry.id}
            index={i}
            row={{
              title: entry.role,
              organization: entry.company,
              period: entry.period,
              tag: experienceTypeLabels[entry.type],
              note: entry.description,
            }}
          />
        ))}
      </ul>
    </section>
  );
}
