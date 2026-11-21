import { projectLabels } from "@/data/projects";
import type { Project } from "@/types";

/** GitHub / demo (Vercel) / APK links of a project. */
export function MissionLinks({ project, className = "" }: { project: Project; className?: string }) {
  const { links } = project;
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {(links.repos ?? [{ label: projectLabels.github, url: links.github }]).map((repo) => (
        <a key={repo.url} className="bracket-link" href={repo.url} target="_blank" rel="noreferrer">
          {repo.label}
        </a>
      ))}
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
