import { useCallback, useEffect, useRef, useState } from 'react';
import { AppError, toAppError } from '../errors/AppError';

export type AsyncState<T> =
  | { status: 'loading'; data: undefined; error: undefined }
  | { status: 'success'; data: T; error: undefined }
  | { status: 'error'; data: undefined; error: AppError };

/**
 * Generic "fetch something async, track loading/success/error" hook.
 * Reused as-is by the training list, the training detail screen, and can
 * back any future screen with the same shape of need — this is the
 * "généricité" instance on the presentation side, mirroring the generic
 * `httpClient` on the data side.
 *
 * `deps` mirrors `useEffect`'s dependency array: the async function
 * re-runs whenever one of them changes (e.g. the `slug` param).
 */
export function useAsync<T>(fn: () => Promise<T>, deps: ReadonlyArray<unknown>): AsyncState<T> & { retry: () => void } {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading', data: undefined, error: undefined });
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const run = useCallback(() => {
    let cancelled = false;
    setState({ status: 'loading', data: undefined, error: undefined });

    fnRef
      .current()
      .then((data) => {
        if (!cancelled) setState({ status: 'success', data, error: undefined });
      })
      .catch((error) => {
        if (!cancelled) setState({ status: 'error', data: undefined, error: toAppError(error) });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => run(), [run]);

  return { ...state, retry: run };
}
