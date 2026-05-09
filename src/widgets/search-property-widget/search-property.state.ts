import { signal } from '@state/signal';

export function createSearchPropertyState() {
  const query = signal('');

  return {
    query,
    setQuery: (value: string) => { query.value = value; },
  };
}

export type SearchPropertyState = ReturnType<typeof createSearchPropertyState>;
