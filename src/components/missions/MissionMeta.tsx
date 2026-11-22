"use client";

import { projectLabels as labelsContent } from "@/data/projects";
import { useLocalized } from "@/components/locale/LocaleProvider";
import type { Project } from "@/types";

/** Meta line: stack / client (or "collaborated") / year. */
export function MissionMeta({ project, className = "" }: { project: Project; className?: string }) {
  const projectLabels = useLocalized(labelsContent);
  const parts = [
    project.technologies.join(", "),
    project.collaborative ? projectLabels.collaborative : (project.client ?? ""),
    project.year,
  ].filter(Boolean);
  return (
    <p className={`mono-label flex flex-wrap gap-x-4 gap-y-1 opacity-80 ${className}`}>
      {parts.map((part, i) => (
        <span key={i} className="flex gap-4 whitespace-nowrap">
          {i > 0 && (
            <span aria-hidden="true" className="text-emphasis">
              /
            </span>
          )}
          <span className="whitespace-normal">{part}</span>
        </span>
      ))}
    </p>
  );
}
