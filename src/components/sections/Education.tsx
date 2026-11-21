import { education, educationTitle } from "@/data/education";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";

export function Education() {
  return (
    <section id="education" className="px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <SectionTitle>{educationTitle}</SectionTitle>
        <ScrollReveal stagger className="flex flex-col gap-4">
          {education.map((entry) => (
            <Card key={entry.id}>
              <h3 className="font-semibold">{entry.title}</h3>
              <p className="text-sm opacity-70">
                {entry.institution} | {entry.period}
              </p>
              {entry.description && <p className="mt-2">{entry.description}</p>}
            </Card>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
