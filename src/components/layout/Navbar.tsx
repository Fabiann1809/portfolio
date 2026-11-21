"use client";

import { useCallback, useRef, useState } from "react";
import { menuLabels, navbarBrand, navigation } from "@/data/navigation";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useScrollTo } from "@/hooks/useScrollTo";
import { Reveal } from "@/components/loader/Reveal";
import { HamburgerIcon } from "@/components/ui/HamburgerIcon";
import { BackdropPicker } from "@/components/theme/BackdropPicker";
import { MobileMenu } from "./MobileMenu";

const ids = navigation.map((item) => item.id);

interface NavbarProps {
  /** Set on pages other than home: links point to `${homeHref}#section` instead of scrolling. */
  homeHref?: string;
}

export function Navbar({ homeHref }: NavbarProps) {
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
    <Reveal as="header" className={
        "fixed inset-x-0 top-0 z-50 " +
        (external
          ? "bg-background/60 backdrop-blur"
          : open
            ? ""
            : "bg-background/90 backdrop-blur")
      }>
      <div className="flex items-center justify-between px-[var(--edge-x)] py-3">
        <a href={hrefPrefix + "#hero"} onClick={(e) => handleAnchor(e, "hero")} className="phosphor font-display text-lg font-black tracking-[0.12em] uppercase">{navbarBrand.label}</a>
        <div className="flex items-center gap-4 md:gap-6">
          <a
            href={hrefPrefix + "#" + navbarBrand.cta.targetId}
            onClick={(e) => handleAnchor(e, navbarBrand.cta.targetId)}
            className="label flex items-center gap-2 text-xs md:text-sm"
          >
            {navbarBrand.cta.label}
            <span aria-hidden="true" className="status-dot" />
          </a>
          <nav className="hidden md:block" aria-label="Secciones">
            <ul className="label flex gap-5 text-xs lg:gap-6 lg:text-sm">
              {navigation.map((item) => (
                <li key={item.id}>
                  <a
                    href={hrefPrefix + "#" + item.id}
                    onClick={(e) => handleAnchor(e, item.id)}
                    aria-current={activeId === item.id ? "true" : undefined}
                    className={activeId === item.id ? "text-emphasis" : ""}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="hidden md:block">
            <BackdropPicker variant="compact" />
          </div>
          <button
            ref={toggleRef}
            type="button"
            className="-mr-2 p-2 md:hidden"
            aria-label={open ? menuLabels.close : menuLabels.open}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <HamburgerIcon open={open} />
          </button>
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
