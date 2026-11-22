import type { Metadata } from "next";
import { ProjectsPage } from "@/components/pages/ProjectsPage";
import { galleryLabels } from "@/data/gallery";

export const metadata: Metadata = {
  title: galleryLabels.es.pageTitle,
  description: galleryLabels.es.pageDescription,
};

export default function Projects() {
  return <ProjectsPage locale="es" />;
}
