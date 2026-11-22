"use client";

import { experienceGroups as groups, experienceTitle as titleContent } from "@/data/experience";
import { useLocalized } from "@/components/locale/LocaleProvider";
import { ExperienceList } from "@/components/rows/ExperienceList";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function Experience() {
  const experienceGroups = useLocalized(groups);
  const experienceTitle = useLocalized(titleContent);
  return (
    <section id="experience" className="section-glow glow-left px-[var(--edge-x)] py-20 md:py-28">
      <SectionTitle>{experienceTitle}</SectionTitle>
      <div className="mt-10 grid gap-x-16 gap-y-12 lg:grid-cols-2">
        {experienceGroups.map((group) => (
          <ScrollReveal key={group.id}>
            <h3 className="mono-label mb-6 text-emphasis">{group.label}</h3>
            <ExperienceList entries={group.entries} label={group.label} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
