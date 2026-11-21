import type { Project, ProjectLabels } from "@/types";

// PLACEHOLDER content. Technologies: frameworks/libraries only.
export const projectsTitle = "Proyectos";
/** Must match the id of the Projects section (and the navigation entry). */
export const projectsSectionId = "projects";

export const projectLabels: ProjectLabels = {
  collaborative: "Colaborativo",
  github: "GitHub",
  demo: "Demo",
  download: "Descargar",
  indexAriaLabel: "Ir al proyecto",
};

export const projects: Project[] = [
  {
    id: "project-1",
    title: "Proyecto de ejemplo 1",
    description: "PLACEHOLDER: descripción del proyecto.",
    technologies: ["Next.js", "Tailwind CSS"],
    collaborative: false,
    links: { github: "https://github.com/", vercel: "https://vercel.com/" },
    image: "/images/project-1.png",
  },
  {
    id: "project-2",
    title: "Proyecto de ejemplo 2",
    description: "PLACEHOLDER: descripción del proyecto colaborativo.",
    technologies: ["React", "Express"],
    collaborative: true,
    links: { github: "https://github.com/", download: "/downloads/project-2.zip" },
    image: "/images/project-2.png",
  },
];
