"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { art as artContent } from "@/data/art";
import { galleryConfig, galleryLabels } from "@/data/gallery";
import { useLocalized } from "@/components/locale/LocaleProvider";
import { GalleryCounter } from "@/components/gallery/GalleryCounter";
import { useCrossfade } from "@/hooks/useCrossfade";
import { useMinWidth } from "@/hooks/useMinWidth";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { placeholderGradient } from "@/lib/gradient";
import type { Artwork } from "@/types";

const cfg = galleryConfig;
const titleClass =
  "col-start-1 row-start-1 font-display text-xl font-extrabold tracking-[0.1em] uppercase";

function ArtMedia({ work, alt = "" }: { work: Artwork; alt?: string }) {
  if (work.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={work.image}
        alt={alt}
        draggable={false}
        className="size-full object-cover"
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      className="size-full"
      style={{ backgroundImage: placeholderGradient(work.id) }}
    />
  );
}

/** Scroll distance (in viewport heights) spent on each artwork while the gallery is pinned. */
const SCROLL_PER_ITEM = 0.6;

/** Rondo-style gallery pinned while scrolling: each scroll step advances the lens and the thumbnail arc. */
export function ArtWheel() {
  const art = useLocalized(artContent);
  const labels = useLocalized(galleryLabels);
  const artworks = art.artworks;
  const count = artworks.length;
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const wide = useMinWidth(1024);
  const g = wide ? cfg.wheel.page : cfg.wheel.embedded;
  const trackRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);

  // 3D tilt: the lens leans toward the pointer and its glare follows it.
  const tilt = (event: React.PointerEvent<HTMLDivElement>) => {
    const lens = lensRef.current;
    if (!lens || reduced || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width - 0.5;
    const ny = (event.clientY - rect.top) / rect.height - 0.5;
    lens.style.setProperty("--rx", `${(-ny * 18).toFixed(2)}deg`);
    lens.style.setProperty("--ry", `${(nx * 24).toFixed(2)}deg`);
    lens.style.setProperty("--gx", `${(50 + nx * 70).toFixed(1)}%`);
    lens.style.setProperty("--gy", `${(50 + ny * 70).toFixed(1)}%`);
  };
  const resetTilt = () => {
    const lens = lensRef.current;
    if (!lens) return;
    for (const v of ["--rx", "--ry", "--gx", "--gy"])
      lens.style.removeProperty(v);
  };
  const duration = reduced ? 0 : cfg.transitionMs;

  // Page scroll position inside the tall track picks the active artwork.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = track.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      const progress =
        range > 0 ? Math.min(1, Math.max(0, -rect.top / range)) : 0;
      setIndex(Math.min(count - 1, Math.floor(progress * count)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [count]);

  const goTo = useCallback(
    (next: number) => {
      const track = trackRef.current;
      if (!track || next < 0 || next >= count) return;
      const range = track.offsetHeight - window.innerHeight;
      const top =
        track.getBoundingClientRect().top +
        window.scrollY +
        ((next + 0.5) / count) * range;
      window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    },
    [reduced, count],
  );

  const work = artworks[index];
  const { current, leaving } = useCrossfade(work, cfg.transitionMs);
  const status = `${work.title}, ${index + 1} ${labels.counterSeparator} ${count}`;
  const stepRad = (g.stepDeg * Math.PI) / 180;

  return (
    <div
      ref={trackRef}
      className="relative mt-12"
      style={{ height: `calc(100svh + ${count * SCROLL_PER_ITEM * 100}svh)` }}
    >
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label={art.galleryAria}
        data-reduced={reduced}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") goTo(index + 1);
          else if (event.key === "ArrowLeft") goTo(index - 1);
          else return;
          event.preventDefault();
        }}
        style={
          {
            "--gallery-ms": cfg.transitionMs + "ms",
            "--gallery-ease": cfg.ease,
          } as React.CSSProperties
        }
        onPointerMove={tilt}
        onPointerLeave={resetTilt}
        className="sticky top-0 flex h-svh flex-col justify-center gap-4 overflow-hidden outline-offset-4 focus-visible:outline-2 focus-visible:outline-(--color-primary) lg:block lg:gap-0"
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
            separator={labels.counterSeparator}
            className="lg:absolute lg:top-[47%] lg:left-0 lg:-translate-y-1/2"
          />
          <div className="text-right lg:absolute lg:top-[47%] lg:right-0 lg:max-w-[18vw] lg:-translate-y-1/2">
            <div aria-hidden="true" className="grid">
              {leaving && (
                <p
                  key={leaving.id}
                  className={`gallery-fade-out ${titleClass}`}
                >
                  {leaving.title}
                </p>
              )}
              <p key={current.id} className={`gallery-fade-in ${titleClass}`}>
                {current.title}
              </p>
            </div>
            <p
              key={current.id}
              className="gallery-fade-in mono-label mt-2 text-muted"
            >
              {art.techniqueLabel}: {current.technique}
              <br />
              {art.yearLabel}: {current.year}
            </p>
          </div>
        </div>

        <div className="relative mx-auto w-[min(100%,calc(36svh*1.6))] shrink-0 lg:absolute lg:top-[47%] lg:left-1/2 lg:w-[min(44vw,600px)] lg:-translate-x-1/2 lg:-translate-y-1/2">
          <div
            ref={lensRef}
            className="relative aspect-[16/10] w-full rounded-[10%/14%]"
            style={{
              transform:
                "perspective(1100px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) scale(1.02)",
              transition: "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
              transformStyle: "preserve-3d",
              boxShadow:
                "0 0 50px 6px color-mix(in srgb, var(--color-primary) 40%, transparent), 0 0 150px 30px color-mix(in srgb, var(--color-primary) 18%, transparent)",
            }}
          >
            <div className="absolute inset-0 overflow-hidden rounded-[10%/14%] bg-black">
              <div
                className="absolute inset-0"
                style={{ filter: "saturate(1.1) contrast(1.05)" }}
              >
                {leaving && (
                  <div
                    key={leaving.id}
                    className="gallery-lens-out absolute inset-0"
                  >
                    <ArtMedia work={leaving} />
                  </div>
                )}
                <div
                  key={current.id}
                  className="gallery-lens-in absolute inset-0"
                >
                  <ArtMedia work={current} alt={current.title} />
                </div>
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at var(--gx, 28%) var(--gy, 18%), rgba(255,255,255,0.2), transparent 42%), repeating-linear-gradient(to bottom, rgba(0,0,0,0.16) 0 1px, transparent 1px 3px)",
                  boxShadow:
                    "inset 0 0 90px 20px rgba(0,0,0,0.75), inset 0 0 0 1px rgba(255,255,255,0.08)",
                }}
              />
            </div>
          </div>
        </div>

        <div className="relative h-24 shrink-0 lg:absolute lg:inset-x-0 lg:bottom-14 lg:h-36">
          <ul
            aria-label={art.wheelAria}
            className="relative size-full"
            style={{ perspective: reduced ? "none" : "900px" }}
          >
            {artworks.map((item, i) => {
              const o = i - index;
              const abs = Math.abs(o);
              const a = reduced ? 0 : o * stepRad;
              const x = reduced
                ? o * (g.thumbWidth + 12)
                : g.radius * Math.sin(a);
              const z = reduced ? 0 : g.radius * (Math.cos(a) - 1);
              const active = o === 0;
              const y = active
                ? -g.lift
                : reduced
                  ? 0
                  : (1 - Math.cos(a)) * g.radius * 0.25;
              const scale = active
                ? g.scaleActive
                : Math.max(0.4, 1 - abs * g.scaleFalloff);
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
      </div>
    </div>
  );
}
