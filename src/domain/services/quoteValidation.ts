import { ValidationError } from '../../shared/errors/AppError';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface QuoteFormValues {
  fullName: string;
  email: string;
  phone: string;
  message: string;
}

/**
 * Pure validation logic, isolated from the form component. The screen
 * *asks* this service whether the values are valid and *tells* the user
 * the result — it never re-implements the rules itself (tell, don't ask).
 * Throws a `ValidationError` carrying per-field messages so the UI can
 * highlight exactly which inputs are wrong.
 */
export function validateQuoteForm(values: QuoteFormValues): void {
  const fieldErrors: Record<string, string> = {};

  if (!values.fullName.trim()) {
    fieldErrors.fullName = 'Le nom est obligatoire.';
  }

  if (!values.email.trim()) {
    fieldErrors.email = "L'email est obligatoire.";
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    fieldErrors.email = "Cet email ne semble pas valide.";
  }

  if (values.phone && !/^[0-9+ .-]{6,}$/.test(values.phone.trim())) {
    fieldErrors.phone = 'Ce numéro de téléphone ne semble pas valide.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw new ValidationError('Le formulaire contient des erreurs.', fieldErrors);
  }
}
