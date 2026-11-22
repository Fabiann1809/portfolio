"use client";

import { MissionTunnel } from "@/components/missions/MissionTunnel";
import { ProjectLibrary } from "@/components/missions/ProjectLibrary";
import { useHydrated } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Projects: pinned tunnel on every screen size (compact layout on phones) unless motion is reduced, then the stacked-card library with every detail. */
export function Projects() {
  const hydrated = useHydrated();
  const reduced = useReducedMotion();
  return (
    <section id="projects">
      {hydrated && !reduced && <MissionTunnel />}
      <ProjectLibrary />
    </section>
  );
}
