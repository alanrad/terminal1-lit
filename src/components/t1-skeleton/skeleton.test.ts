import { expect, afterEach, test } from 'vitest';
import './index';

type T1SkeletonEl = HTMLElement & {
  updateComplete: Promise<boolean>;
  effect: 'pulse' | 'sheen' | 'none';
};

function createElement(attrs: Record<string, string> = {}): T1SkeletonEl {
  const el = document.createElement('t1-skeleton') as unknown as T1SkeletonEl;
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  document.body.querySelectorAll('t1-skeleton').forEach((el) => el.remove());
});

test('has effect="none" by default', async () => {
  const el = createElement();
  await el.updateComplete;
  expect(el.effect).toBe('none');
});

test('base part has skeleton class only with no effect', async () => {
  const el = createElement();
  await el.updateComplete;
  const base = el.shadowRoot!.querySelector('[part~="base"]')!;
  expect(base.classList.contains('skeleton')).toBe(true);
  expect(base.classList.contains('skeleton--pulse')).toBe(false);
  expect(base.classList.contains('skeleton--sheen')).toBe(false);
});

test('renders the indicator part', async () => {
  const el = createElement();
  await el.updateComplete;
  const indicator = el.shadowRoot!.querySelector('[part~="indicator"]');
  expect(indicator).not.toBeNull();
  expect(indicator!.classList.contains('skeleton__indicator')).toBe(true);
});

test('applies skeleton--pulse class for pulse effect', async () => {
  const el = createElement({ effect: 'pulse' });
  await el.updateComplete;
  const base = el.shadowRoot!.querySelector('[part~="base"]')!;
  expect(base.classList.contains('skeleton--pulse')).toBe(true);
  expect(base.classList.contains('skeleton--sheen')).toBe(false);
});

test('applies skeleton--sheen class for sheen effect', async () => {
  const el = createElement({ effect: 'sheen' });
  await el.updateComplete;
  const base = el.shadowRoot!.querySelector('[part~="base"]')!;
  expect(base.classList.contains('skeleton--sheen')).toBe(true);
  expect(base.classList.contains('skeleton--pulse')).toBe(false);
});

test('updates class when effect changes programmatically', async () => {
  const el = createElement();
  await el.updateComplete;

  el.effect = 'sheen';
  await el.updateComplete;

  const base = el.shadowRoot!.querySelector('[part~="base"]')!;
  expect(base.classList.contains('skeleton--sheen')).toBe(true);

  el.effect = 'pulse';
  await el.updateComplete;
  expect(base.classList.contains('skeleton--pulse')).toBe(true);
  expect(base.classList.contains('skeleton--sheen')).toBe(false);

  el.effect = 'none';
  await el.updateComplete;
  expect(base.classList.contains('skeleton--pulse')).toBe(false);
  expect(base.classList.contains('skeleton--sheen')).toBe(false);
});
