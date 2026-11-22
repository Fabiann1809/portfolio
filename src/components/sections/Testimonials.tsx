"use client";

import { testimonials as items, testimonialsMarquee as marquee, testimonialsTitle as titleContent } from "@/data/testimonials";
import { useLocalized } from "@/components/locale/LocaleProvider";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TestimonialMarquee } from "@/components/testimonials/TestimonialMarquee";

export function Testimonials() {
  const testimonials = useLocalized(items);
  const testimonialsMarquee = useLocalized(marquee);
  const testimonialsTitle = useLocalized(titleContent);
  return (
    <section id="testimonials" className="py-24 md:py-32">
      <div className="px-[var(--edge-x)]">
        <SectionTitle trailing={String(testimonials.length).padStart(2, "0")}>{testimonialsTitle}</SectionTitle>
      </div>
      <ScrollReveal className="mt-10">
        <TestimonialMarquee items={testimonials} config={testimonialsMarquee} />
      </ScrollReveal>
    </section>
  );
}
