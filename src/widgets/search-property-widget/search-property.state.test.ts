import { describe, it, expect } from 'vitest';
import { createSearchPropertyState } from './search-property.state';

describe('createSearchPropertyState', () => {
  it('initialises with an empty query', () => {
    const s = createSearchPropertyState();
    expect(s.query.value).toBe('');
  });

  it('setQuery updates the query signal', () => {
    const s = createSearchPropertyState();
    s.setQuery('Paris');
    expect(s.query.value).toBe('Paris');
  });

  it('multiple setQuery calls update to the latest value', () => {
    const s = createSearchPropertyState();
    s.setQuery('New York');
    s.setQuery('London');
    expect(s.query.value).toBe('London');
  });

  it('each factory call returns independent state', () => {
    const a = createSearchPropertyState();
    const b = createSearchPropertyState();
    a.setQuery('Tokyo');
    expect(b.query.value).toBe('');
  });
});
