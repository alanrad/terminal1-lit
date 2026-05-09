import { describe, it, expect, afterEach, vi } from 'vitest';
import './index';

type SearchPropertyWidgetEl = HTMLElement & {
  updateComplete: Promise<boolean>;
  debounce: number;
  search: (term: string) => void;
};

function createElement(attrs: Record<string, string | number> = {}): SearchPropertyWidgetEl {
  const el = document.createElement('search-property-widget') as unknown as SearchPropertyWidgetEl;
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, String(v)));
  document.body.appendChild(el);
  return el;
}

function dispatchInput(el: SearchPropertyWidgetEl, value: string) {
  const input = el.shadowRoot!.querySelector('t1-input') as HTMLElement & { value: string };
  input.value = value;
  input.dispatchEvent(new CustomEvent('t1-input', { bubbles: true, composed: true }));
}

afterEach(() => {
  document.body.querySelectorAll('search-property-widget').forEach(el => el.remove());
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('search-property-widget', () => {
  describe('rendering', () => {
    it('renders a t1-input with the correct placeholder', async () => {
      const el = createElement();
      await el.updateComplete;
      const input = el.shadowRoot!.querySelector('t1-input')!;
      expect(input.getAttribute('placeholder')).toBe('Where would you like to go?');
    });

    it('renders a t1-icon with slot="prefix" and name="search"', async () => {
      const el = createElement();
      await el.updateComplete;
      const icon = el.shadowRoot!.querySelector('t1-icon')!;
      expect(icon.getAttribute('slot')).toBe('prefix');
      expect(icon.getAttribute('name')).toBe('search');
    });

    it('has clearable attribute on the input', async () => {
      const el = createElement();
      await el.updateComplete;
      const input = el.shadowRoot!.querySelector('t1-input')!;
      expect(input.hasAttribute('clearable')).toBe(true);
    });
  });

  describe('search threshold', () => {
    it('does not call search when input has 1 character', async () => {
      vi.useFakeTimers();
      const el = createElement();
      await el.updateComplete;
      const spy = vi.fn();
      el.search = spy;
      dispatchInput(el, 'a');
      vi.runAllTimers();
      expect(spy).not.toHaveBeenCalled();
    });

    it('does not call search when input has exactly 3 characters', async () => {
      vi.useFakeTimers();
      const el = createElement();
      await el.updateComplete;
      const spy = vi.fn();
      el.search = spy;
      dispatchInput(el, 'abc');
      vi.runAllTimers();
      expect(spy).not.toHaveBeenCalled();
    });

    it('calls search when input has 4 characters', async () => {
      vi.useFakeTimers();
      const el = createElement();
      await el.updateComplete;
      const spy = vi.fn();
      el.search = spy;
      dispatchInput(el, 'abcd');
      vi.runAllTimers();
      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith('abcd');
    });

    it('calls search with the full query string', async () => {
      vi.useFakeTimers();
      const el = createElement();
      await el.updateComplete;
      const spy = vi.fn();
      el.search = spy;
      dispatchInput(el, 'Where would you like to go?');
      vi.runAllTimers();
      expect(spy).toHaveBeenCalledWith('Where would you like to go?');
    });
  });

  describe('debounce', () => {
    it('does not call search before the debounce delay elapses', async () => {
      vi.useFakeTimers();
      const el = createElement();
      await el.updateComplete;
      const spy = vi.fn();
      el.search = spy;
      dispatchInput(el, 'Paris');
      expect(spy).not.toHaveBeenCalled();
      vi.advanceTimersByTime(299);
      expect(spy).not.toHaveBeenCalled();
    });

    it('calls search after the default 300ms debounce delay', async () => {
      vi.useFakeTimers();
      const el = createElement();
      await el.updateComplete;
      const spy = vi.fn();
      el.search = spy;
      dispatchInput(el, 'Paris');
      vi.advanceTimersByTime(300);
      expect(spy).toHaveBeenCalledOnce();
    });

    it('debounces rapid input and only calls search once with the last value', async () => {
      vi.useFakeTimers();
      const el = createElement();
      await el.updateComplete;
      const spy = vi.fn();
      el.search = spy;

      ['Pari', 'Paris', 'Paris ', 'Paris F'].forEach(term => dispatchInput(el, term));

      vi.runAllTimers();
      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith('Paris F');
    });

    it('respects a custom debounce attribute value', async () => {
      vi.useFakeTimers();
      const el = createElement({ debounce: 500 });
      await el.updateComplete;
      const spy = vi.fn();
      el.search = spy;

      dispatchInput(el, 'Paris');
      vi.advanceTimersByTime(499);
      expect(spy).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1);
      expect(spy).toHaveBeenCalledOnce();
    });
  });
});
