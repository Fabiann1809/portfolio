"use client";

import { useEffect, useRef } from "react";
import { footer, socials } from "@/data/socials";
import { navigation } from "@/data/navigation";
import { contact as contactContent } from "@/data/contact";
import { heroShared } from "@/data/hero";
import { useLocalized } from "@/components/locale/LocaleProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Footer: tagline, quick links and contact, then the giant name. As the footer scrolls into view each
 * letter of the name rises out of the bottom edge, staggered left to right (static with reduced motion).
 */
export function Footer() {
  const copy = useLocalized(footer);
  const links = useLocalized(navigation);
  const contact = useLocalized(contactContent);
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const letters = Array.from(heroShared.displayName);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      // 0 when the footer top reaches the bottom of the screen, 1 when the page bottom is reached
      const range = Math.max(1, rect.height);
      const progress = clamp01((window.innerHeight - rect.top) / range);
      letterRefs.current.forEach((el, i) => {
        if (!el) return;
        const start = 0.3 + i * 0.05;
        const t = clamp01((progress - start) / 0.35);
        const eased = 1 - Math.pow(1 - t, 3);
        el.style.transform = `translate3d(0, ${((1 - eased) * 100).toFixed(2)}%, 0)`;
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <footer ref={rootRef} className="overflow-hidden border-t border-line px-[var(--edge-x)] pt-24 font-sans">
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

      <p
        aria-hidden="true"
        className="mt-6 flex justify-center overflow-hidden text-[clamp(80px,22vw,360px)] leading-[0.78] font-black tracking-[-0.05em] text-foreground/10 select-none"
      >
        {letters.map((letter, i) => (
          <span
            key={i}
            ref={(el) => {
              letterRefs.current[i] = el;
            }}
            className="inline-block will-change-transform"
          >
            {letter}
          </span>
        ))}
      </p>
    </footer>
  );
}
