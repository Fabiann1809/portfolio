"use client";

import { stack } from "@/data/stack";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Seconds for one full loop of the strip. */
const LOOP_SECONDS = 40;

function Tile({ name, icon }: { name: string; icon: string }) {
  return (
    <li className="group flex shrink-0 flex-col items-center gap-2" title={name}>
      <span className="grid size-16 place-items-center rounded-xl border border-line bg-surface grayscale transition-[filter,border-color,transform] duration-300 group-hover:-translate-y-1 group-hover:border-emphasis group-hover:grayscale-0 md:size-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={icon} alt="" width={36} height={36} className="size-8 md:size-9" />
      </span>
      <span className="mono-label text-[10px] text-muted">{name}</span>
    </li>
  );
}

/** Centered title and an endless strip of stack tiles with faded edges (static wrap with reduced motion). */
export function StackMarquee({ title }: { title: string }) {
  const reduced = useReducedMotion();

  return (
    <div className="flex flex-col items-center gap-6">
      <h3 className="mono-label text-center text-muted">{title}</h3>
      {reduced ? (
        <ul className="flex flex-wrap justify-center gap-5">
          {stack.map((item) => (
            <Tile key={item.name} {...item} />
          ))}
        </ul>
      ) : (
        <div
          className="w-full overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
          }}
        >
          <div className="stack-marquee flex w-max gap-5 hover:[animation-play-state:paused]" style={{ animationDuration: LOOP_SECONDS + "s" }}>
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 gap-5">
                {stack.map((item) => (
                  <Tile key={item.name} {...item} />
                ))}
              </ul>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
