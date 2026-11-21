"use client";

import { usePinnedLayout } from "@/hooks/usePinnedLayout";
import { ProjectsPinned } from "@/components/projects/ProjectsPinned";
import { ProjectsEmbedded } from "@/components/projects/ProjectsEmbedded";

/** Pinned scroll-driven "Selected Work" on md+, embedded gallery on mobile / reduced motion. */
export function Projects() {
  const pinned = usePinnedLayout();
  return pinned ? <ProjectsPinned /> : <ProjectsEmbedded />;
}
