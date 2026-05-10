import { describe, it, expect, afterEach, vi } from 'vitest';
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

describe('t1-rating', () => {
  describe('default properties', () => {
    it('has correct default values', async () => {
      const el = createElement({ label: 'Rating' });
      await el.updateComplete;

      expect(el.value).toBe(0);
      expect(el.max).toBe(5);
      expect(el.precision).toBe(1);
      expect(el.readonly).toBe(false);
      expect(el.disabled).toBe(false);
    });

    it('base part has role="slider" with correct aria attributes', async () => {
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

    it('renders max number of symbols', async () => {
      const el = createElement({ label: 'Rating' });
      await el.updateComplete;

      const symbols = el.shadowRoot!.querySelectorAll('.rating__symbol');
      expect(symbols.length).toBe(5);
    });
  });

  describe('value attribute', () => {
    it('reflects aria-valuenow when value is set', async () => {
      const el = createElement({ label: 'Rating', value: '3' });
      await el.updateComplete;

      const base = el.shadowRoot!.querySelector('[part~="base"]')!;
      expect(base.getAttribute('aria-valuenow')).toBe('3');
    });
  });

  describe('max attribute', () => {
    it('reflects aria-valuemax and renders correct symbol count', async () => {
      const el = createElement({ label: 'Rating', max: '10' });
      await el.updateComplete;

      const base = el.shadowRoot!.querySelector('[part~="base"]')!;
      expect(base.getAttribute('aria-valuemax')).toBe('10');

      const symbols = el.shadowRoot!.querySelectorAll(
        '.rating__symbol, .rating__partial-symbol-container',
      );
      expect(symbols.length).toBe(10);
    });
  });

  describe('readonly', () => {
    it('applies rating--readonly class and aria-readonly', async () => {
      const el = createElement({ label: 'Rating', readonly: true });
      await el.updateComplete;

      const base = el.shadowRoot!.querySelector('[part~="base"]')!;
      expect(base.getAttribute('aria-readonly')).toBe('true');
      expect(base.classList.contains('rating--readonly')).toBe(true);
    });

    it('uses tabindex -1 when readonly', async () => {
      const el = createElement({ label: 'Rating', readonly: true });
      await el.updateComplete;

      const base = el.shadowRoot!.querySelector('[part~="base"]')!;
      expect(base.getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('disabled', () => {
    it('applies rating--disabled class and aria-disabled', async () => {
      const el = createElement({ label: 'Rating', disabled: true });
      await el.updateComplete;

      const base = el.shadowRoot!.querySelector('[part~="base"]')!;
      expect(base.getAttribute('aria-disabled')).toBe('true');
      expect(base.classList.contains('rating--disabled')).toBe(true);
    });

    it('uses tabindex -1 when disabled', async () => {
      const el = createElement({ label: 'Rating', disabled: true });
      await el.updateComplete;

      const base = el.shadowRoot!.querySelector('[part~="base"]')!;
      expect(base.getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('keyboard interaction', () => {
    it('increases value on ArrowRight and emits t1-change', async () => {
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

    it('decreases value on ArrowLeft', async () => {
      const el = createElement({ label: 'Rating', value: '3' });
      await el.updateComplete;

      const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
      base.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      await el.updateComplete;

      expect(el.value).toBe(2);
    });

    it('sets value to 0 on Home key', async () => {
      const el = createElement({ label: 'Rating', value: '3' });
      await el.updateComplete;

      const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
      base.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
      await el.updateComplete;

      expect(el.value).toBe(0);
    });

    it('sets value to max on End key', async () => {
      const el = createElement({ label: 'Rating' });
      await el.updateComplete;

      const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
      base.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
      await el.updateComplete;

      expect(el.value).toBe(5);
    });

    it('does not change value when disabled', async () => {
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

    it('does not change value when readonly', async () => {
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
  });

  describe('active symbol classes', () => {
    it('marks symbols up to value as active', async () => {
      const el = createElement({ label: 'Rating', value: '3' });
      await el.updateComplete;

      const symbols = el.shadowRoot!.querySelectorAll('.rating__symbol');
      const activeSymbols = [...symbols].filter((s) =>
        s.classList.contains('rating__symbol--active'),
      );
      expect(activeSymbols.length).toBe(3);
    });
  });

  describe('focus / blur methods', () => {
    it('focus() focuses the inner rating element', async () => {
      const el = createElement({ label: 'Rating' });
      await el.updateComplete;

      el.focus();
      await el.updateComplete;

      const base = el.shadowRoot!.querySelector('[part~="base"]');
      expect(el.shadowRoot!.activeElement).toBe(base);
    });

    it('blur() removes focus from the inner rating element', async () => {
      const el = createElement({ label: 'Rating' });
      await el.updateComplete;

      el.focus();
      await el.updateComplete;
      el.blur();
      await el.updateComplete;

      expect(el.shadowRoot!.activeElement).toBeNull();
    });
  });

  describe('t1-change not emitted on programmatic change', () => {
    it('does not emit t1-change when value is set programmatically', async () => {
      const el = createElement({ label: 'Rating', value: '1' });
      await el.updateComplete;

      const changeHandler = vi.fn();
      el.addEventListener('t1-change', changeHandler);

      el.value = 5;
      await el.updateComplete;

      expect(changeHandler).not.toHaveBeenCalled();
    });
  });
});
