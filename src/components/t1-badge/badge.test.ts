import { describe, it, expect, afterEach } from 'vitest';
import './index';

type T1BadgeEl = HTMLElement & {
  updateComplete: Promise<boolean>;
  variant: string;
  pill: boolean;
  pulse: boolean;
};

function createElement(attrs = '', content = 'Badge'): T1BadgeEl {
  const el = document.createElement('t1-badge') as unknown as T1BadgeEl;
  if (attrs) {
    attrs.split(' ').forEach((attr) => {
      const [key, val] = attr.split('=');
      if (val !== undefined) {
        el.setAttribute(key, val.replace(/"/g, ''));
      } else {
        el.setAttribute(key, '');
      }
    });
  }
  el.textContent = content;
  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  document.body.querySelectorAll('t1-badge').forEach((el) => el.remove());
});

describe('t1-badge', () => {
  describe('default properties', () => {
    it('has correct default values', async () => {
      const el = createElement();
      await el.updateComplete;

      expect(el.variant).toBe('primary');
      expect(el.pill).toBe(false);
      expect(el.pulse).toBe(false);
    });

    it('base part has role="status"', async () => {
      const el = createElement();
      await el.updateComplete;

      const base = el.shadowRoot!.querySelector('[part~="base"]')!;
      expect(base.getAttribute('role')).toBe('status');
    });

    it('applies badge--primary class by default', async () => {
      const el = createElement();
      await el.updateComplete;

      const base = el.shadowRoot!.querySelector('[part~="base"]')!;
      expect(base.classList.contains('badge--primary')).toBe(true);
    });
  });

  describe('when pill is set', () => {
    it('applies badge--pill class', async () => {
      const el = createElement('pill');
      await el.updateComplete;

      const base = el.shadowRoot!.querySelector('[part~="base"]')!;
      expect(base.classList.contains('badge--pill')).toBe(true);
    });
  });

  describe('when pulse is set', () => {
    it('applies badge--pulse class', async () => {
      const el = createElement('pulse');
      await el.updateComplete;

      const base = el.shadowRoot!.querySelector('[part~="base"]')!;
      expect(base.classList.contains('badge--pulse')).toBe(true);
    });
  });

  describe('variant attribute', () => {
    (['primary', 'success', 'neutral', 'warning', 'danger'] as const).forEach((variant) => {
      it(`applies badge--${variant} class for variant="${variant}"`, async () => {
        const el = createElement(`variant="${variant}"`);
        await el.updateComplete;

        const base = el.shadowRoot!.querySelector('[part~="base"]')!;
        expect(base.classList.contains(`badge--${variant}`)).toBe(true);
        expect(el.getAttribute('variant')).toBe(variant);
      });
    });

    it('does not apply other variant classes when a specific variant is set', async () => {
      const el = createElement('variant="success"');
      await el.updateComplete;

      const base = el.shadowRoot!.querySelector('[part~="base"]')!;
      expect(base.classList.contains('badge--primary')).toBe(false);
      expect(base.classList.contains('badge--success')).toBe(true);
    });
  });

  describe('slot content', () => {
    it('renders slotted text', async () => {
      const el = createElement('', 'Test Label');
      await el.updateComplete;

      expect(el.textContent).toBe('Test Label');
    });
  });
});
