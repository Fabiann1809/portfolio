export interface ContactData {
  title: string;
  intro: string;
  fields: {
    name: string;
    email: string;
    message: string;
  };
  submitLabel: string;
  successMessage: string;
  errorMessage: string;
}

export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;
