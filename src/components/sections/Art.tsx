"use client";

import { art as artContent } from "@/data/art";
import { useLocalized } from "@/components/locale/LocaleProvider";
import { ArtWheel } from "@/components/art/ArtWheel";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

/** "Mi lado artístico": intro text and a Rondo-style snap wheel of artworks (image or generated gradient). */
export function Art() {
  const art = useLocalized(artContent);
  return (
    <section id={art.id} className="px-[var(--edge-x)] py-24 md:py-32">
      <SectionLabel trailing={String(art.artworks.length).padStart(2, "0")}>{art.title}</SectionLabel>
      <ScrollReveal as="p" className="mt-8 max-w-2xl font-condensed text-[clamp(24px,3vw,44px)] leading-[1.1] font-bold">
        {art.text}
      </ScrollReveal>
      <ArtWheel />
    </section>
  );
}
