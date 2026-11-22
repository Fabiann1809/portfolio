"use client";

import { projectLabels as labelsContent, projects as projectsContent } from "@/data/projects";
import { useLocalized } from "@/components/locale/LocaleProvider";
import { MissionFrame } from "./MissionFrame";
import { MissionLinks } from "./MissionLinks";
import { MissionMeta } from "./MissionMeta";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ViewAllLink } from "@/components/gallery/ViewAllLink";
import { codeOf, countOf } from "./format";

/** Stacked mission cards: mobile and reduced-motion layout of the projects section. */
export function MissionList() {
  const projects = useLocalized(projectsContent);
  const projectLabels = useLocalized(labelsContent);
  return (
    <div className="px-[var(--edge-x)] py-24">
      <SectionLabel trailing={`${countOf(projects.length)} ${projectLabels.countLabel}`}>{projectLabels.heading}</SectionLabel>
      <ul className="mt-10 flex flex-col gap-14">
        {projects.map((project, i) => (
          <li key={project.id}>
            <ScrollReveal className="flex flex-col gap-5">
              <MissionFrame project={project} code={codeOf(projectLabels.codePrefix, i)} />
              <span aria-hidden="true" className="outline-num font-condensed text-6xl leading-none font-black">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="giant-title text-[clamp(40px,11vw,72px)]">{project.title}</h3>
              <MissionMeta project={project} />
              <p className="max-w-xl text-sm text-muted">{project.description}</p>
              <MissionLinks project={project} />
            </ScrollReveal>
          </li>
        ))}
      </ul>
      <ViewAllLink className="mt-12" />
    </div>
  );
}
