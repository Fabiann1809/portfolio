import { featuredProjects, projectsSectionId, projectsTitle } from "@/data/projects";
import { SnapWheelGallery } from "@/components/gallery/SnapWheelGallery";
import { ViewAllLink } from "@/components/gallery/ViewAllLink";

/** Flow-layout projects (mobile / reduced motion / no WebGL): embedded gallery of featured projects. */
export function ProjectsEmbedded() {
  return (
    <section id={projectsSectionId} className="flex min-h-svh flex-col bg-background text-foreground">
      <h2 className="px-4 pt-20 pb-3 font-display text-sm font-bold tracking-[0.3em] uppercase opacity-80">{projectsTitle}</h2>
      <SnapWheelGallery projects={featuredProjects} mode="embedded" />
      <div className="flex justify-center px-4 pb-8">
        <ViewAllLink />
      </div>
    </section>
  );
}
