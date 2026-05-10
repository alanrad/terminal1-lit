import { expect, afterEach, test } from 'vitest';
import './index';

type PropertyCardSkeletonEl = HTMLElement & {
  updateComplete: Promise<boolean>;
};

function createElement(): PropertyCardSkeletonEl {
  const el = document.createElement('property-card-skeleton') as unknown as PropertyCardSkeletonEl;
  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  document.body.querySelectorAll('property-card-skeleton').forEach((el) => el.remove());
});

test('renders a t1-card', async () => {
  const el = createElement();
  await el.updateComplete;
  expect(el.shadowRoot!.querySelector('t1-card')).not.toBeNull();
});

test('renders a t1-skeleton in the image slot with sheen effect', async () => {
  const el = createElement();
  await el.updateComplete;
  const skeleton = el.shadowRoot!.querySelector('t1-skeleton[slot="image"]');
  expect(skeleton).not.toBeNull();
  expect(skeleton!.getAttribute('effect')).toBe('sheen');
});

test('renders skeleton for name', async () => {
  const el = createElement();
  await el.updateComplete;
  expect(el.shadowRoot!.querySelector('.skeleton-name')).not.toBeNull();
});

test('renders skeleton for city', async () => {
  const el = createElement();
  await el.updateComplete;
  expect(el.shadowRoot!.querySelector('.skeleton-city')).not.toBeNull();
});

test('renders skeleton for rating', async () => {
  const el = createElement();
  await el.updateComplete;
  expect(el.shadowRoot!.querySelector('.skeleton-rating')).not.toBeNull();
});

test('renders 3 facility skeletons', async () => {
  const el = createElement();
  await el.updateComplete;
  expect(el.shadowRoot!.querySelectorAll('.skeleton-facility').length).toBe(3);
});

test('renders skeleton for price', async () => {
  const el = createElement();
  await el.updateComplete;
  expect(el.shadowRoot!.querySelector('.skeleton-price')).not.toBeNull();
});

test('renders skeleton for button', async () => {
  const el = createElement();
  await el.updateComplete;
  expect(el.shadowRoot!.querySelector('.skeleton-button')).not.toBeNull();
});
