export interface ProjectRepo {
  /** Role of the repository (e.g. "Frontend"). */
  label: string;
  url: string;
}

export interface ProjectLinks {
  /** Main repository (or organization when the project spans several). */
  github: string;
  /** Several repositories, labelled by role; replaces the single GitHub link when present. */
  repos?: ProjectRepo[];
  /** Live demo (Vercel). */
  vercel?: string;
  /** APK download. */
  download?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  /** Frameworks and libraries only, never bare languages. */
  technologies: string[];
  collaborative: boolean;
  /** Client name shown in the meta line when the project is not collaborative. */
  client?: string;
  year: string;
  links: ProjectLinks;
  /** Optional image path. Without it a generated gradient placeholder is shown. */
  image?: string;
  /** Optional demo video (muted loop); `image` is used as its poster. */
  video?: string;
}

export interface ProjectLabels {
  /** Heading of the home section ("// LABEL 0N COUNT"). */
  heading: string;
  countLabel: string;
  /** Prefix of the record codes (e.g. MSN gives MSN-01). */
  codePrefix: string;
  collaborative: string;
  github: string;
  demo: string;
  download: string;
  /** Accessible name of the progress ticks list. */
  progressAria: string;
}
