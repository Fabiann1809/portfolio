"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "@/data/motion";
import { projectLabels as labelsContent, projects as projectsContent } from "@/data/projects";
import { useLocalized } from "@/components/locale/LocaleProvider";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { WorkCard } from "./WorkCard";
import { WorkDetails } from "./WorkDetails";
import { SectionTitle } from "@/components/ui/SectionTitle";

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


  return (
    <section
      ref={rootRef}
      id="work"
      aria-label={labels.galleryAria}
      className="overflow-x-clip px-[var(--edge-x)] pt-20 pb-24"
    >
      <header className="max-w-3xl">
        <SectionTitle>{labels.galleryTitle}</SectionTitle>
        <p className="mt-4 font-sans text-muted">{labels.gallerySubtitle}</p>
      </header>

      <div
        role="group"
        aria-roledescription="carousel"
        aria-label={labels.galleryAria}
        tabIndex={0}
        className="mt-4 rounded-2xl outline-offset-8 focus-visible:outline-2 focus-visible:outline-emphasis md:mt-6"
        onKeyDown={onKeyDown}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <div
          className="relative touch-pan-y py-4 select-none md:py-6"
          style={{ perspective: reduced ? undefined : cfg.perspective + "px" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
        >
          <div className="relative mx-auto w-[78vw] max-w-[520px] md:w-[min(34vw,520px,calc(34svh*1.6))]">
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

        {/* Touch-only swipe hint; fades away after the first interaction. */}
        <p
          aria-hidden="true"
          className={
            "mono-label mx-auto mb-1 hidden w-fit items-center gap-2 text-[10px] text-muted transition-opacity duration-500 [@media(hover:none)]:flex " +
            (interacted ? "opacity-0" : "opacity-100")
          }
        >
          <span className="swipe-hint-arrow" aria-hidden="true">←</span>
          {labels.swipeHint}
          <span className="swipe-hint-arrow" aria-hidden="true">→</span>
        </p>
        {/* Indicator: counter + one segment per project; the active one fills while autoplay counts down. */}
        <div className="mx-auto mt-2 flex w-[min(88vw,520px)] items-center gap-4">
          <p className="font-sans text-sm font-semibold tabular-nums" aria-hidden="true">
            <span className="text-emphasis">{String(active + 1).padStart(2, "0")}</span>
            <span className="text-muted"> / {String(count).padStart(2, "0")}</span>
          </p>
          <ul aria-label={labels.dotsAria} className="flex flex-1 items-center gap-1.5">
            {projects.map((project, i) => (
              <li key={project.id} className="flex-1">
                <button
                  type="button"
                  aria-label={`${labels.goTo} ${project.title}`}
                  aria-current={i === active ? "true" : undefined}
                  className="group block w-full cursor-pointer py-2"
                  onClick={() => go(i)}
                >
                  <span className="relative block h-1 overflow-hidden rounded-full bg-foreground/15 transition-colors group-hover:bg-foreground/30">
                    {i < active && <span className="absolute inset-0 bg-emphasis/50" />}
                    {i === active && (
                      <span
                        key={`${active}-${paused}`}
                        className={"work-progress absolute inset-0 origin-left bg-emphasis" + (paused ? " is-paused" : "")}
                        style={{ animationDuration: cfg.autoplayMs + "ms" }}
                      />
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div aria-live="polite">
        <WorkDetails key={projects[active].id} project={projects[active]} />
      </div>
    </section>
  );
}
