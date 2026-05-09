import { describe, it, expect, afterEach } from 'vitest';
import './index';

type T1OptionEl = HTMLElement & {
  updateComplete: Promise<boolean>;
  value: string;
  disabled: boolean;
  selected: boolean;
  current: boolean;
  getTextLabel(): string;
};

function createElement(attrs = '', content = 'Option'): T1OptionEl {
  const el = document.createElement('t1-option') as unknown as T1OptionEl;
  if (attrs) {
    const re = /(\w[\w-]*)(?:="([^"]*)")?/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(attrs)) !== null) el.setAttribute(m[1], m[2] ?? '');
  }
  el.textContent = content;
  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  document.body.querySelectorAll('t1-option').forEach(el => el.remove());
});

describe('t1-option', () => {
  describe('default properties', () => {
    it('has correct default values', async () => {
      const el = createElement();
      await el.updateComplete;

      expect(el.value).toBe('');
      expect(el.disabled).toBe(false);
      expect(el.selected).toBe(false);
      expect(el.current).toBe(false);
    });

    it('has role="option"', async () => {
      const el = createElement();
      await el.updateComplete;

      expect(el.getAttribute('role')).toBe('option');
    });

    it('has aria-selected="false" by default', async () => {
      const el = createElement();
      await el.updateComplete;

      expect(el.getAttribute('aria-selected')).toBe('false');
    });
  });

  describe('when disabled', () => {
    it('sets aria-disabled="true"', async () => {
      const el = createElement('disabled');
      await el.updateComplete;

      expect(el.getAttribute('aria-disabled')).toBe('true');
    });

    it('applies option--disabled class', async () => {
      const el = createElement('disabled');
      await el.updateComplete;

      const base = el.shadowRoot!.querySelector('[part~="base"]')!;
      expect(base.classList.contains('option--disabled')).toBe(true);
    });
  });

  describe('when selected', () => {
    it('sets aria-selected="true" when selected is true', async () => {
      const el = createElement();
      el.selected = true;
      await el.updateComplete;

      expect(el.getAttribute('aria-selected')).toBe('true');
    });

    it('shows the check icon when selected', async () => {
      const el = createElement();
      el.selected = true;
      await el.updateComplete;

      const base = el.shadowRoot!.querySelector('[part~="base"]')!;
      expect(base.classList.contains('option--selected')).toBe(true);
    });
  });

  describe('when current', () => {
    it('applies option--current class', async () => {
      const el = createElement();
      el.current = true;
      await el.updateComplete;

      const base = el.shadowRoot!.querySelector('[part~="base"]')!;
      expect(base.classList.contains('option--current')).toBe(true);
    });
  });

  describe('value attribute', () => {
    it('reflects the value attribute', async () => {
      const el = createElement('value="hello"');
      await el.updateComplete;

      expect(el.value).toBe('hello');
    });

    it('converts non-string values to string', async () => {
      const el = createElement();
      await el.updateComplete;

      (el as unknown as { value: unknown }).value = 42;
      await el.updateComplete;

      expect(el.value).toBe('42');
    });

    it('replaces spaces in value with underscores', async () => {
      const el = createElement();
      await el.updateComplete;

      el.value = 'hello world';
      await el.updateComplete;

      expect(el.value).toBe('hello_world');
    });
  });

  describe('getTextLabel()', () => {
    it('returns the text content of the label slot', async () => {
      const el = createElement('', 'Save File');
      await el.updateComplete;

      expect(el.getTextLabel()).toBe('Save File');
    });

    it('strips HTML element text from slotted elements', async () => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = '<t1-option><strong>Bold Option</strong></t1-option>';
      document.body.appendChild(wrapper);
      const el = wrapper.querySelector('t1-option') as unknown as T1OptionEl;
      await el.updateComplete;

      expect(el.getTextLabel()).toBe('Bold Option');
      wrapper.remove();
    });

    it('excludes prefix/suffix slot text from label', async () => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = `
        <t1-option>
          <span slot="prefix">★</span>
          Label Text
          <span slot="suffix">⌘</span>
        </t1-option>
      `;
      document.body.appendChild(wrapper);
      const el = wrapper.querySelector('t1-option') as unknown as T1OptionEl;
      await el.updateComplete;

      expect(el.getTextLabel()).toBe('Label Text');
      wrapper.remove();
    });
  });
});
