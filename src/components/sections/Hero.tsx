import { hero } from "@/data/hero";
import { IntroReveal } from "@/components/intro/IntroReveal";
import { LinkButton } from "@/components/ui/Button";

export function Hero() {
  return (
    <section id="hero" className="flex min-h-screen items-center px-4">
      <div className="mx-auto w-full max-w-5xl">
        <IntroReveal as="p">{hero.greeting}</IntroReveal>
        <IntroReveal as="h1" delay={120} className="text-5xl font-bold">{hero.name}</IntroReveal>
        <IntroReveal as="p" delay={240} className="mt-2 text-xl">{hero.role}</IntroReveal>
        <IntroReveal as="p" delay={360} className="mt-4 max-w-xl">{hero.tagline}</IntroReveal>
        <IntroReveal delay={480} className="mt-6">
          <LinkButton href={hero.cvPath} download>
            {hero.cvLabel}
          </LinkButton>
        </IntroReveal>
      </div>
    </section>
  );
}
