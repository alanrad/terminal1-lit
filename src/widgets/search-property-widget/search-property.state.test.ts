import { test, expect } from 'vitest';
import createSearchPropertyState from './search-property.state';

test('query signal initialises with an empty query', () => {
  const state = createSearchPropertyState();
  expect(state.query.value).toBe('');
});

test('setQuery updates the query signal', () => {
  const state = createSearchPropertyState();
  state.setQuery('Paris');
  expect(state.query.value).toBe('Paris');
});

test('multiple setQuery calls update to the latest value', () => {
  const state = createSearchPropertyState();
  state.setQuery('New York');
  state.setQuery('London');
  expect(state.query.value).toBe('London');
});

test('each factory call returns independent query state', () => {
  const stateA = createSearchPropertyState();
  const stateB = createSearchPropertyState();
  stateA.setQuery('Tokyo');
  expect(stateB.query.value).toBe('');
});

test('properties signal initialises as null', () => {
  const state = createSearchPropertyState();
  expect(state.properties.value).toBeNull();
});

test('setProperties stores the given array', () => {
  const state = createSearchPropertyState();
  const stub = [{ id: 1, fullAddress: 'A, B, C, D, E' }] as Parameters<
    typeof state.setProperties
  >[0];
  state.setProperties(stub);
  expect(state.properties.value).toStrictEqual(stub);
});

test('setProperties replaces any previous value', () => {
  const state = createSearchPropertyState();
  const first = [{ id: 1, fullAddress: 'A' }] as Parameters<typeof state.setProperties>[0];
  const second = [
    { id: 2, fullAddress: 'B' },
    { id: 3, fullAddress: 'C' },
  ] as Parameters<typeof state.setProperties>[0];
  state.setProperties(first);
  state.setProperties(second);
  expect(state.properties.value).toStrictEqual(second);
});

test('each factory call returns independent properties state', () => {
  const stateA = createSearchPropertyState();
  const stateB = createSearchPropertyState();
  stateA.setProperties([{ id: 99, fullAddress: 'X' }] as Parameters<
    typeof stateA.setProperties
  >[0]);
  expect(stateB.properties.value).toBeNull();
});

test('results signal initialises as an empty array', () => {
  const state = createSearchPropertyState();
  expect(state.results.value).toEqual([]);
});

test('setResults stores the given array', () => {
  const state = createSearchPropertyState();
  const stub = [{ id: 1, fullAddress: 'A, B, C, D, E' }] as Parameters<typeof state.setResults>[0];
  state.setResults(stub);
  expect(state.results.value).toStrictEqual(stub);
});

test('setResults replaces any previous value', () => {
  const state = createSearchPropertyState();
  const first = [{ id: 1, fullAddress: 'A' }] as Parameters<typeof state.setResults>[0];
  const second = [{ id: 2, fullAddress: 'B' }] as Parameters<typeof state.setResults>[0];
  state.setResults(first);
  state.setResults(second);
  expect(state.results.value).toStrictEqual(second);
});

test('each factory call returns independent results state', () => {
  const stateA = createSearchPropertyState();
  const stateB = createSearchPropertyState();
  stateA.setResults([{ id: 1, fullAddress: 'X' }] as Parameters<typeof stateA.setResults>[0]);
  expect(stateB.results.value).toEqual([]);
});

test('clearResults resets results to an empty array', () => {
  const state = createSearchPropertyState();
  state.setResults([{ id: 1, fullAddress: 'A' }] as Parameters<typeof state.setResults>[0]);
  state.clearResults();
  expect(state.results.value).toEqual([]);
});

test('setResults with non-empty data opens the popup', () => {
  const state = createSearchPropertyState();
  state.setResults([{ id: 1, fullAddress: 'A' }] as Parameters<typeof state.setResults>[0]);
  expect(state.popupVisible.value).toBe(true);
});

test('setResults with an empty array closes the popup', () => {
  const state = createSearchPropertyState();
  state.setResults([{ id: 1, fullAddress: 'A' }] as Parameters<typeof state.setResults>[0]);
  state.setResults([]);
  expect(state.popupVisible.value).toBe(false);
});

test('clearResults closes the popup', () => {
  const state = createSearchPropertyState();
  state.clearResults();
  expect(state.popupVisible.value).toBe(false);
});

test('popupVisible signal initialises as false', () => {
  const state = createSearchPropertyState();
  expect(state.popupVisible.value).toBe(false);
});

test('showPopup sets popupVisible to true', () => {
  const state = createSearchPropertyState();
  state.showPopup();
  expect(state.popupVisible.value).toBe(true);
});

test('hidePopup sets popupVisible to false without clearing results', () => {
  const state = createSearchPropertyState();
  const stub = [{ id: 1, fullAddress: 'A' }] as Parameters<typeof state.setResults>[0];
  state.setResults(stub);
  state.hidePopup();
  expect(state.popupVisible.value).toBe(false);
  expect(state.results.value).toStrictEqual(stub);
});

test('each factory call returns independent popupVisible state', () => {
  const stateA = createSearchPropertyState();
  const stateB = createSearchPropertyState();
  stateA.showPopup();
  expect(stateB.popupVisible.value).toBe(false);
});

test('loading signal initialises as false', () => {
  const state = createSearchPropertyState();
  expect(state.loading.value).toBe(false);
});

test('setLoading updates the loading signal', () => {
  const state = createSearchPropertyState();
  state.setLoading(true);
  expect(state.loading.value).toBe(true);
});

test('setLoading can toggle back to false', () => {
  const state = createSearchPropertyState();
  state.setLoading(true);
  state.setLoading(false);
  expect(state.loading.value).toBe(false);
});

test('each factory call returns independent loading state', () => {
  const stateA = createSearchPropertyState();
  const stateB = createSearchPropertyState();
  stateA.setLoading(true);
  expect(stateB.loading.value).toBe(false);
});

test('selectedProperty signal initialises as null', () => {
  const state = createSearchPropertyState();
  expect(state.selectedProperty.value).toBeNull();
});

test('setSelectedProperty stores the given property', () => {
  const state = createSearchPropertyState();
  const stub = { id: 1, fullAddress: 'A' } as Parameters<typeof state.setSelectedProperty>[0];
  state.setSelectedProperty(stub);
  expect(state.selectedProperty.value).toStrictEqual(stub);
});

test('clearSelectedProperty resets selectedProperty to null', () => {
  const state = createSearchPropertyState();
  const stub = { id: 1, fullAddress: 'A' } as Parameters<typeof state.setSelectedProperty>[0];
  state.setSelectedProperty(stub);
  state.clearSelectedProperty();
  expect(state.selectedProperty.value).toBeNull();
});

test('clearResults also resets selectedProperty to null', () => {
  const state = createSearchPropertyState();
  const stub = { id: 1, fullAddress: 'A' } as Parameters<typeof state.setSelectedProperty>[0];
  state.setSelectedProperty(stub);
  state.clearResults();
  expect(state.selectedProperty.value).toBeNull();
});

test('each factory call returns independent selectedProperty state', () => {
  const stateA = createSearchPropertyState();
  const stateB = createSearchPropertyState();
  stateA.setSelectedProperty({ id: 1, fullAddress: 'A' } as Parameters<
    typeof stateA.setSelectedProperty
  >[0]);
  expect(stateB.selectedProperty.value).toBeNull();
});

test('showSkeleton signal initialises as false', () => {
  const state = createSearchPropertyState();
  expect(state.showSkeleton.value).toBe(false);
});

test('setShowSkeleton sets the value to true', () => {
  const state = createSearchPropertyState();
  state.setShowSkeleton(true);
  expect(state.showSkeleton.value).toBe(true);
});

test('setShowSkeleton can toggle back to false', () => {
  const state = createSearchPropertyState();
  state.setShowSkeleton(true);
  state.setShowSkeleton(false);
  expect(state.showSkeleton.value).toBe(false);
});

test('clearResults also resets showSkeleton to false', () => {
  const state = createSearchPropertyState();
  state.setShowSkeleton(true);
  state.clearResults();
  expect(state.showSkeleton.value).toBe(false);
});

test('each factory call returns independent showSkeleton state', () => {
  const stateA = createSearchPropertyState();
  const stateB = createSearchPropertyState();
  stateA.setShowSkeleton(true);
  expect(stateB.showSkeleton.value).toBe(false);
});
