"use client";

import { extra as extraContent } from "@/data/extra";
import { useLocalized } from "@/components/locale/LocaleProvider";
import { stack } from "@/data/stack";
import type { Ability } from "@/types";

/** Scan panel body: active ability name, description and its framework icons. */
export function PowerScan({ ability }: { ability: Ability }) {
  const extra = useLocalized(extraContent);
  const technologies = ability.technologies
    .map((name) => stack.find((item) => item.name === name))
    .filter((item) => item !== undefined);

  return (
    <div className="flex flex-col gap-6">
      <h3 className="giant-title text-[clamp(28px,3vw,44px)]">{ability.name}</h3>

      <p className="max-w-lg text-sm text-muted">{ability.description}</p>

      <div>
        <p className="mono-label text-muted">{extra.technologiesLabel}</p>
        {/* Keyed by ability: the tiles replay their staggered entrance on every switch. */}
        <ul key={ability.id} className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {technologies.map((tech, i) => (
            <li
              key={tech.name}
              className="tech-tile flex aspect-square flex-col items-center justify-center gap-3 rounded-xl border border-line bg-surface p-3 text-center transition-colors hover:border-emphasis"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={tech.icon} alt="" width={44} height={44} className="size-10 md:size-11" />
              <span className="mono-label text-[10px] leading-tight">{tech.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
