import { featuredProjects, projectsSectionId, projectsTitle } from "@/data/projects";
import { SnapWheelGallery } from "@/components/gallery/SnapWheelGallery";
import { ViewAllLink } from "@/components/gallery/ViewAllLink";

/** Flow-layout projects (mobile / reduced motion / no WebGL): embedded gallery of featured projects. */
export function ProjectsEmbedded() {
  return (
    <section id={projectsSectionId} className="flex min-h-svh flex-col bg-neutral-950 text-neutral-100">
      <h2 className="px-4 pt-20 pb-3 font-mono text-xs tracking-[0.4em] uppercase opacity-70">{projectsTitle}</h2>
      <SnapWheelGallery projects={featuredProjects} mode="embedded" />
      <div className="flex justify-center px-4 pb-8">
        <ViewAllLink />
      </div>
    </section>
  );
}
