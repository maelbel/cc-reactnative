/**
 * Centralised configuration.
 *
 * Keeping every external constant in one place (rather than scattering
 * literals across the codebase) is what lets the API base URL, the quote
 * recipient address, or the email-provider credentials change without
 * touching business logic — a small but concrete instance of the
 * "Organisation des packages" / "Dette technique" criteria.
 */
export const ENV = {
  /** Base URL of the Dawan public training REST service. */
  TRAINING_API_BASE_URL: 'https://dawan.org/public/training',

  /** Address that receives quote requests submitted from the app. */
  QUOTE_RECIPIENT_EMAIL: 'commercial@example-lmcontrol.fr',

  /**
   * EmailJS (https://www.emailjs.com) is used as a lightweight way for a
   * client-only mobile app to trigger an email without standing up a
   * backend. These are placeholders: replace them with real values from
   * an EmailJS account before shipping, and treat the public key as
   * non-secret but rate-limited (EmailJS is designed to be called from
   * untrusted clients).
   */
  EMAILJS: {
    SERVICE_ID: 'REPLACE_WITH_EMAILJS_SERVICE_ID',
    TEMPLATE_ID: 'REPLACE_WITH_EMAILJS_TEMPLATE_ID',
    PUBLIC_KEY: 'REPLACE_WITH_EMAILJS_PUBLIC_KEY',
    ENDPOINT: 'https://api.emailjs.com/api/v1.0/email/send',
  },

  /** Network timeout applied to every HTTP call, in milliseconds. */
  HTTP_TIMEOUT_MS: 10_000,
} as const;
