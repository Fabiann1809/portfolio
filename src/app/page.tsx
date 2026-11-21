import { Fragment } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SceneLayer } from "@/components/three/SceneLayer";
import { JourneyRoot } from "@/components/journey/JourneyRoot";
import { TransitionZone } from "@/components/journey/TransitionZone";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Testimonials } from "@/components/sections/Testimonials";
import { Experience } from "@/components/sections/Experience";
import { Education } from "@/components/sections/Education";
import { Extra } from "@/components/sections/Extra";
import { Contact } from "@/components/sections/Contact";
import { chapters } from "@/data/chapters";

/** Section component for each chapter id (see data/chapters.ts for the order). */
const sections: Record<string, React.ReactNode> = {
  hero: <Hero />,
  about: <About />,
  projects: <Projects />,
  testimonials: <Testimonials />,
  experience: <Experience />,
  education: <Education />,
  extra: <Extra />,
  contact: <Contact />,
};

export default function Home() {
  return (
    <>
      <SceneLayer />
      <Navbar />
      <JourneyRoot>
        {chapters.map((chapter) => (
          <Fragment key={chapter.id}>
            {chapter.transition && <TransitionZone chapterId={chapter.id} />}
            {sections[chapter.id]}
          </Fragment>
        ))}
      </JourneyRoot>
      <div className="relative z-10">
        <Footer />
      </div>
    </>
  );
}
