import { projects, projectsSectionId, projectsTitle } from "@/data/projects";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ProjectCard } from "@/components/ui/ProjectCard";

/** Simple stacked cards for small screens and reduced motion (no pin, no 3D). */
export function ProjectsStacked() {
  return (
    <section id={projectsSectionId} className="px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <SectionTitle>{projectsTitle}</SectionTitle>
        <ScrollReveal stagger className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
