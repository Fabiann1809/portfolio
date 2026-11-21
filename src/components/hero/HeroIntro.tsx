"use client";

import { hero } from "@/data/hero";
import { Reveal } from "@/components/loader/Reveal";
import { LinkButton } from "@/components/ui/Button";
import { useScrollTo } from "@/hooks/useScrollTo";

/** Top-left block: greeting, two-line role, short paragraph and the two calls to action. */
export function HeroIntro() {
  const scrollTo = useScrollTo();

  function onWork(event: React.MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    scrollTo(hero.workTargetId);
  }

  return (
    <Reveal
      delay={420}
      className="relative z-30 order-1 px-[var(--edge-x)] pt-24 md:absolute hero-top md:left-0 md:max-w-[34rem] md:pt-0"
    >
      <p className="label text-sm text-muted">{hero.greeting}</p>
      <h2 className="phosphor mt-2 font-display text-[clamp(1.35rem,2.1vw,2rem)] leading-[1.1] font-extrabold tracking-[0.04em] uppercase">
        {hero.roleLines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h2>
      <p className="mt-3 max-w-[32ch] text-sm leading-relaxed text-muted">{hero.tagline}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <LinkButton href={"#" + hero.workTargetId} onClick={onWork} variant="solid">
          {hero.workLabel}
        </LinkButton>
        <LinkButton href={hero.cvPath} download>
          {hero.cvLabel}
        </LinkButton>
      </div>
    </Reveal>
  );
}
