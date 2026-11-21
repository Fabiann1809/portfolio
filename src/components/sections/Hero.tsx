import { hero } from "@/data/hero";
import { Reveal } from "@/components/loader/Reveal";
import { LinkButton } from "@/components/ui/Button";

export function Hero() {
  return (
    <section id="hero" className="flex min-h-[100svh] items-center px-4">
      <div className="mx-auto w-full max-w-5xl">
        <Reveal as="p">{hero.greeting}</Reveal>
        <Reveal as="h1" delay={120} className="text-5xl font-bold">{hero.name}</Reveal>
        <Reveal as="p" delay={240} className="mt-2 text-xl">{hero.role}</Reveal>
        <Reveal as="p" delay={360} className="mt-4 max-w-xl">{hero.tagline}</Reveal>
        <Reveal delay={480} className="mt-6">
          <LinkButton href={hero.cvPath} download>
            {hero.cvLabel}
          </LinkButton>
        </Reveal>
      </div>
    </section>
  );
}
