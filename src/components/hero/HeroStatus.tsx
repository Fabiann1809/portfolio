"use client";

import { hero } from "@/data/hero";
import { Reveal } from "@/components/loader/Reveal";
import { useNow } from "@/hooks/useNow";

/** Dot-matrix status lines (top right): availability + date, city + live local time, years of experience. */
export function HeroStatus() {
  const { status } = hero;
  const now = useNow();

  const date = now
    ? new Intl.DateTimeFormat(status.locale, { month: "short", year: "numeric" }).format(now)
    : "";
  const time = now
    ? new Intl.DateTimeFormat(status.locale, { hour: "2-digit", minute: "2-digit", timeZone: status.timeZone }).format(now)
    : "";
  const years = now ? now.getFullYear() - status.experienceSince : 0;

  return (
    <Reveal
      delay={560}
      className="label hidden z-30 text-xs leading-relaxed text-muted md:absolute hero-top md:right-[var(--edge-x)] md:block md:text-right"
    >
      <p className="flex items-center gap-2 md:justify-end">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-emphasis" />
        {status.availability}
        {date && <span> · {date}</span>}
      </p>
      <p>
        {status.city}
        {time && <span> · {time}</span>}
      </p>
      <p>{years > 0 ? status.yearsLabel.replace("{years}", String(years)) : " "}</p>
    </Reveal>
  );
}
