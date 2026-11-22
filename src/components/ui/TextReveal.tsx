"use client";

import { useEffect } from "react";

/** Text that fades in on its own; skips anything already animated (hero, ScrollReveal, pinned stages). */
const SELECTOR = "main section :is(h2, h3, p, li), footer :is(p, li)";
const SKIP =
  "#hero, [data-reveal], [data-text-reveal], .sticky, [aria-hidden='true'], dialog, [class*='transition-[opacity'], [class*='marquee']";

/**
 * Subtle entrance for text across the page: each heading / paragraph / list item rises a few pixels and
 * un-blurs once when it scrolls into view. Pure enhancement: nothing is hidden without JS or with reduced motion.
 */
export function TextReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const targets = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR)).filter(
      (el) => !el.closest(SKIP) && el.getBoundingClientRect().top > window.innerHeight,
    );
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.setAttribute("data-text-reveal", "in");
          io.unobserve(el);
          // drop the attribute once done so the element's own transitions (hover colors) apply again
          window.setTimeout(() => el.removeAttribute("data-text-reveal"), 900);
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    targets.forEach((el) => {
      el.setAttribute("data-text-reveal", "");
      io.observe(el);
    });
    return () => {
      io.disconnect();
      targets.forEach((el) => el.removeAttribute("data-text-reveal"));
    };
  }, []);
  return null;
}
