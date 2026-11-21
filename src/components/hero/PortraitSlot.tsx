"use client";

import Image from "next/image";
import { hero } from "@/data/hero";
import { useLoader } from "@/components/loader/LoaderProvider";

/**
 * The real portrait (transparent cut-out), shown as is: bottom-anchored on desktop with a soft
 * bottom fade and a very light CRT treatment (scanlines + tiny vignette, clipped to the figure).
 * The grid wall measures [data-portrait-slot] to subdivide around the figure.
 */
export function PortraitSlot() {
  const { loaded } = useLoader();
  const { portrait } = hero;

  return (
    <div className="portrait-area pointer-events-none relative z-10 order-2 flex justify-center">
      <div data-portrait-slot="true" data-in={loaded} className="portrait-slot">
        <Image
          src={portrait.src}
          alt={portrait.alt}
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 70vw"
          className="object-contain object-bottom"
        />
        <span
          aria-hidden="true"
          className="portrait-crt"
          style={{ maskImage: `url(${portrait.src})`, WebkitMaskImage: `url(${portrait.src})` }}
        />
      </div>
    </div>
  );
}
