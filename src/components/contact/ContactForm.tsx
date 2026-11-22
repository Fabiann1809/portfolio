"use client";

import { useState } from "react";
import { contact as contactContent } from "@/data/contact";
import { useLocale, useLocalized } from "@/components/locale/LocaleProvider";
import { validateContactForm } from "@/lib/validation";
import type { ContactFormErrors, ContactFormValues } from "@/types";

const emptyValues: ContactFormValues = { name: "", email: "", subject: "", message: "" };
type Status = "idle" | "sending" | "success" | "error";

const fieldClass =
  "w-full rounded-2xl border border-line bg-surface px-5 py-3.5 text-base text-foreground outline-none transition-colors placeholder:text-muted/70 focus:border-emphasis";
const labelClass = "flex flex-col gap-2.5 text-[15px] font-medium text-foreground";
const errorClass = "text-sm normal-case tracking-normal text-red-500";

/** Regex-validated contact form (see lib/validation.ts) posting to the Resend route. */
export function ContactForm() {
  const locale = useLocale();
  const contact = useLocalized(contactContent);
  const [values, setValues] = useState<ContactFormValues>(emptyValues);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  function handleChange(field: keyof ContactFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validateContactForm(values, locale);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Request failed");
      setValues(emptyValues);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 font-sans">
      <label className={labelClass}>
        {contact.fields.name}
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder={contact.placeholders.name}
          aria-invalid={Boolean(errors.name)}
          className={fieldClass}
        />
        {errors.name && (
          <span role="alert" className={errorClass}>
            {errors.name}
          </span>
        )}
      </label>
      <label className={labelClass}>
        {contact.fields.email}
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder={contact.placeholders.email}
          aria-invalid={Boolean(errors.email)}
          className={fieldClass}
        />
        {errors.email && (
          <span role="alert" className={errorClass}>
            {errors.email}
          </span>
        )}
      </label>
      <label className={labelClass}>
        {contact.fields.subject}
        <input
          type="text"
          name="subject"
          value={values.subject}
          onChange={(e) => handleChange("subject", e.target.value)}
          placeholder={contact.placeholders.subject}
          aria-invalid={Boolean(errors.subject)}
          className={fieldClass}
        />
        {errors.subject && (
          <span role="alert" className={errorClass}>
            {errors.subject}
          </span>
        )}
      </label>
      <label className={labelClass}>
        {contact.fields.message}
        <textarea
          name="message"
          rows={5}
          value={values.message}
          onChange={(e) => handleChange("message", e.target.value)}
          placeholder={contact.placeholders.message}
          aria-invalid={Boolean(errors.message)}
          className={fieldClass}
        />
        {errors.message && (
          <span role="alert" className={errorClass}>
            {errors.message}
          </span>
        )}
      </label>
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-2 w-full cursor-pointer rounded-full bg-emphasis py-4 text-sm font-semibold tracking-[0.12em] text-background uppercase transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {status === "sending" ? contact.sendingLabel : contact.submitLabel}
      </button>
      {status === "success" && (
        <p role="status" className="mono-label text-emphasis">
          {contact.successMessage}
        </p>
      )}
      {status === "error" && (
        <p role="alert" className={errorClass}>
          {contact.errorMessage}
        </p>
      )}
    </form>
  );
}
