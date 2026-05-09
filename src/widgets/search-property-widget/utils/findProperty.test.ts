import { describe, it, expect } from 'vitest';
import { findProperty } from './findProperty';
import type { TransformedProperty } from '@services/property.service';

const make = (id: number, fullAddress: string): TransformedProperty => ({
  id,
  name: `Property ${id}`,
  rating: 3,
  propertyType: 'hotel',
  facilities: [],
  address: '',
  city: '',
  state: '',
  postcode: '',
  country: '',
  price: { total: 0, currency: 'AUD' },
  fullAddress,
});

const properties: TransformedProperty[] = [
  make(1, '141 George Road, Gold Coast, QLD, 4217, Australia'),
  make(2, '10 King Street, Sydney, NSW, 2000, Australia'),
  make(3, '5 Ocean Drive, Byron Bay, NSW, 2481, Australia'),
];

describe('findProperty', () => {
  it('returns an empty array when the properties list is empty', () => {
    expect(findProperty([], 'Gold Coast')).toEqual([]);
  });

  it('returns an empty array when no property matches the phrase', () => {
    expect(findProperty(properties, 'Tokyo')).toEqual([]);
  });

  it('returns a property whose fullAddress exactly matches the phrase', () => {
    const result = findProperty(properties, '141 George Road, Gold Coast, QLD, 4217, Australia');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it('returns a property when the phrase is a partial match', () => {
    const result = findProperty(properties, 'Gold Coast');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it('is case-insensitive', () => {
    const result = findProperty(properties, 'gold coast');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it('matches on postcode', () => {
    const result = findProperty(properties, '2000');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it('returns multiple properties when more than one fullAddress matches', () => {
    const result = findProperty(properties, 'NSW');
    expect(result).toHaveLength(2);
    expect(result.map(p => p.id)).toEqual([2, 3]);
  });

  it('returns all properties when phrase is an empty string', () => {
    expect(findProperty(properties, '')).toHaveLength(properties.length);
  });
});
