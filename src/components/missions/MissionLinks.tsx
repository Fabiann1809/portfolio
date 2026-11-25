"use client";

import { useState } from "react";
import { projectLabels as labelsContent } from "@/data/projects";
import { DemoDialog } from "./DemoDialog";
import { useLocalized } from "@/components/locale/LocaleProvider";
import type { Project } from "@/types";

/** GitHub / live site (Vercel) / APK links of a project, plus "Watch demo" when it has a video. */
export function MissionLinks({ project, className = "" }: { project: Project; className?: string }) {
  const projectLabels = useLocalized(labelsContent);
  const { links } = project;
  const [demoOpen, setDemoOpen] = useState(false);
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {project.video && (
        <>
          <button type="button" className="bracket-link text-emphasis" onClick={() => setDemoOpen(true)}>
            {projectLabels.watchDemo}
          </button>
          <DemoDialog
            open={demoOpen}
            onClose={() => setDemoOpen(false)}
            src={project.video}
            poster={project.image}
            title={project.title}
            closeLabel={projectLabels.closeDemo}
          />
        </>
      )}
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
      {links.release && (
        <a className="bracket-link" href={links.release} target="_blank" rel="noreferrer">
          {projectLabels.release}
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
