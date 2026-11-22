"use client";

import { useEffect, useRef, useState } from "react";
import { placeholderGradient } from "@/lib/gradient";
import { projectLabels } from "@/data/projects";
import { useLocalized } from "@/components/locale/LocaleProvider";
import type { Project } from "@/types";

interface ProjectMediaProps {
  project: Project;
  /** Alt text for the image; empty (decorative) by default. */
  alt?: string;
  /** Show only the still image (poster) even when the project has a video. */
  still?: boolean;
}

/** Cross-fade between the poster and the playing video. */
const POSTER_FADE_MS = 300;

/** Demo video that plays only while the pointer is over it (tap toggles on touch); shows the poster otherwise. */
function ProjectVideo({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);
  const [playing, setPlaying] = useState(false);
  const labels = useLocalized(projectLabels);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const isReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.querySelector('[data-reduced="true"]') !== null;
    const id = window.setTimeout(() => setReduced(isReduced), 0);
    if (isReduced) return () => window.clearTimeout(id);

    // Hit-test by geometry: in the 3D tunnel other layers sit on top of the frame and swallow hover events.
    const inside = (x: number, y: number) => {
      const r = video.getBoundingClientRect();
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    };
    let last: { x: number; y: number } | null = null;
    let over = false;
    let rewind = 0;
    // Enter: restart from the beginning; the poster fades out once frames are actually playing.
    const start = () => {
      window.clearTimeout(rewind);
      video.currentTime = 0;
      video.play().catch(() => {});
    };
    // Leave: fade the poster back in first, then pause and rewind behind it, so no cut is visible.
    const stop = () => {
      setPlaying(false);
      window.clearTimeout(rewind);
      rewind = window.setTimeout(() => {
        video.pause();
        video.currentTime = 0;
      }, POSTER_FADE_MS);
    };
    const onPlaying = () => over && setPlaying(true);
    video.addEventListener("playing", onPlaying);
    const sync = () => {
      if (!last) return;
      const now = inside(last.x, last.y);
      if (now === over) return;
      over = now;
      if (now) start();
      else stop();
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      last = { x: event.clientX, y: event.clientY };
      sync();
    };
    const onLeave = () => {
      last = null;
      if (over) {
        over = false;
        stop();
      }
    };
    // Touch: press and hold on the video plays it; lifting the finger (or the browser taking over to scroll) stops it.
    const onPress = (event: PointerEvent) => {
      if (event.pointerType !== "touch" || !inside(event.clientX, event.clientY)) return;
      over = true;
      start();
    };
    const onRelease = (event: PointerEvent) => {
      if (event.pointerType !== "touch" || !over) return;
      over = false;
      stop();
    };
    // No long-press menu / image callout while holding the video.
    const onMenu = (event: Event) => {
      if (event instanceof MouseEvent && inside(event.clientX, event.clientY)) event.preventDefault();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("pointerdown", onPress, { passive: true });
    window.addEventListener("pointerup", onRelease);
    window.addEventListener("pointercancel", onRelease);
    window.addEventListener("contextmenu", onMenu);
    document.documentElement.addEventListener("pointerleave", onLeave);
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && over) {
        over = false;
        stop();
      }
    });
    io.observe(video);
    return () => {
      window.clearTimeout(id);
      window.clearTimeout(rewind);
      video.removeEventListener("playing", onPlaying);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", sync);
      window.removeEventListener("pointerdown", onPress);
      window.removeEventListener("pointerup", onRelease);
      window.removeEventListener("pointercancel", onRelease);
      window.removeEventListener("contextmenu", onMenu);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      io.disconnect();
    };
  }, []);

  return (
    <div className="relative size-full [-webkit-touch-callout:none] select-none">
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
      {poster && !reduced && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="pointer-events-none absolute inset-0 size-full object-cover"
          style={{ opacity: playing ? 0 : 1, transition: `opacity ${POSTER_FADE_MS}ms ease` }}
        />
      )}
      {!reduced && (
        <span
          aria-hidden="true"
          className="mono-label pointer-events-none absolute right-2 bottom-2 flex items-center gap-1.5 whitespace-nowrap rounded-full bg-black/60 px-2.5 py-1 text-[10px] text-white backdrop-blur-sm"
          style={{ opacity: playing ? 0 : 1, transition: `opacity ${POSTER_FADE_MS}ms ease` }}
        >
          <svg viewBox="0 0 10 10" className="size-2 fill-current" aria-hidden="true">
            <path d="M2 1l7 4-7 4z" />
          </svg>
          <span className="[@media(hover:none)]:hidden">{labels.hoverHint}</span>
          <span className="hidden [@media(hover:none)]:inline">{labels.tapHint}</span>
        </span>
      )}
    </div>
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
