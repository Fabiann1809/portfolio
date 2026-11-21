"use client";

import { useState } from "react";
import Image from "next/image";
import { hero } from "@/data/hero";
import { Reveal } from "@/components/loader/Reveal";
import { PortraitPlaceholder } from "./PortraitPlaceholder";

/** Cut-out portrait standing on the backdrop; its cast shadow follows the studio light. */
export function Portrait() {
  const { portrait } = hero;
  const [failed, setFailed] = useState(false);

  return (
    <Reveal
      rise="lg"
      delay={260}
      className="pointer-events-none relative z-10 mx-auto -mt-[6vw] h-[56svh] w-full max-w-md md:absolute md:inset-x-0 md:bottom-0 md:mt-0 md:h-[80svh] md:max-w-none"
    >
      <div
        className="relative mx-auto aspect-[1145/1374] h-full max-w-full"
        style={{
          filter: "drop-shadow(var(--p-sx, 0px) var(--p-sy, 12px) var(--p-blur, 24px) var(--shadow-color))",
          // Bust crop: fade the cut chest into the backdrop.
          maskImage: "linear-gradient(to bottom, #000 78%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 78%, transparent 100%)",
        }}
      >
        {portrait.src && !failed ? (
          <Image
            src={portrait.src}
            alt={portrait.alt}
            fill
            priority
            sizes="(min-width: 768px) 70vh, 70vw"
            className="object-contain object-bottom"
            onError={() => setFailed(true)}
          />
        ) : (
          <PortraitPlaceholder />
        )}
      </div>
    </Reveal>
  );
}
