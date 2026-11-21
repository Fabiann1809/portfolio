import { ScrollReveal } from "./ScrollReveal";
import { ScrambleText } from "./ScrambleText";

export function SectionTitle({ children }: { children: string }) {
  return (
    <ScrollReveal as="h2" className="mb-8 text-3xl font-bold">
      <ScrambleText text={children} delay={120} />
    </ScrollReveal>
  );
}
