"use client";

import { hero } from "@/data/hero";
import { Reveal } from "@/components/loader/Reveal";
import { LinkButton } from "@/components/ui/Button";
import { useScrollTo } from "@/hooks/useScrollTo";

const SHADOW = { textShadow: "0 1px 14px var(--background), 0 0 3px var(--background)" };

/** Intro (no card): role as a big heading, short paragraph and the two calls to action, top-left under the navbar. */
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
      className="relative z-20 mx-5 pt-24 text-center sm:mx-auto sm:max-w-md xl:absolute xl:bottom-[8vh] xl:left-[3.5vw] xl:mx-0 xl:max-w-none xl:pt-0 xl:text-left"
    >
      <h2
        className="text-[clamp(1.6rem,2.3vw,2.4rem)] leading-[1.02] font-bold tracking-tight text-foreground max-xl:text-[clamp(1.75rem,7vw,2.5rem)]"
        style={SHADOW}
      >
        {hero.roleLines[0]}
        <br />
        {hero.roleLines[1]}
      </h2>
      <p className="mx-auto mt-4 max-w-[34ch] text-sm leading-relaxed text-muted xl:mx-0" style={SHADOW}>
        {hero.tagline}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3 xl:justify-start">
        <LinkButton
          href={"#" + hero.workTargetId}
          onClick={onWork}
          variant="solid"
          className="gap-3 py-1.5 pr-1.5 pl-4"
        >
          {hero.workLabel} <span aria-hidden="true">↗</span>
          <span aria-hidden="true" className="ml-1 size-6 bg-emphasis" />
        </LinkButton>
        <LinkButton href={hero.cvPath} download className="gap-2">
          {hero.cvLabel} <span aria-hidden="true">↗</span>
        </LinkButton>
      </div>
    </Reveal>
  );
}
