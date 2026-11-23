"use client";

import { extra as extraContent } from "@/data/extra";
import { useLocalized } from "@/components/locale/LocaleProvider";
import { stack } from "@/data/stack";
import type { Ability } from "@/types";

/** Deterministic 0..1 value per (string, salt), so the scatter is stable between renders. */
function hash01(text: string, salt: number): number {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return ((h >>> 0) % 1000) / 1000;
}

/** Jittered grid: one cell per icon, each nudged inside its cell and rows offset, so it reads as scattered. */
function scatter(names: string[]) {
  const cols = names.length > 6 ? 4 : 3;
  const rows = Math.ceil(names.length / cols);
  return names.map((name, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cell = 100 / cols;
    const shift = row % 2 === 1 ? cell * 0.3 : -cell * 0.1; // stagger alternate rows
    const x = (col + 0.5) * cell + shift + (hash01(name, 1) - 0.5) * cell * 0.45;
    const y = ((row + 0.5 + (hash01(name, 2) - 0.5) * 0.4) / rows) * 100;
    return { x: Math.min(91, Math.max(9, x)), y: Math.min(88, Math.max(12, y)), rows };
  });
}

/** Scan panel body: ability description and its framework icons scattered over the panel. */
/** `showTitle` is off in the mobile accordion, where the ability button already shows the name. */
export function PowerScan({ ability, showTitle = true }: { ability: Ability; showTitle?: boolean }) {
  const extra = useLocalized(extraContent);
  const technologies = ability.technologies
    .map((name) => stack.find((item) => item.name === name))
    .filter((item) => item !== undefined);
  const spots = scatter(technologies.map((tech) => tech.name));
  const rows = spots[0]?.rows ?? 1;

  return (
    <div className="flex flex-col gap-4">
      {showTitle && <h3 className="giant-title text-[clamp(24px,2.4vw,36px)]">{ability.name}</h3>}

      <p className="max-w-md text-[13px] leading-relaxed text-muted">{ability.description}</p>

      <div>
        <p className="mono-label text-[10px] text-muted">{extra.technologiesLabel}</p>
        {/* Keyed by ability: the icons replay their staggered entrance on every switch. */}
        <ul key={ability.id} className="relative mt-2 w-full" style={{ height: rows * 74 + 8 }}>
          {technologies.map((tech, i) => (
            <li
              key={tech.name}
              className="tech-tile absolute flex w-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 text-center"
              style={{ left: spots[i].x + "%", top: spots[i].y + "%", animationDelay: `${i * 60}ms` }}
              title={tech.name}
            >
              <span className="tech-float flex size-10 items-center justify-center rounded-full border border-line bg-surface shadow-[0_6px_18px_-8px_var(--shadow-color)] transition-colors hover:border-emphasis" style={{ animationDelay: `${(hash01(tech.name, 3) * -4).toFixed(2)}s` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={tech.icon} alt="" width={20} height={20} className="size-5 object-contain" />
              </span>
              <span className="mono-label text-[8.5px] leading-tight text-muted">{tech.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
