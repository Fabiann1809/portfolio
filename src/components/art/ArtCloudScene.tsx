"use client";

import { useEffect, useMemo, useRef } from "react";
import { artCloudConfig as cfg } from "@/data/gallery";
import { buildCloudCards } from "@/lib/artCloud";
import { ArtCard } from "@/components/art/ArtCard";
import { useMinWidth } from "@/hooks/useMinWidth";
import type { ArtData } from "@/types";

interface ArtCloudSceneProps {
  art: ArtData;
  onOpen: (index: number) => void;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Pinned stage with a cloud of cards floating at different depths. Scroll progress turns the cloud and, in the
 * last part of the track, collapses it into the first artwork. Everything is a pure function of progress, time
 * and pointer, written imperatively from one RAF loop (no React state per frame).
 */
export function ArtCloudScene({ art, onOpen }: ArtCloudSceneProps) {
  const wide = useMinWidth(1024);
  const layout = wide ? cfg.desktop : cfg.mobile;
  const cards = useMemo(
    () => buildCloudCards(art.artworks.map((work) => work.aspect ?? 1), layout.count, cfg.seed),
    [art.artworks, layout.count],
  );
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const group = groupRef.current;
    if (!track || !stage || !group) return;

    // Pointer target and tilt spring (desktop only).
    const pointer = { x: 0, y: 0 };
    const spring = { x: 0, y: 0, vx: 0, vy: 0 };
    let smoothProgress = 0;
    let idle = 0;
    let started = false;
    let raf = 0;
    let last = 0;
    let visible = false;

    const frame = (now: number) => {
      raf = 0;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
      last = now;

      const rect = track.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      const progress = range > 0 ? clamp01(-rect.top / range) : 0;
      smoothProgress = started ? smoothProgress + (progress - smoothProgress) * (1 - Math.exp(-cfg.scrollEase * dt)) : progress;
      started = true;
      idle += cfg.idleDegPerSec * dt;

      if (wide) {
        const k = cfg.tilt.stiffness;
        const c = cfg.tilt.damping;
        spring.vx += (k * (pointer.x - spring.x) - c * spring.vx) * dt;
        spring.vy += (k * (pointer.y - spring.y) - c * spring.vy) * dt;
        spring.x += spring.vx * dt;
        spring.y += spring.vy * dt;
      }

      const unit = Math.min(stage.clientHeight * layout.unitVh, stage.clientWidth * layout.unitVw);
      const rot = smoothProgress * cfg.scrollDeg + idle;
      const rad = (rot * Math.PI) / 180;
      // closing: collapse to the first card during the last part of the track
      const close = smooth((smoothProgress - cfg.closeStart) / (1 - cfg.closeStart));
      const fade = 1 - smooth((close - 0.5) / 0.5);
      const parallax = wide ? cfg.tilt.parallax * unit : 0;

      group.style.transform = `rotateX(${(-spring.y * cfg.tilt.maxDeg).toFixed(2)}deg) rotateY(${(spring.x * cfg.tilt.maxDeg).toFixed(2)}deg) scale(${lerp(1, 0.7, close).toFixed(3)})`;

      for (let i = 0; i < cards.length; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        const card = cards[i];
        const angle = card.theta + rad;
        const depth = Math.sin(angle); // -1 far ... 1 near
        const near = (depth + 1) / 2;
        let x = Math.cos(angle) * card.radius * layout.spreadX * unit + spring.x * parallax * depth;
        let y = card.y * layout.spreadY * unit + spring.y * parallax * depth;
        let z = depth * card.radius * layout.spreadZ * unit;
        let yaw = card.yaw;
        let scale = 1;
        let opacity = lerp(cfg.minOpacity, 1, near);
        if (i === 0) {
          x = lerp(x, 0, close);
          y = lerp(y, 0, close);
          z = lerp(z, 0.8 * unit, close);
          yaw = lerp(yaw, 0, close);
          scale = lerp(1, 1.25, close);
          opacity = lerp(opacity, 1, close);
        } else {
          x = lerp(x, 0, close);
          y = lerp(y, 0, close);
          z = lerp(z, -0.5 * unit, close);
          scale = lerp(1, 0.6, close);
          opacity *= 1 - close;
        }
        opacity *= fade;
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${yaw.toFixed(2)}deg) rotateZ(${card.roll.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        el.style.opacity = opacity.toFixed(3);
        el.style.visibility = opacity < 0.01 ? "hidden" : "visible";
        el.style.pointerEvents = opacity < 0.2 ? "none" : "auto";
      }

      if (visible) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      visible = true;
      last = 0;
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      visible = false;
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), {
      rootMargin: "100px 0px",
    });
    observer.observe(track);

    const onMove = (event: PointerEvent) => {
      const box = stage.getBoundingClientRect();
      pointer.x = clamp01((event.clientX - box.left) / box.width) * 2 - 1;
      pointer.y = clamp01((event.clientY - box.top) / box.height) * 2 - 1;
    };
    const onLeave = () => {
      pointer.x = 0;
      pointer.y = 0;
    };
    if (wide) {
      stage.addEventListener("pointermove", onMove);
      stage.addEventListener("pointerleave", onLeave);
    }

    return () => {
      stop();
      observer.disconnect();
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, [cards, layout, wide]);

  return (
    <div ref={trackRef} className="relative mt-12" style={{ height: `calc(100svh + ${layout.trackScreens * 100}svh)` }}>
      <div
        ref={stageRef}
        role="group"
        aria-label={art.galleryAria}
        aria-describedby="art-cloud-description"
        className="sticky top-0 h-svh overflow-hidden"
        style={
          {
            perspective: `${cfg.perspective}px`,
            "--u": `min(${layout.unitVh * 100}svh, ${layout.unitVw * 100}vw)`,
          } as React.CSSProperties
        }
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, color-mix(in srgb, var(--color-primary) 14%, transparent), transparent 60%)",
          }}
        />
        <p id="art-cloud-description" className="sr-only">
          {art.description}
        </p>
        <div ref={groupRef} className="absolute inset-0" style={{ transformStyle: "preserve-3d", willChange: "transform" }}>
          {cards.map((card, i) => (
            <ArtCard
              key={card.key}
              work={art.artworks[card.artIndex]}
              label={`${art.openArtwork} ${art.artworks[card.artIndex].title}`}
              onOpen={() => onOpen(card.artIndex)}
              eager={i < cfg.eagerCount}
              focusable={i < art.artworks.length}
              buttonRef={(el) => {
                cardRefs.current[i] = el;
              }}
              className="absolute top-1/2 left-1/2"
              style={{
                width: `calc(var(--u) * ${card.width})`,
                height: `calc(var(--u) * ${card.height})`,
                marginLeft: `calc(var(--u) * ${-card.width / 2})`,
                marginTop: `calc(var(--u) * ${-card.height / 2})`,
                opacity: 0,
                willChange: "transform, opacity",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
