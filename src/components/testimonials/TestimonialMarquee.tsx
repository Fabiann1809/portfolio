"use client";

import { useEffect, useRef, useState } from "react";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Testimonial, TestimonialsMarqueeConfig } from "@/types";
import { useMarquee } from "./useMarquee";

interface TestimonialMarqueeProps {
  items: Testimonial[];
  config: TestimonialsMarqueeConfig;
}

const EDGE_MASK = "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)";

export function TestimonialMarquee({ items, config }: TestimonialMarqueeProps) {
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [copies, setCopies] = useState(2);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  // Enough copies so the track always covers viewport + one full set (seamless wrap).
  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (reduced || !viewport || !track) return;
    const update = () => {
      const setWidth = (track.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0;
      if (setWidth > 0) setCopies(Math.max(2, Math.ceil(viewport.clientWidth / setWidth) + 1));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(viewport);
    return () => ro.disconnect();
  }, [reduced, items]);

  useMarquee(viewportRef, trackRef, {
    fastSpeed: config.fastSpeed,
    slowSpeed: config.slowSpeed,
    dampingMs: config.dampingMs,
    disabled: reduced,
    pausedRef,
  });

  if (reduced) {
    return (
      <div
        role="region"
        aria-label={config.regionLabel}
        className="flex snap-x snap-mandatory overflow-x-auto px-4 pb-4"
        style={{ gap: config.gap }}
      >
        {items.map((item) => (
          <div key={item.id} className="snap-center">
            <TestimonialCard testimonial={item} focusable />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div role="region" aria-label={config.regionLabel} className="relative">
      <div className="mb-3 flex justify-end px-4">
        <button
          type="button"
          aria-pressed={paused}
          onClick={() => setPaused((p) => !p)}
          className="font-display text-xs tracking-[0.1em] overlay-text overlay-muted uppercase"
        >
          {paused ? config.playLabel : config.pauseLabel}
        </button>
      </div>
      <div
        ref={viewportRef}
        className="cursor-grab overflow-hidden select-none"
        style={{ touchAction: "pan-y", maskImage: EDGE_MASK, WebkitMaskImage: EDGE_MASK }}
      >
        <div ref={trackRef} className="flex w-max will-change-transform">
          {Array.from({ length: copies }, (_, copy) => (
            <div
              key={copy}
              className="flex shrink-0"
              style={{ gap: config.gap, paddingRight: config.gap }}
              aria-hidden={copy > 0 || undefined}
            >
              {items.map((item) => (
                <TestimonialCard key={item.id} testimonial={item} focusable={copy === 0} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
