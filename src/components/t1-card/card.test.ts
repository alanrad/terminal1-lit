import { expect, afterEach, test } from 'vitest';
import './index';

type T1CardEl = HTMLElement & {
  updateComplete: Promise<boolean>;
};

function createElement(innerHTML = ''): T1CardEl {
  const el = document.createElement('t1-card') as unknown as T1CardEl;
  el.innerHTML = innerHTML;
  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  document.body.querySelectorAll('t1-card').forEach((el) => el.remove());
});

test('renders body content', async () => {
  const el = createElement('Just card content.');
  await el.updateComplete;

  expect(el.textContent).toContain('Just card content.');
});

test('base part has only card class when no slots filled', async () => {
  const el = createElement('Content only');
  await el.updateComplete;

  const card = el.shadowRoot!.querySelector('.card')!;
  expect(card.classList.contains('card')).toBe(true);
  expect(card.classList.contains('card--has-header')).toBe(false);
  expect(card.classList.contains('card--has-footer')).toBe(false);
  expect(card.classList.contains('card--has-image')).toBe(false);
});

test('applies card--has-header class when header slot is filled', async () => {
  const el = createElement('<div slot="header">Header</div>Body content');
  await el.updateComplete;

  const card = el.shadowRoot!.querySelector('.card')!;
  expect(card.classList.contains('card--has-header')).toBe(true);
});

test('accepts header content in the shadow root slot', async () => {
  const el = createElement('<div slot="header">Header Title</div>Body content');
  await el.updateComplete;

  const slot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name=header]')!;
  const assigned = slot.assignedNodes({ flatten: true });
  expect(assigned.length).toBe(1);
});

test('renders the header text content', () => {
  const el = createElement('<div slot="header">My Header</div>Body');
  const header = el.querySelector<HTMLElement>('div[slot=header]')!;
  expect(header.textContent).toBe('My Header');
});

test('applies card--has-footer class when footer slot is filled', async () => {
  const el = createElement('Body<div slot="footer">Footer</div>');
  await el.updateComplete;

  const card = el.shadowRoot!.querySelector('.card')!;
  expect(card.classList.contains('card--has-footer')).toBe(true);
});

test('accepts footer content in the shadow root slot', async () => {
  const el = createElement('Body<div slot="footer">Footer</div>');
  await el.updateComplete;

  const slot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name=footer]')!;
  const assigned = slot.assignedNodes({ flatten: true });
  expect(assigned.length).toBe(1);
});

test('renders the footer text content', () => {
  const el = createElement('<div slot="footer">My Footer</div>Body');
  const footer = el.querySelector<HTMLElement>('div[slot=footer]')!;
  expect(footer.textContent).toBe('My Footer');
});

test('applies card--has-image class when image slot is filled', async () => {
  const src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  const el = createElement(`<img slot="image" src="${src}" alt="test" />Body`);
  await el.updateComplete;

  const card = el.shadowRoot!.querySelector('.card')!;
  expect(card.classList.contains('card--has-image')).toBe(true);
});

test('accepts image content in the shadow root slot', async () => {
  const src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  const el = createElement(`<img slot="image" src="${src}" alt="test" />Body`);
  await el.updateComplete;

  const slot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name=image]')!;
  const assigned = slot.assignedNodes({ flatten: true });
  expect(assigned.length).toBe(1);
});

test('applies all modifier classes when all slots are filled', async () => {
  const src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  const el = createElement(
    `<img slot="image" src="${src}" alt="" /><div slot="header">H</div>Body<div slot="footer">F</div>`,
  );
  await el.updateComplete;

  const card = el.shadowRoot!.querySelector('.card')!;
  expect(card.classList.contains('card--has-image')).toBe(true);
  expect(card.classList.contains('card--has-header')).toBe(true);
  expect(card.classList.contains('card--has-footer')).toBe(true);
});
