"use client";

import type { CSSProperties } from "react";
import { ProjectMedia } from "@/components/gallery/ProjectMedia";
import { motion } from "@/data/motion";
import type { Project } from "@/types";

const cfg = motion.gallery;

/** Value of a per-distance table at a fractional distance (linear between steps). */
const at = (table: number[], d: number) => {
  const i = Math.min(Math.floor(d), table.length - 1);
  const j = Math.min(i + 1, table.length - 1);
  return table[i] + (table[j] - table[i]) * (d - i);
};

interface WorkCardProps {
  project: Project;
  /** Signed, fractional distance from the centre (0 = centred); follows the scroll continuously. */
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
  const active = dist < 0.5;
  const visible = reduced ? active : dist < maxVisible + 0.5;
  const side = Math.sign(offset);
  const xs = compact ? cfg.xCompact : cfg.x;
  const d = Math.min(dist, cfg.x.length - 1);
  const fadeOut = dist > maxVisible ? Math.max(0, 1 - (dist - maxVisible) * 2) : 1;

  const style: CSSProperties = reduced
    ? { opacity: active ? 1 : 0 }
    : {
        transform: `perspective(${cfg.perspective}px) translateX(calc(-50% + ${side * at(xs, d) * 100}%)) translateZ(${at(cfg.depth, d)}px) rotateY(${-side * at(cfg.rotate, d)}deg) scale(${at(cfg.scale, d)})`,
        opacity: visible ? at(cfg.opacity, d) * fadeOut : 0,
        // Positions already follow the (smoothed) scroll; a short transition only irons out frame gaps.
        transition: `transform 180ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms cubic-bezier(0.22, 1, 0.36, 1)`,
      };

  return (
    <div
      className="absolute top-0 left-1/2 w-full will-change-transform"
      style={{ ...style, zIndex: 10 - Math.round(dist * 2), pointerEvents: visible ? "auto" : "none" }}
      aria-hidden={active ? undefined : true}
    >
      <div
        className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_30px_60px_-25px_var(--shadow-color)]"
        style={{ filter: reduced || dist < 0.05 ? undefined : `brightness(${(1 - 0.2 * Math.min(1, dist)).toFixed(2)})` }}
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
