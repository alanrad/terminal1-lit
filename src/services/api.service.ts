import { apiFetch, type FetchOptions } from "@utils/fetch";

export interface WidgetConfig {
  baseUrl?: string;
  apiKey?: string;
  timeoutMs?: number;
}

/**
 * Base class for all API services.
 * Concrete services extend this and add domain-specific methods.
 */
export abstract class ApiService {
  protected readonly baseUrl: string;
  private readonly apiKey?: string;
  private readonly timeoutMs?: number;

  constructor({ baseUrl = "", apiKey, timeoutMs }: WidgetConfig = {}) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.timeoutMs = timeoutMs;
  }

  protected fetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
    const headers: Record<string, string> = {};
    if (this.apiKey) headers["Authorization"] = `Bearer ${this.apiKey}`;
    return apiFetch<T>(path, {
      baseUrl: this.baseUrl,
      timeoutMs: this.timeoutMs,
      ...opts,
      headers: { ...headers, ...(opts.headers as Record<string, string>) },
    });
  }
}
