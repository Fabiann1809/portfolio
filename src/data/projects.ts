import type { Project, ProjectLabels } from "@/types";

// PLACEHOLDER content. Technologies: frameworks/libraries only.
/** Must match the id of the Projects section (and the navigation entry). */
export const projectsSectionId = "projects";

export const projectLabels: ProjectLabels = {
  heading: "Archivos de misión",
  countLabel: "registros",
  codePrefix: "MSN",
  collaborative: "Colaboré",
  github: "GitHub",
  demo: "Demo",
  download: "APK",
  progressAria: "Progreso de proyectos",
};

const make = (n: number, collaborative: boolean, technologies: string[]): Project => ({
  id: `project-${n}`,
  title: `Proyecto de ejemplo ${n}`,
  description: `PLACEHOLDER: descripción del proyecto ${n}.`,
  technologies,
  collaborative,
  ...(collaborative ? {} : { client: `Cliente ${n}` }),
  year: String(2026 - Math.floor(n / 3)),
  links: {
    github: "https://github.com/",
    ...(n % 2 === 1 ? { vercel: "https://vercel.com/" } : { download: `/downloads/project-${n}.apk` }),
  },
});

export const projects: Project[] = [
  make(1, false, ["Next.js", "Tailwind CSS"]),
  make(2, true, ["React", "Express"]),
  make(3, false, ["Vue", "Pinia"]),
  make(4, false, ["Next.js", "Prisma"]),
  make(5, true, ["React", "Redux"]),
  make(6, false, ["Astro", "Tailwind CSS"]),
  make(7, false, ["SvelteKit"]),
  make(8, true, ["NestJS", "React Query"]),
];
