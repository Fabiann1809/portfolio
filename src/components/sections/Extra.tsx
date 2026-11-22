"use client";

import { useState } from "react";
import { extra as extraContent } from "@/data/extra";
import { useLocalized } from "@/components/locale/LocaleProvider";
import { PowerScan } from "@/components/extra/PowerScan";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

/** "Power profile": abilities list (hover / focus / click activates) next to a scan panel. */
export function Extra() {
  const extra = useLocalized(extraContent);
  const codeOf = (i: number) => `${extra.codePrefix}-${String(i + 1).padStart(2, "0")}`;
  const [activeId, setActiveId] = useState(extra.abilities[0].id);
  const activeIndex = Math.max(0, extra.abilities.findIndex((ability) => ability.id === activeId));
  const active = extra.abilities[activeIndex];

  return (
    <section id="extra" className="px-[var(--edge-x)] py-24 md:py-32">
      <SectionLabel trailing={String(extra.abilities.length).padStart(2, "0")}>{extra.label}</SectionLabel>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
        <ScrollReveal as="ul" className="flex flex-col">
          {extra.abilities.map((ability, i) => {
            const on = ability.id === activeId;
            return (
              <li key={ability.id} className="border-t border-line last:border-b">
                <button
                  type="button"
                  aria-pressed={on}
                  onMouseEnter={() => setActiveId(ability.id)}
                  onFocus={() => setActiveId(ability.id)}
                  onClick={() => setActiveId(ability.id)}
                  className="grid w-full cursor-pointer grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-4 py-5 text-left"
                >
                  <span className={"mono-label transition-colors " + (on ? "text-emphasis" : "text-muted")}>{codeOf(i)}</span>
                  <span
                    className={
                      "giant-title transition-[font-size,opacity,transform] duration-500 " +
                      (on
                        ? "translate-x-2 text-[clamp(44px,6vw,92px)] opacity-100"
                        : "text-[clamp(30px,3.6vw,56px)] opacity-45")
                    }
                  >
                    {ability.name}
                  </span>
                  <span className={"mono-label flex items-center gap-2 transition-opacity " + (on ? "opacity-100" : "opacity-0")}>
                    <span aria-hidden="true" className="status-dot" />
                    {extra.activeLabel}
                  </span>
                </button>
              </li>
            );
          })}
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <div className="border border-line p-6 md:p-8">
            <p className="mono-label mb-6 flex justify-between text-muted">
              <span>{extra.scanLabel}</span>
              <span className="text-emphasis">{codeOf(activeIndex)}</span>
            </p>
            <PowerScan ability={active} />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
