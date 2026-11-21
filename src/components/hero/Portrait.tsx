"use client";

import { useState } from "react";
import Image from "next/image";
import { hero } from "@/data/hero";
import { Reveal } from "@/components/loader/Reveal";
import { PortraitPlaceholder } from "./PortraitPlaceholder";

/** Cut-out portrait standing on the backdrop; its cast shadow follows the studio light. */
export function Portrait() {
  const { portrait, portraitShadow } = hero;
  const [failed, setFailed] = useState(false);

  return (
    <Reveal
      rise="lg"
      delay={260}
      className="pointer-events-none relative z-10 mx-auto -mt-[6vw] h-[56svh] w-full max-w-md xl:absolute xl:inset-x-0 xl:bottom-0 xl:mt-0 xl:h-[74svh] xl:max-w-none"
    >
      <div className="relative mx-auto aspect-[1145/1374] h-full max-w-full">
        {portrait.src && !failed && (
          // Cast shadow on the backdrop: the same cut-out as a blurred silhouette, offset away from
          // the light. The box is oversized (-10% top, -15% sides) so the mask and the blur are not
          // clipped; the fade 80%..100% of it matches the portrait's own 78%..100%.
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-[15%] -top-[10%] bottom-0"
            style={{
              mixBlendMode: "var(--portrait-shadow-blend, normal)" as React.CSSProperties["mixBlendMode"],
              maskImage: "linear-gradient(to bottom, #000 80%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, #000 80%, transparent 100%)",
            }}
          >
            <div className="absolute inset-x-[11.54%] bottom-0 top-[9.09%]">
              <Image
                src={portrait.src}
                alt=""
                fill
                priority
                tabIndex={-1}
                sizes="(min-width: 768px) 70vh, 70vw"
                className="object-contain object-bottom"
                style={{
                  filter: "brightness(0) blur(var(--shadow-blur, 10px))",
                  opacity: "var(--portrait-shadow-opacity, 0.2)",
                  transformOrigin: "bottom center",
                  transform: `translate(var(--shadow-x, -34px), var(--shadow-y, -14px)) scale(${portraitShadow.scale}) skewX(var(--shadow-skew, 2deg))`,
                }}
              />
            </div>
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{
            // Contact shadow only: the cast shadow above carries the light direction.
            filter: "drop-shadow(0 6px 14px var(--shadow-color))",
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
      </div>
    </Reveal>
  );
}
