"use client";

import { art as artContent } from "@/data/art";
import { useLocalized } from "@/components/locale/LocaleProvider";
import { ArtCloud } from "@/components/art/ArtCloud";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionTitle } from "@/components/ui/SectionTitle";

/** "Mi lado artístico": intro text and a scroll-driven 3D cloud of artworks. */
export function Art() {
  const art = useLocalized(artContent);
  return (
    <section id={art.id} className="px-[var(--edge-x)] py-24 md:py-32">
      <SectionTitle trailing={String(art.artworks.length).padStart(2, "0")}>{art.title}</SectionTitle>
      <ScrollReveal as="p" className="mt-4 max-w-xl font-sans text-base text-muted md:text-lg">
        {art.text}
      </ScrollReveal>
      <ArtCloud />
    </section>
  );
}
