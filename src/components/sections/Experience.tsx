import { experience, experienceTitle } from "@/data/experience";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";

export function Experience() {
  return (
    <section id="experience" className="flex min-h-screen items-center px-4 py-24">
      <div className="mx-auto w-full max-w-5xl">
        <SectionTitle>{experienceTitle}</SectionTitle>
        <ScrollReveal stagger className="flex flex-col gap-4">
          {experience.map((entry) => (
            <Card key={entry.id}>
              <h3 className="font-semibold">
                {entry.role} - {entry.company}
              </h3>
              <p className="text-sm opacity-70">
                {entry.period} ({entry.type})
              </p>
              <p className="mt-2">{entry.description}</p>
            </Card>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
