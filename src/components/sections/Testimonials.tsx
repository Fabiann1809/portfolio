import { testimonials, testimonialsTitle } from "@/data/testimonials";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { TestimonialCard } from "@/components/ui/TestimonialCard";

export function Testimonials() {
  return (
    <section id="testimonials" className="flex min-h-screen items-center px-4 py-24">
      <div className="mx-auto w-full max-w-5xl">
        <SectionTitle>{testimonialsTitle}</SectionTitle>
        <ScrollReveal stagger className="grid gap-6 md:grid-cols-2">
          {testimonials.map((item) => (
            <TestimonialCard key={item.id} testimonial={item} />
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
