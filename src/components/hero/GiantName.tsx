"use client";

import { hero } from "@/data/hero";
import { useLoader } from "@/components/loader/LoaderProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Giant dot-matrix name behind the portrait. Each letter sits in an overflow mask and slides up
 * when the loader finishes; its --t (light proximity, written by useStudioLight) drives color
 * and lift. The accessible name is a single sr-only text.
 */
export function GiantName() {
  const { loaded } = useLoader();
  const reduced = useReducedMotion();
  const letters = Array.from(hero.displayName);

  return (
    <h1 className="hero-name phosphor order-2">
      <span className="sr-only">{hero.displayName}</span>
      <span aria-hidden="true">
        {letters.map((letter, index) => (
          <span key={index} data-letter-box className="name-mask">
            <span
              data-letter
              data-in={loaded}
              data-reduced={reduced}
              className="name-letter"
              style={{ "--i": index } as React.CSSProperties}
            >
              {letter}
            </span>
          </span>
        ))}
      </span>
    </h1>
  );
}
