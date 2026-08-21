import { ENV } from '../config/env';
import { QuoteRequest } from '../domain/models/Quote';
import { toAppError } from '../shared/errors/AppError';
import { httpClient } from './httpClient';

/**
 * Sends a quote request by email.
 *
 * A pure mobile client cannot send SMTP mail itself, so this calls
 * EmailJS (https://www.emailjs.com), a service designed to be invoked
 * directly from untrusted/client-side code with a public key. This keeps
 * requirement 3 ("le formulaire envoie un email") satisfied without a
 * custom backend.
 *
 * This is an explicit, documented trade-off (see README "Dette technique
 * assumée"): the EmailJS public key ships inside the app bundle. Because
 * this function is the *only* place that knows about EmailJS, swapping it
 * for a real backend endpoint — or for a `Linking.openURL('mailto:...')`
 * fallback — later is a one-file change; nothing else in the app depends
 * on how the email is actually sent.
 */
export interface QuoteApi {
  sendQuoteRequest(request: QuoteRequest): Promise<void>;
}

class EmailJsQuoteApi implements QuoteApi {
  async sendQuoteRequest(request: QuoteRequest): Promise<void> {
    try {
      await httpClient.post<void>(ENV.EMAILJS.ENDPOINT, {
        service_id: ENV.EMAILJS.SERVICE_ID,
        template_id: ENV.EMAILJS.TEMPLATE_ID,
        user_id: ENV.EMAILJS.PUBLIC_KEY,
        template_params: {
          to_email: ENV.QUOTE_RECIPIENT_EMAIL,
          from_name: request.fullName,
          from_email: request.email,
          phone: request.phone ?? '(non renseigné)',
          training_title: request.trainingTitle,
          training_slug: request.trainingSlug,
          message: request.message ?? '(aucun message)',
        },
      });
    } catch (error) {
      throw toAppError(error);
    }
  }
}

export const quoteApi: QuoteApi = new EmailJsQuoteApi();
