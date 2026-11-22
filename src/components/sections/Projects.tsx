"use client";

import { MissionTunnel } from "@/components/missions/MissionTunnel";
import { WorkGallery } from "@/components/missions/WorkGallery";
import { useHydrated } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Projects: pinned tunnel on every screen size (compact layout on phones) unless motion is reduced, and always the work gallery with every project. */
export function Projects() {
  const hydrated = useHydrated();
  const reduced = useReducedMotion();
  return (
    <section id="projects">
      {hydrated && !reduced && <MissionTunnel />}
      <WorkGallery />
    </section>
  );
}
