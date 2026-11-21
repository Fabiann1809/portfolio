"use client";

import { useEffect, useRef, useState } from "react";
import { projects, projectsSectionId, projectsTitle } from "@/data/projects";
import { getSectionOffset, registerSection, subscribe } from "@/lib/scrollStore";
import { useScrollTo } from "@/hooks/useScrollTo";
import { ProjectIndex } from "./ProjectIndex";
import { ProjectInfo } from "./ProjectInfo";

/**
 * Tall section with a sticky full-viewport inner. The project screens themselves are drawn
 * by the shared background canvas, driven by this section's scroll offset in the scroll store.
 */
export function ProjectsPinned() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const scrollTo = useScrollTo();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const unregister = registerSection(projectsSectionId, el);
    const unsubscribe = subscribe(() => {
      const offset = getSectionOffset(projectsSectionId) ?? 0;
      setActive(Math.min(projects.length - 1, Math.max(0, Math.round(offset))));
    });
    return () => {
      unsubscribe();
      unregister();
    };
  }, []);

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
      <div className="sticky top-0 h-screen overflow-hidden px-8">
        <p className="absolute top-20 left-8 font-mono text-xs tracking-[0.4em] uppercase opacity-60">
          {projectsTitle}
        </p>
        <div className="absolute top-1/2 left-8 -translate-y-1/2">
          <ProjectIndex projects={projects} activeIndex={active} onSelect={handleSelect} />
        </div>
        <div className="absolute right-8 bottom-12 h-64 w-full max-w-sm">
          {projects.map((project, index) => (
            <ProjectInfo key={project.id} project={project} active={index === active} />
          ))}
        </div>
      </div>
    </section>
  );
}
