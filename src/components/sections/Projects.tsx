import { projects, projectsTitle } from "@/data/projects";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ProjectCard } from "@/components/ui/ProjectCard";

export function Projects() {
  return (
    <section id="projects" className="px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <SectionTitle>{projectsTitle}</SectionTitle>
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
