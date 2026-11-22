"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "@/data/motion";
import { projectLabels as labelsContent, projects as projectsContent } from "@/data/projects";
import { useLocalized } from "@/components/locale/LocaleProvider";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { WorkCard } from "./WorkCard";
import { WorkDetails } from "./WorkDetails";

const cfg = motion.gallery;
const DRAG_START_PX = 8;

/** Shortest signed distance from `active` to `i` on a loop of `n` items. */
const loopOffset = (i: number, active: number, n: number) => {
  const half = Math.floor(n / 2);
  return ((((i - active + half) % n) + n) % n) - half;
};

/**
 * "Work gallery": 3D coverflow of every project with the active one's details underneath.
 * Click a side card, use the arrows / dots / left-right keys, or swipe. Autoplay pauses on hover, focus and interaction.
 */
export function WorkGallery() {
  const labels = useLocalized(labelsContent);
  const projects = useLocalized(projectsContent);
  const count = projects.length;
  const reduced = useReducedMotion();
  const compact = useMediaQuery("(max-width: 767px)");
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const drag = useRef({ id: -1, startX: 0, dx: 0, moved: false });

  const go = (index: number) => {
    setInteracted(true);
    setActive(((index % count) + count) % count);
  };
  const step = (dir: number) => go(active + dir);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    io.observe(root);
    return () => io.disconnect();
  }, []);

  const paused = reduced || hovered || focused || interacted || !inView;
  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % count), cfg.autoplayMs);
    return () => window.clearInterval(id);
  }, [paused, count]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    }
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    drag.current = { id: event.pointerId, startX: event.clientX, dx: 0, moved: false };
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (d.id !== event.pointerId) return;
    d.dx = event.clientX - d.startX;
    if (!d.moved && Math.abs(d.dx) > DRAG_START_PX) {
      d.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };
  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (d.id !== event.pointerId) return;
    d.id = -1;
    if (Math.abs(d.dx) >= cfg.swipePx) step(d.dx < 0 ? 1 : -1);
  };
  // A drag must not count as a click on a side card.
  const onClickCapture = (event: React.MouseEvent) => {
    if (drag.current.moved) {
      event.stopPropagation();
      event.preventDefault();
      drag.current.moved = false;
    }
  };

  const navButton =
    "flex size-11 items-center justify-center rounded-full border border-line bg-surface/80 text-foreground backdrop-blur-sm transition-colors hover:border-emphasis hover:text-emphasis focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emphasis";

  return (
    <section
      ref={rootRef}
      id="work"
      aria-label={labels.galleryAria}
      className="overflow-x-clip px-[var(--edge-x)] pt-24 pb-32"
    >
      <header className="max-w-2xl">
        <p className="mono-label text-emphasis">{labels.galleryEyebrow}</p>
        <h2 className="giant-title mt-3 text-[clamp(36px,6vw,88px)]">{labels.galleryTitle}</h2>
        <p className="mt-4 text-muted">{labels.gallerySubtitle}</p>
      </header>

      <div
        role="group"
        aria-roledescription="carousel"
        aria-label={labels.galleryAria}
        tabIndex={0}
        className="mt-10 rounded-2xl outline-offset-8 focus-visible:outline-2 focus-visible:outline-emphasis md:mt-14"
        onKeyDown={onKeyDown}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <div
          className="relative touch-pan-y py-6 select-none md:py-10"
          style={{ perspective: reduced ? undefined : cfg.perspective + "px" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
        >
          <div className="relative mx-auto w-[78vw] max-w-[600px] md:w-[min(40vw,600px,calc(42svh*1.6))]">
            <div className="aspect-[16/10]" aria-hidden="true" />
            {projects.map((project, i) => (
              <WorkCard
                key={project.id}
                project={project}
                offset={loopOffset(i, active, count)}
                compact={compact}
                reduced={reduced}
                selectLabel={labels.goTo}
                onSelect={() => go(i)}
              />
            ))}
          </div>
        </div>

        <div className="mt-2 flex items-center justify-center gap-4">
          <button type="button" className={navButton} aria-label={labels.prev} onClick={() => step(-1)}>
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <ul aria-label={labels.dotsAria} className="flex items-center">
            {projects.map((project, i) => (
              <li key={project.id}>
                <button
                  type="button"
                  aria-label={`${labels.goTo} ${project.title}`}
                  aria-current={i === active ? "true" : undefined}
                  className="group flex size-6 items-center justify-center"
                  onClick={() => go(i)}
                >
                  <span
                    className={
                      "block h-2 rounded-full transition-[width,background-color] duration-300 " +
                      (i === active ? "w-6 bg-emphasis" : "w-2 bg-foreground/25 group-hover:bg-foreground/50")
                    }
                  />
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className={navButton} aria-label={labels.next} onClick={() => step(1)}>
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div aria-live="polite">
        <WorkDetails key={projects[active].id} project={projects[active]} />
      </div>
    </section>
  );
}
