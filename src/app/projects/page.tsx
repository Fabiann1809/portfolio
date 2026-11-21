import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { SnapWheelGallery } from "@/components/gallery/SnapWheelGallery";
import { galleryLabels } from "@/data/gallery";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: galleryLabels.pageTitle,
  description: galleryLabels.pageDescription,
};

export default function ProjectsPage() {
  return (
    <>
      <Navbar homeHref="/" />
      <main>
        <SnapWheelGallery projects={projects} mode="page" />
      </main>
    </>
  );
}
