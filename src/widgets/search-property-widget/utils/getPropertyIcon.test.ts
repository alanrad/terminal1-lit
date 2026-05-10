import { test, expect } from 'vitest';
import getPropertyIcon from './getPropertyIcon';

test('returns buildings for hotel', () => {
  expect(getPropertyIcon('hotel')).toBe('buildings');
});

test('returns house for motel', () => {
  expect(getPropertyIcon('motel')).toBe('house');
});

test('returns building for apartment', () => {
  expect(getPropertyIcon('apartment')).toBe('building');
});

test('returns houses for hostel', () => {
  expect(getPropertyIcon('hostel')).toBe('houses');
});

test('returns building for an unknown property type', () => {
  expect(getPropertyIcon('resort')).toBe('building');
});

test('is case-insensitive', () => {
  expect(getPropertyIcon('Hotel')).toBe('buildings');
  expect(getPropertyIcon('MOTEL')).toBe('house');
  expect(getPropertyIcon('Apartment')).toBe('building');
});
