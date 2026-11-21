import { about } from "@/data/about";
import { stack } from "@/data/stack";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function About() {
  return (
    <section id="about" className="flex min-h-screen items-center px-4 py-24">
      <div className="mx-auto w-full max-w-5xl">
        <SectionTitle>{about.title}</SectionTitle>
        <ScrollReveal stagger>
          {about.paragraphs.map((text) => (
            <p key={text} className="mb-4 max-w-2xl">{text}</p>
          ))}
        </ScrollReveal>
        <ScrollReveal as="h3" className="mt-8 mb-4 text-xl font-semibold">{about.stackTitle}</ScrollReveal>
        <ScrollReveal as="ul" stagger className="flex flex-wrap gap-4">
          {stack.map((item) => (
            <li key={item.name} className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.icon} alt="" width={24} height={24} />
              <span>{item.name}</span>
            </li>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
