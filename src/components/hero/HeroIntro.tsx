"use client";

import { hero } from "@/data/hero";
import { Reveal } from "@/components/loader/Reveal";
import { LinkButton } from "@/components/ui/Button";
import { useScrollTo } from "@/hooks/useScrollTo";

/** Intro card: role, short paragraph and the two calls to action, on its own readable panel. */
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
      className="relative z-20 mx-5 mt-6 sm:mx-auto sm:w-full sm:max-w-md xl:absolute xl:bottom-20 xl:left-12 xl:mx-0 xl:mt-0 xl:w-[22rem]"
    >
      <div className="border border-line bg-background/80 p-5 text-center shadow-[0_8px_30px_var(--shadow-color)] backdrop-blur-md xl:text-left">
        <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase">{hero.greeting}</p>
        <h2 className="mt-2 text-2xl leading-tight font-semibold tracking-tight text-foreground">{hero.role}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{hero.tagline}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3 xl:justify-start">
          <LinkButton href={"#" + hero.workTargetId} onClick={onWork} variant="solid">
            {hero.workLabel}
          </LinkButton>
          <LinkButton href={hero.cvPath} download>
            {hero.cvLabel}
          </LinkButton>
        </div>
      </div>
    </Reveal>
  );
}
