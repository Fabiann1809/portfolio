"use client";

import { about as aboutContent } from "@/data/about";
import { useLocalized } from "@/components/locale/LocaleProvider";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { StackMarquee } from "@/components/about/StackMarquee";

/** "About me": plain heading and paragraphs, then the technologies strip. */
export function About() {
  const about = useLocalized(aboutContent);
  const intro = about.statement.map((part) => part.text).join("");

  return (
    <section id="about" className="section-glow glow-right px-[var(--edge-x)] py-24 font-sans md:py-32">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal as="h2" className="text-[clamp(32px,4vw,48px)] font-bold tracking-tight">
          {about.label}
        </ScrollReveal>
        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-14">
          <ScrollReveal stagger className="flex flex-col gap-5 text-[17px] leading-relaxed text-muted">
            {[intro, ...about.paragraphs].map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </ScrollReveal>
          {/* Quick facts the text doesn't mention. */}
          <ScrollReveal as="ul" stagger className="grid grid-cols-2 gap-3 self-start">
            {about.facts.map((fact) => (
              <li key={fact.label} className="rounded-2xl border border-line bg-surface/40 p-4 md:p-5">
                <p className="mono-label text-[10px] text-muted">{fact.label}</p>
                <p className="mt-2 text-[15px] leading-snug font-semibold text-foreground md:text-base">{fact.value}</p>
              </li>
            ))}
          </ScrollReveal>
        </div>
      </div>
      <ScrollReveal className="mt-20">
        <StackMarquee title={about.stackTitle} />
      </ScrollReveal>
    </section>
  );
}
