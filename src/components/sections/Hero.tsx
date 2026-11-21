import { HeroStage } from "@/components/hero/HeroStage";
import { StudioBackdrop } from "@/components/hero/StudioBackdrop";
import { GiantName } from "@/components/hero/GiantName";
import { Portrait } from "@/components/hero/Portrait";
import { HeroIntro } from "@/components/hero/HeroIntro";
import { HeroStatus } from "@/components/hero/HeroStatus";
import { BackdropPicker } from "@/components/theme/BackdropPicker";

/**
 * First section: a photo-studio scene.
 */
export function Hero() {
  return (
    <section id="hero" className="relative">
      <HeroStage>
        <StudioBackdrop />
        <GiantName />
        <Portrait />
        <HeroIntro />
        <HeroStatus />
        <div className="relative z-30 flex justify-center pt-8 xl:absolute xl:inset-x-0 xl:bottom-6 xl:pt-0">
          <BackdropPicker />
        </div>
      </HeroStage>
    </section>
  );
}
