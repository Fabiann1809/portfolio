"use client";

import { hero } from "@/data/hero";
import { Reveal } from "@/components/loader/Reveal";
import { useNow } from "@/hooks/useNow";

/** Mono status lines (top right): availability + date, city + live local time, study stage. */
export function HeroStatus() {
  const { status } = hero;
  const now = useNow();

  const date = now
    ? new Intl.DateTimeFormat(status.locale, { month: "short", year: "numeric" }).format(now)
    : "";
  const time = now
    ? new Intl.DateTimeFormat(status.locale, { hour: "2-digit", minute: "2-digit", timeZone: status.timeZone }).format(now)
    : "";

  return (
    <Reveal
      delay={560}
      className="relative z-20 px-5 pt-6 text-center font-mono text-xs leading-relaxed tracking-wide text-muted uppercase xl:absolute xl:top-[14vh] xl:right-12 xl:p-0 xl:pr-3 xl:text-right xl:text-[13px]"
    >
      <p className="flex items-center justify-center gap-2 font-semibold text-foreground xl:justify-end">
        <span aria-hidden="true" className="size-2 rounded-full bg-emphasis" />
        {status.availability}
        {date && <span> · {date}</span>}
      </p>
      <p>
        {status.city}
        {time && <span> · {time}</span>}
      </p>
      <p>{status.stage}</p>
    </Reveal>
  );
}
