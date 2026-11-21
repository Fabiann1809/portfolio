export interface ProjectLinks {
  github: string;
  vercel?: string;
  download?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  /** Frameworks and libraries only, never bare languages. */
  technologies: string[];
  collaborative: boolean;
  /** Featured projects appear in the home journey; the gallery shows every project. */
  featured: boolean;
  links: ProjectLinks;
  /** Optional image path. Without it a generated gradient placeholder is shown. */
  image?: string;
}

export interface ProjectLabels {
  collaborative: string;
  github: string;
  demo: string;
  download: string;
  indexAriaLabel: string;
}
