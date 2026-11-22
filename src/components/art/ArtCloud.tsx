"use client";

import { useState } from "react";
import { art as artContent } from "@/data/art";
import { useLocalized } from "@/components/locale/LocaleProvider";
import { ArtCloudScene } from "@/components/art/ArtCloudScene";
import { ArtGrid } from "@/components/art/ArtGrid";
import { ArtLightbox } from "@/components/art/ArtLightbox";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Scroll-driven 3D image cloud (static grid with reduced motion) plus the enlarged-artwork dialog. */
export function ArtCloud() {
  const art = useLocalized(artContent);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const openWork = (index: number) => {
    setActive(index);
    setOpen(true);
  };

  return (
    <>
      {reduced ? <ArtGrid art={art} onOpen={openWork} /> : <ArtCloudScene art={art} onOpen={openWork} />}
      <ArtLightbox
        work={art.artworks[active] ?? art.artworks[0]}
        open={open}
        onClose={() => setOpen(false)}
        closeLabel={art.close}
        techniqueLabel={art.techniqueLabel}
        yearLabel={art.yearLabel}
      />
    </>
  );
}
