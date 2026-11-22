"use client";

import { useEffect, useRef, useState } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { motion } from "@/data/motion";
import { projectLabels as labelsContent, projects as projectsContent } from "@/data/projects";
import { useLocalized } from "@/components/locale/LocaleProvider";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePinnedProgress } from "@/hooks/usePinnedProgress";
import { scrambleFrame } from "@/lib/scramble";
import { MissionFrame } from "./MissionFrame";
import { MissionLinks } from "./MissionLinks";
import { MissionMeta } from "./MissionMeta";
import { codeOf, countOf } from "./format";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const SCRAMBLE_MS = 650;
const cfg = motion.tunnel;
/** Phones and portrait tablets: panel sized from the narrow side, HUD stacked under it. */
const COMPACT_QUERY = "(max-width: 767px), (orientation: portrait)";
const COMPACT_PANEL_VW = 0.8;
const COMPACT_PANEL_MAX = 560;

/**
 * Pinned corridor: scrolling flies the camera past each project (CSS 3D, no WebGL). Frame rings
 * stream toward the viewer, the project in focus sits in a framed panel on alternating sides and
 * the HUD (index, title, meta, links) switches with a glyph decode.
 */
export function MissionTunnel() {
  const projects = useLocalized(projectsContent);
  const projectLabels = useLocalized(labelsContent);
  const count = projects.length;
  const compact = useMediaQuery(COMPACT_QUERY);
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ringRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const state = useRef({ shown: -1, scrambleStart: 0, camX: 0, px: 0, py: 0, tx: 0, ty: 0, text: "" });

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const stage = stageRef.current;
      if (!stage) return;
      const r = stage.getBoundingClientRect();
      state.current.tx = ((event.clientX - r.left) / r.width) * 2 - 1;
      state.current.ty = ((event.clientY - r.top) / r.height) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  usePinnedProgress(
    rootRef,
    (progress, _raw, dt) => {
      const stage = stageRef.current;
      const group = groupRef.current;
      if (!stage || !group) return;
      const st = state.current;
      const now = performance.now();
      const f = progress * (count - 1);
      const vw = stage.clientWidth;
      const vh = stage.clientHeight;
      const panelW = compact ? Math.min(vw * COMPACT_PANEL_VW, COMPACT_PANEL_MAX) : Math.min(vw * cfg.panelWidth, cfg.panelMaxPx);
      // Wide: panels alternate sides. Compact: the focused panel is centred and the others slide in from the sides.
      const offsetX = compact ? vw * 0.3 : vw * 0.5 - panelW * 0.5 - vw * 0.06;
      const focusIdx = Math.min(count - 1, Math.max(0, Math.round(f)));

      if (focusIdx !== st.shown) {
        st.shown = focusIdx;
        st.scrambleStart = now;
        setActive(focusIdx);
      }
      const title = titleRef.current;
      if (title) {
        const target = projects[focusIdx].title.toUpperCase();
        const text = scrambleFrame(target, clamp01((now - st.scrambleStart) / SCRAMBLE_MS));
        if (text !== st.text) {
          st.text = text;
          title.textContent = text;
        }
      }

      // The camera drifts toward the side of the focused panel; the pointer adds a slight parallax.
      const targetX = compact ? 0 : (focusIdx % 2 === 0 ? 1 : -1) * offsetX * 0.18;
      const ease = Math.min(1, dt * 3);
      st.camX += (targetX - st.camX) * ease;
      st.px += (st.tx - st.px) * ease;
      st.py += (st.ty - st.py) * ease;
      group.style.transform = `translate3d(${-st.camX}px, 0, 0) rotateX(${-st.py * 2.2}deg) rotateY(${st.px * 3.2}deg)`;

      // Frame rings: element k always shows ring index base - 2 + k, so rings stream past the camera.
      const base = Math.floor(f / cfg.ringStep);
      ringRefs.current.forEach((ring, k) => {
        if (!ring) return;
        const g = base - 2 + k;
        const d = g * cfg.ringStep - f;
        const hot = g % cfg.hotEvery === 0;
        const strength = hot ? 0.75 : 0.18;
        const fade = d < 0 ? clamp01(1 + d / 0.4) : clamp01(1 - d / (cfg.rings * cfg.ringStep * 0.85));
        ring.style.opacity = String(fade * strength);
        ring.style.width = vw * 1.12 + "px";
        ring.style.height = vh * 1.12 + "px";
        ring.dataset.hot = String(hot);
        ring.style.transform = `translate3d(-50%, -50%, ${-d * cfg.spacing}px)`;
      });

      panelRefs.current.forEach((panel, i) => {
        if (!panel) return;
        const d = i - f;
        const visible = d > -0.62 && d < 3.4;
        panel.style.visibility = visible ? "visible" : "hidden";
        if (!visible) return;
        const side = i % 2 === 0 ? 1 : -1;
        const focus = clamp01(1 - Math.abs(d) / 0.6);
        const fade = clamp01(1 - Math.max(0, d) / 3.2) * clamp01((d + 0.6) / 0.3);
        panel.style.opacity = String(fade);
        panel.style.filter = `grayscale(${((1 - focus) * 0.85).toFixed(2)}) brightness(${(0.82 + 0.18 * focus).toFixed(2)})`;
        const shift = compact ? side * offsetX * (1 - focus) : side * offsetX;
        panel.style.transform = `translate3d(calc(-50% + ${shift}px), -50%, ${-d * cfg.spacing}px) rotateY(${side * -10.3 * (1 - focus)}deg)`;
      });
    },
    { enabled: true, damping: cfg.damping },
  );

  const project = projects[active];
  const hudRight = !compact && active % 2 === 1;

  return (
    <div ref={rootRef} style={{ height: (count * motion.missionScreensPerProject + 0.2) * 100 + "vh" }}>
      <div ref={stageRef} className="sticky top-0 h-svh overflow-hidden bg-background" style={{ perspective: cfg.perspective + "px" }}>
        <div ref={groupRef} aria-hidden="true" className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {Array.from({ length: cfg.rings }, (_, k) => (
            <div
              key={k}
              ref={(el) => {
                ringRefs.current[k] = el;
              }}
              className="tunnel-ring"
            />
          ))}
          {projects.map((p, i) => (
            <div
              key={p.id}
              ref={(el) => {
                panelRefs.current[i] = el;
              }}
              className={"absolute left-1/2 will-change-transform " + (compact ? "top-[37%]" : "top-1/2")}
              style={{
                width: compact
                  ? `min(${COMPACT_PANEL_VW * 100}vw, ${COMPACT_PANEL_MAX}px)`
                  : `min(${cfg.panelWidth * 100}vw, ${cfg.panelMaxPx}px)`,
                visibility: i === 0 ? "visible" : "hidden",
              }}
            >
              <MissionFrame project={p} code={codeOf(projectLabels.codePrefix, i)} />
            </div>
          ))}
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[max(140px,16%)]"
          style={{ background: "linear-gradient(color-mix(in srgb, var(--background) 94%, transparent), transparent)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 55%, var(--vignette) 130%)" }}
        />

        <div className="pointer-events-none absolute top-[84px] left-[var(--edge-x)] md:top-[100px]">
          <SectionLabel trailing={`${countOf(count)} ${projectLabels.countLabel}`}>{projectLabels.heading}</SectionLabel>
        </div>

        <ul
          aria-label={projectLabels.progressAria}
          className="pointer-events-none absolute top-1/2 right-2 flex -translate-y-1/2 flex-col items-end gap-2.5 md:right-[1.6vw]"
        >
          {projects.map((p, i) => (
            <li
              key={p.id}
              aria-current={i === active ? "true" : undefined}
              className={
                "block h-0.5 w-[22px] origin-right transition-[transform,background-color] duration-500 " +
                (i === active ? "scale-x-100 bg-emphasis" : "scale-x-[0.45] bg-foreground/25")
              }
            >
              <span className="sr-only">{p.title}</span>
            </li>
          ))}
        </ul>

        <div
          className={
            "pointer-events-none absolute flex flex-col " +
            (compact
              ? "inset-x-[10vw] bottom-[max(3.5svh,16px)] max-w-[560px] items-start gap-2.5"
              : "bottom-[9vh] max-w-[min(46vw,640px)] gap-3.5 " +
                (hudRight ? "right-[6vw] items-end text-right" : "left-[6vw] items-start"))
          }
        >
          <div
            aria-hidden="true"
            className={
              "outline-num font-condensed leading-[0.8] font-black " +
              (compact ? "text-[clamp(40px,12vw,72px)]" : "text-[clamp(56px,9vw,150px)]")
            }
          >
            {countOf(active + 1)}
          </div>
          <h3 className={"giant-title " + (compact ? "text-[clamp(34px,10.5vw,64px)]" : "text-[clamp(40px,5.6vw,96px)]")}>
            <span className="sr-only">{project.title}</span>
            <span ref={titleRef} aria-hidden="true" />
          </h3>
          <MissionMeta project={project} className={hudRight ? "justify-end" : compact ? "text-[10px]" : ""} />
          <MissionLinks
            project={project}
            className={
              "pointer-events-auto " +
              (hudRight ? "justify-end" : "") +
              (compact ? " [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center [&_button]:min-h-11" : "")
            }
          />
        </div>

      </div>
    </div>
  );
}
