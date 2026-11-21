import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SceneLayer } from "@/components/three/SceneLayer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Testimonials } from "@/components/sections/Testimonials";
import { Experience } from "@/components/sections/Experience";
import { Education } from "@/components/sections/Education";
import { Extra } from "@/components/sections/Extra";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <SceneLayer />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Testimonials />
        <Experience />
        <Education />
        <Extra />
        <Contact />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </>
  );
}
