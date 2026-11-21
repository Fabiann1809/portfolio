"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { art } from "@/data/art";
import { galleryConfig, galleryLabels } from "@/data/gallery";
import { GalleryCounter } from "@/components/gallery/GalleryCounter";
import { GalleryNav } from "@/components/gallery/GalleryNav";
import { useCrossfade } from "@/hooks/useCrossfade";
import { useMinWidth } from "@/hooks/useMinWidth";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { placeholderGradient } from "@/lib/gradient";
import type { Artwork } from "@/types";

const cfg = galleryConfig;
const artworks = art.artworks;
const count = artworks.length;
const titleClass = "col-start-1 row-start-1 font-display text-xl font-extrabold tracking-[0.1em] uppercase";

function ArtMedia({ work, alt = "" }: { work: Artwork; alt?: string }) {
  if (work.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={work.image} alt={alt} draggable={false} className="size-full object-cover" />;
  }
  return <div aria-hidden="true" className="size-full" style={{ backgroundImage: placeholderGradient(work.id) }} />;
}

/** Rondo-style gallery: active artwork in a glowing lens, a snap wheel of thumbnails on an arc below. */
export function ArtWheel() {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const wide = useMinWidth(1024);
  const g = wide ? cfg.wheel.page : cfg.wheel.embedded;
  const indexRef = useRef(0);
  const lockUntil = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const cooldown = reduced ? cfg.reducedCooldownMs : cfg.cooldownMs;
  const duration = reduced ? 0 : cfg.transitionMs;

  const goTo = useCallback((next: number) => {
    if (next < 0 || next >= count || next === indexRef.current) return false;
    indexRef.current = next;
    setIndex(next);
    return true;
  }, []);

  const step = useCallback(
    (dir: 1 | -1) => {
      const now = performance.now();
      if (now < lockUntil.current) return;
      if (goTo(indexRef.current + dir)) lockUntil.current = now + cooldown;
    },
    [goTo, cooldown],
  );

  // Horizontal wheel / trackpad swipes step the wheel; vertical scrolling keeps moving the page.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let accum = 0;
    let lastTime = 0;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || event.ctrlKey) return;
      event.preventDefault();
      const now = performance.now();
      if (now - lastTime > cfg.wheelIdleMs) accum = 0;
      lastTime = now;
      if (now < lockUntil.current) return;
      accum += event.deltaX;
      if (Math.abs(accum) >= cfg.wheelThreshold) {
        step(accum > 0 ? 1 : -1);
        accum = 0;
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [step]);

  const work = artworks[index];
  const { current, leaving } = useCrossfade(work, cfg.transitionMs);
  const status = `${work.title}, ${index + 1} ${galleryLabels.counterSeparator} ${count}`;
  const stepRad = (g.stepDeg * Math.PI) / 180;

  return (
    <div
      ref={rootRef}
      role="group"
      aria-roledescription="carousel"
      aria-label={art.galleryAria}
      data-reduced={reduced}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") step(1);
        else if (event.key === "ArrowLeft") step(-1);
        else return;
        event.preventDefault();
      }}
      onTouchStart={(event) => {
        const t = event.touches[0];
        touch.current = { x: t.clientX, y: t.clientY };
      }}
      onTouchEnd={(event) => {
        const start = touch.current;
        touch.current = null;
        if (!start) return;
        const t = event.changedTouches[0];
        const dx = t.clientX - start.x;
        const dy = t.clientY - start.y;
        if (Math.abs(dx) < cfg.swipeThreshold || Math.abs(dx) < Math.abs(dy) * 1.2) return;
        step(dx < 0 ? 1 : -1);
      }}
      style={{ "--gallery-ms": cfg.transitionMs + "ms", "--gallery-ease": cfg.ease } as React.CSSProperties}
      className="relative mt-12 flex flex-col gap-4 overflow-hidden [touch-action:pan-y] outline-offset-4 focus-visible:outline-2 focus-visible:outline-(--color-primary) lg:block lg:h-[46rem] lg:gap-0"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 42%, color-mix(in srgb, var(--color-primary) 14%, transparent), transparent 60%), radial-gradient(ellipse at 50% 120%, color-mix(in srgb, var(--color-accent) 10%, transparent), transparent 55%)",
        }}
      />
      <p aria-live="polite" className="sr-only">
        {status}
      </p>

      <div className="relative flex items-end justify-between gap-4 lg:contents">
        <GalleryCounter
          index={index}
          count={count}
          separator={galleryLabels.counterSeparator}
          className="lg:absolute lg:top-[40%] lg:left-0 lg:-translate-y-1/2"
        />
        <div className="text-right lg:absolute lg:top-[40%] lg:right-0 lg:max-w-[18vw] lg:-translate-y-1/2">
          <div aria-hidden="true" className="grid">
            {leaving && (
              <p key={leaving.id} className={`gallery-fade-out ${titleClass}`}>
                {leaving.title}
              </p>
            )}
            <p key={current.id} className={`gallery-fade-in ${titleClass}`}>
              {current.title}
            </p>
          </div>
          <p key={current.id} className="gallery-fade-in mono-label mt-2 text-muted">
            {art.techniqueLabel}: {current.technique}
            <br />
            {art.yearLabel}: {current.year}
          </p>
        </div>
      </div>

      <div className="relative mx-auto w-[min(100%,calc(36svh*1.6))] shrink-0 lg:absolute lg:top-[40%] lg:left-1/2 lg:w-[min(52vw,720px)] lg:-translate-x-1/2 lg:-translate-y-1/2">
        <div
          className="relative aspect-[16/10] w-full rounded-[10%/14%]"
          style={{
            boxShadow:
              "0 0 50px 6px color-mix(in srgb, var(--color-primary) 40%, transparent), 0 0 150px 30px color-mix(in srgb, var(--color-primary) 18%, transparent)",
          }}
        >
          <div className="absolute inset-0 overflow-hidden rounded-[10%/14%] bg-black">
            <div className="absolute inset-0" style={{ filter: "saturate(1.1) contrast(1.05)" }}>
              {leaving && (
                <div key={leaving.id} className="gallery-lens-out absolute inset-0">
                  <ArtMedia work={leaving} />
                </div>
              )}
              <div key={current.id} className="gallery-lens-in absolute inset-0">
                <ArtMedia work={current} alt={current.title} />
              </div>
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 28% 18%, rgba(255,255,255,0.16), transparent 42%), repeating-linear-gradient(to bottom, rgba(0,0,0,0.16) 0 1px, transparent 1px 3px)",
                boxShadow: "inset 0 0 90px 20px rgba(0,0,0,0.75), inset 0 0 0 1px rgba(255,255,255,0.08)",
              }}
            />
          </div>
        </div>
      </div>

      <div className="relative h-24 shrink-0 lg:absolute lg:inset-x-0 lg:bottom-14 lg:h-36">
        <ul aria-label={art.wheelAria} className="relative size-full" style={{ perspective: reduced ? "none" : "900px" }}>
          {artworks.map((item, i) => {
            const o = i - index;
            const abs = Math.abs(o);
            const a = reduced ? 0 : o * stepRad;
            const x = reduced ? o * (g.thumbWidth + 12) : g.radius * Math.sin(a);
            const z = reduced ? 0 : g.radius * (Math.cos(a) - 1);
            const active = o === 0;
            const y = active ? -g.lift : reduced ? 0 : (1 - Math.cos(a)) * g.radius * 0.25;
            const scale = active ? g.scaleActive : Math.max(0.4, 1 - abs * g.scaleFalloff);
            const hidden = abs > g.reach;
            const opacity = hidden ? 0 : Math.max(0.12, 1 - abs * g.fade);

            return (
              <li
                key={item.id}
                className="absolute bottom-3 left-1/2"
                style={{
                  width: g.thumbWidth,
                  height: g.thumbHeight,
                  marginLeft: -g.thumbWidth / 2,
                  zIndex: 100 - abs,
                  opacity,
                  transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${(a * 180) / Math.PI}deg) scale(${scale})`,
                  transition: `transform ${duration}ms ${cfg.ease}, opacity ${duration}ms ${cfg.ease}`,
                  pointerEvents: hidden ? "none" : "auto",
                }}
              >
                <button
                  type="button"
                  tabIndex={hidden ? -1 : 0}
                  aria-label={`${art.select} ${item.title}`}
                  aria-current={active ? "true" : undefined}
                  onClick={() => goTo(i)}
                  className={
                    "block size-full cursor-pointer overflow-hidden rounded-md border transition-[border-color,box-shadow] duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary) " +
                    (active
                      ? "border-foreground/70 shadow-[0_0_24px_color-mix(in_srgb,var(--color-primary)_55%,transparent)]"
                      : "border-foreground/15")
                  }
                >
                  <ArtMedia work={item} />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="relative lg:absolute lg:inset-x-0 lg:bottom-0">
        <GalleryNav
          previousLabel={art.previous}
          nextLabel={art.next}
          canPrevious={index > 0}
          canNext={index < count - 1}
          onPrevious={() => goTo(index - 1)}
          onNext={() => goTo(index + 1)}
        />
      </div>
    </div>
  );
}
