import { ScrollReveal } from "./ScrollReveal";

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <ScrollReveal as="h2" className="mb-8 text-3xl font-bold">
      {children}
    </ScrollReveal>
  );
}
