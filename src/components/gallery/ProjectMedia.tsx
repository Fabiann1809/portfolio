"use client";

import { useEffect, useRef, useState } from "react";
import { placeholderGradient } from "@/lib/gradient";
import type { Project } from "@/types";

interface ProjectMediaProps {
  project: Project;
  /** Alt text for the image; empty (decorative) by default. */
  alt?: string;
  /** Show only the still image (poster) even when the project has a video. */
  still?: boolean;
}

/** Demo video that plays only while visible; with reduced motion it shows the poster and plays on click. */
function ProjectVideo({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isReduced = mq.matches || document.querySelector('[data-reduced="true"]') !== null;
    setReduced(isReduced);
    if (isReduced) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      controls={reduced}
      draggable={false}
      className="size-full object-cover"
    />
  );
}

/** The project video or image, or a deterministic gradient placeholder when it has neither. */
export function ProjectMedia({ project, alt = "", still = false }: ProjectMediaProps) {
  if (project.video && !still) {
    return <ProjectVideo src={project.video} poster={project.image} />;
  }
  if (project.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={project.image} alt={alt} draggable={false} className="size-full object-cover" />;
  }
  return <div aria-hidden="true" className="size-full" style={{ backgroundImage: placeholderGradient(project.id) }} />;
}
