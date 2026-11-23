"use client";

import { glass } from "@/lib/glass";
import { useCallback, useRef, useState } from "react";
import { menuLabels, navbarBrand, navigationIds } from "@/data/navigation";
import { useLocalized } from "@/components/locale/LocaleProvider";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useScrollTo } from "@/hooks/useScrollTo";
import { Reveal } from "@/components/loader/Reveal";
import { HamburgerIcon } from "@/components/ui/HamburgerIcon";
import { BackdropPicker } from "@/components/theme/BackdropPicker";
import { hero as heroContent } from "@/data/hero";
import { LocaleToggle } from "./LocaleToggle";
import { MobileMenu } from "./MobileMenu";
import { PillNav } from "./PillNav";

const ids = navigationIds;

interface NavbarProps {
  /** Set on pages other than home: links point to `${homeHref}#section` instead of scrolling. */
  homeHref?: string;
}

export function Navbar({ homeHref }: NavbarProps) {
  const labels = useLocalized(menuLabels);
  const brand = useLocalized(navbarBrand);
  const hero = useLocalized(heroContent);
  const external = homeHref !== undefined;
  const hrefPrefix = homeHref ?? "";
  const [open, setOpen] = useState(false);
  const sectionId = useActiveSection(ids);
  const activeId = external ? "" : sectionId;
  const scrollTo = useScrollTo();
  const toggleRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  function handleAnchor(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    if (external) return; // plain navigation back to the home section
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    // Wait a frame so the menu scroll lock (Lenis stop) is released before scrolling.
    if (open) requestAnimationFrame(() => scrollTo(id));
    else scrollTo(id);
    history.replaceState(null, "", "#" + id);
  }

  return (
    <Reveal as="header" className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="relative flex items-start justify-between px-[var(--edge-x)] pt-6">
        {/* Mobile / tablet: compact pill with logo + hamburger. Desktop: logo alone, pill centered. */}
        <div className={`${glass} pointer-events-auto flex w-full items-center justify-between rounded-full py-2 pr-2 pl-5 xl:w-auto xl:py-3 xl:pr-6`}>
          <a href={hrefPrefix + "#hero"} onClick={(e) => handleAnchor(e, "hero")} className="font-sans text-base font-bold tracking-[0.12em] uppercase sm:text-lg xl:text-xl">{brand.label}</a>
          {/* Mobile / tablet controls: language, theme, CV and menu, each in its own round chip. */}
          <div className="flex items-center gap-1.5 xl:hidden">
            <LocaleToggle variant="chip" className="rounded-full border border-line p-0.5" />
            <BackdropPicker variant="compact" className="size-9 justify-center border border-line" />
            <a
              href={hero.cvPath}
              download
              className="label flex h-9 items-center gap-1 rounded-full bg-emphasis px-3 text-[11px] text-background transition-opacity hover:opacity-85"
            >
              CV
              <span aria-hidden="true">↓</span>
            </a>
            <button
              ref={toggleRef}
              type="button"
              className="flex size-9 items-center justify-center rounded-full border border-line"
              aria-label={open ? labels.close : labels.open}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((value) => !value)}
            >
              <HamburgerIcon open={open} />
            </button>
          </div>
        </div>
        <div className="pointer-events-auto absolute top-6 left-1/2 hidden -translate-x-1/2 xl:block">
          <PillNav activeId={activeId} hrefPrefix={hrefPrefix} onAnchor={handleAnchor} />
        </div>
        <div className="pointer-events-auto hidden items-center gap-4 xl:flex">
          <BackdropPicker variant="compact" />
          <a
            href={hrefPrefix + "#" + brand.cta.targetId}
            onClick={(e) => handleAnchor(e, brand.cta.targetId)}
            className={`${glass} label flex items-center gap-2 rounded-full px-5 py-3 text-xs transition-colors hover:border-emphasis hover:text-emphasis`}
          >
            {brand.cta.label}
            <span aria-hidden="true" className="status-dot" />
          </a>
        </div>
      </div>
      <MobileMenu
        open={open}
        activeId={activeId}
        hrefPrefix={hrefPrefix}
        onNavigate={(id, event) => {
          handleAnchor(event, id);
          setOpen(false);
        }}
        onClose={closeMenu}
      />
    </Reveal>
  );
}
