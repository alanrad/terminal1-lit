import type { LitElement, ReactiveController, ReactiveControllerHost } from 'lit';

export type FunctionParams<T> = T extends (...args: infer U) => string ? U : [];

export interface Translation {
  $code: string;
  $name: string;
  $dir: 'ltr' | 'rtl';
  loading?: string;
  [key: string]: unknown;
}

export interface ExistsOptions {
  lang: string;
  includeFallback: boolean;
}

const connectedElements = new Set<HTMLElement>();
const translationsMap = new Map<string, Translation>();
let fallback: Translation | undefined;

let documentDirection = 'ltr';
let documentLanguage = 'en';

const isClient =
  typeof MutationObserver !== 'undefined' &&
  typeof document !== 'undefined' &&
  typeof document.documentElement !== 'undefined';

if (isClient) {
  const observer = new MutationObserver(_update);
  documentDirection = document.documentElement.dir || 'ltr';
  documentLanguage = document.documentElement.lang || navigator.language;
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['dir', 'lang'],
  });
}

export function registerTranslation(...translations: Translation[]) {
  translations.forEach(t => {
    const code = t.$code.toLowerCase();
    translationsMap.set(code, translationsMap.has(code) ? { ...translationsMap.get(code), ...t } : t);
    if (!fallback) fallback = t;
  });
  _update();
}

function _update() {
  if (isClient) {
    documentDirection = document.documentElement.dir || 'ltr';
    documentLanguage = document.documentElement.lang || navigator.language;
  }
  connectedElements.forEach(el => {
    (el as Partial<LitElement>).requestUpdate?.();
  });
}

registerTranslation({
  $code: 'en',
  $name: 'English',
  $dir: 'ltr',
  clearEntry: 'Clear entry',
  hidePassword: 'Hide password',
  showPassword: 'Show password',
  loading: 'Loading',
});

export class LocalizeController<UserTranslation extends Translation = Translation>
  implements ReactiveController
{
  host: ReactiveControllerHost & HTMLElement;

  constructor(host: ReactiveControllerHost & HTMLElement) {
    this.host = host;
    this.host.addController(this);
  }

  hostConnected() {
    connectedElements.add(this.host);
  }

  hostDisconnected() {
    connectedElements.delete(this.host);
  }

  dir(): string {
    return `${this.host.dir || documentDirection}`.toLowerCase();
  }

  lang(): string {
    return `${this.host.lang || documentLanguage}`.toLowerCase();
  }

  private getTranslationData(lang: string) {
    let locale: Intl.Locale | undefined;
    try {
      locale = new Intl.Locale(lang.replace(/_/g, '-'));
    } catch {
      return { primary: undefined as UserTranslation | undefined, secondary: undefined as UserTranslation | undefined };
    }
    const language = locale.language.toLowerCase();
    const region = locale.region?.toLowerCase() ?? '';
    return {
      primary: translationsMap.get(`${language}-${region}`) as UserTranslation | undefined,
      secondary: translationsMap.get(language) as UserTranslation | undefined,
    };
  }

  exists<K extends keyof UserTranslation>(key: K, options: Partial<ExistsOptions> = {}): boolean {
    const { primary, secondary } = this.getTranslationData(options.lang ?? this.lang());
    return !!(
      primary?.[key] ??
      secondary?.[key] ??
      (options.includeFallback && fallback && (fallback as Record<string, unknown>)[String(key)])
    );
  }

  term<K extends keyof UserTranslation>(key: K, ...args: FunctionParams<UserTranslation[K]>): string {
    const { primary, secondary } = this.getTranslationData(this.lang());
    const term =
      primary?.[key] ??
      secondary?.[key] ??
      (fallback ? (fallback as Record<string, unknown>)[String(key)] : undefined);

    if (term === undefined) {
      console.error(`No translation found for: ${String(key)}`);
      return String(key);
    }
    if (typeof term === 'function') {
      return (term as (...a: unknown[]) => string)(...(args as unknown[]));
    }
    return String(term);
  }

  date(dateToFormat: Date | string, options?: Intl.DateTimeFormatOptions): string {
    return new Intl.DateTimeFormat(this.lang(), options).format(new Date(dateToFormat));
  }

  number(numberToFormat: number | string, options?: Intl.NumberFormatOptions): string {
    const n = Number(numberToFormat);
    return isNaN(n) ? '' : new Intl.NumberFormat(this.lang(), options).format(n);
  }

  relativeTime(
    value: number,
    unit: Intl.RelativeTimeFormatUnit,
    options?: Intl.RelativeTimeFormatOptions,
  ): string {
    return new Intl.RelativeTimeFormat(this.lang(), options).format(value, unit);
  }
}
