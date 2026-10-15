/**
 * Centralised configuration.
 *
 * Every external constant lives here so that the API base URL, the quote
 * recipient address or the email-provider credentials can change without
 * touching business logic ("Organisation des packages" / "Dette technique").
 *
 * Values come from a local `.env` file (never committed — see
 * `.env.example` for the expected keys). Expo inlines variables prefixed
 * with `EXPO_PUBLIC_` at build time, and they must be read with the
 * *static* form `process.env.EXPO_PUBLIC_X` (no destructuring, no dynamic
 * keys), otherwise they are not replaced.
 *
 * ⚠️ `EXPO_PUBLIC_*` values end up in the shipped JavaScript bundle: a
 * `.env` keeps them out of git, it does not make them secret. That is
 * acceptable for the EmailJS public key (designed for untrusted clients)
 * but a real secret must live on a backend, never in this file.
 */
export const ENV = {
  /** Base URL of the Dawan public training REST service. */
  TRAINING_API_BASE_URL:
    process.env.EXPO_PUBLIC_TRAINING_API_BASE_URL ?? 'https://dawan.org/public/training',

  /** Address that receives quote requests submitted from the app. */
  QUOTE_RECIPIENT_EMAIL:
    process.env.EXPO_PUBLIC_QUOTE_RECIPIENT_EMAIL ?? 'commercial@example.fr',

  /**
   * EmailJS (https://www.emailjs.com) lets a client-only mobile app trigger
   * an email without standing up a backend. Credentials come from `.env`;
   * when they are empty, sending a quote fails with an HTTP error.
   */
  EMAILJS: {
    SERVICE_ID: process.env.EXPO_PUBLIC_EMAILJS_SERVICE_ID ?? '',
    TEMPLATE_ID: process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_ID ?? '',
    PUBLIC_KEY: process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY ?? '',
    ENDPOINT: 'https://api.emailjs.com/api/v1.0/email/send',
  },

  /** Network timeout applied to every HTTP call, in milliseconds. */
  HTTP_TIMEOUT_MS: Number(process.env.EXPO_PUBLIC_HTTP_TIMEOUT_MS) || 10_000,
};
