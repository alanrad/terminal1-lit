import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiFetch, HttpError } from './fetch';

describe('apiFetch', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns parsed JSON on 200', async () => {
    const mockFetch = vi.mocked(globalThis.fetch);
    mockFetch.mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    const result = await apiFetch<{ ok: boolean }>('/test');
    expect(result).toEqual({ ok: true });
  });

  it('throws HttpError on non-2xx', async () => {
    const mockFetch = vi.mocked(globalThis.fetch);
    mockFetch.mockResolvedValue(
      new Response('Not Found', { status: 404, statusText: 'Not Found' }),
    );
    await expect(apiFetch('/missing')).rejects.toBeInstanceOf(HttpError);
  });

  it('prepends baseUrl', async () => {
    const mockFetch = vi.mocked(globalThis.fetch);
    mockFetch.mockResolvedValue(new Response(JSON.stringify({}), { status: 200 }));
    await apiFetch('/path', { baseUrl: 'https://api.example.com' });
    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/path', expect.any(Object));
  });
});
