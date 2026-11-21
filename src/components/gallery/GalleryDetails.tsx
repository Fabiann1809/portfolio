"use client";

import { useCrossfade } from "@/hooks/useCrossfade";
import { galleryConfig, galleryLabels } from "@/data/gallery";
import { projectLabels } from "@/data/projects";
import { LinkButton } from "@/components/ui/Button";
import type { Project } from "@/types";

function Details({ project }: { project: Project }) {
  const { links } = project;
  return (
    <>
      {project.collaborative && (
        <span className="mb-2 inline-block label rounded-full border border-foreground/30 px-2.5 py-0.5 text-xs">
          {projectLabels.collaborative}
        </span>
      )}
      <p className="text-sm leading-relaxed text-muted">{project.description}</p>
      <ul aria-label={galleryLabels.technologies} className="mt-3 flex flex-wrap gap-2 text-xs">
        {project.technologies.map((tech) => (
          <li key={tech} className="rounded border border-foreground/25 px-2 py-0.5">
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
    </>
  );
}

/** Description, technologies, collaborative badge and links of the active project; cross-fades. */
export function GalleryDetails({ project }: { project: Project }) {
  const { current, leaving } = useCrossfade(project, galleryConfig.transitionMs);
  return (
    <div className="grid">
      {leaving && (
        <div
          key={leaving.id}
          aria-hidden="true"
          inert
          className="gallery-fade-out pointer-events-none col-start-1 row-start-1"
        >
          <Details project={leaving} />
        </div>
      )}
      <article key={current.id} aria-label={current.title} className="gallery-fade-in col-start-1 row-start-1">
        <Details project={current} />
      </article>
    </div>
  );
}
