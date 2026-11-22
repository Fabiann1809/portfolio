"use client";

import { MissionTunnel } from "@/components/missions/MissionTunnel";
import { ProjectLibrary } from "@/components/missions/ProjectLibrary";
import { useMinWidth } from "@/hooks/useMinWidth";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Projects: pinned tunnel on md+ with motion allowed, then the stacked-card library with every detail. */
export function Projects() {
  const wide = useMinWidth(768);
  const reduced = useReducedMotion();
  return (
    <section id="projects">
      {wide && !reduced && <MissionTunnel />}
      <ProjectLibrary />
    </section>
  );
}
