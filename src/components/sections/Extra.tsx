"use client";

import { useState } from "react";
import { extra as extraContent } from "@/data/extra";
import { useLocalized } from "@/components/locale/LocaleProvider";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { PowerScan } from "@/components/extra/PowerScan";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionTitle } from "@/components/ui/SectionTitle";

/** "Power profile": abilities list (hover / focus / click activates) next to a scan panel. */
export function Extra() {
  const extra = useLocalized(extraContent);
  const codeOf = (i: number) =>
    `${extra.codePrefix}-${String(i + 1).padStart(2, "0")}`;
  const [activeId, setActiveId] = useState(extra.abilities[0].id);
  const activeIndex = Math.max(
    0,
    extra.abilities.findIndex((ability) => ability.id === activeId),
  );
  const active = extra.abilities[activeIndex];
  // Wide (2-column) layout: hover-activated list + side panel. Otherwise: tap-to-open accordion.
  const wide = useMediaQuery("(min-width: 1024px)");
  const [openId, setOpenId] = useState<string | null>(null);
  /** Stays true after the first tap, so the hint does not come back when the panel is closed. */
  const [touched, setTouched] = useState(false);

  return (
    <section
      id="extra"
      className="section-glow glow-right px-[var(--edge-x)] py-24 md:py-32"
    >
      <SectionTitle trailing={String(extra.abilities.length).padStart(2, "0")}>
        {extra.label}
      </SectionTitle>

      {/* Accordion layout only: subtle tap hint that fades away once an ability has been opened. */}
      {!wide && (
        <p
          aria-hidden="true"
          className={
            "mono-label mt-5 flex items-center gap-2 text-[10px] text-muted transition-opacity duration-500 " +
            (touched ? "opacity-0" : "opacity-100")
          }
        >
          <span className="tap-hint-dot relative flex size-2.5 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-emphasis/40" />
            <span className="relative size-1.5 rounded-full bg-emphasis" />
          </span>
          {extra.tapHint}
        </p>
      )}

      <div className="mt-6 grid gap-12 lg:mt-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
        <ScrollReveal as="ul" className="flex flex-col">
          {extra.abilities.map((ability, i) => {
            const open = !wide && ability.id === openId;
            const on = wide ? ability.id === activeId : open;
            const panelId = `ability-panel-${ability.id}`;
            return (
              <li
                key={ability.id}
                className="border-t border-line last:border-b"
              >
                <button
                  type="button"
                  {...(wide
                    ? { "aria-pressed": on }
                    : { "aria-expanded": open, "aria-controls": panelId })}
                  onMouseEnter={
                    wide ? () => setActiveId(ability.id) : undefined
                  }
                  onFocus={wide ? () => setActiveId(ability.id) : undefined}
                  onClick={() =>
                    wide
                      ? setActiveId(ability.id)
                      : (setTouched(true), setOpenId(open ? null : ability.id))
                  }
                  className="grid w-full cursor-pointer grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-4 py-5 text-left"
                >
                  <span
                    className={
                      "mono-label transition-colors " +
                      (on ? "text-emphasis" : "text-muted")
                    }
                  >
                    {codeOf(i)}
                  </span>
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
                  <span
                    className={
                      "mono-label flex items-center gap-2 transition-opacity " +
                      (on ? "opacity-100" : "opacity-0")
                    }
                  >
                    <span aria-hidden="true" className="status-dot" />
                    {extra.activeLabel}
                  </span>
                </button>
                {!wide && (
                  <div
                    id={panelId}
                    role="region"
                    aria-label={ability.name}
                    inert={!open}
                    className={
                      "grid transition-[grid-template-rows,opacity] duration-500 ease-out " +
                      (open
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0")
                    }
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="mb-5 rounded-3xl border border-line bg-surface/40 p-5 backdrop-blur-sm">
                        <PowerScan ability={ability} showTitle={false} />
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ScrollReveal>

        {wide && (
          <ScrollReveal delay={120} className="self-start lg:sticky lg:top-28">
            <div className="mx-auto w-full max-w-md rounded-3xl border border-line bg-surface/40 p-5 backdrop-blur-sm lg:mt-6 lg:max-w-lg lg:p-7">
              <p className="mono-label mb-6 flex justify-between text-muted">
                <span>{extra.scanLabel}</span>
                <span className="text-emphasis">{codeOf(activeIndex)}</span>
              </p>
              <PowerScan ability={active} />
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
