import type { ContactFormErrors, Localized } from "@/types";

/** Contact form validation messages, one per field. */
export const validationMessages: Localized<Required<ContactFormErrors>> = {
  es: {
    name: "Ingresa un nombre valido (2 a 60 letras).",
    email: "Ingresa un correo valido.",
    subject: "Ingresa un asunto valido (3 a 100 caracteres).",
    message: "El mensaje debe tener entre 10 y 2000 caracteres.",
  },
  en: {
    name: "Enter a valid name (2 to 60 letters).",
    email: "Enter a valid email address.",
    subject: "Enter a valid subject (3 to 100 characters).",
    message: "The message must be between 10 and 2000 characters.",
  },
};
