import { extra } from "@/data/extra";
import { AbilityWheel } from "@/components/extra/AbilityWheel";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

/** Skills profile: Rondo-style snap wheel of abilities. Not part of the navbar. */
export function Extra() {
  return (
    <section id="extra" className="overflow-hidden px-[var(--edge-x)] py-24 md:py-32">
      <SectionLabel trailing={String(extra.abilities.length).padStart(2, "0")}>{extra.label}</SectionLabel>
      <ScrollReveal>
        <AbilityWheel />
      </ScrollReveal>
    </section>
  );
}
