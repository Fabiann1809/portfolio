import { testimonials, testimonialsMarquee, testimonialsTitle } from "@/data/testimonials";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TestimonialMarquee } from "@/components/testimonials/TestimonialMarquee";

export function Testimonials() {
  return (
    <section id="testimonials" className="flex items-center journey:min-h-screen py-24">
      <div className="w-full">
        <div className="mx-auto max-w-5xl px-4">
          <SectionTitle>{testimonialsTitle}</SectionTitle>
        </div>
        <ScrollReveal>
          <TestimonialMarquee items={testimonials} config={testimonialsMarquee} />
        </ScrollReveal>
      </div>
    </section>
  );
}
