import type { Localized, Social } from "@/types";

export const socials: Social[] = [
  { id: "github", label: "GitHub", url: "https://github.com/Fabiann1809" },
  { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/leider-fabian-chipu-erazo-971319368/" },
];

export interface FooterContent {
  text: string;
  /** Short statement shown big on the left, one entry per line. */
  taglineLines: string[];
  quickLinksTitle: string;
  contactTitle: string;
}

export const footer: Localized<FooterContent> = {
  es: {
    text: "© 2026 Fabian. Hecho con Next.js y Tailwind CSS",
    taglineLines: ["Software que", "piensa, aprende", "y resuelve."],
    quickLinksTitle: "/Enlaces",
    contactTitle: "/Contacto",
  },
  en: {
    text: "© 2026 Fabian. Built with Next.js and Tailwind CSS",
    taglineLines: ["Software that", "thinks, learns", "and solves."],
    quickLinksTitle: "/Quick links",
    contactTitle: "/Contact",
  },
};
