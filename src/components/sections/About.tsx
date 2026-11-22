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
    <section id="about" className="px-[var(--edge-x)] py-24 font-sans md:py-32">
      <div className="mx-auto max-w-2xl">
        <ScrollReveal as="h2" className="text-[clamp(32px,4vw,48px)] font-bold tracking-tight">
          {about.label}
        </ScrollReveal>
        <ScrollReveal stagger className="mt-6 flex flex-col gap-5 text-[17px] leading-relaxed text-muted">
          {[intro, ...about.paragraphs].map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </ScrollReveal>
      </div>
      <ScrollReveal className="mt-20">
        <StackMarquee title={about.stackTitle} />
      </ScrollReveal>
    </section>
  );
}
