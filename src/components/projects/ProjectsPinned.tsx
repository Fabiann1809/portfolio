"use client";

import { useEffect, useRef } from "react";
import { featuredProjects as projects, projectsSectionId, projectsTitle } from "@/data/projects";
import { getJourneyState, registerTrack } from "@/lib/journey";
import { chapterScreens, clamp01 } from "@/lib/journeyModel";
import { useJourneyFrame } from "@/hooks/useJourneyFrame";
import { useScrollTo } from "@/hooks/useScrollTo";
import { ProjectIndex } from "./ProjectIndex";
import { ProjectInfo } from "./ProjectInfo";
import { ViewAllLink } from "@/components/gallery/ViewAllLink";

const { first, count } = chapterScreens(projectsSectionId);
/** Distance (in screens) over which the HUD fades in/out around the projects stream. */
const HUD_FADE = 0.45;
/** Distance (in screens) over which a project panel cross-fades. */
const INFO_FADE = 0.4;

/**
 * Tall section with a sticky full-viewport inner: the scroll track of the projects stream.
 * The screens are drawn by the shared canvas; this component only owns the overlay (title,
 * index, per-project panel), updated every frame through refs - no React state.
 */
export function ProjectsPinned() {
  const sectionRef = useRef<HTMLElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const scrollTo = useScrollTo();

  useEffect(() => {
    const el = sectionRef.current;
    return el ? registerTrack("stream", el, Math.max(0, count - 1)) : undefined;
  }, []);

  useJourneyFrame(() => {
    const hud = hudRef.current;
    if (!hud) return;
    const g = getJourneyState().stream;

    const outside = Math.max(first - g, g - (first + count - 1), 0);
    const hudOpacity = 1 - clamp01(outside / HUD_FADE);
    hud.style.opacity = String(hudOpacity);
    hud.style.visibility = hudOpacity < 0.01 ? "hidden" : "visible";

    const active = Math.min(count - 1, Math.max(0, Math.round(g - first)));
    hud.querySelectorAll<HTMLElement>("[data-index-item]").forEach((item, i) => {
      const on = String(i === active);
      if (item.dataset.active !== on) item.dataset.active = on;
    });
    const viewAll = hud.querySelector<HTMLElement>("[data-view-all]");
    if (viewAll) {
      const o = (count > 1 ? clamp01(g - first - (count - 2)) : 1) * hudOpacity;
      viewAll.style.opacity = String(o);
      const hidden = o < 0.5;
      if (viewAll.inert !== hidden) viewAll.inert = hidden;
    }
    hud.querySelectorAll<HTMLElement>("[data-project-info]").forEach((info, i) => {
      const o = clamp01(1 - Math.abs(g - (first + i)) / INFO_FADE) * hudOpacity;
      info.style.opacity = String(o);
      info.style.transform = `translateY(${(1 - o) * 24}px)`;
      const hidden = o < 0.5;
      if (info.inert !== hidden) info.inert = hidden;
      info.setAttribute("aria-hidden", String(hidden));
    });
  });

  function handleSelect(index: number) {
    const el = sectionRef.current;
    if (el) scrollTo(el, { offset: index * window.innerHeight, nav: false });
  }

  return (
    <section
      ref={sectionRef}
      id={projectsSectionId}
      className="relative"
      style={{ height: projects.length * 100 + "vh" }}
    >
      <div ref={hudRef} className="sticky top-0 h-screen overflow-hidden px-8">
        <p className="absolute top-20 left-8 font-mono text-xs tracking-[0.4em] uppercase opacity-70">
          {projectsTitle}
        </p>
        <div className="absolute top-1/2 left-8 -translate-y-1/2">
          <ProjectIndex projects={projects} onSelect={handleSelect} />
        </div>
        <div data-view-all className="absolute bottom-12 left-8" style={{ opacity: 0 }}>
          <ViewAllLink />
        </div>
        <div className="absolute right-8 bottom-12 h-64 w-full max-w-sm">
          {projects.map((project) => (
            <ProjectInfo key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
