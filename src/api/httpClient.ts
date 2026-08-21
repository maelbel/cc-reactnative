import { ENV } from '../config/env';
import { HttpError, NetworkError, toAppError } from '../shared/errors/AppError';

/**
 * Generic, dependency-free HTTP client built on top of `fetch`.
 *
 * It is intentionally the *only* place in the codebase that talks to
 * `fetch`/timeouts/JSON parsing directly. Every other module — the
 * training API, the quote API — depends on this generic `get<T>`/`post<T>`
 * instead of duplicating request plumbing, which is the concrete
 * "généricité" + "tell, don't ask" instance for this layer: callers ask
 * for a typed result, they don't inspect a raw `Response` themselves.
 */
class HttpClient {
  constructor(private readonly timeoutMs: number = ENV.HTTP_TIMEOUT_MS) {}

  async get<T>(url: string): Promise<T> {
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(url: string, body: unknown): Promise<T> {
    return this.request<T>(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  private async request<T>(url: string, init: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    let response: Response;

    try {
      response = await fetch(url, { ...init, signal: controller.signal });
    } catch (error) {
      if (error instanceof TypeError) {
        // fetch() rejects with a TypeError for DNS/connection failures.
        throw new NetworkError('Impossible de contacter le serveur. Vérifiez votre connexion.', error);
      }
      throw toAppError(error);
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      throw new HttpError(response.status, await this.safeReadMessage(response));
    }

    // Some endpoints (e.g. a successful email-send) may return an empty body.
    const text = await response.text();
    return (text ? JSON.parse(text) : undefined) as T;
  }

  private async safeReadMessage(response: Response): Promise<string | undefined> {
    try {
      const body = await response.text();
      return body || undefined;
    } catch {
      return undefined;
    }
  }
}

export const httpClient = new HttpClient();
