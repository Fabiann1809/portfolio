import { HeroStage } from "@/components/hero/HeroStage";
import { HeroScene } from "@/components/hero/HeroScene";
import { GiantName } from "@/components/hero/GiantName";
import { PortraitSlot } from "@/components/hero/PortraitSlot";
import { HeroIntro } from "@/components/hero/HeroIntro";
import { HeroAside } from "@/components/hero/HeroAside";
import { HeroHint } from "@/components/hero/HeroHint";
import { BackdropPicker } from "@/components/theme/BackdropPicker";

/**
 * Chapter 1: a CRT scan of the portrait over a wireframe wall. The WebGL canvas (grid wall +
 * portrait mosaic) sits behind the DOM text; the name stands in front of the portrait. In the
 * journey layout the stage is fixed and fades into the curved screen (see useHeroFade); the
 * section only reserves the scroll space.
 */
export function Hero() {
  return (
    <section id="hero" className="relative journey:h-svh">
      <HeroStage>
        <HeroScene />
        <PortraitSlot />
        <GiantName />
        <HeroIntro />
        <HeroAside />
        <HeroHint />
        <div className="relative z-30 order-6 flex justify-center pt-6 lg:absolute lg:inset-x-0 lg:bottom-8 lg:pt-0">
          <BackdropPicker />
        </div>
      </HeroStage>
    </section>
  );
}
