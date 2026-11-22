"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "@/data/motion";
import { projectLabels as labelsContent, projects as projectsContent } from "@/data/projects";
import { useLocalized } from "@/components/locale/LocaleProvider";
import { useLenisInstance } from "@/components/layout/SmoothScroll";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { WorkCard } from "./WorkCard";
import { WorkDetails } from "./WorkDetails";
import { SectionTitle } from "@/components/ui/SectionTitle";

const cfg = motion.gallery;

/**
 * "Work gallery": 3D coverflow of every project with the active one's details underneath.
 * The section is pinned (sticky stage) and page scroll advances the active project; clicking a
 * side card, a segment or the arrow keys scrolls to that project. With reduced motion there is
 * no pinning and navigation changes the state directly.
 */
export function WorkGallery() {
  const labels = useLocalized(labelsContent);
  const projects = useLocalized(projectsContent);
  const count = projects.length;
  const reduced = useReducedMotion();
  const compact = useMediaQuery("(max-width: 767px)");
  const lenis = useLenisInstance();
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLElement>(null);

  // Scroll -> active project (rAF-throttled, passive).
  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const root = rootRef.current;
      if (!root) return;
      const rect = root.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      const progress = range > 0 ? Math.min(1, Math.max(0, -rect.top / range)) : 0;
      const next = Math.min(count - 1, Math.floor(progress * count));
      setActive((current) => (current === next ? current : next));
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
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced, count]);

  const go = useCallback(
    (index: number) => {
      const target = Math.min(count - 1, Math.max(0, index));
      const root = rootRef.current;
      if (reduced || !root) {
        setActive(target);
        return;
      }
      const range = root.offsetHeight - window.innerHeight;
      const top = window.scrollY + root.getBoundingClientRect().top + ((target + 0.5) / count) * range;
      // Lenis owns the scroll position (native smooth behaviour is disabled while it runs).
      if (lenis) lenis.scrollTo(top);
      else window.scrollTo({ top, behavior: "smooth" });
    },
    [count, reduced, lenis],
  );

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(active - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      go(active + 1);
    }
  };

  return (
    <section
      ref={rootRef}
      id="work"
      aria-label={labels.galleryAria}
      className="section-glow glow-left overflow-x-clip"
      style={reduced ? undefined : { height: `calc(100svh + ${count * cfg.scrollVh}svh)` }}
    >
      <div
        className={
          "flex flex-col px-[var(--edge-x)] " +
          (reduced ? "pt-20 pb-24" : "sticky top-0 h-svh justify-center overflow-y-clip pt-20 pb-4 md:pt-24")
        }
      >
        <header className="max-w-3xl">
          <SectionTitle>{labels.galleryTitle}</SectionTitle>
          <p className="mt-2 font-sans text-sm text-muted md:mt-4 md:text-base">{labels.gallerySubtitle}</p>
        </header>

        <div
          role="group"
          aria-roledescription="carousel"
          aria-label={labels.galleryAria}
          tabIndex={0}
          className="mt-2 rounded-2xl outline-offset-8 focus-visible:outline-2 focus-visible:outline-emphasis md:mt-4"
          onKeyDown={onKeyDown}
        >
          <div className="relative py-3 select-none md:py-5" style={{ perspective: reduced ? undefined : cfg.perspective + "px" }}>
            <div className="relative mx-auto w-[70vw] max-w-[490px] md:w-[min(32vw,490px,calc(30svh*1.6))]">
              <div className="aspect-[16/10]" aria-hidden="true" />
              {projects.map((project, i) => (
                <WorkCard
                  key={project.id}
                  project={project}
                  offset={i - active}
                  compact={compact}
                  reduced={reduced}
                  selectLabel={labels.goTo}
                  onSelect={() => go(i)}
                />
              ))}
            </div>
          </div>

          {/* Indicator: counter + one segment per project; segments up to the active one are filled. */}
          <div className="mx-auto mt-1 flex w-[min(88vw,520px)] items-center gap-4">
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
                      <span
                        className={
                          "absolute inset-0 origin-left transition-transform duration-300 " +
                          (i === active ? "bg-emphasis" : "bg-emphasis/50")
                        }
                        style={{ transform: `scaleX(${i <= active ? 1 : 0})` }}
                      />
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
      </div>
    </section>
  );
}
