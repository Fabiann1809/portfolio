import { experience, experienceTitle } from "@/data/experience";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";

export function Experience() {
  return (
    <section id="experience" className="px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <SectionTitle>{experienceTitle}</SectionTitle>
        <div className="flex flex-col gap-4">
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
        </div>
      </div>
    </section>
  );
}
