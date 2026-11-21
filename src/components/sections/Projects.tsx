"use client";

import { MissionList } from "@/components/missions/MissionList";
import { MissionTunnel } from "@/components/missions/MissionTunnel";
import { useMinWidth } from "@/hooks/useMinWidth";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** "Mission files": pinned tunnel on md+ with motion allowed, stacked mission cards otherwise. */
export function Projects() {
  const wide = useMinWidth(768);
  const reduced = useReducedMotion();
  return <section id="projects">{wide && !reduced ? <MissionTunnel /> : <MissionList />}</section>;
}
