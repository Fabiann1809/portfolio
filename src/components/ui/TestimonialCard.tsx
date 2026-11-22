import type { Testimonial } from "@/types";
import { TestimonialAvatar } from "@/components/testimonials/TestimonialAvatar";

interface TestimonialCardProps {
  testimonial: Testimonial;
  /** Makes the card keyboard-focusable (used to pause the marquee). */
  focusable?: boolean;
}

export function TestimonialCard({ testimonial, focusable = false }: TestimonialCardProps) {
  const { name, role, company, quote, avatar } = testimonial;
  return (
    <figure
      tabIndex={focusable ? 0 : undefined}
      className="relative flex min-h-72 w-[min(86vw,440px)] shrink-0 flex-col rounded-3xl border border-line p-7 text-foreground outline-none transition-colors hover:border-emphasis focus-visible:border-emphasis"
    >
      <span aria-hidden="true" className="absolute top-0 left-0 h-px w-12 bg-emphasis" />
      <blockquote className="font-condensed text-2xl leading-tight font-bold">&ldquo;{quote}&rdquo;</blockquote>
      <figcaption className="mt-auto flex items-center gap-4 pt-8">
        <TestimonialAvatar name={name} src={avatar} />
        <span className="mono-label min-w-0">
          <span className="block truncate">{name}</span>
          <span className="block truncate text-muted">
            {company ? `${role} / ${company}` : role}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
