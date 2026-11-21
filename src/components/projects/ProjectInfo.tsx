import { projectLabels } from "@/data/projects";
import type { Project } from "@/types";

/**
 * Text layer for one project, stacked in one grid cell with its siblings (left column, under the
 * index). Opacity/transform/inert are driven every frame by ProjectsPinned.
 */
export function ProjectInfo({ project }: { project: Project }) {
  const { links } = project;
  return (
    <div data-project-info className="project-info col-start-1 row-start-1" style={{ opacity: 0 }}>
      <h3 className="project-info__title">{project.title}</h3>
      {project.collaborative && <span className="project-info__meta">{projectLabels.collaborative}</span>}
      <p className="project-info__desc">{project.description}</p>
      <ul className="project-info__chips">
        {project.technologies.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>
      <div className="project-info__actions">
        <a className="bracket-btn" href={links.github} target="_blank" rel="noreferrer">
          [ {projectLabels.github} ]
        </a>
        {links.vercel && (
          <a className="bracket-btn" href={links.vercel} target="_blank" rel="noreferrer">
            [ {projectLabels.demo} ]
          </a>
        )}
        {links.download && (
          <a className="bracket-btn" href={links.download} download>
            [ {projectLabels.download} ]
          </a>
        )}
      </div>
    </div>
  );
}
