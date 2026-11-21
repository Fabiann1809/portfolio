import { experienceGroups, experienceTitle } from "@/data/experience";
import { TimelineRow } from "@/components/rows/TimelineRow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function Experience() {
  return (
    <section id="experience" className="px-[var(--edge-x)] py-24 md:py-32">
      <SectionLabel>{experienceTitle}</SectionLabel>
      {experienceGroups.map((group) => (
        <div key={group.id} className="mt-12">
          <ScrollReveal as="h3" className="mono-label text-emphasis">
            {group.label}
          </ScrollReveal>
          <ul className="mt-4">
            {group.entries.map((entry, i) => (
              <TimelineRow
                key={entry.id}
                index={i}
                row={{
                  title: entry.title,
                  organization: entry.organization,
                  period: entry.period,
                  tag: entry.tag,
                  note: entry.note,
                }}
              />
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
