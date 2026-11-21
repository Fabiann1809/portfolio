"use client";

import { useMemo, useRef } from "react";
import { about } from "@/data/about";
import { motion } from "@/data/motion";
import { stack } from "@/data/stack";
import { usePinnedProgress } from "@/hooks/usePinnedProgress";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { tokenizeStatement } from "@/lib/statement";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * "Origin story": the statement lights up word by word while the section is pinned, a counter
 * runs to 100% and the timeline stops switch on. Reduced motion shows everything lit and unpinned.
 */
export function About() {
  const reduced = useReducedMotion();
  const tokens = useMemo(() => tokenizeStatement(about.statement), []);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const stopRefs = useRef<(HTMLLIElement | null)[]>([]);
  const lastLevels = useRef<number[]>([]);

  usePinnedProgress(
    trackRef,
    (progress) => {
      const lit = clamp01((progress - 0.05) / 0.8) * tokens.length;
      wordRefs.current.forEach((el, i) => {
        if (!el) return;
        const level = Math.round(clamp01(lit - i) * 20) / 20;
        if (lastLevels.current[i] === level) return;
        lastLevels.current[i] = level;
        el.style.opacity = String(0.14 + level * 0.86);
        el.style.transform = reduced ? "none" : `translate3d(0, ${(1 - level) * 0.12}em, 0)`;
        if (el.dataset.emphasis === "true") {
          el.style.color = level > 0.5 ? "var(--emphasis)" : "";
          el.style.textShadow = level > 0.5 ? `0 0 ${18 * level}px color-mix(in srgb, var(--emphasis) 40%, transparent)` : "none";
        }
      });
      const sp = clamp01((progress - 0.05) / 0.75);
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${sp})`;
      stopRefs.current.forEach((el, i) => {
        if (el) el.dataset.on = String(sp >= i / Math.max(1, about.timeline.length - 1) - 0.001);
      });
      if (counterRef.current) counterRef.current.textContent = String(Math.round(sp * 100)).padStart(3, "0") + "%";
    },
    { enabled: !reduced },
  );

  return (
    <section id="about">
      <div ref={trackRef} style={reduced ? undefined : { height: motion.originScrollVh + "vh" }}>
        <div
          className={
            "flex flex-col justify-center gap-10 px-[var(--edge-x)] md:gap-14 " +
            (reduced ? "py-24" : "sticky top-0 h-svh overflow-hidden pt-24 pb-12")
          }
        >
          <SectionLabel trailing={<span ref={counterRef}>000%</span>}>{about.label}</SectionLabel>

          <p className="max-w-6xl font-condensed text-[clamp(30px,4.4vw,68px)] leading-[1.06] font-bold">
            {tokens.map((token, i) => (
              <span
                key={i}
                ref={(el) => {
                  wordRefs.current[i] = el;
                }}
                data-emphasis={token.emphasis}
                className={"mr-[0.24em] inline-block opacity-[0.14] " + (token.emphasis ? "italic" : "")}
              >
                {token.text}
              </span>
            ))}
          </p>

          <div>
            <div className="relative h-px bg-line">
              <span ref={fillRef} className="absolute inset-0 origin-left scale-x-0 bg-emphasis" />
            </div>
            <ol className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 md:flex md:justify-between">
              {about.timeline.map((step, i) => (
                <li
                  key={step.id}
                  ref={(el) => {
                    stopRefs.current[i] = el;
                  }}
                  data-stop
                  data-on="false"
                  className="flex items-start gap-3"
                >
                  <span aria-hidden="true" className="stop-dot mt-1 size-2.5 shrink-0 rounded-full border border-foreground/50" />
                  <span className="stop-text mono-label flex flex-col gap-1">
                    <span>{step.place}</span>
                    <span className="text-muted">{step.period}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div className="grid gap-10 border-t border-line px-[var(--edge-x)] py-16 md:grid-cols-2">
        <ScrollReveal>
          <dl className="flex flex-col gap-6">
            {about.facts.map((fact) => (
              <div key={fact.label}>
                <dt className="mono-label text-muted">{fact.label}</dt>
                <dd className="mt-2 max-w-md">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </ScrollReveal>
        <div>
          <ScrollReveal as="h3" className="mono-label text-muted">{about.stackTitle}</ScrollReveal>
          <ScrollReveal as="ul" stagger className="mt-4 flex flex-wrap gap-3">
            {stack.map((item) => (
              <li key={item.name} className="mono-label flex items-center gap-2 border border-line px-3 py-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.icon} alt="" width={20} height={20} />
                <span>{item.name}</span>
              </li>
            ))}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
