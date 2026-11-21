"use client";

import { hero } from "@/data/hero";
import { useNow } from "@/hooks/useNow";

/** Dot-matrix status lines (lg+, under the description): availability + date, city + live local time, years. */
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
    <div className="label mt-4 hidden text-[0.9em] leading-relaxed text-muted lg:block lg:text-right">
      <p className="flex items-center gap-2 lg:justify-end">
        <span aria-hidden="true" className="status-dot" />
        {status.availability}
        {date && <span> · {date}</span>}
      </p>
      <p>
        {status.city}
        {time && <span> · {time}</span>}
      </p>
      <p>{years > 0 ? status.yearsLabel.replace("{years}", String(years)) : " "}</p>
    </div>
  );
}
