"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { art as artContent } from "@/data/art";
import { artGalleryConfig, galleryConfig, galleryLabels } from "@/data/gallery";
import { useLocalized } from "@/components/locale/LocaleProvider";
import { GalleryCounter } from "@/components/gallery/GalleryCounter";
import { LensCanvas } from "@/components/art/LensCanvas";
import { useCrossfade } from "@/hooks/useCrossfade";
import { useMinWidth } from "@/hooks/useMinWidth";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { placeholderGradient } from "@/lib/gradient";
import type { Artwork } from "@/types";

const cfg = galleryConfig;
const artCfg = artGalleryConfig;
const titleClass = "font-display text-xl font-extrabold tracking-[0.1em] uppercase";
/** Clip box for the slide-up text swap. */
const swapWrap = "block overflow-hidden pb-1";

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

/** Wraps an angle in degrees to (-180, 180]. */
const wrapDeg = (a: number) => a - 360 * Math.round(a / 360);

/** Gallery pinned while scrolling: page scroll turns a 3D thumbnail ring and swaps the WebGL lens artwork. */
export function ArtWheel() {
  const art = useLocalized(artContent);
  const labels = useLocalized(galleryLabels);
  const artworks = art.artworks;
  const count = artworks.length;
  const [index, setIndex] = useState(0);
  const [glFailed, setGlFailed] = useState(false);
  const reduced = useReducedMotion();
  const wide = useMinWidth(1024);
  const ringCfg = artCfg.ring;
  const thumb = wide ? ringCfg.page : ringCfg.embedded;
  const thumbW = thumb.thumbWidth;
  const thumbH = thumb.thumbHeight;
  const step = 360 / count;
  const radius = Math.max((count * (thumbW + ringCfg.gap)) / (2 * Math.PI), thumbW * 1.5);
  const trackRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  /** Continuous artwork position: the ring eases toward the scroll-driven target. */
  const target = useRef(0);
  const position = useRef(0);
  const onLensFail = useCallback(() => setGlFailed(true), []);
  const useGL = !reduced && !glFailed;

  // Page scroll -> continuous target; per-frame ring placement with frame-rate independent easing.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    let last = 0;
    const place = () => {
      const ring = ringRef.current;
      const rot = -position.current * step;
      if (ring) {
        ring.style.transform = `translateZ(${-radius}px) rotateX(${ringCfg.tiltDeg}deg) rotateY(${rot}deg)`;
      }
      for (let i = 0; i < count; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;
        const angle = wrapDeg(i * step + rot);
        const facing = Math.cos((angle * Math.PI) / 180);
        const near = Math.max(0, 1 - Math.abs(angle) / step);
        el.style.transform = `rotateY(${i * step}deg) translateZ(${radius}px) translateY(${-near * thumbH * 0.18}px) scale(${1 + near * 0.18})`;
        el.style.opacity = String(Math.min(1, Math.max(0, (facing - 0.05) / 0.45)));
        el.style.visibility = facing < 0.02 ? "hidden" : "visible";
      }
    };
    const tick = (now: number) => {
      raf = 0;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
      last = now;
      const diff = target.current - position.current;
      let moving = false;
      if (reduced || Math.abs(diff) < 0.0005) position.current = target.current;
      else {
        position.current += diff * (1 - Math.exp(-ringCfg.snapSpeed * dt));
        moving = true;
      }
      place();
      if (moving) raf = requestAnimationFrame(tick);
      else last = 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      const rect = track.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      const progress = range > 0 ? Math.min(1, Math.max(0, -rect.top / range)) : 0;
      // the middle of each artwork's scroll segment is exactly that artwork
      target.current = Math.min(count - 1, Math.max(0, progress * count - 0.5));
      setIndex(Math.round(target.current));
      kick();
    };
    const initial = requestAnimationFrame(onScroll);
    kick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(initial);
      cancelAnimationFrame(raf);
    };
  }, [count, step, radius, thumbH, ringCfg.tiltDeg, ringCfg.snapSpeed, reduced]);

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
  // Only the CSS fallback lens needs the previous artwork kept around for its crossfade.
  const { current, leaving } = useCrossfade(work, cfg.transitionMs);
  const status = `${work.title}, ${index + 1} ${labels.counterSeparator} ${count}`;
  const lens = artCfg.lens;

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
          <div className={`${swapWrap} lg:absolute lg:top-[42%] lg:left-0 lg:-translate-y-1/2`}>
            <div key={index} className="gallery-text-swap">
              <GalleryCounter index={index} count={count} separator={labels.counterSeparator} />
            </div>
          </div>
          <div className="text-right lg:absolute lg:top-[42%] lg:right-0 lg:max-w-[18vw] lg:-translate-y-1/2">
            <div aria-hidden="true" className={swapWrap}>
              <p key={work.id} className={`gallery-text-swap ${titleClass}`}>
                {work.title}
              </p>
            </div>
            <div className={swapWrap}>
              <p key={work.id} className="gallery-text-swap mono-label mt-2 text-muted">
                {art.techniqueLabel}: {work.technique}
                <br />
                {art.yearLabel}: {work.year}
              </p>
            </div>
          </div>
        </div>

        {/* Max box for the lens; the lens inside takes the artwork's own proportions and animates between them. */}
        <div className="relative mx-auto flex h-[36svh] w-full max-w-[calc(36svh*1.6)] shrink-0 items-center justify-center lg:absolute lg:top-[42%] lg:left-1/2 lg:h-[min(calc(100svh-420px),540px)] lg:w-[min(52vw,760px)] lg:max-w-none lg:-translate-x-1/2 lg:-translate-y-1/2 [container-type:size]">
          <div
            className="relative"
            style={{
              aspectRatio: String(work.aspect ?? 1.6),
              width: `min(100cqw, calc(100cqh * ${work.aspect ?? 1.6}))`,
              transition: reduced ? undefined : "width 0.9s cubic-bezier(.7,0,.2,1)",
            }}
          >
            {useGL ? (
              <LensCanvas
                artId={work.id}
                image={work.image}
                alt={work.title}
                distortion={lens.distortion}
                chromatic={lens.chromatic}
                glow={lens.glow}
                tilt={lens.tilt}
                fadeMs={lens.fadeMs}
                onFail={onLensFail}
              />
            ) : (
              <div
                className="absolute inset-0 rounded-[10%/14%]"
                style={{
                  transform: "scale(1.02)",
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
                        "repeating-linear-gradient(to bottom, rgba(0,0,0,0.16) 0 1px, transparent 1px 3px)",
                      boxShadow:
                        "inset 0 0 90px 20px rgba(0,0,0,0.75), inset 0 0 0 1px rgba(255,255,255,0.08)",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className="relative h-24 shrink-0 lg:absolute lg:inset-x-0 lg:bottom-14 lg:h-36"
          style={{ perspective: ringCfg.perspective }}
        >
          <ul
            ref={ringRef}
            aria-label={art.wheelAria}
            className="absolute left-1/2"
            style={{
              top: thumbH * 0.25 + radius * Math.sin((ringCfg.tiltDeg * Math.PI) / 180),
              width: 0,
              height: 0,
              transformStyle: "preserve-3d",
              transform: `translateZ(${-radius}px) rotateX(${ringCfg.tiltDeg}deg)`,
            }}
          >
            {artworks.map((item, i) => {
              const active = i === index;
              return (
                <li
                  key={item.id}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className="absolute top-0"
                  style={{
                    left: -thumbW / 2,
                    width: thumbW,
                    height: thumbH,
                    backfaceVisibility: "hidden",
                    transform: `rotateY(${i * step}deg) translateZ(${radius}px)`,
                  }}
                >
                  <button
                    type="button"
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
