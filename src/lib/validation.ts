import { defaultLocale } from "@/data/locale";
import { validationMessages } from "@/data/validation";
import type { ContactFormErrors, ContactFormValues, Locale } from "@/types";

export const NAME_REGEX = /^[\p{L}][\p{L}\s.'-]{1,59}$/u;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const SUBJECT_REGEX = /^(?=.*[\p{L}\p{N}])[^\n\r]{3,100}$/u;
export const MESSAGE_REGEX = /^[\s\S]{10,2000}$/;

export function validateContactForm(values: ContactFormValues, locale: Locale = defaultLocale): ContactFormErrors {
  const errors: ContactFormErrors = {};
  const messages = validationMessages[locale];
  if (!NAME_REGEX.test(values.name.trim())) {
    errors.name = messages.name;
  }
  if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = messages.email;
  }
  if (!SUBJECT_REGEX.test(values.subject.trim())) {
    errors.subject = messages.subject;
  }
  if (!MESSAGE_REGEX.test(values.message.trim())) {
    errors.message = messages.message;
  }
  return errors;
}
