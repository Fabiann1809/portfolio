"use client";

import { usePinnedLayout } from "@/hooks/usePinnedLayout";
import { ProjectsPinned } from "@/components/projects/ProjectsPinned";
import { ProjectsStacked } from "@/components/projects/ProjectsStacked";

/** Pinned scroll-driven "Selected Work" on md+, stacked cards on mobile / reduced motion. */
export function Projects() {
  const pinned = usePinnedLayout();
  return pinned ? <ProjectsPinned /> : <ProjectsStacked />;
}
