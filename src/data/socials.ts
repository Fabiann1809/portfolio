import type { Localized, Social } from "@/types";

export const socials: Social[] = [
  { id: "github", label: "GitHub", url: "https://github.com/Fabiann1809" },
  // PLACEHOLDER: replace with the real LinkedIn profile URL.
  { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/PLACEHOLDER" },
];

export const footer: Localized<{ text: string }> = {
  es: { text: "© 2026 Fabian. Hecho con Next.js y Tailwind CSS" },
  en: { text: "© 2026 Fabian. Built with Next.js and Tailwind CSS" },
};
