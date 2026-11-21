"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import { hero } from "@/data/hero";
import { hasWebGL } from "@/lib/webgl";

const noopSubscribe = () => () => {};

/**
 * Empty box the portrait mosaic is drawn into by the hero canvas (it measures [data-portrait-slot]).
 * Without WebGL it falls back to the plain photo, dimmed into the backdrop.
 */
export function PortraitSlot() {
  const webgl = useSyncExternalStore(noopSubscribe, hasWebGL, () => true);
  const { portrait } = hero;

  return (
    <div className="portrait-area pointer-events-none relative z-10 order-2 flex justify-center">
      <div data-portrait-slot="true" role="img" aria-label={portrait.alt} className="portrait-slot">
        {!webgl && (
          <Image
            src={portrait.src}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 40vw, 60vw"
            className="object-contain opacity-80"
            style={{ maskImage: "linear-gradient(to bottom, #000 70%, transparent 100%)" }}
          />
        )}
      </div>
    </div>
  );
}
