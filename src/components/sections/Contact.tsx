"use client";

import { contact as contactContent } from "@/data/contact";
import { useLocalized } from "@/components/locale/LocaleProvider";
import { socials } from "@/data/socials";
import { ContactForm } from "@/components/contact/ContactForm";
import { SocialIcon } from "@/components/contact/SocialIcon";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

/** Contact: compact headline with email and social pills on the left, the form on the right. */
export function Contact() {
  const contact = useLocalized(contactContent);
  const hasEmail = contact.email.includes("@");
  return (
    <section id="contact" className="px-[var(--edge-x)] py-24 font-sans md:py-32">
      <div className="mx-auto grid max-w-6xl gap-14 md:grid-cols-2 md:gap-20">
        <ScrollReveal className="flex flex-col gap-8">
          <div>
            <p className="mono-label text-emphasis">{contact.label}</p>
            <h2 className="mt-3 text-[clamp(48px,7vw,104px)] leading-[0.95] font-bold tracking-tight">
              {contact.headlineLines.join(" ")}
              <span className="text-emphasis">.</span>
            </h2>
            <p className="mt-5 max-w-md text-muted">{contact.intro}</p>
          </div>
          {hasEmail ? (
            <a
              href={`mailto:${contact.email}`}
              className="self-start text-xl break-all underline decoration-emphasis underline-offset-8 transition-colors hover:text-emphasis md:text-2xl"
            >
              {contact.email}
            </a>
          ) : (
            <p className="text-xl break-all md:text-2xl">{contact.email}</p>
          )}
          <ul className="flex flex-wrap gap-3">
            {socials.map((social) => (
              <li key={social.id}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 rounded-full border border-line px-5 py-2.5 transition-colors hover:border-emphasis hover:text-emphasis"
                >
                  <SocialIcon id={social.id} />
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mono-label flex items-center gap-3 text-muted">
            <span aria-hidden="true" className="status-dot" />
            {contact.location}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <ContactForm />
        </ScrollReveal>
      </div>
    </section>
  );
}
