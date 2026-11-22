"use client";

import type { CSSProperties } from "react";
import { projectLabels as labelsContent, projects as projectsContent } from "@/data/projects";
import { stack } from "@/data/stack";
import { useLocalized } from "@/components/locale/LocaleProvider";
import { ProjectMedia } from "@/components/gallery/ProjectMedia";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MissionLinks } from "./MissionLinks";
import { countOf } from "./format";

/** Sticky offset of each card (px) and the extra step so stacked cards peek out under the next one. */
const STICKY_TOP = 88;
const PEEK = 14;

/**
 * Library under the tunnel: one large card per project that sticks to the top while the next
 * card slides up and stacks over it. Full description, technologies with icons and every link.
 */
export function ProjectLibrary() {
  const labels = useLocalized(labelsContent);
  const projects = useLocalized(projectsContent);

  return (
    <div className="px-[var(--edge-x)] pt-24 pb-32">
      <SectionLabel trailing={countOf(projects.length)}>{labels.libraryHeading}</SectionLabel>
      <ol className="mt-10 flex flex-col gap-10">
        {projects.map((project, i) => (
          <li
            key={project.id}
            className="lg:sticky lg:top-[var(--sticky-top)]"
            style={{ "--sticky-top": `${STICKY_TOP + i * PEEK}px`, zIndex: i + 1 } as CSSProperties}
          >
            <article className="grid gap-6 rounded-2xl border border-line bg-surface p-5 shadow-[0_-12px_40px_-20px_var(--shadow-color)] md:p-8 lg:min-h-[min(72svh,640px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-12">
              <div className="flex flex-col gap-6">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="outline-num font-condensed text-[clamp(48px,6vw,96px)] leading-[0.8] font-black">
                    {countOf(i + 1)}
                  </span>
                  <span className="mono-label text-muted">
                    {project.collaborative ? labels.collaborative : labels.personal} / {project.year}
                  </span>
                </div>
                <h3 className="giant-title text-[clamp(32px,3.6vw,60px)]">{project.title}</h3>
                <p className="max-w-xl text-muted">{project.description}</p>
                <div>
                  <p className="mono-label text-muted">{labels.technologiesLabel}</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {project.technologies.map((name) => {
                      const icon = stack.find((item) => item.name === name || name.startsWith(item.name))?.icon;
                      return (
                        <li key={name} className="mono-label flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[11px]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          {icon && <img src={icon} alt="" width={16} height={16} />}
                          <span>{name}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <MissionLinks project={project} className="mt-auto" />
              </div>
              <div className="relative order-first aspect-[16/10] overflow-hidden rounded-xl border border-line bg-background lg:order-none lg:aspect-auto lg:min-h-full">
                <ProjectMedia project={project} alt={project.title} />
              </div>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
