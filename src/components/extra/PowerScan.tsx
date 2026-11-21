import { extra } from "@/data/extra";
import { stack } from "@/data/stack";
import type { Ability } from "@/types";

/** Scan panel body: active ability name, description and its framework icons. */
export function PowerScan({ ability }: { ability: Ability }) {
  const technologies = ability.technologies
    .map((name) => stack.find((item) => item.name === name))
    .filter((item) => item !== undefined);

  return (
    <div className="flex flex-col gap-6">
      <h3 className="giant-title text-[clamp(28px,3vw,44px)]">{ability.name}</h3>

      <p className="max-w-lg text-sm text-muted">{ability.description}</p>

      <div>
        <p className="mono-label text-muted">{extra.technologiesLabel}</p>
        <ul className="mt-3 flex flex-wrap gap-3">
          {technologies.map((tech) => (
            <li key={tech.name} className="mono-label flex items-center gap-2 border border-line px-3 py-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={tech.icon} alt="" width={20} height={20} />
              <span>{tech.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
