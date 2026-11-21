import { projectLabels } from "@/data/projects";
import type { Project } from "@/types";

interface ProjectIndexProps {
  projects: Project[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

const pad = (n: number) => String(n + 1).padStart(2, "0");

/** Left rail: [01] [02] ... highlighting the active project. */
export function ProjectIndex({ projects, activeIndex, onSelect }: ProjectIndexProps) {
  return (
    <ol className="flex flex-col gap-3 font-mono text-sm">
      {projects.map((project, index) => {
        const active = index === activeIndex;
        return (
          <li key={project.id}>
            <button
              type="button"
              onClick={() => onSelect(index)}
              aria-current={active ? "true" : undefined}
              aria-label={`${projectLabels.indexAriaLabel} ${project.title}`}
              className={`transition-[opacity,color,transform] duration-500 ${
                active ? "text-primary translate-x-1 opacity-100" : "opacity-40 hover:opacity-70"
              }`}
            >
              [{pad(index)}]
            </button>
          </li>
        );
      })}
    </ol>
  );
}
