import { contact } from "@/data/contact";
import { socials } from "@/data/socials";
import { ContactForm } from "@/components/contact/ContactForm";
import { SignalHeadline } from "@/components/contact/SignalHeadline";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

/** "Send the signal": giant headline, availability, socials and the contact form. */
export function Contact() {
  return (
    <section id="contact" className="px-[var(--edge-x)] pt-24 pb-20 md:pt-32">
      <SectionLabel>{contact.label}</SectionLabel>
      <div className="mt-10">
        <SignalHeadline lines={contact.headlineLines} />
      </div>

      <div className="mt-16 grid gap-14 border-t border-line pt-12 md:grid-cols-2 md:gap-20">
        <ScrollReveal className="flex flex-col gap-8">
          <p className="mono-label flex items-center gap-3">
            <span aria-hidden="true" className="status-dot" />
            {contact.availability}
          </p>
          <p className="max-w-md text-muted">{contact.intro}</p>
          <div>
            <p className="mono-label text-muted">{contact.emailLabel}</p>
            {contact.email.includes("@") ? (
              <a
                href={`mailto:${contact.email}`}
                className="mt-2 inline-block font-condensed text-[clamp(26px,3vw,44px)] font-bold break-all underline-offset-8 hover:text-emphasis hover:underline"
              >
                {contact.email}
              </a>
            ) : (
              <p className="mt-2 font-condensed text-[clamp(26px,3vw,44px)] font-bold break-all">{contact.email}</p>
            )}
          </div>
          <div>
            <p className="mono-label text-muted">{contact.locationLabel}</p>
            <p className="mt-2">{contact.location}</p>
          </div>
          <div>
            <p className="mono-label text-muted">{contact.socialsLabel}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {socials.map((social) => (
                <li key={social.id}>
                  <a className="bracket-link inline-block" href={social.url} target="_blank" rel="noreferrer">
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <ContactForm />
        </ScrollReveal>
      </div>
    </section>
  );
}
