import { expect, afterEach, vi, test } from 'vitest';
import './index';

type T1RatingEl = HTMLElement & {
  updateComplete: Promise<boolean>;
  value: number;
  max: number;
  precision: number;
  readonly: boolean;
  disabled: boolean;
  label: string;
  focus: (opts?: FocusOptions) => void;
  blur: () => void;
};

function createElement(attrs: Record<string, string | boolean> = {}): T1RatingEl {
  const el = document.createElement('t1-rating') as unknown as T1RatingEl;
  Object.entries(attrs).forEach(([key, val]) => {
    if (val === true) {
      el.setAttribute(key, '');
    } else if (val !== false) {
      el.setAttribute(key, String(val));
    }
  });
  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  document.body.querySelectorAll('t1-rating').forEach((el) => el.remove());
});

test('has correct default values', async () => {
  const el = createElement({ label: 'Rating' });
  await el.updateComplete;

  expect(el.value).toBe(0);
  expect(el.max).toBe(5);
  expect(el.precision).toBe(1);
  expect(el.readonly).toBe(false);
  expect(el.disabled).toBe(false);
});

test('base part has role="slider" with correct aria attributes', async () => {
  const el = createElement({ label: 'Test' });
  await el.updateComplete;

  const base = el.shadowRoot!.querySelector('[part~="base"]')!;
  expect(base.getAttribute('role')).toBe('slider');
  expect(base.getAttribute('aria-disabled')).toBe('false');
  expect(base.getAttribute('aria-readonly')).toBe('false');
  expect(base.getAttribute('aria-valuenow')).toBe('0');
  expect(base.getAttribute('aria-valuemin')).toBe('0');
  expect(base.getAttribute('aria-valuemax')).toBe('5');
  expect(base.getAttribute('tabindex')).toBe('0');
});

test('renders max number of symbols', async () => {
  const el = createElement({ label: 'Rating' });
  await el.updateComplete;

  const symbols = el.shadowRoot!.querySelectorAll('.rating__symbol');
  expect(symbols.length).toBe(5);
});

test('reflects aria-valuenow when value is set', async () => {
  const el = createElement({ label: 'Rating', value: '3' });
  await el.updateComplete;

  const base = el.shadowRoot!.querySelector('[part~="base"]')!;
  expect(base.getAttribute('aria-valuenow')).toBe('3');
});

test('reflects aria-valuemax and renders correct symbol count for max=10', async () => {
  const el = createElement({ label: 'Rating', max: '10' });
  await el.updateComplete;

  const base = el.shadowRoot!.querySelector('[part~="base"]')!;
  expect(base.getAttribute('aria-valuemax')).toBe('10');

  const symbols = el.shadowRoot!.querySelectorAll(
    '.rating__symbol, .rating__partial-symbol-container',
  );
  expect(symbols.length).toBe(10);
});

test('applies rating--readonly class and aria-readonly when readonly', async () => {
  const el = createElement({ label: 'Rating', readonly: true });
  await el.updateComplete;

  const base = el.shadowRoot!.querySelector('[part~="base"]')!;
  expect(base.getAttribute('aria-readonly')).toBe('true');
  expect(base.classList.contains('rating--readonly')).toBe(true);
});

test('uses tabindex -1 when readonly', async () => {
  const el = createElement({ label: 'Rating', readonly: true });
  await el.updateComplete;

  const base = el.shadowRoot!.querySelector('[part~="base"]')!;
  expect(base.getAttribute('tabindex')).toBe('-1');
});

test('applies rating--disabled class and aria-disabled when disabled', async () => {
  const el = createElement({ label: 'Rating', disabled: true });
  await el.updateComplete;

  const base = el.shadowRoot!.querySelector('[part~="base"]')!;
  expect(base.getAttribute('aria-disabled')).toBe('true');
  expect(base.classList.contains('rating--disabled')).toBe(true);
});

test('uses tabindex -1 when disabled', async () => {
  const el = createElement({ label: 'Rating', disabled: true });
  await el.updateComplete;

  const base = el.shadowRoot!.querySelector('[part~="base"]')!;
  expect(base.getAttribute('tabindex')).toBe('-1');
});

test('increases value on ArrowRight and emits t1-change', async () => {
  const el = createElement({ label: 'Rating' });
  await el.updateComplete;

  const changeHandler = vi.fn();
  el.addEventListener('t1-change', changeHandler);

  const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
  base.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  await el.updateComplete;

  expect(el.value).toBe(1);
  expect(changeHandler).toHaveBeenCalledOnce();
});

test('increases value on ArrowUp and emits t1-change', async () => {
  const el = createElement({ label: 'Rating', value: '2' });
  await el.updateComplete;

  const changeHandler = vi.fn();
  el.addEventListener('t1-change', changeHandler);

  const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
  base.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
  await el.updateComplete;

  expect(el.value).toBe(3);
  expect(changeHandler).toHaveBeenCalledOnce();
});

test('decreases value on ArrowLeft', async () => {
  const el = createElement({ label: 'Rating', value: '3' });
  await el.updateComplete;

  const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
  base.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
  await el.updateComplete;

  expect(el.value).toBe(2);
});

test('decreases value on ArrowDown', async () => {
  const el = createElement({ label: 'Rating', value: '3' });
  await el.updateComplete;

  const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
  base.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
  await el.updateComplete;

  expect(el.value).toBe(2);
});

test('sets value to 0 on Home key', async () => {
  const el = createElement({ label: 'Rating', value: '3' });
  await el.updateComplete;

  const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
  base.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
  await el.updateComplete;

  expect(el.value).toBe(0);
});

test('sets value to max on End key', async () => {
  const el = createElement({ label: 'Rating' });
  await el.updateComplete;

  const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
  base.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
  await el.updateComplete;

  expect(el.value).toBe(5);
});

test('does not change value when disabled', async () => {
  const el = createElement({ label: 'Rating', value: '3', disabled: true });
  await el.updateComplete;

  const changeHandler = vi.fn();
  el.addEventListener('t1-change', changeHandler);

  const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
  base.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  await el.updateComplete;

  expect(el.value).toBe(3);
  expect(changeHandler).not.toHaveBeenCalled();
});

test('does not change value when readonly', async () => {
  const el = createElement({ label: 'Rating', value: '3', readonly: true });
  await el.updateComplete;

  const changeHandler = vi.fn();
  el.addEventListener('t1-change', changeHandler);

  const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
  base.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  await el.updateComplete;

  expect(el.value).toBe(3);
  expect(changeHandler).not.toHaveBeenCalled();
});

test('marks symbols up to value as active', async () => {
  const el = createElement({ label: 'Rating', value: '3' });
  await el.updateComplete;

  const symbols = el.shadowRoot!.querySelectorAll('.rating__symbol');
  const activeSymbols = [...symbols].filter((s) => s.classList.contains('rating__symbol--active'));
  expect(activeSymbols.length).toBe(3);
});

test('precision property reflects correctly', async () => {
  const el = createElement({ label: 'Rating', precision: '0.5' });
  await el.updateComplete;

  expect(el.precision).toBe(0.5);
});

test('focus() focuses the inner rating element', async () => {
  const el = createElement({ label: 'Rating' });
  await el.updateComplete;

  el.focus();
  await el.updateComplete;

  const base = el.shadowRoot!.querySelector('[part~="base"]');
  expect(el.shadowRoot!.activeElement).toBe(base);
});

test('blur() removes focus from the inner rating element', async () => {
  const el = createElement({ label: 'Rating' });
  await el.updateComplete;

  el.focus();
  await el.updateComplete;
  el.blur();
  await el.updateComplete;

  expect(el.shadowRoot!.activeElement).toBeNull();
});

test('does not emit t1-change when value is set programmatically', async () => {
  const el = createElement({ label: 'Rating', value: '1' });
  await el.updateComplete;

  const changeHandler = vi.fn();
  el.addEventListener('t1-change', changeHandler);

  el.value = 5;
  await el.updateComplete;

  expect(changeHandler).not.toHaveBeenCalled();
});
