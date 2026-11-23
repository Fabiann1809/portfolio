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
    <section id="experience" className="relative isolate px-[var(--edge-x)] py-20 md:py-28">
      {/* Soft light behind each column (education left, freelance right), like the other sections' glow. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 45% 45% at 18% 45%, color-mix(in srgb, var(--color-primary) 12%, transparent), transparent 70%), radial-gradient(ellipse 45% 45% at 82% 55%, color-mix(in srgb, var(--color-primary) 12%, transparent), transparent 70%)",
        }}
      />
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
