"use client";

import { hero } from "@/data/hero";
import { Reveal } from "@/components/loader/Reveal";
import { LinkButton } from "@/components/ui/Button";
import { useScrollTo } from "@/hooks/useScrollTo";

/** Left block: role, short paragraph and the two calls to action. */
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
      className="relative z-20 px-5 pt-6 text-center md:absolute md:bottom-24 md:left-8 md:max-w-sm md:p-0 md:text-left lg:left-12"
    >
      <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase">{hero.greeting}</p>
      <h2 className="mt-2 text-2xl leading-tight font-semibold tracking-tight">{hero.role}</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted">{hero.tagline}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-3 md:justify-start">
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
