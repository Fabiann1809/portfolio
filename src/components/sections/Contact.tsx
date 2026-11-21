"use client";

import { useState } from "react";
import { contact } from "@/data/contact";
import { validateContactForm } from "@/lib/validation";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import type { ContactFormErrors, ContactFormValues } from "@/types";

const emptyValues: ContactFormValues = { name: "", email: "", message: "" };
type Status = "idle" | "sending" | "success" | "error";

const inputClass = "w-full rounded border border-current/30 bg-transparent p-2";
const errorClass = "text-sm text-red-500";

export function Contact() {
  const [values, setValues] = useState<ContactFormValues>(emptyValues);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  function handleChange(field: keyof ContactFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validateContactForm(values);
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
    <section id="contact" className="flex items-center journey:min-h-screen px-4 py-24">
      <div className="mx-auto w-full max-w-xl">
        <SectionTitle>{contact.title}</SectionTitle>
        <ScrollReveal as="p" delay={80} className="mb-6">{contact.intro}</ScrollReveal>
        <ScrollReveal delay={160}>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            {contact.fields.name}
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={(e) => handleChange("name", e.target.value)}
              aria-invalid={Boolean(errors.name)}
              className={inputClass}
            />
            {errors.name && (
              <span role="alert" className={errorClass}>
                {errors.name}
              </span>
            )}
          </label>
          <label className="flex flex-col gap-1">
            {contact.fields.email}
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={(e) => handleChange("email", e.target.value)}
              aria-invalid={Boolean(errors.email)}
              className={inputClass}
            />
            {errors.email && (
              <span role="alert" className={errorClass}>
                {errors.email}
              </span>
            )}
          </label>
          <label className="flex flex-col gap-1">
            {contact.fields.message}
            <textarea
              name="message"
              rows={5}
              value={values.message}
              onChange={(e) => handleChange("message", e.target.value)}
              aria-invalid={Boolean(errors.message)}
              className={inputClass}
            />
            {errors.message && (
              <span role="alert" className={errorClass}>
                {errors.message}
              </span>
            )}
          </label>
          <Button type="submit" disabled={status === "sending"}>
            {contact.submitLabel}
          </Button>
          {status === "success" && <p role="status">{contact.successMessage}</p>}
          {status === "error" && (
            <p role="alert" className={errorClass}>
              {contact.errorMessage}
            </p>
          )}
        </form>
        </ScrollReveal>
      </div>
    </section>
  );
}
