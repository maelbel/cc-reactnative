import { httpClient } from '../../src/api/httpClient';
import { HttpError, NetworkError } from '../../src/shared/errors/AppError';

function mockFetchOnce(response: Partial<Response> & { ok: boolean; status?: number }) {
  (global as any).fetch = jest.fn().mockResolvedValue({
    ok: response.ok,
    status: response.status ?? (response.ok ? 200 : 500),
    text: async () => (response as any).text ?? '',
  });
}

describe('httpClient', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('parses a successful JSON response', async () => {
    mockFetchOnce({ ok: true, text: JSON.stringify({ hello: 'world' }) } as any);

    const result = await httpClient.get<{ hello: string }>('https://example.test/ok');

    expect(result).toEqual({ hello: 'world' });
  });

  it('returns undefined for an empty successful body', async () => {
    mockFetchOnce({ ok: true, text: '' } as any);

    const result = await httpClient.post<void>('https://example.test/empty', {});

    expect(result).toBeUndefined();
  });

  it('throws an HttpError for a non-2xx response', async () => {
    mockFetchOnce({ ok: false, status: 404, text: 'Not found' } as any);

    await expect(httpClient.get('https://example.test/missing')).rejects.toBeInstanceOf(HttpError);
  });

  it('throws a NetworkError when fetch itself fails (e.g. no connectivity)', async () => {
    (global as any).fetch = jest.fn().mockRejectedValue(new TypeError('Network request failed'));

    await expect(httpClient.get('https://example.test/offline')).rejects.toBeInstanceOf(NetworkError);
  });
});
