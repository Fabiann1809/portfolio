"use client";

import { useState } from "react";
import Image from "next/image";
import { hero } from "@/data/hero";
import { Reveal } from "@/components/loader/Reveal";
import { PortraitPlaceholder } from "./PortraitPlaceholder";

/**
 * Cut-out portrait standing on the backdrop, above the giant name. Three layers share the
 * cut-out: a blurred cast shadow (masked silhouette), the photo, and a key-light highlight
 * (soft-light gradient masked by the photo) that follows the studio light.
 */
export function Portrait() {
  const { portrait, portraitShadow, studio } = hero;
  const [failed, setFailed] = useState(false);
  const photo = portrait.src && !failed ? portrait.src : null;
  const { radius, strength } = studio.keyLight;

  return (
    <Reveal
      rise="lg"
      delay={260}
      className="pointer-events-none relative z-20 order-3 mx-auto -mt-[9vw] h-[56svh] w-full max-w-md md:absolute md:inset-x-0 md:bottom-0 md:mt-0 md:h-[90%] md:max-w-none"
    >
      <div
        data-portrait-box
        className="relative mx-auto aspect-[1145/1374] h-full max-w-full"
        style={
          {
            translate: "var(--person-x, 0px) var(--person-y, 0px)",
            "--portrait-url": photo ? `url("${photo}")` : "none",
          } as React.CSSProperties
        }
      >
        {photo && (
          // Cast shadow on the backdrop: the cut-out as a blurred black silhouette (CSS mask), offset
          // away from the light. The box is oversized (-10% top, -15% sides) so the blur is not
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
              <div
                className="absolute inset-0"
                style={{
                  filter: "blur(var(--shadow-blur, 10px))",
                  opacity: "var(--portrait-shadow-opacity, 0.2)",
                  transformOrigin: "bottom center",
                  transform: `translate(var(--shadow-x, -34px), var(--shadow-y, -14px)) scale(${portraitShadow.scale}) skewX(var(--shadow-skew, 2deg))`,
                }}
              >
                <div className="portrait-mask absolute inset-0 bg-black" />
              </div>
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
          {photo ? (
            <>
              <Image
                src={photo}
                alt={portrait.alt}
                fill
                priority
                sizes="(min-width: 768px) 70vh, 70vw"
                className="object-contain object-bottom"
                style={{ filter: "brightness(0.92) contrast(1.04)" }}
                onError={() => setFailed(true)}
              />
              <div
                aria-hidden="true"
                className="portrait-mask absolute inset-0 mix-blend-soft-light"
                style={{
                  opacity: strength,
                  background: `radial-gradient(circle at var(--key-x, 35%) var(--key-y, 25%), var(--key-light) 0%, color-mix(in srgb, var(--key-light) 45%, transparent) ${radius * 0.45}%, transparent ${radius}%)`,
                }}
              />
            </>
          ) : (
            <PortraitPlaceholder />
          )}
        </div>
      </div>
    </Reveal>
  );
}
