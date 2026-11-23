"use client";

import { projectLabels as labelsContent } from "@/data/projects";
import { stack } from "@/data/stack";
import { useLocalized } from "@/components/locale/LocaleProvider";
import type { Project } from "@/types";
import { MissionLinks } from "./MissionLinks";

/** Text under the coverflow for the active project. Remount with a `key` to replay the entry animation. */
export function WorkDetails({ project }: { project: Project }) {
  const labels = useLocalized(labelsContent);
  return (
    <div className="work-details-in mx-auto mt-3 flex max-w-3xl flex-col items-center gap-1.5 md:gap-2.5 text-center md:mt-6">
      <h3 className="giant-title text-[22px] md:text-[clamp(24px,2.6vw,38px)]">{project.title}</h3>
      <p className="max-w-2xl text-xs leading-snug text-muted md:text-sm">{project.description}</p>
      <p className="mono-label text-[10px] text-muted">
        {project.collaborative ? labels.collaborative : labels.personal} / {project.year}
      </p>
      <ul aria-label={labels.technologiesLabel} className="flex flex-wrap justify-center gap-1.5 md:gap-2">
        {project.technologies.map((name) => {
          const icon = stack.find((item) => item.name === name || name.startsWith(item.name))?.icon;
          return (
            <li key={name} className="mono-label flex items-center gap-2 rounded-full border border-line px-2 py-0.5 text-[9px] md:px-2.5 md:py-1 md:text-[10px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {icon && <img src={icon} alt="" width={14} height={14} />}
              <span>{name}</span>
            </li>
          );
        })}
      </ul>
      <MissionLinks project={project} className="justify-center" />
    </div>
  );
}
