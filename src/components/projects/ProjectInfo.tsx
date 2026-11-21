import { projectLabels } from "@/data/projects";
import { LinkButton } from "@/components/ui/Button";
import type { Project } from "@/types";

/** Text layer for one project; fades and slides in when active, out when not. */
export function ProjectInfo({ project, active }: { project: Project; active: boolean }) {
  const { links } = project;
  return (
    <div
      inert={!active}
      aria-hidden={!active}
      className={`absolute right-0 bottom-0 w-full transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${
        active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <h3 className="text-2xl font-semibold">{project.title}</h3>
      {project.collaborative && (
        <span className="mt-1 block text-xs tracking-widest uppercase opacity-70">
          {projectLabels.collaborative}
        </span>
      )}
      <p className="mt-3 text-sm">{project.description}</p>
      <ul className="mt-3 flex flex-wrap gap-2 text-xs">
        {project.technologies.map((tech) => (
          <li key={tech} className="rounded border border-current/30 px-2 py-0.5">
            {tech}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        <LinkButton href={links.github} target="_blank" rel="noreferrer">{projectLabels.github}</LinkButton>
        {links.vercel && (
          <LinkButton href={links.vercel} target="_blank" rel="noreferrer">{projectLabels.demo}</LinkButton>
        )}
        {links.download && <LinkButton href={links.download} download>{projectLabels.download}</LinkButton>}
      </div>
    </div>
  );
}
