import { placeholderGradient } from "@/lib/gradient";
import type { Project } from "@/types";

interface ProjectMediaProps {
  project: Project;
  /** Alt text for the image; empty (decorative) by default. */
  alt?: string;
}

/** The project image, or a deterministic gradient placeholder when it has none. */
export function ProjectMedia({ project, alt = "" }: ProjectMediaProps) {
  if (project.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={project.image} alt={alt} draggable={false} className="size-full object-cover" />;
  }
  return <div aria-hidden="true" className="size-full" style={{ backgroundImage: placeholderGradient(project.id) }} />;
}
