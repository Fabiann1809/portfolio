import { HeroStage } from "@/components/hero/HeroStage";
import { StudioBackdrop } from "@/components/hero/StudioBackdrop";
import { GiantName } from "@/components/hero/GiantName";
import { Portrait } from "@/components/hero/Portrait";
import { HeroIntro } from "@/components/hero/HeroIntro";
import { HeroStatus } from "@/components/hero/HeroStatus";
import { HeroHint } from "@/components/hero/HeroHint";
import { BackdropPicker } from "@/components/theme/BackdropPicker";

/**
 * Chapter 1: a photo-studio scene. In the journey layout the stage is fixed and fades into
 * the curved screen (see useHeroFade); the section only reserves the scroll space.
 */
export function Hero() {
  return (
    <section id="hero" className="relative journey:h-svh">
      <HeroStage>
        <StudioBackdrop />
        <GiantName />
        <Portrait />
        <HeroIntro />
        <HeroStatus />
        <HeroHint />
        <div className="relative z-30 order-4 flex justify-center pt-6 md:absolute md:inset-x-0 md:bottom-8 md:pt-0">
          <BackdropPicker />
        </div>
      </HeroStage>
    </section>
  );
}
