"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";

interface MarqueeOptions {
  fastSpeed: number;
  mobileSpeed: number;
  slowSpeed: number;
  dampingMs: number;
  /** Disables the loop entirely (reduced motion). */
  disabled: boolean;
  /** User pause toggle; read live through a ref so toggling never restarts the loop. */
  pausedRef: RefObject<boolean>;
}

/**
 * Drives an infinite marquee imperatively (no React renders per frame): damped velocity,
 * offset wrapped by the width of one set, pointer drag, hover slow-down, focus/offscreen/hidden pause.
 */
export function useMarquee(
  viewportRef: RefObject<HTMLElement | null>,
  trackRef: RefObject<HTMLElement | null>,
  { fastSpeed, mobileSpeed, slowSpeed, dampingMs, disabled, pausedRef }: MarqueeOptions,
) {
  const stateRef = useRef({ offset: 0, velocity: 0 });

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (disabled || !viewport || !track) return;

    const s = stateRef.current;
    const mobileQuery = window.matchMedia("(max-width: 767px), (pointer: coarse)");

    let setWidth = 0;
    let hovered = false;
    let focused = false;
    let dragging = false;
    let onScreen = true;
    let raf = 0;
    let last = 0;
    let dragX = 0;

    const apply = () => {
      if (setWidth > 0) s.offset = ((s.offset % setWidth) + setWidth) % setWidth;
      track.style.transform = `translate3d(${-s.offset}px,0,0)`;
    };

    const measure = () => {
      const first = track.firstElementChild as HTMLElement | null;
      setWidth = first ? first.offsetWidth : 0;
      apply();
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (!dragging) {
        const stopped = pausedRef.current || focused;
        const target = stopped ? 0 : hovered ? slowSpeed : mobileQuery.matches ? mobileSpeed : fastSpeed;
        s.velocity += (target - s.velocity) * (1 - Math.exp(-(dt * 1000) / Math.max(dampingMs, 1)));
        s.offset += s.velocity * dt;
        apply();
      }
      raf = requestAnimationFrame(tick);
    };

    const sync = () => {
      cancelAnimationFrame(raf);
      if (onScreen && !document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") hovered = true;
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === "mouse") hovered = false;
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragging = true;
      dragX = e.clientX;
      s.velocity = 0;
      viewport.setPointerCapture(e.pointerId);
      viewport.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      s.offset -= e.clientX - dragX;
      dragX = e.clientX;
      apply();
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      viewport.style.cursor = "";
      if (viewport.hasPointerCapture(e.pointerId)) viewport.releasePointerCapture(e.pointerId);
    };
    const onFocusIn = () => {
      focused = true;
    };
    const onFocusOut = (e: FocusEvent) => {
      if (!viewport.contains(e.relatedTarget as Node | null)) focused = false;
    };

    const ro = new ResizeObserver(measure);
    ro.observe(track);
    const first = track.firstElementChild;
    if (first) ro.observe(first);
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    io.observe(viewport);

    measure();
    sync();
    document.addEventListener("visibilitychange", sync);
    viewport.addEventListener("pointerenter", onEnter);
    viewport.addEventListener("pointerleave", onLeave);
    viewport.addEventListener("pointerdown", onDown);
    viewport.addEventListener("pointermove", onMove);
    viewport.addEventListener("pointerup", onUp);
    viewport.addEventListener("pointercancel", onUp);
    viewport.addEventListener("focusin", onFocusIn);
    viewport.addEventListener("focusout", onFocusOut);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      viewport.removeEventListener("pointerenter", onEnter);
      viewport.removeEventListener("pointerleave", onLeave);
      viewport.removeEventListener("pointerdown", onDown);
      viewport.removeEventListener("pointermove", onMove);
      viewport.removeEventListener("pointerup", onUp);
      viewport.removeEventListener("pointercancel", onUp);
      viewport.removeEventListener("focusin", onFocusIn);
      viewport.removeEventListener("focusout", onFocusOut);
    };
  }, [viewportRef, trackRef, fastSpeed, mobileSpeed, slowSpeed, dampingMs, disabled, pausedRef]);
}
