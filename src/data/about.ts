import type { AboutData } from "@/types";

export const about: AboutData = {
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
};
