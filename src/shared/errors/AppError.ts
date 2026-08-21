/**
 * Typed error hierarchy used across the app so that call sites can react to
 * *categories* of failure ("no network", "server error", "bad input")
 * instead of parsing error messages. This is what "Gestion des exceptions"
 * hooks into: screens catch `AppError` and render an appropriate message,
 * everything else is treated as a genuine bug and surfaced by the
 * top-level ErrorBoundary.
 */
export abstract class AppError extends Error {
  abstract readonly kind: 'network' | 'http' | 'validation' | 'unknown';

  protected constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = new.target.name;
  }
}

/** The device has no connectivity, or the request timed out. */
export class NetworkError extends AppError {
  readonly kind = 'network' as const;

  constructor(message = 'Impossible de contacter le serveur. Vérifiez votre connexion.', cause?: unknown) {
    super(message, cause);
  }
}

/** The server responded, but with a non-2xx status code. */
export class HttpError extends AppError {
  readonly kind = 'http' as const;

  constructor(readonly status: number, message?: string, cause?: unknown) {
    super(message ?? `Le serveur a répondu avec le statut ${status}.`, cause);
  }
}

/** A specific, well-known HTTP error: the requested resource does not exist. */
export class NotFoundError extends HttpError {
  constructor(resource: string) {
    super(404, `${resource} introuvable.`);
  }
}

/** User input failed validation before any network call was made. */
export class ValidationError extends AppError {
  readonly kind = 'validation' as const;

  constructor(message: string, readonly fieldErrors: Record<string, string> = {}) {
    super(message);
  }
}

/** Fallback for anything that doesn't fit the categories above. */
export class UnknownError extends AppError {
  readonly kind = 'unknown' as const;

  constructor(cause?: unknown) {
    super('Une erreur inattendue est survenue.', cause);
  }
}

/** Normalises any thrown value into an `AppError`. */
export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  if (error instanceof Error && error.name === 'AbortError') return new NetworkError('La requête a expiré.', error);
  return new UnknownError(error);
}
