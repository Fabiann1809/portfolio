"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { galleryConfig, galleryLabels } from "@/data/gallery";
import { useLocale, useLocalized } from "@/components/locale/LocaleProvider";
import { localizePath } from "@/lib/locale";
import { useLenisInstance } from "@/components/layout/SmoothScroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";
import { GalleryCounter } from "./GalleryCounter";
import { GalleryDetails } from "./GalleryDetails";
import { GalleryLens } from "./GalleryLens";
import { GalleryNav } from "./GalleryNav";
import { GalleryTitle } from "./GalleryTitle";
import { GalleryWheel } from "./GalleryWheel";

interface SnapWheelGalleryProps {
  projects: Project[];
  /**
   * "page": full-screen, captures wheel / keys / swipes and locks page scrolling.
   * "embedded": fits its parent, only captures horizontal swipes (the page still scrolls).
   */
  mode?: "page" | "embedded";
  className?: string;
}

const cfg = galleryConfig;
const SCROLL_AREA = "[data-gallery-scroll]";

/** Class sets per mode. Page mode is absolutely laid out from xl; below that it stacks. */
const layout = {
  page: {
    root: "fixed inset-0 z-0",
    inner: "relative flex h-full flex-col gap-3 px-5 pt-16 pb-4 xl:block xl:gap-0 xl:p-0",
    back: "self-start text-sm xl:absolute xl:top-20 xl:left-8",
    header: "flex items-end justify-between gap-4 xl:contents",
    counter: "xl:absolute xl:top-[44%] xl:left-8 xl:-translate-y-1/2",
    title: "text-right xl:absolute xl:top-[44%] xl:right-8 xl:max-w-[18vw] xl:-translate-y-1/2",
    lens: "mx-auto w-[min(100%,calc(36svh*1.6))] shrink-0 xl:absolute xl:top-[44%] xl:left-1/2 xl:w-[min(58vw,calc((100svh-18rem)*1.6))] xl:-translate-x-1/2 xl:-translate-y-1/2",
    wheel: "h-28 shrink-0 xl:absolute xl:inset-x-0 xl:bottom-6 xl:h-36",
    details: "min-h-0 flex-1 overflow-y-auto xl:absolute xl:right-8 xl:bottom-8 xl:w-72 xl:flex-none xl:overflow-visible",
  },
  embedded: {
    root: "relative flex flex-1 flex-col",
    inner: "relative flex flex-1 flex-col gap-3 px-4 pb-4",
    back: "",
    header: "flex items-end justify-between gap-4",
    counter: "",
    title: "text-right",
    lens: "mx-auto w-[min(100%,calc(36svh*1.6))] shrink-0",
    wheel: "h-24 shrink-0",
    details: "flex-1",
  },
} as const;

/** Wheel / swipe / keyboard stepped gallery: a lens with the active media and a snap wheel of thumbnails. */
export function SnapWheelGallery({ projects, mode = "page", className }: SnapWheelGalleryProps) {
  const [index, setIndex] = useState(0);
  const locale = useLocale();
  const galleryText = useLocalized(galleryLabels);
  const reduced = useReducedMotion();
  const lenis = useLenisInstance();
  const rootRef = useRef<HTMLElement>(null);
  const indexRef = useRef(0);
  const lockUntil = useRef(0);
  const touch = useRef<{ x: number; y: number; inScroll: boolean } | null>(null);

  const page = mode === "page";
  const count = projects.length;
  const cooldown = reduced ? cfg.reducedCooldownMs : cfg.cooldownMs;
  const classes = layout[mode];

  const goTo = useCallback(
    (next: number) => {
      if (next < 0 || next >= count || next === indexRef.current) return false;
      indexRef.current = next;
      setIndex(next);
      return true;
    },
    [count],
  );

  /** One step in `dir`, ignored while the cooldown of the previous step runs. */
  const step = useCallback(
    (dir: 1 | -1) => {
      const now = performance.now();
      if (now < lockUntil.current) return;
      if (goTo(indexRef.current + dir)) lockUntil.current = now + cooldown;
    },
    [goTo, cooldown],
  );

  // Page mode: own the wheel and the keyboard; the document must not scroll.
  useEffect(() => {
    if (!page) return;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    const prevOverscroll = root.style.overscrollBehavior;
    root.style.overflow = "hidden";
    root.style.overscrollBehavior = "none";
    lenis?.stop();

    let accum = 0;
    let lastTime = 0;
    let lastMag = 0;

    const onWheel = (event: WheelEvent) => {
      const area = (event.target as Element | null)?.closest?.(SCROLL_AREA);
      if (area && area.scrollHeight > area.clientHeight) return; // let the details panel scroll
      event.preventDefault();
      if (event.ctrlKey) return;

      let delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (event.deltaMode === 1) delta *= 16;
      else if (event.deltaMode === 2) delta *= window.innerHeight;

      const now = performance.now();
      const mag = Math.abs(delta);
      const gap = now - lastTime;
      // Trackpad inertia: a continuous, decaying tail of the previous gesture is not a new one.
      const inertiaTail = gap < cfg.wheelIdleMs && mag <= lastMag;
      lastTime = now;
      lastMag = mag;

      if (gap > cfg.wheelIdleMs) accum = 0;
      if (now < lockUntil.current || inertiaTail) {
        accum = 0;
        return;
      }
      accum += delta;
      if (Math.abs(accum) >= cfg.wheelThreshold) {
        step(accum > 0 ? 1 : -1);
        accum = 0;
      }
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") step(1);
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") step(-1);
      else return;
      event.preventDefault();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      root.style.overflow = prevOverflow;
      root.style.overscrollBehavior = prevOverscroll;
      lenis?.start();
    };
  }, [page, lenis, step]);

  function onTouchStart(event: React.TouchEvent) {
    const t = event.touches[0];
    touch.current = { x: t.clientX, y: t.clientY, inScroll: !!(event.target as Element).closest(SCROLL_AREA) };
  }

  function onTouchEnd(event: React.TouchEvent) {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const t = event.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    const horizontal = Math.abs(dx) >= Math.abs(dy);
    if (Math.max(Math.abs(dx), Math.abs(dy)) < cfg.swipeThreshold) return;
    // Embedded: horizontal only (vertical belongs to the page). Page: either axis, except
    // vertical drags that scroll the details panel.
    if (!page && (!horizontal || Math.abs(dx) < Math.abs(dy) * 1.2)) return;
    if (page && !horizontal && start.inScroll) return;
    step((horizontal ? dx : dy) < 0 ? 1 : -1);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (page) return; // handled on window
    if (event.key === "ArrowRight") step(1);
    else if (event.key === "ArrowLeft") step(-1);
  }

  const project = projects[index];
  const status = galleryText.status.replace("{current}", String(index + 1)).replace("{total}", String(count));

  return (
    <section
      ref={rootRef}
      aria-roledescription="carousel"
      aria-label={galleryText.galleryAria}
      data-reduced={reduced}
      data-lenis-prevent={page ? "" : undefined}
      tabIndex={page ? undefined : 0}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onKeyDown={onKeyDown}
      className={cn(
        "gallery-enter overflow-hidden bg-background text-foreground [touch-action:pan-y]",
        classes.root,
        className,
      )}
      style={
        {
          "--gallery-ms": cfg.transitionMs + "ms",
          "--gallery-ease": cfg.ease,
        } as React.CSSProperties
      }
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

      <div className={classes.inner}>
        {page && (
          <Link href={localizePath(locale, "/")} className={cn("inline-flex items-center gap-2 opacity-80 hover:opacity-100", classes.back)}>
            <span aria-hidden="true">←</span>
            {galleryText.backHome}
          </Link>
        )}

        <div className={classes.header}>
          <GalleryCounter index={index} count={count} separator={galleryText.counterSeparator} className={classes.counter} />
          <GalleryTitle project={project} className={classes.title} />
        </div>

        <div className={classes.lens}>
          <GalleryLens project={project} />
        </div>

        <div className={classes.wheel}>
          <GalleryWheel
            projects={projects}
            index={index}
            geometry={cfg.wheel[mode]}
            reduced={reduced}
            labels={galleryText}
            timing={cfg}
            onSelect={goTo}
          />
        </div>

        <div data-gallery-scroll className={classes.details}>
          <GalleryDetails project={project} />
        </div>

        {!page && (
          <GalleryNav
            previousLabel={galleryText.previous}
            nextLabel={galleryText.next}
            canPrevious={index > 0}
            canNext={index < count - 1}
            onPrevious={() => goTo(index - 1)}
            onNext={() => goTo(index + 1)}
          />
        )}
      </div>
    </section>
  );
}
