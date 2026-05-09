import { describe, it, expect, afterEach } from 'vitest';
import './index';

type T1IconButtonEl = HTMLElement & {
  updateComplete: Promise<boolean>;
  name?: string;
  library?: string;
  src?: string;
  href?: string;
  target?: string;
  download?: string;
  label: string;
  disabled: boolean;
  focus(options?: FocusOptions): void;
  blur(): void;
  click(): void;
};

function createElement(attrs = ''): T1IconButtonEl {
  const el = document.createElement('t1-icon-button') as unknown as T1IconButtonEl;
  if (attrs) {
    const re = /(\w[\w-]*)(?:="([^"]*)")?/g;
    let match: RegExpExecArray | null;
    while ((match = re.exec(attrs)) !== null) {
      el.setAttribute(match[1], match[2] ?? '');
    }
  }
  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  document.body.querySelectorAll('t1-icon-button').forEach(el => el.remove());
});

describe('t1-icon-button', () => {
  describe('default properties', () => {
    it('has correct default values', async () => {
      const el = createElement();
      await el.updateComplete;

      expect(el.name).toBeUndefined();
      expect(el.library).toBeUndefined();
      expect(el.src).toBeUndefined();
      expect(el.href).toBeUndefined();
      expect(el.target).toBeUndefined();
      expect(el.download).toBeUndefined();
      expect(el.label).toBe('');
      expect(el.disabled).toBe(false);
    });

    it('renders as a <button> by default', async () => {
      const el = createElement();
      await el.updateComplete;

      expect(el.shadowRoot!.querySelector('button')).not.toBeNull();
      expect(el.shadowRoot!.querySelector('a')).toBeNull();
    });

    it('always renders a t1-icon inside', async () => {
      const el = createElement();
      await el.updateComplete;

      expect(el.shadowRoot!.querySelector('t1-icon')).not.toBeNull();
    });
  });

  describe('when icon attributes are set', () => {
    it('forwards name to t1-icon', async () => {
      const el = createElement('name="check"');
      await el.updateComplete;

      const icon = el.shadowRoot!.querySelector('t1-icon')!;
      expect(icon.getAttribute('name')).toBe('check');
    });

    it('forwards library to t1-icon', async () => {
      const el = createElement('library="system" name="check"');
      await el.updateComplete;

      const icon = el.shadowRoot!.querySelector('t1-icon')!;
      expect(icon.getAttribute('library')).toBe('system');
    });
  });

  describe('when href is present', () => {
    it('renders as an <a>', async () => {
      const el = createElement('href="some/path"');
      await el.updateComplete;

      expect(el.shadowRoot!.querySelector('a')).not.toBeNull();
      expect(el.shadowRoot!.querySelector('button')).toBeNull();
    });

    it('does not set rel when no target', async () => {
      const el = createElement('href="some/path"');
      await el.updateComplete;

      expect(el.shadowRoot!.querySelector('a[rel]')).toBeNull();
    });

    describe('with target', () => {
      (['_blank', '_parent', '_self', '_top'] as const).forEach(target => {
        it(`sets target="${target}" on the anchor`, async () => {
          const el = createElement(`href="some/path" target="${target}"`);
          await el.updateComplete;

          expect(el.shadowRoot!.querySelector(`a[target="${target}"]`)).not.toBeNull();
        });

        it(`sets rel="noreferrer noopener" when target="${target}"`, async () => {
          const el = createElement(`href="some/path" target="${target}"`);
          await el.updateComplete;

          expect(el.shadowRoot!.querySelector('a[rel="noreferrer noopener"]')).not.toBeNull();
        });
      });
    });

    it('sets the download attribute on the anchor', async () => {
      const el = createElement('href="some/path" download="file.pdf"');
      await el.updateComplete;

      expect(el.shadowRoot!.querySelector('a[download="file.pdf"]')).not.toBeNull();
    });
  });

  describe('when label is set', () => {
    it('sets aria-label on the button', async () => {
      const el = createElement('label="close"');
      await el.updateComplete;

      expect(el.shadowRoot!.querySelector('button[aria-label="close"]')).not.toBeNull();
    });

    it('sets aria-label on the anchor', async () => {
      const el = createElement('href="some/path" label="close"');
      await el.updateComplete;

      expect(el.shadowRoot!.querySelector('a[aria-label="close"]')).not.toBeNull();
    });
  });

  describe('when disabled', () => {
    it('the button has disabled attribute', async () => {
      const el = createElement('disabled');
      await el.updateComplete;

      expect(el.shadowRoot!.querySelector('button[disabled]')).not.toBeNull();
    });

    it('the anchor has aria-disabled="true"', async () => {
      const el = createElement('href="some/path" disabled');
      await el.updateComplete;

      expect(el.shadowRoot!.querySelector('a[aria-disabled="true"]')).not.toBeNull();
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
});
