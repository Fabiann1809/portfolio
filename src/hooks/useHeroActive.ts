"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

function subscribeTab(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

/**
 * True while the hero scene should render: the stage intersects the viewport, the tab is
 * visible and the journey has not faded the stage out (it removes data-light-zone then).
 */
export function useHeroActive(stage: HTMLElement | null): boolean {
  const tabVisible = useSyncExternalStore(
    subscribeTab,
    () => !document.hidden,
    () => true,
  );
  const zone = useSyncExternalStore(
    (onChange) => {
      if (!stage) return () => {};
      const observer = new MutationObserver(onChange);
      observer.observe(stage, { attributes: true, attributeFilter: ["data-light-zone"] });
      return () => observer.disconnect();
    },
    () => stage?.dataset.lightZone === "true",
    () => false,
  );
  const [intersecting, setIntersecting] = useState(true);

  useEffect(() => {
    if (!stage) return;
    const observer = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting), { threshold: 0 });
    observer.observe(stage);
    return () => observer.disconnect();
  }, [stage]);

  return tabVisible && zone && intersecting;
}
