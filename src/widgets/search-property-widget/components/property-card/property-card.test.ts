import { expect, vi, afterEach, test } from 'vitest';
import './index';
import type { TransformedProperty } from '@services/property.service';

type PropertyCardEl = HTMLElement & {
  updateComplete: Promise<boolean>;
  selectedProperty: TransformedProperty | null;
};

const mockProperty: TransformedProperty = {
  id: 1,
  name: 'The Hotel Windsor',
  rating: 4.5,
  propertyType: 'hotel',
  facilities: ['Daily breakfast', 'Free WiFi', 'Swimming pool', 'Spa', 'Gym'],
  address: '111 Spring Street',
  city: 'Melbourne',
  state: 'VIC',
  postcode: '3000',
  country: 'Australia',
  price: { total: 200, currency: 'AUD' },
  fullAddress: 'The Hotel Windsor, 111 Spring Street, Melbourne, VIC, 3000, Australia',
};

function createElement(): PropertyCardEl {
  const el = document.createElement('property-card') as unknown as PropertyCardEl;
  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  document.body.querySelectorAll('property-card').forEach((el) => el.remove());
  vi.restoreAllMocks();
});

test('renders nothing when selectedProperty is null', async () => {
  const el = createElement();
  await el.updateComplete;
  expect(el.shadowRoot!.querySelector('t1-card')).toBeNull();
});

test('card shows property name', async () => {
  const el = createElement();
  el.selectedProperty = mockProperty;
  await el.updateComplete;

  const name = el.shadowRoot!.querySelector('.card-content__name');
  expect(name?.textContent?.trim()).toBe('The Hotel Windsor');
});

test('card shows property city', async () => {
  const el = createElement();
  el.selectedProperty = mockProperty;
  await el.updateComplete;

  const city = el.shadowRoot!.querySelector('.card-content__city');
  expect(city?.textContent?.trim()).toBe('Melbourne');
});

test('card shows t1-rating with correct value', async () => {
  const el = createElement();
  el.selectedProperty = mockProperty;
  await el.updateComplete;

  const rating = el.shadowRoot!.querySelector('t1-rating') as HTMLElement & { value: number };
  expect(rating).not.toBeNull();
  expect(rating.value).toBe(4.5);
});

test('card shows first 3 facilities', async () => {
  const el = createElement();
  el.selectedProperty = mockProperty;
  await el.updateComplete;

  const facilities = el.shadowRoot!.querySelectorAll('.card-content__facility');
  expect(facilities.length).toBe(3);
  expect(facilities[0].textContent?.trim()).toContain('Daily breakfast');
});

test('card shows overflow count when facilities exceed 3', async () => {
  const el = createElement();
  el.selectedProperty = mockProperty;
  await el.updateComplete;

  const more = el.shadowRoot!.querySelector('.card-content__more');
  expect(more?.textContent?.trim()).toBe('+ 2 more facilities');
});

test('card does not show overflow text when facilities are 3 or fewer', async () => {
  const el = createElement();
  el.selectedProperty = { ...mockProperty, facilities: ['Free WiFi', 'Parking'] };
  await el.updateComplete;

  expect(el.shadowRoot!.querySelector('.card-content__more')).toBeNull();
});

test('card shows price with currency and amount', async () => {
  const el = createElement();
  el.selectedProperty = mockProperty;
  await el.updateComplete;

  const price = el.shadowRoot!.querySelector('.card-content__price-amount');
  expect(price?.textContent?.trim()).toContain('AUD');
  expect(price?.textContent?.trim()).toContain('200');
});

test('card shows correct icon for hotel property type', async () => {
  const el = createElement();
  el.selectedProperty = mockProperty;
  await el.updateComplete;

  const icon = el.shadowRoot!.querySelector('.card-image__icon') as HTMLElement & { name: string };
  expect(icon?.name).toBe('buildings');
});

test('card shows More Info button', async () => {
  const el = createElement();
  el.selectedProperty = mockProperty;
  await el.updateComplete;

  const button = el.shadowRoot!.querySelector('t1-button');
  expect(button?.textContent?.trim()).toBe('More Info');
});
