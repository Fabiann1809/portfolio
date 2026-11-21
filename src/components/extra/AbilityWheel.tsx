"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { extra } from "@/data/extra";
import { galleryConfig } from "@/data/gallery";
import { stack } from "@/data/stack";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { GalleryCounter } from "@/components/gallery/GalleryCounter";
import { GalleryNav } from "@/components/gallery/GalleryNav";
import type { Ability } from "@/types";

/** Degrees between neighbouring cards on the arc and how many steps away stay visible. */
const STEP_DEG = 15;
const REACH = 2;
const DRAG_THRESHOLD = 40;

const abilities = extra.abilities;
const count = abilities.length;

const techOf = (ability: Ability) =>
  ability.technologies.map((name) => stack.find((item) => item.name === name)).filter((item) => item !== undefined);

/** Card backdrop: theme tokens only, rotated per card so each one reads differently. */
const cardBackground = (i: number) =>
  `linear-gradient(${135 + i * 70}deg, color-mix(in srgb, var(--color-primary) 38%, transparent), transparent 55%), ` +
  `radial-gradient(circle at ${20 + i * 25}% 110%, color-mix(in srgb, var(--color-accent) 30%, transparent), transparent 60%), ` +
  `repeating-linear-gradient(0deg, transparent 0 23px, var(--color-line) 23px 24px), var(--color-surface)`;

/** Rondo-style wheel: cards fan out on an arc, the active one is large and centred; snaps one by one. */
export function AbilityWheel() {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const indexRef = useRef(0);
  const lockUntil = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number } | null>(null);
  const moved = useRef(false);
  const cooldown = reduced ? galleryConfig.reducedCooldownMs : galleryConfig.cooldownMs;
  const duration = reduced ? 0 : galleryConfig.transitionMs;

  const goTo = useCallback((next: number) => {
    if (next < 0 || next >= count || next === indexRef.current) return;
    indexRef.current = next;
    setIndex(next);
  }, []);

  const step = useCallback(
    (dir: 1 | -1) => {
      const now = performance.now();
      if (now < lockUntil.current) return;
      const before = indexRef.current;
      goTo(before + dir);
      if (indexRef.current !== before) lockUntil.current = now + cooldown;
    },
    [goTo, cooldown],
  );

  // Horizontal wheel / trackpad swipes step the wheel; vertical wheel keeps scrolling the page.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let accum = 0;
    let lastTime = 0;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || event.ctrlKey) return;
      event.preventDefault();
      const now = performance.now();
      if (now - lastTime > galleryConfig.wheelIdleMs) accum = 0;
      lastTime = now;
      if (now < lockUntil.current) return;
      accum += event.deltaX;
      if (Math.abs(accum) >= galleryConfig.wheelThreshold) {
        step(accum > 0 ? 1 : -1);
        accum = 0;
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [step]);

  const endDrag = (x: number) => {
    const start = drag.current;
    drag.current = null;
    if (!start) return;
    const dx = x - start.x;
    if (Math.abs(dx) >= DRAG_THRESHOLD) step(dx < 0 ? 1 : -1);
  };

  const status = `${index + 1} ${extra.counterSeparator} ${count}`;

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={extra.wheelAria}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") step(1);
        else if (event.key === "ArrowLeft") step(-1);
        else return;
        event.preventDefault();
      }}
      className="mt-10 flex flex-col gap-8 outline-offset-4 focus-visible:outline-2 focus-visible:outline-(--color-primary)"
    >
      <p aria-live="polite" className="sr-only">
        {status}
      </p>

      <div
        ref={stageRef}
        onPointerDown={(event) => {
          drag.current = { x: event.clientX };
          moved.current = false;
        }}
        onPointerMove={(event) => {
          if (drag.current && Math.abs(event.clientX - drag.current.x) > 10) moved.current = true;
        }}
        onPointerUp={(event) => endDrag(event.clientX)}
        onPointerCancel={() => (drag.current = null)}
        onPointerLeave={(event) => endDrag(event.clientX)}
        className="relative h-[28rem] cursor-grab touch-pan-y overflow-hidden select-none active:cursor-grabbing md:h-[32rem]"
        style={{ perspective: reduced ? "none" : "1400px" }}
      >
        <ul className="relative size-full">
          {abilities.map((ability, i) => {
            const o = i - index;
            const abs = Math.abs(o);
            const active = o === 0;
            const hidden = abs > (reduced ? 1 : REACH);
            const transform = reduced
              ? `translate(calc(-50% + ${o * 106}%), -50%)`
              : `translate(-50%, -50%) rotate(${o * STEP_DEG}deg) scale(${active ? 1 : 0.84})`;
            const opacity = hidden ? 0 : active ? 1 : Math.max(0.2, 0.6 - (abs - 1) * 0.3);

            return (
              <li
                key={ability.id}
                aria-hidden={!active}
                className="absolute top-1/2 left-1/2 h-[24rem] w-[min(82vw,26rem)] md:h-[28rem]"
                style={{
                  zIndex: 10 - abs,
                  opacity,
                  transform,
                  transformOrigin: reduced ? "50% 50%" : "50% 230%",
                  transition: `transform ${duration}ms ${galleryConfig.ease}, opacity ${duration}ms ${galleryConfig.ease}`,
                  pointerEvents: hidden ? "none" : "auto",
                }}
              >
                <article
                  className={
                    "relative flex size-full flex-col justify-between overflow-hidden border p-6 transition-colors duration-500 md:p-8 " +
                    (active ? "border-foreground/70" : "border-line")
                  }
                  style={{ background: cardBackground(i) }}
                >
                  <p className="mono-label flex justify-between text-muted">
                    <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                    <span aria-hidden="true" className="status-dot" />
                  </p>

                  <div className="flex flex-col gap-4">
                    <h3 className="giant-title text-[clamp(30px,4vw,52px)]">{ability.name}</h3>
                    <p
                      className={
                        "max-w-sm text-sm text-muted transition-opacity duration-500 " + (active ? "opacity-100" : "opacity-0")
                      }
                    >
                      {ability.description}
                    </p>
                    <ul className="flex flex-wrap gap-2" aria-label={extra.technologiesLabel}>
                      {techOf(ability).map((item) => (
                        <li key={item.name} className="mono-label flex items-center gap-2 border border-line bg-background/60 px-2.5 py-1.5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.icon} alt="" width={18} height={18} />
                          <span>{item.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {!active && !hidden && (
                    <button
                      type="button"
                      aria-label={`${extra.select} ${ability.name}`}
                      onClick={() => {
                        if (!moved.current) goTo(i);
                      }}
                      className="absolute inset-0 cursor-pointer"
                    />
                  )}
                </article>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex items-center justify-between gap-4">
        <GalleryCounter index={index} count={count} separator={extra.counterSeparator} />
        <GalleryNav
          previousLabel={extra.previous}
          nextLabel={extra.next}
          canPrevious={index > 0}
          canNext={index < count - 1}
          onPrevious={() => goTo(index - 1)}
          onNext={() => goTo(index + 1)}
        />
      </div>
    </div>
  );
}
