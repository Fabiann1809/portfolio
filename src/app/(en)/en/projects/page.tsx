import type { Metadata } from "next";
import { ProjectsPage } from "@/components/pages/ProjectsPage";
import { galleryLabels } from "@/data/gallery";

export const metadata: Metadata = {
  title: galleryLabels.en.pageTitle,
  description: galleryLabels.en.pageDescription,
};

export default function Projects() {
  return <ProjectsPage locale="en" />;
}
