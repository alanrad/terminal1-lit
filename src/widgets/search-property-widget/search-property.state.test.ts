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

  describe('properties signal', () => {
    it('initialises as null', () => {
      const s = createSearchPropertyState();
      expect(s.properties.value).toBeNull();
    });

    it('setProperties stores the given array', () => {
      const s = createSearchPropertyState();
      const stub = [{ id: 1, fullAddress: 'A, B, C, D, E' }] as Parameters<typeof s.setProperties>[0];
      s.setProperties(stub);
      expect(s.properties.value).toStrictEqual(stub);
    });

    it('setProperties replaces any previous value', () => {
      const s = createSearchPropertyState();
      const first = [{ id: 1, fullAddress: 'A' }] as Parameters<typeof s.setProperties>[0];
      const second = [{ id: 2, fullAddress: 'B' }, { id: 3, fullAddress: 'C' }] as Parameters<typeof s.setProperties>[0];
      s.setProperties(first);
      s.setProperties(second);
      expect(s.properties.value).toStrictEqual(second);
    });

    it('each factory call has independent properties state', () => {
      const a = createSearchPropertyState();
      const b = createSearchPropertyState();
      a.setProperties([{ id: 99, fullAddress: 'X' }] as Parameters<typeof a.setProperties>[0]);
      expect(b.properties.value).toBeNull();
    });
  });

  describe('results signal', () => {
    it('initialises as an empty array', () => {
      const s = createSearchPropertyState();
      expect(s.results.value).toEqual([]);
    });

    it('setResults stores the given array', () => {
      const s = createSearchPropertyState();
      const stub = [{ id: 1, fullAddress: 'A, B, C, D, E' }] as Parameters<typeof s.setResults>[0];
      s.setResults(stub);
      expect(s.results.value).toStrictEqual(stub);
    });

    it('setResults replaces any previous value', () => {
      const s = createSearchPropertyState();
      const first = [{ id: 1, fullAddress: 'A' }] as Parameters<typeof s.setResults>[0];
      const second = [{ id: 2, fullAddress: 'B' }] as Parameters<typeof s.setResults>[0];
      s.setResults(first);
      s.setResults(second);
      expect(s.results.value).toStrictEqual(second);
    });

    it('each factory call has independent results state', () => {
      const a = createSearchPropertyState();
      const b = createSearchPropertyState();
      a.setResults([{ id: 1, fullAddress: 'X' }] as Parameters<typeof a.setResults>[0]);
      expect(b.results.value).toEqual([]);
    });

    it('clearResults resets results to an empty array', () => {
      const s = createSearchPropertyState();
      s.setResults([{ id: 1, fullAddress: 'A' }] as Parameters<typeof s.setResults>[0]);
      s.clearResults();
      expect(s.results.value).toEqual([]);
    });
  });
});
