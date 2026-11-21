import type { ContactData } from "@/types";

export const contact: ContactData = {
  label: "Contacto",
  headlineLines: ["Hablemos"],
  intro: "¿Tienes una idea, una oportunidad o solo quieres conversar sobre tecnología? Escríbeme y te respondo pronto.",
  availability: "Disponible para oportunidades como desarrollador full stack junior y proyectos freelance.",
  // PLACEHOLDER: real email (rendered as a mailto link once it contains "@").
  email: "PLACEHOLDER: correo",
  emailLabel: "Correo",
  location: "Túquerres / Pasto, Nariño, Colombia",
  locationLabel: "Ubicación",
  socialsLabel: "Redes",
  fields: { name: "Nombre", email: "Correo", subject: "Asunto", message: "Mensaje" },
  submitLabel: "Enviar",
  sendingLabel: "Enviando",
  successMessage: "Mensaje enviado. ¡Gracias!",
  errorMessage: "No se pudo enviar el mensaje. Inténtalo de nuevo.",
};
