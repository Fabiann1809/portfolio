import { projectLabels } from "@/data/projects";
import type { Project } from "@/types";

interface ProjectIndexProps {
  projects: Project[];
  onSelect: (index: number) => void;
}

const pad = (n: number) => String(n + 1).padStart(2, "0");

/**
 * Left rail: "[01] PROJECT NAME" rows. The active row is marked by the parent through the
 * `data-active` attribute (updated every frame, no React state); css prefixes it with a bullet.
 */
export function ProjectIndex({ projects, onSelect }: ProjectIndexProps) {
  return (
    <ol className="side-index">
      {projects.map((project, index) => (
        <li key={project.id}>
          <button
            type="button"
            data-index-item
            data-active={index === 0}
            onClick={() => onSelect(index)}
            aria-label={`${projectLabels.indexAriaLabel} ${project.title}`}
          >
            <span aria-hidden="true">
              [{pad(index)}] {project.title}
            </span>
          </button>
        </li>
      ))}
    </ol>
  );
}
