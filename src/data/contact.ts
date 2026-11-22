import type { ContactData, Localized } from "@/types";

// PLACEHOLDER: real email (rendered as a mailto link once it contains "@").
export const contact: Localized<ContactData> = {
  es: {
    label: "Contacto",
    headlineLines: ["Hablemos"],
    intro: "¿Tienes una idea, una oportunidad o solo quieres conversar sobre tecnología? Escríbeme y te respondo pronto.",
    availability: "Disponible para oportunidades como desarrollador full stack junior y proyectos freelance.",
    email: "fabianchipu@gmail.com",
    emailLabel: "Correo",
    location: "Túquerres / Pasto, Nariño, Colombia",
    locationLabel: "Ubicación",
    socialsLabel: "Redes",
    placeholders: { name: "Tu nombre", email: "tu@correo.com", subject: "¿De qué quieres hablar?", message: "¡Hola! Me encantaría…" },
    fields: { name: "Nombre", email: "Correo", subject: "Asunto", message: "Mensaje" },
    submitLabel: "Enviar mensaje",
    sendingLabel: "Enviando",
    successMessage: "Mensaje enviado. ¡Gracias!",
    errorMessage: "No se pudo enviar el mensaje. Inténtalo de nuevo.",
  },
  en: {
    label: "Contact",
    headlineLines: ["Let's talk"],
    intro: "Have an idea, an opportunity, or just want to chat about technology? Write to me and I'll get back to you soon.",
    availability: "Available for junior full stack developer opportunities and freelance projects.",
    email: "fabianchipu@gmail.com",
    emailLabel: "Email",
    location: "Túquerres / Pasto, Nariño, Colombia",
    locationLabel: "Location",
    socialsLabel: "Social",
    placeholders: { name: "Your name", email: "you@email.com", subject: "What would you like to talk about?", message: "Hi! I'd love to…" },
    fields: { name: "Name", email: "Email", subject: "Subject", message: "Message" },
    submitLabel: "Send message",
    sendingLabel: "Sending",
    successMessage: "Message sent. Thank you!",
    errorMessage: "The message could not be sent. Please try again.",
  },
};
