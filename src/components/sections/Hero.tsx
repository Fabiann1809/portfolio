import { hero } from "@/data/hero";
import { HeroStage } from "@/components/hero/HeroStage";
import { HeroScene } from "@/components/hero/HeroScene";
import { PortraitSlot } from "@/components/hero/PortraitSlot";
import { HeroIntro } from "@/components/hero/HeroIntro";
import { HeroAside } from "@/components/hero/HeroAside";

/**
 * Chapter 1: the portrait over a barrel-distorted wireframe wall, flanked by two text blocks.
 * The name is only an sr-only heading here: the giant lettering and the pixel mosaic appear on
 * the curved screen the hero shrinks into (see lib/heroTexture.ts). In the journey layout the
 * stage is fixed and fades into that screen (see useHeroFade); the section reserves the scroll space.
 */
export function Hero() {
  return (
    <section id="hero" className="relative journey:h-svh">
      <HeroStage>
        <h1 className="sr-only">{hero.displayName}</h1>
        <HeroScene />
        <PortraitSlot />
        <HeroIntro />
        <HeroAside />
      </HeroStage>
    </section>
  );
}
