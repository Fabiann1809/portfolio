import { extra } from "@/data/extra";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function Extra() {
  return (
    <section id="extra" className="flex items-center journey:min-h-screen px-4 py-24">
      <div className="mx-auto w-full max-w-5xl">
        <SectionTitle>{extra.title}</SectionTitle>
        <ScrollReveal as="ul" stagger className="list-disc pl-5">
          {extra.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
