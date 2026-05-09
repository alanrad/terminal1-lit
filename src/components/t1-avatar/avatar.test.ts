import { describe, it, expect, afterEach, vi } from 'vitest';
import './index';

type T1AvatarEl = HTMLElement & {
  updateComplete: Promise<boolean>;
  image: string;
  label: string;
  initials: string;
  loading: 'eager' | 'lazy';
  shape: 'circle' | 'square' | 'rounded';
};

function createElement(props: Partial<{ image: string; label: string; initials: string; loading: string; shape: string }> = {}): T1AvatarEl {
  const el = document.createElement('t1-avatar') as unknown as T1AvatarEl;
  Object.entries(props).forEach(([key, val]) => el.setAttribute(key, val));
  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  document.body.querySelectorAll('t1-avatar').forEach(el => el.remove());
});

describe('t1-avatar', () => {
  describe('default properties', () => {
    it('defaults to circle shape', async () => {
      const el = createElement({ label: 'Avatar' });
      await el.updateComplete;

      expect(el.getAttribute('shape')).toBe('circle');
    });

    it('base part has role="img" and aria-label', async () => {
      const el = createElement({ label: 'User avatar' });
      await el.updateComplete;

      const base = el.shadowRoot!.querySelector('[part~="base"]')!;
      expect(base.getAttribute('role')).toBe('img');
      expect(base.getAttribute('aria-label')).toBe('User avatar');
    });

    it('shows icon fallback when no image or initials provided', async () => {
      const el = createElement({ label: 'Avatar' });
      await el.updateComplete;

      const icon = el.shadowRoot!.querySelector('[part~="icon"]');
      expect(icon).not.toBeNull();
    });
  });

  describe('shape attribute', () => {
    (['circle', 'square', 'rounded'] as const).forEach(shape => {
      it(`applies avatar--${shape} class for shape="${shape}"`, async () => {
        const el = createElement({ shape, label: 'Avatar' });
        await el.updateComplete;

        const base = el.shadowRoot!.querySelector('[part~="base"]')!;
        expect(base.classList.contains(`avatar--${shape}`)).toBe(true);
        expect(el.getAttribute('shape')).toBe(shape);
      });
    });
  });

  describe('initials', () => {
    it('renders initials part when initials are set', async () => {
      const el = createElement({ initials: 'AB', label: 'Avatar' });
      await el.updateComplete;

      const initials = el.shadowRoot!.querySelector('[part~="initials"]');
      expect(initials).not.toBeNull();
      expect(initials!.textContent).toBe('AB');
    });

    it('does not render icon when initials are set', async () => {
      const el = createElement({ initials: 'AB', label: 'Avatar' });
      await el.updateComplete;

      const icon = el.shadowRoot!.querySelector('[part~="icon"]');
      expect(icon).toBeNull();
    });
  });

  describe('image', () => {
    const src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    it('renders image part with src when image is set', async () => {
      const el = createElement({ image: src, label: 'Avatar' });
      await el.updateComplete;

      const img = el.shadowRoot!.querySelector('[part~="image"]');
      expect(img).not.toBeNull();
      expect(img!.getAttribute('src')).toBe(src);
    });

    it('hides initials when image is provided', async () => {
      const el = createElement({ image: src, initials: 'AB', label: 'Avatar' });
      await el.updateComplete;

      const initials = el.shadowRoot!.querySelector('[part~="initials"]');
      expect(initials).toBeNull();
    });

    it('hides icon when image is provided', async () => {
      const el = createElement({ image: src, label: 'Avatar' });
      await el.updateComplete;

      const icon = el.shadowRoot!.querySelector('[part~="icon"]');
      expect(icon).toBeNull();
    });

    it('emits t1-error and falls back to fallback content when image fails', async () => {
      const el = createElement({ label: 'Avatar' });
      await el.updateComplete;

      const errorHandler = vi.fn();
      el.addEventListener('t1-error', errorHandler);

      (el as unknown as T1AvatarEl).image = 'invalid-url.png';
      await el.updateComplete;

      const img = el.shadowRoot!.querySelector('img');
      if (img) {
        img.dispatchEvent(new Event('error'));
      }
      await el.updateComplete;

      expect(errorHandler).toHaveBeenCalledOnce();
      const imgAfterError = el.shadowRoot!.querySelector('img');
      expect(imgAfterError).toBeNull();
    });

    it('resets error state when a new image is set', async () => {
      const el = createElement({ label: 'Avatar' });
      await el.updateComplete;

      (el as unknown as T1AvatarEl).image = 'bad.png';
      await el.updateComplete;

      const img = el.shadowRoot!.querySelector('img');
      if (img) img.dispatchEvent(new Event('error'));
      await el.updateComplete;

      expect(el.shadowRoot!.querySelector('img')).toBeNull();

      (el as unknown as T1AvatarEl).image = src;
      await el.updateComplete;
      await el.updateComplete; // second cycle: hasError reset triggers re-render

      expect(el.shadowRoot!.querySelector('img')).not.toBeNull();
    });
  });

  describe('icon slot', () => {
    it('accepts slotted content in the icon slot', async () => {
      const el = document.createElement('t1-avatar') as unknown as T1AvatarEl;
      el.setAttribute('label', 'Avatar');
      const span = document.createElement('span');
      span.setAttribute('slot', 'icon');
      span.textContent = 'custom';
      el.appendChild(span);
      document.body.appendChild(el);
      await el.updateComplete;

      const slot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name=icon]');
      expect(slot).not.toBeNull();
      const assigned = slot!.assignedNodes({ flatten: true });
      expect(assigned.length).toBeGreaterThan(0);
    });
  });
});
