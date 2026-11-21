import { hero } from "@/data/hero";
import { LinkButton } from "@/components/ui/Button";

export function Hero() {
  return (
    <section id="hero" className="flex min-h-screen items-center px-4">
      <div className="mx-auto w-full max-w-5xl">
        <p>{hero.greeting}</p>
        <h1 className="text-5xl font-bold">{hero.name}</h1>
        <p className="mt-2 text-xl">{hero.role}</p>
        <p className="mt-4 max-w-xl">{hero.tagline}</p>
        <LinkButton href={hero.cvPath} download className="mt-6">
          {hero.cvLabel}
        </LinkButton>
      </div>
    </section>
  );
}
