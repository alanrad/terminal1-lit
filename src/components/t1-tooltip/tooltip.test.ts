import { describe, it, expect, afterEach, vi } from 'vitest';
import './index';

type T1TooltipEl = HTMLElement & {
  updateComplete: Promise<boolean>;
  content: string;
  placement: string;
  disabled: boolean;
  open: boolean;
  trigger: string;
  distance: number;
  show: () => Promise<void>;
  hide: () => Promise<void>;
};

function createElement(
  attrs: Record<string, string | boolean> = {},
  slotContent = '<button>Hover Me</button>',
): T1TooltipEl {
  const el = document.createElement('t1-tooltip') as unknown as T1TooltipEl;
  Object.entries(attrs).forEach(([k, v]) => {
    if (v === true) el.setAttribute(k, '');
    else if (v !== false) el.setAttribute(k, String(v));
  });
  el.innerHTML = slotContent;
  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  document.body.querySelectorAll('t1-tooltip').forEach((el) => el.remove());
});

describe('t1-tooltip', () => {
  describe('default properties', () => {
    it('has correct defaults', async () => {
      const el = createElement({ content: 'Hello' });
      await el.updateComplete;
      expect(el.content).toBe('Hello');
      expect(el.placement).toBe('top');
      expect(el.disabled).toBe(false);
      expect(el.open).toBe(false);
      expect(el.trigger).toBe('hover focus');
    });
  });

  describe('visibility', () => {
    it('body is hidden when open is false', async () => {
      const el = createElement({ content: 'Tooltip' });
      await el.updateComplete;
      const body = el.shadowRoot!.querySelector<HTMLElement>('[part~="body"]')!;
      expect(body.hidden).toBe(true);
    });

    it('body is visible when open attribute is set', async () => {
      const el = createElement({ content: 'Tooltip', open: true });
      await el.updateComplete;
      const body = el.shadowRoot!.querySelector<HTMLElement>('[part~="body"]')!;
      expect(body.hidden).toBe(false);
    });
  });

  describe('show() and hide()', () => {
    it('show() makes body visible and emits t1-show + t1-after-show', async () => {
      const el = createElement({ content: 'Tooltip' });
      await el.updateComplete;

      const showHandler = vi.fn();
      const afterShowHandler = vi.fn();
      el.addEventListener('t1-show', showHandler);
      el.addEventListener('t1-after-show', afterShowHandler);

      await el.show();

      const body = el.shadowRoot!.querySelector<HTMLElement>('[part~="body"]')!;
      expect(body.hidden).toBe(false);
      expect(showHandler).toHaveBeenCalledOnce();
      expect(afterShowHandler).toHaveBeenCalledOnce();
    });

    it('hide() hides body and emits t1-hide + t1-after-hide', async () => {
      const el = createElement({ content: 'Tooltip', open: true });
      await el.updateComplete;

      const hideHandler = vi.fn();
      const afterHideHandler = vi.fn();
      el.addEventListener('t1-hide', hideHandler);
      el.addEventListener('t1-after-hide', afterHideHandler);

      await el.hide();

      const body = el.shadowRoot!.querySelector<HTMLElement>('[part~="body"]')!;
      expect(body.hidden).toBe(true);
      expect(hideHandler).toHaveBeenCalledOnce();
      expect(afterHideHandler).toHaveBeenCalledOnce();
    });

    it('show() is a no-op when already open', async () => {
      const el = createElement({ content: 'Tooltip', open: true });
      await el.updateComplete;

      const showHandler = vi.fn();
      el.addEventListener('t1-show', showHandler);
      await el.show();

      expect(showHandler).not.toHaveBeenCalled();
    });

    it('hide() is a no-op when already hidden', async () => {
      const el = createElement({ content: 'Tooltip' });
      await el.updateComplete;

      const hideHandler = vi.fn();
      el.addEventListener('t1-hide', hideHandler);
      await el.hide();

      expect(hideHandler).not.toHaveBeenCalled();
    });
  });

  describe('open property', () => {
    it('setting open=true shows the tooltip', async () => {
      const el = createElement({ content: 'Tooltip' });
      await el.updateComplete;

      const showHandler = vi.fn();
      el.addEventListener('t1-show', showHandler);

      el.open = true;
      await el.updateComplete;
      await el.updateComplete;

      expect(showHandler).toHaveBeenCalledOnce();
      const body = el.shadowRoot!.querySelector<HTMLElement>('[part~="body"]')!;
      expect(body.hidden).toBe(false);
    });

    it('setting open=false hides the tooltip', async () => {
      const el = createElement({ content: 'Tooltip', open: true });
      await el.updateComplete;

      const hideHandler = vi.fn();
      el.addEventListener('t1-hide', hideHandler);

      el.open = false;
      await el.updateComplete;
      await el.updateComplete;

      expect(hideHandler).toHaveBeenCalledOnce();
    });
  });

  describe('disabled', () => {
    it('does not open when disabled is set before show()', async () => {
      const el = createElement({ content: 'Tooltip', disabled: true });
      await el.updateComplete;

      el.open = true;
      await el.updateComplete;
      await el.updateComplete;

      // disabled prevents the open state from sticking
      const body = el.shadowRoot!.querySelector<HTMLElement>('[part~="body"]')!;
      expect(body.hidden).toBe(true);
    });

    it('hides the tooltip when disabled while open', async () => {
      const el = createElement({ content: 'Tooltip', open: true });
      await el.updateComplete;

      const hideHandler = vi.fn();
      el.addEventListener('t1-hide', hideHandler);

      el.disabled = true;
      await el.updateComplete;
      await el.updateComplete;

      expect(hideHandler).toHaveBeenCalledOnce();
    });
  });

  describe('content slot', () => {
    it('renders text content from content attribute', async () => {
      const el = createElement({ content: 'My tooltip text', open: true });
      await el.updateComplete;

      const body = el.shadowRoot!.querySelector('[part~="body"]')!;
      expect(body.textContent?.trim()).toBe('My tooltip text');
    });
  });

  describe('placement', () => {
    it('reflects placement attribute to t1-popup', async () => {
      const el = createElement({ content: 'Tooltip', placement: 'bottom' });
      await el.updateComplete;

      const popup = el.shadowRoot!.querySelector('t1-popup')!;
      expect(popup.getAttribute('placement')).toBe('bottom');
    });
  });
});
