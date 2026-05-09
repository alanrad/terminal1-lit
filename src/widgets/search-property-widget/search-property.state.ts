import { signal } from '@state/signal';
import type { TransformedProperty } from '@services/property.service';

export function createSearchPropertyState() {
  const query = signal('');
  const properties = signal<TransformedProperty[] | null>(null);
  const results = signal<TransformedProperty[]>([]);

  return {
    query,
    properties,
    results,
    setQuery: (value: string) => { query.value = value; },
    setProperties: (data: TransformedProperty[]) => { properties.value = data; },
    setResults: (data: TransformedProperty[]) => { results.value = data; },
    clearResults: () => { results.value = []; },
  };
}

export type SearchPropertyState = ReturnType<typeof createSearchPropertyState>;
