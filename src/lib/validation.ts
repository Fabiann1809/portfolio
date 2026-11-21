import type { ContactFormErrors, ContactFormValues } from "@/types";

export const NAME_REGEX = /^[\p{L}][\p{L}\s.'-]{1,59}$/u;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const SUBJECT_REGEX = /^[p{L}p{N}][p{L}p{N}s.,:;!?¿¡'()-]{2,99}$/u;
export const MESSAGE_REGEX = /^[\s\S]{10,2000}$/;

export function validateContactForm(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {};
  if (!NAME_REGEX.test(values.name.trim())) {
    errors.name = "Ingresa un nombre valido (2 a 60 letras).";
  }
  if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = "Ingresa un correo valido.";
  }
  if (!SUBJECT_REGEX.test(values.subject.trim())) {
    errors.subject = "Ingresa un asunto valido (3 a 100 caracteres).";
  }
  if (!MESSAGE_REGEX.test(values.message.trim())) {
    errors.message = "El mensaje debe tener entre 10 y 2000 caracteres.";
  }
  return errors;
}
