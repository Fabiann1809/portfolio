"use client";

import { hero } from "@/data/hero";
import { Reveal } from "@/components/loader/Reveal";
import { useScrollTo } from "@/hooks/useScrollTo";

/**
 * Left block (fojcik style): "// PORTFOLIO ©year" meta line, two-line role, short paragraph and
 * the two calls to action as retro bracket buttons. Below lg the block dissolves into the stage
 * column: role on top, buttons at the bottom (the paragraph is lg only).
 */
export function HeroIntro() {
  const scrollTo = useScrollTo();

  function onWork(event: React.MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    scrollTo(hero.workTargetId);
  }

  return (
    <div data-side="left" className="hero-side contents lg:block">
      <Reveal delay={420} className="order-1 px-[var(--edge-x)] pt-24 text-center lg:p-0 lg:text-left">
        <p className="hero-meta flex justify-center gap-[1.5em] lg:justify-start">
          <span>{hero.metaLabel}</span>
          <span>©{hero.copyrightYear}</span>
        </p>
        <h2 className="hero-role mt-3">
          {hero.roleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <p className="hero-copy mt-4 hidden max-w-[32ch] lg:block">{hero.tagline}</p>
      </Reveal>
      <Reveal delay={560} className="order-5 flex flex-wrap justify-center gap-3 px-[var(--edge-x)] pt-6 lg:mt-5 lg:justify-start lg:p-0">
        <a href={"#" + hero.workTargetId} onClick={onWork} data-primary="true" className="retro-btn">
          {hero.workLabel}
        </a>
        <a href={hero.cvPath} download className="retro-btn">
          {hero.cvLabel}
        </a>
      </Reveal>
    </div>
  );
}
