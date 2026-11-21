import { ScrollReveal } from "./ScrollReveal";
import { ScrambleText } from "./ScrambleText";

export function SectionTitle({ children }: { children: string }) {
  return (
    <ScrollReveal as="h2" className="phosphor mb-8 font-display text-4xl font-black tracking-[0.04em] uppercase md:text-5xl">
      <ScrambleText text={children} delay={120} />
    </ScrollReveal>
  );
}
