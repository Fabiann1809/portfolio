"use client";

import { extra as extraContent } from "@/data/extra";
import { useLocalized } from "@/components/locale/LocaleProvider";
import { stack } from "@/data/stack";
import type { Ability } from "@/types";

/** Scan panel body: ability description and its framework icons in a grid. */
/** `showTitle` is off in the mobile accordion, where the ability button already shows the name. */
export function PowerScan({ ability, showTitle = true }: { ability: Ability; showTitle?: boolean }) {
  const extra = useLocalized(extraContent);
  const technologies = ability.technologies
    .map((name) => stack.find((item) => item.name === name))
    .filter((item) => item !== undefined);

  return (
    <div className="flex flex-col gap-4">
      {showTitle && <h3 className="giant-title text-[clamp(24px,2.4vw,36px)]">{ability.name}</h3>}

      <p className="max-w-md text-[13px] leading-relaxed text-muted lg:text-sm">{ability.description}</p>

      <div>
        <p className="mono-label text-[10px] text-muted">{extra.technologiesLabel}</p>
        {/* Keyed by ability: the icons replay their staggered entrance on every switch. */}
        <ul key={ability.id} className="mt-3 grid grid-cols-4 gap-x-2 gap-y-4">
          {technologies.map((tech, i) => (
            <li
              key={tech.name}
              className="tech-tile flex flex-col items-center gap-1 text-center"
              style={{ animationDelay: `${i * 60}ms` }}
              title={tech.name}
            >
              <span className="flex size-10 lg:size-12 items-center justify-center rounded-full border border-line bg-surface shadow-[0_6px_18px_-8px_var(--shadow-color)] transition-colors hover:border-emphasis">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={tech.icon} alt="" width={20} height={20} className="size-5 object-contain lg:size-6" />
              </span>
              <span className="mono-label text-[8.5px] leading-tight text-muted lg:text-[9.5px]">{tech.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
