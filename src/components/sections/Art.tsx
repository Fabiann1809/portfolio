import { art } from "@/data/art";
import { placeholderGradient } from "@/lib/gradient";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

/** "Mi lado artístico": intro text and a gallery grid of artworks (image or generated gradient). */
export function Art() {
  return (
    <section id={art.id} className="px-[var(--edge-x)] py-24 md:py-32">
      <SectionLabel trailing={String(art.artworks.length).padStart(2, "0")}>{art.title}</SectionLabel>
      <ScrollReveal as="p" className="mt-8 max-w-2xl font-condensed text-[clamp(24px,3vw,44px)] leading-[1.1] font-bold">
        {art.text}
      </ScrollReveal>
      <ScrollReveal as="ul" stagger className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {art.artworks.map((work) => (
          <li key={work.id}>
            <figure>
              <div className="aspect-[4/5] overflow-hidden border border-line">
                {work.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={work.image} alt={work.title} loading="lazy" className="size-full object-cover" />
                ) : (
                  <div aria-hidden="true" className="size-full" style={{ backgroundImage: placeholderGradient(work.id) }} />
                )}
              </div>
              <figcaption className="mt-4 flex flex-col gap-1">
                <span className="giant-title text-[clamp(20px,2vw,28px)]">{work.title}</span>
                <span className="mono-label text-muted">
                  {work.technique} / {work.year}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ScrollReveal>
    </section>
  );
}
