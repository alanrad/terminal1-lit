import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './index';

type T1ButtonEl = HTMLElement & {
  updateComplete: Promise<boolean>;
  variant: string;
  size: string;
  disabled: boolean;
  caret: boolean;
  loading: boolean;
  outline: boolean;
  pill: boolean;
  circle: boolean;
  href: string;
  target: string | undefined;
  rel: string;
  type: string;
  title: string;
  focus(options?: FocusOptions): void;
  blur(): void;
  click(): void;
};

function createElement(attrs = ''): T1ButtonEl {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `<t1-button ${attrs}>Button Label</t1-button>`;
  document.body.appendChild(wrapper);
  return wrapper.querySelector('t1-button') as unknown as T1ButtonEl;
}

let wrapper: HTMLDivElement;

beforeEach(() => {
  wrapper = document.createElement('div');
  document.body.appendChild(wrapper);
});

afterEach(() => {
  wrapper.remove();
});

describe('t1-button', () => {
  describe('default properties', () => {
    it('has correct default values', async () => {
      const el = createElement();
      await el.updateComplete;

      expect(el.title).toBe('');
      expect(el.variant).toBe('default');
      expect(el.size).toBe('medium');
      expect(el.disabled).toBe(false);
      expect(el.caret).toBe(false);
      expect(el.loading).toBe(false);
      expect(el.outline).toBe(false);
      expect(el.pill).toBe(false);
      expect(el.circle).toBe(false);
    });

    it('renders as a <button> element', async () => {
      const el = createElement();
      await el.updateComplete;

      expect(el.shadowRoot!.querySelector('button')).not.toBeNull();
      expect(el.shadowRoot!.querySelector('a')).toBeNull();
    });

    it('has no spinner by default', async () => {
      const el = createElement();
      await el.updateComplete;

      expect(el.shadowRoot!.querySelector('t1-spinner')).toBeNull();
    });

    it('has no caret by default', async () => {
      const el = createElement();
      await el.updateComplete;

      expect(el.shadowRoot!.querySelector('[part~="caret"]')).toBeNull();
    });
  });

  describe('when disabled', () => {
    it('disables the native <button>', async () => {
      const el = createElement('disabled');
      await el.updateComplete;

      expect(el.shadowRoot!.querySelector('button[disabled]')).not.toBeNull();
    });

    it('does not disable the native <a> when rendering as link', async () => {
      const el = createElement('href="some/path" disabled');
      await el.updateComplete;

      expect(el.shadowRoot!.querySelector('a[disabled]')).toBeNull();
    });

    it('sets aria-disabled="true"', async () => {
      const el = createElement('disabled');
      await el.updateComplete;

      const base = el.shadowRoot!.querySelector('[part~="base"]')!;
      expect(base.getAttribute('aria-disabled')).toBe('true');
    });

    it('sets tabindex="-1"', async () => {
      const el = createElement('disabled');
      await el.updateComplete;

      const base = el.shadowRoot!.querySelector('[part~="base"]')!;
      expect(base.getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('when loading', () => {
    it('renders a spinner', async () => {
      const el = createElement('loading');
      await el.updateComplete;

      expect(el.shadowRoot!.querySelector('t1-spinner')).not.toBeNull();
    });
  });

  describe('when caret', () => {
    it('renders the caret icon', async () => {
      const el = createElement('caret');
      await el.updateComplete;

      expect(el.shadowRoot!.querySelector('[part~="caret"]')).not.toBeNull();
    });
  });

  describe('when title is set', () => {
    it('forwards the title to the base element', async () => {
      const el = createElement('title="Test"');
      await el.updateComplete;

      const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
      expect(base.title).toBe('Test');
    });
  });

  describe('when href is present', () => {
    it('renders as an <a>', async () => {
      const el = createElement('href="some/path"');
      await el.updateComplete;

      expect(el.shadowRoot!.querySelector('a')).not.toBeNull();
      expect(el.shadowRoot!.querySelector('button')).toBeNull();
    });

    it('includes rel="noreferrer noopener" by default', async () => {
      const el = createElement('href="https://example.com/" target="_blank"');
      await el.updateComplete;

      const link = el.shadowRoot!.querySelector('a')!;
      expect(link.getAttribute('rel')).toBe('noreferrer noopener');
    });

    it('respects a custom rel attribute', async () => {
      const el = createElement('href="https://example.com/" target="_blank" rel="nofollow"');
      await el.updateComplete;

      const link = el.shadowRoot!.querySelector('a')!;
      expect(link.getAttribute('rel')).toBe('nofollow');
    });

    it('does not set href on disabled link buttons', async () => {
      const el = createElement('href="some/path" disabled');
      await el.updateComplete;

      const link = el.shadowRoot!.querySelector('a')!;
      expect(link.hasAttribute('href')).toBe(false);
    });
  });

  describe('focus and blur events', () => {
    it('emits t1-focus when focused', async () => {
      const el = createElement();
      await el.updateComplete;

      let focused = false;
      el.addEventListener('t1-focus', () => { focused = true; }, { once: true });
      el.focus();
      await el.updateComplete;

      expect(focused).toBe(true);
    });

    it('emits t1-blur when blurred', async () => {
      const el = createElement();
      await el.updateComplete;

      el.focus();
      await el.updateComplete;

      let blurred = false;
      el.addEventListener('t1-blur', () => { blurred = true; }, { once: true });
      el.blur();
      await el.updateComplete;

      expect(blurred).toBe(true);
    });
  });

  describe('click delegation', () => {
    it('emits a click event when .click() is called', async () => {
      const el = createElement();
      await el.updateComplete;

      let clicked = false;
      el.addEventListener('click', () => { clicked = true; }, { once: true });
      el.click();

      expect(clicked).toBe(true);
    });
  });

  describe('variant and size attributes', () => {
    it('reflects variant attribute', async () => {
      const el = createElement('variant="primary"');
      await el.updateComplete;

      expect(el.variant).toBe('primary');
      expect(el.getAttribute('variant')).toBe('primary');
    });

    it('reflects size attribute', async () => {
      const el = createElement('size="small"');
      await el.updateComplete;

      expect(el.size).toBe('small');
      expect(el.getAttribute('size')).toBe('small');
    });

    it('reflects outline attribute', async () => {
      const el = createElement('outline');
      await el.updateComplete;

      expect(el.outline).toBe(true);
    });

    it('reflects pill attribute', async () => {
      const el = createElement('pill');
      await el.updateComplete;

      expect(el.pill).toBe(true);
    });

    it('reflects circle attribute', async () => {
      const el = createElement('circle');
      await el.updateComplete;

      expect(el.circle).toBe(true);
    });
  });
});
