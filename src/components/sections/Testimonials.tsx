import { testimonials, testimonialsMarquee, testimonialsTitle } from "@/data/testimonials";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TestimonialMarquee } from "@/components/testimonials/TestimonialMarquee";

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 md:py-32">
      <div className="px-[var(--edge-x)]">
        <SectionLabel trailing={String(testimonials.length).padStart(2, "0")}>{testimonialsTitle}</SectionLabel>
      </div>
      <ScrollReveal className="mt-10">
        <TestimonialMarquee items={testimonials} config={testimonialsMarquee} />
      </ScrollReveal>
    </section>
  );
}
