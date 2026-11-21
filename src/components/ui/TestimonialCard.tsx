import type { Testimonial } from "@/types";
import { Card } from "./Card";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card>
      <blockquote className="mb-3">{testimonial.quote}</blockquote>
      <p className="font-medium">{testimonial.name}</p>
      <p className="text-sm opacity-70">{testimonial.role}</p>
    </Card>
  );
}
