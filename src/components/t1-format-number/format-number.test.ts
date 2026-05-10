import { expect, afterEach, test } from 'vitest';
import './index';

type T1FormatNumberEl = HTMLElement & {
  updateComplete: Promise<boolean>;
  value: number;
  type: 'currency' | 'decimal' | 'percent';
  noGrouping: boolean;
  currency: string;
  currencyDisplay: string;
  minimumIntegerDigits: number | undefined;
  minimumFractionDigits: number | undefined;
  maximumFractionDigits: number | undefined;
  minimumSignificantDigits: number | undefined;
  maximumSignificantDigits: number | undefined;
};

function createElement(attrs: Record<string, string | boolean> = {}): T1FormatNumberEl {
  const el = document.createElement('t1-format-number') as unknown as T1FormatNumberEl;
  Object.entries(attrs).forEach(([k, v]) => {
    if (v === true) el.setAttribute(k, '');
    else if (v !== false) el.setAttribute(k, String(v));
  });
  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  document.body.querySelectorAll('t1-format-number').forEach((el) => el.remove());
});

function text(el: T1FormatNumberEl): string {
  return el.shadowRoot!.textContent ?? '';
}

test('has correct defaults', async () => {
  const el = createElement();
  await el.updateComplete;
  expect(el.value).toBe(0);
  expect(el.type).toBe('decimal');
  expect(el.noGrouping).toBe(false);
  expect(el.currency).toBe('USD');
  expect(el.currencyDisplay).toBe('symbol');
  expect(el.minimumIntegerDigits).toBeUndefined();
  expect(el.minimumFractionDigits).toBeUndefined();
  expect(el.maximumFractionDigits).toBeUndefined();
  expect(el.minimumSignificantDigits).toBeUndefined();
  expect(el.maximumSignificantDigits).toBeUndefined();
});

test('formats 1000 as decimal with grouping', async () => {
  const el = createElement({ value: '1000' });
  await el.updateComplete;
  const expected = new Intl.NumberFormat('en', { style: 'decimal', useGrouping: true }).format(
    1000,
  );
  expect(text(el)).toBe(expected);
});

test('formats without grouping when no-grouping is set', async () => {
  const el = createElement({ value: '1000', 'no-grouping': true });
  await el.updateComplete;
  const expected = new Intl.NumberFormat('en', { style: 'decimal', useGrouping: false }).format(
    1000,
  );
  expect(text(el)).toBe(expected);
});

(['decimal', 'percent'] as const).forEach((type) => {
  test(`formats as ${type}`, async () => {
    const el = createElement({ value: '0.5', type });
    await el.updateComplete;
    const expected = new Intl.NumberFormat('en', { style: type }).format(0.5);
    expect(text(el)).toBe(expected);
  });
});

test('formats as currency', async () => {
  const el = createElement({ value: '1000', type: 'currency', currency: 'USD' });
  await el.updateComplete;
  const expected = new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' }).format(1000);
  expect(text(el)).toBe(expected);
});

(['USD', 'EUR', 'GBP'] as const).forEach((currency) => {
  test(`formats ${currency} currency`, async () => {
    const el = createElement({ value: '1000', type: 'currency', currency });
    await el.updateComplete;
    const expected = new Intl.NumberFormat('en', { style: 'currency', currency }).format(1000);
    expect(text(el)).toBe(expected);
  });
});

test('respects minimum-fraction-digits', async () => {
  const el = createElement({ value: '1', 'minimum-fraction-digits': '3' });
  await el.updateComplete;
  const expected = new Intl.NumberFormat('en', { minimumFractionDigits: 3 }).format(1);
  expect(text(el)).toBe(expected);
});

test('respects maximum-fraction-digits', async () => {
  const el = createElement({ value: '1.12345', 'maximum-fraction-digits': '2' });
  await el.updateComplete;
  const expected = new Intl.NumberFormat('en', { maximumFractionDigits: 2 }).format(1.12345);
  expect(text(el)).toBe(expected);
});

test('respects minimum-significant-digits', async () => {
  const el = createElement({ value: '1', 'minimum-significant-digits': '4' });
  await el.updateComplete;
  const expected = new Intl.NumberFormat('en', { minimumSignificantDigits: 4 }).format(1);
  expect(text(el)).toBe(expected);
});

test('respects maximum-significant-digits', async () => {
  const el = createElement({ value: '1234567', 'maximum-significant-digits': '4' });
  await el.updateComplete;
  const expected = new Intl.NumberFormat('en', { maximumSignificantDigits: 4 }).format(1234567);
  expect(text(el)).toBe(expected);
});

test('renders empty string for NaN', async () => {
  const el = createElement();
  await el.updateComplete;
  el.value = NaN;
  await el.updateComplete;
  expect(text(el)).toBe('');
});

test('pads integer digits with minimum-integer-digits', async () => {
  const el = createElement({ value: '5', 'minimum-integer-digits': '4' });
  await el.updateComplete;
  const expected = new Intl.NumberFormat('en', { minimumIntegerDigits: 4 }).format(5);
  expect(text(el)).toBe(expected);
});
