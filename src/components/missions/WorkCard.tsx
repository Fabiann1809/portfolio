"use client";

import type { CSSProperties } from "react";
import { ProjectMedia } from "@/components/gallery/ProjectMedia";
import { motion } from "@/data/motion";
import type { Project } from "@/types";

const cfg = motion.gallery;

interface WorkCardProps {
  project: Project;
  /** Signed distance from the active card (0 = centre). */
  offset: number;
  compact: boolean;
  reduced: boolean;
  /** Accessible name of the button that brings a side card to the centre. */
  selectLabel: string;
  onSelect: () => void;
}

/** One card of the coverflow: transform, opacity and stacking come from its distance to the centre. */
export function WorkCard({ project, offset, compact, reduced, selectLabel, onSelect }: WorkCardProps) {
  const dist = Math.abs(offset);
  const maxVisible = compact ? cfg.visibleCompact : cfg.visible;
  const active = dist === 0;
  const visible = reduced ? active : dist <= maxVisible;
  const side = Math.sign(offset);
  const xs = compact ? cfg.xCompact : cfg.x;
  const i = Math.min(dist, cfg.x.length - 1);

  const style: CSSProperties = reduced
    ? { opacity: active ? 1 : 0 }
    : {
        transform: `perspective(${cfg.perspective}px) translateX(calc(-50% + ${side * xs[i] * 100}%)) translateZ(${cfg.depth[i]}px) rotateY(${-side * cfg.rotate[i]}deg) scale(${cfg.scale[i]})`,
        opacity: visible ? cfg.opacity[i] : 0,
        transition: `transform ${cfg.transitionMs}ms ease-out, opacity ${cfg.transitionMs}ms ease-out`,
      };

  return (
    <div
      className="absolute top-0 left-1/2 w-full will-change-transform"
      style={{ ...style, zIndex: 10 - dist, pointerEvents: visible ? "auto" : "none" }}
      aria-hidden={active ? undefined : true}
    >
      <div
        className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_30px_60px_-25px_var(--shadow-color)]"
        style={{ filter: active || reduced ? undefined : "brightness(0.8)" }}
      >
        {/* Neighbours show the poster only; the demo video plays on the active card. */}
        <ProjectMedia project={project} alt={active ? project.title : ""} still={!active} />
        {!active && visible && (
          <button
            type="button"
            tabIndex={-1}
            aria-label={`${selectLabel} ${project.title}`}
            className="absolute inset-0 cursor-pointer"
            onClick={onSelect}
          />
        )}
      </div>
    </div>
  );
}
