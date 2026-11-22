import { Navbar } from "@/components/layout/Navbar";
import { SnapWheelGallery } from "@/components/gallery/SnapWheelGallery";
import { projects } from "@/data/projects";
import { localizePath } from "@/lib/locale";
import type { Locale } from "@/types";

/** Full-screen projects gallery in the given language. */
export function ProjectsPage({ locale }: { locale: Locale }) {
  return (
    <>
      <Navbar homeHref={localizePath(locale, "/")} />
      <main>
        <SnapWheelGallery projects={projects[locale]} mode="page" />
      </main>
    </>
  );
}
