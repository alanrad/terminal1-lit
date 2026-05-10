export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export interface FetchOptions extends RequestInit {
  baseUrl?: string;
  timeoutMs?: number;
}

/**
 * Thin fetch wrapper used by services.
 * - Automatically parses JSON responses.
 * - Throws HttpError for non-2xx status codes.
 * - Supports optional request timeout.
 */
export async function apiFetch<T = unknown>(
  path: string,
  { baseUrl = '', timeoutMs, ...init }: FetchOptions = {},
): Promise<T> {
  const url = baseUrl ? `${baseUrl}${path}` : path;

  const controller = timeoutMs ? new AbortController() : null;
  const timerId = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

  try {
    const res = await fetch(url, {
      ...init,
      signal: controller?.signal ?? init.signal,
      headers: {
        'Content-Type': 'application/json',
        ...init.headers,
      },
    });

    if (!res.ok) {
      throw new HttpError(res.status, `HTTP ${res.status}: ${res.statusText}`);
    }

    return (await res.json()) as T;
  } finally {
    if (timerId !== null) clearTimeout(timerId);
  }
}
