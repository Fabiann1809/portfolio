import type { AboutData, Localized } from "@/types";

export const about: Localized<AboutData> = {
  es: {
    label: "Historia de origen",
    statement: [
      { text: "Soy de Túquerres, Nariño, y estudio ingeniería de software en Pasto. Me gusta entender el " },
      { text: "porqué", emphasis: true },
      { text: " de las cosas antes de usarlas, y esa " },
      { text: "curiosidad", emphasis: true },
      { text: " me acompaña tanto en el código como fuera de él." },
    ],
    paragraphs: [
      "Lo que más disfruto en mi tiempo libre es dibujar y pintar. Un lienzo en blanco me relaja y me reta a la vez, y es el lugar donde mejor se me apaga el ruido. Varias de mis obras están en la sección \"Mi lado artístico\".",
      "También me apunto a cualquier deporte. El fútbol y el tenis de mesa son mis favoritos. No soy bueno en todos, pero los practico hasta alcanzar un buen nivel, porque disfruto el proceso de mejorar tanto como el juego. Esa constancia, la misma del pincel y de la cancha, es la que llevo a cada proyecto de software.",
    ],
    timeline: [
      { id: "step-1", place: "Túquerres", period: "Origen" },
      { id: "step-2", place: "SENA", period: "Técnico en Programación" },
      { id: "step-3", place: "Pasto · UCC", period: "Ingeniería de Software" },
      { id: "step-4", place: "Full stack & AI", period: "Hoy" },
    ],
    stackTitle: "Stack",
  },
  en: {
    label: "Origin story",
    statement: [
      { text: "I'm from Túquerres, Nariño, and I study software engineering in Pasto. I like to understand the " },
      { text: "why", emphasis: true },
      { text: " of things before I use them, and that " },
      { text: "curiosity", emphasis: true },
      { text: " stays with me in code and out of it." },
    ],
    paragraphs: [
      "What I enjoy most in my free time is drawing and painting. A blank canvas relaxes and challenges me at the same time, and it's where the noise quiets down best. Several of my works are in the \"My artistic side\" section.",
      "I'll also join in any sport. Football and table tennis are my favorites. I'm not good at all of them, but I practice until I reach a solid level, because I enjoy the process of improving as much as the game. That persistence, the same one I bring to the brush and to the court, is what I bring to every software project.",
    ],
    timeline: [
      { id: "step-1", place: "Túquerres", period: "Origin" },
      { id: "step-2", place: "SENA", period: "Programming Technician" },
      { id: "step-3", place: "Pasto · UCC", period: "Software Engineering" },
      { id: "step-4", place: "Full stack & AI", period: "Today" },
    ],
    stackTitle: "Stack",
  },
};
