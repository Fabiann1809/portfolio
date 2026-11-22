"use client";

import { footer, socials } from "@/data/socials";
import { navigation } from "@/data/navigation";
import { contact as contactContent } from "@/data/contact";
import { heroShared } from "@/data/hero";
import { useLocalized } from "@/components/locale/LocaleProvider";
import { LiquidName } from "@/components/layout/LiquidName";

/**
 * Footer: tagline, quick links and contact, then the giant name as a WebGL liquid-metal headline.
 */
export function Footer() {
  const copy = useLocalized(footer);
  const links = useLocalized(navigation);
  const contact = useLocalized(contactContent);
  return (
    <footer className="overflow-hidden border-t border-line px-[var(--edge-x)] pt-24 font-sans">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.4fr_1fr_0.9fr] md:items-end">
        <p className="text-[clamp(32px,3.4vw,54px)] whitespace-nowrap leading-[1.02] font-bold tracking-tight">
          {copy.taglineLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
        <div>
          <p className="text-2xl font-medium">{copy.quickLinksTitle}</p>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {links.map((item) => (
              <li key={item.id}>
                <a
                  href={"#" + item.id}
                  className="block rounded-lg bg-foreground px-4 py-2 text-[15px] text-background transition-colors hover:bg-emphasis"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-2xl font-medium">{copy.contactTitle}</p>
          <a href={`mailto:${contact.email}`} className="mt-5 block text-lg break-all transition-colors hover:text-emphasis">
            {contact.email}
          </a>
          <ul className="mt-3 flex gap-5 text-muted">
            {socials.map((social) => (
              <li key={social.id}>
                <a className="transition-colors hover:text-emphasis" href={social.url} target="_blank" rel="noreferrer">
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mono-label mx-auto mt-16 max-w-6xl text-muted">{copy.text}</p>

      <LiquidName text={heroShared.displayName} />
    </footer>
  );
}
