import { testimonials, testimonialsTitle } from "@/data/testimonials";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { TestimonialCard } from "@/components/ui/TestimonialCard";

export function Testimonials() {
  return (
    <section id="testimonials" className="px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <SectionTitle>{testimonialsTitle}</SectionTitle>
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((item) => (
            <TestimonialCard key={item.id} testimonial={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
