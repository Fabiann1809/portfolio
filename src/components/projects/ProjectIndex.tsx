import { projectLabels } from "@/data/projects";
import type { Project } from "@/types";

interface ProjectIndexProps {
  projects: Project[];
  onSelect: (index: number) => void;
}

const pad = (n: number) => String(n + 1).padStart(2, "0");

/**
 * Left rail: [01] [02] ... The active item is marked by the parent through the
 * `data-active` attribute (updated every frame, no React state).
 */
export function ProjectIndex({ projects, onSelect }: ProjectIndexProps) {
  return (
    <ol className="flex flex-col gap-3 font-mono text-sm">
      {projects.map((project, index) => (
        <li key={project.id}>
          <button
            type="button"
            data-index-item
            data-active={index === 0}
            onClick={() => onSelect(index)}
            aria-label={`${projectLabels.indexAriaLabel} ${project.title}`}
            className="opacity-40 transition-[opacity,transform] duration-500 hover:opacity-70 data-[active=true]:text-primary data-[active=true]:translate-x-1 data-[active=true]:opacity-100"
          >
            [{pad(index)}]
          </button>
        </li>
      ))}
    </ol>
  );
}
