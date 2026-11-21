import type { Project, ProjectLabels } from "@/types";

// PLACEHOLDER content. Technologies: frameworks/libraries only.
export const projectsTitle = "Proyectos";
/** Display title of the left overlay while the projects stream is on screen (words stack on lines). PLACEHOLDER copy. */
export const projectsSideTitle = "Trabajo seleccionado";
/** Must match the id of the Projects section (and the navigation entry). */
export const projectsSectionId = "projects";

export const projectLabels: ProjectLabels = {
  collaborative: "Colaborativo",
  github: "GitHub",
  demo: "Demo",
  download: "Descargar",
  indexAriaLabel: "Ir al proyecto",
};

const make = (
  n: number,
  featured: boolean,
  collaborative: boolean,
  technologies: string[],
): Project => ({
  id: `project-${n}`,
  title: `Proyecto de ejemplo ${n}`,
  description: `PLACEHOLDER: descripción del proyecto ${n}.`,
  technologies,
  collaborative,
  featured,
  links: {
    github: "https://github.com/",
    ...(n % 2 === 1 ? { vercel: "https://vercel.com/" } : { download: `/downloads/project-${n}.zip` }),
  },
});

export const projects: Project[] = [
  make(1, true, false, ["Next.js", "Tailwind CSS"]),
  make(2, true, true, ["React", "Express"]),
  make(3, false, false, ["Vue", "Pinia"]),
  make(4, true, false, ["Next.js", "Prisma"]),
  make(5, false, true, ["React", "Redux"]),
  make(6, true, false, ["Astro", "Tailwind CSS"]),
  make(7, false, false, ["SvelteKit"]),
  make(8, false, true, ["NestJS", "React Query"]),
];

/** Projects shown in the home journey. */
export const featuredProjects: Project[] = projects.filter((project) => project.featured);
