import { projectLabels } from "@/data/projects";
import type { Project } from "@/types";

/** GitHub / demo (Vercel) / APK links of a project. */
export function MissionLinks({ project, className = "" }: { project: Project; className?: string }) {
  const { links } = project;
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <a className="bracket-link" href={links.github} target="_blank" rel="noreferrer">
        {projectLabels.github}
      </a>
      {links.vercel && (
        <a className="bracket-link" href={links.vercel} target="_blank" rel="noreferrer">
          {projectLabels.demo}
        </a>
      )}
      {links.download && (
        <a className="bracket-link" href={links.download} download>
          {projectLabels.download}
        </a>
      )}
    </div>
  );
}
