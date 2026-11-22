"use client";

import { footer, socials } from "@/data/socials";
import { useLocalized } from "@/components/locale/LocaleProvider";

export function Footer() {
  const copy = useLocalized(footer);
  return (
    <footer className="border-t border-line px-[var(--edge-x)] py-8">
      <div className="mono-label flex flex-col items-start justify-between gap-4 text-muted sm:flex-row sm:items-center">
        <p>{copy.text}</p>
        <ul className="flex gap-5">
          {socials.map((social) => (
            <li key={social.id}>
              <a className="transition-colors hover:text-emphasis" href={social.url} target="_blank" rel="noreferrer">
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
