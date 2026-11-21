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
  links: ProjectLinks;
  image: string;
}

export interface ProjectLabels {
  collaborative: string;
  github: string;
  demo: string;
  download: string;
  indexAriaLabel: string;
}
