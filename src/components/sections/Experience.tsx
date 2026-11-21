import { experienceGroups, experienceLabels, experienceTitle } from "@/data/experience";
import { Timeline } from "@/components/rows/Timeline";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function Experience() {
  return (
    <section id="experience" className="px-[var(--edge-x)] py-24 md:py-32">
      <SectionLabel>{experienceTitle}</SectionLabel>
      <div className="mt-12 grid gap-x-20 gap-y-16 lg:grid-cols-2">
        {experienceGroups.map((group) => (
          <div key={group.id}>
            <ScrollReveal as="h3" className="mono-label mb-8 text-emphasis">
              {group.label}
            </ScrollReveal>
            <Timeline entries={group.entries} label={`${experienceLabels.timeline}: ${group.label}`} />
          </div>
        ))}
      </div>
    </section>
  );
}
