export interface ContactData {
  /** Section label, shown as "// LABEL". */
  label: string;
  /** Giant headline, one entry per line. */
  headlineLines: string[];
  intro: string;
  availability: string;
  email: string;
  emailLabel: string;
  location: string;
  locationLabel: string;
  socialsLabel: string;
  fields: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
  submitLabel: string;
  sendingLabel: string;
  successMessage: string;
  errorMessage: string;
}

export interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;
