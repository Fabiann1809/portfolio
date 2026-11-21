"use client";

import { hero } from "@/data/hero";
import { Reveal } from "@/components/loader/Reveal";
import { useNow } from "@/hooks/useNow";

/** Mono status lines (top right): availability + date, city + live local time, years of experience. */
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
      className="relative z-20 px-5 pt-6 text-center font-mono text-[11px] leading-relaxed tracking-wide text-muted uppercase md:absolute md:top-24 md:right-8 md:p-0 md:text-right lg:right-12"
    >
      <p className="flex items-center justify-center gap-2 md:justify-end">
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
