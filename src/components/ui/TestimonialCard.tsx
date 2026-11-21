import type { Testimonial } from "@/types";
import { TestimonialAvatar } from "@/components/testimonials/TestimonialAvatar";

interface TestimonialCardProps {
  testimonial: Testimonial;
  /** Makes the card keyboard-focusable (used to pause the marquee). */
  focusable?: boolean;
}

const SCANLINES =
  "repeating-linear-gradient(to bottom, color-mix(in srgb, var(--foreground) 5%, transparent) 0 1px, transparent 1px 3px)";

export function TestimonialCard({ testimonial, focusable = false }: TestimonialCardProps) {
  const { name, role, company, quote, avatar } = testimonial;
  return (
    <figure
      tabIndex={focusable ? 0 : undefined}
      className="relative flex min-h-72 w-[min(86vw,440px)] shrink-0 flex-col overflow-hidden border border-line bg-surface p-7 text-foreground outline-none focus-visible:ring-1 focus-visible:ring-foreground"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundImage: SCANLINES }} />
      <div className="relative flex items-center gap-4">
        <TestimonialAvatar name={name} src={avatar} />
        <figcaption className="min-w-0">
          <p className="truncate font-display text-2xl font-black leading-tight">{name}</p>
          <p className="truncate font-display text-xs tracking-[0.1em] text-muted uppercase">
            {role} · {company}
          </p>
        </figcaption>
      </div>
      <hr className="relative my-6 border-0 border-t border-line" />
      <blockquote className="relative font-mono text-sm leading-relaxed">&ldquo;{quote}&rdquo;</blockquote>
    </figure>
  );
}
