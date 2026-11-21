import type { Project } from "@/types";
import { projectLabels } from "@/data/projects";
import { Card } from "./Card";
import { LinkButton } from "./Button";

export function ProjectCard({ project }: { project: Project }) {
  const { links } = project;
  return (
    <Card className="flex flex-col gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={project.image} alt={project.title} className="aspect-video w-full object-cover" />
      <h3 className="text-xl font-semibold">{project.title}</h3>
      {project.collaborative && <span className="text-xs uppercase opacity-70">{projectLabels.collaborative}</span>}
      <p className="text-sm">{project.description}</p>
      <ul className="flex flex-wrap gap-2 text-xs">
        {project.technologies.map((tech) => (
          <li key={tech} className="rounded border border-current/30 px-2 py-0.5">
            {tech}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap gap-2">
        <LinkButton href={links.github} target="_blank" rel="noreferrer">{projectLabels.github}</LinkButton>
        {links.vercel && (
          <LinkButton href={links.vercel} target="_blank" rel="noreferrer">{projectLabels.demo}</LinkButton>
        )}
        {links.download && <LinkButton href={links.download} download>{projectLabels.download}</LinkButton>}
      </div>
    </Card>
  );
}
