import { describe, it, expect, afterEach } from 'vitest';
import '../t1-option/index';
import './index';

type T1SelectEl = HTMLElement & {
  updateComplete: Promise<boolean>;
  value: string | string[];
  size: string;
  placeholder: string;
  multiple: boolean;
  disabled: boolean;
  clearable: boolean;
  open: boolean;
  pill: boolean;
  label: string;
  required: boolean;
  show(): void;
  hide(): void;
  getOptions(): HTMLElement[];
};

const OPTIONS_HTML = `
  <t1-option value="opt1">Option 1</t1-option>
  <t1-option value="opt2">Option 2</t1-option>
  <t1-option value="opt3">Option 3</t1-option>
  <t1-option value="opt4" disabled>Option 4</t1-option>
`;

function createSelect(attrs = '', innerHTML = OPTIONS_HTML): T1SelectEl {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `<t1-select ${attrs}>${innerHTML}</t1-select>`;
  document.body.appendChild(wrapper);
  return wrapper.querySelector('t1-select') as unknown as T1SelectEl;
}

async function settled(el: T1SelectEl) {
  await el.updateComplete;
  await new Promise(r => requestAnimationFrame(r));
  await el.updateComplete;
}

afterEach(() => {
  document.body.querySelectorAll('div').forEach(el => el.remove());
});

describe('t1-select', () => {
  describe('default properties', () => {
    it('has correct default values', async () => {
      const el = createSelect();
      await settled(el);

      expect(el.value).toBe('');
      expect(el.size).toBe('medium');
      expect(el.placeholder).toBe('');
      expect(el.multiple).toBe(false);
      expect(el.disabled).toBe(false);
      expect(el.clearable).toBe(false);
      expect(el.open).toBe(false);
      expect(el.pill).toBe(false);
      expect(el.required).toBe(false);
    });

    it('renders the combobox', async () => {
      const el = createSelect();
      await settled(el);

      expect(el.shadowRoot!.querySelector('[part~="combobox"]')).not.toBeNull();
    });

    it('renders the listbox', async () => {
      const el = createSelect();
      await settled(el);

      expect(el.shadowRoot!.querySelector('[part~="listbox"]')).not.toBeNull();
    });
  });

  describe('show() and hide()', () => {
    it('show() sets open to true', async () => {
      const el = createSelect();
      await settled(el);

      el.show();
      await el.updateComplete;

      expect(el.open).toBe(true);
    });

    it('hide() sets open to false', async () => {
      const el = createSelect('open');
      await settled(el);

      el.hide();
      await el.updateComplete;

      expect(el.open).toBe(false);
    });

    it('show() emits t1-show', async () => {
      const el = createSelect();
      await settled(el);

      let shown = false;
      el.addEventListener('t1-show', () => { shown = true; }, { once: true });
      el.show();
      await el.updateComplete;

      expect(shown).toBe(true);
    });

    it('hide() emits t1-hide', async () => {
      const el = createSelect('open');
      await settled(el);

      let hidden = false;
      el.addEventListener('t1-hide', () => { hidden = true; }, { once: true });
      el.hide();
      await el.updateComplete;

      expect(hidden).toBe(true);
    });

    it('show() is no-op when disabled', async () => {
      const el = createSelect('disabled');
      await settled(el);

      el.show();
      await el.updateComplete;

      expect(el.open).toBe(false);
    });
  });

  describe('value selection', () => {
    it('reflects a selected option via value property', async () => {
      const el = createSelect();
      await settled(el);

      el.value = 'opt1';
      await settled(el);

      const opt1 = el.querySelector('[value="opt1"]') as HTMLElement & { selected: boolean };
      expect(opt1.selected).toBe(true);
    });

    it('clears the selection when value is set to empty string', async () => {
      const el = createSelect();
      await settled(el);

      el.value = 'opt2';
      await settled(el);
      el.value = '';
      await settled(el);

      const opt2 = el.querySelector('[value="opt2"]') as HTMLElement & { selected: boolean };
      expect(opt2.selected).toBe(false);
    });

    it('emits t1-change when an option is clicked', async () => {
      const el = createSelect('open');
      await settled(el);

      let changed = false;
      el.addEventListener('t1-change', () => { changed = true; }, { once: true });

      const listbox = el.shadowRoot!.querySelector('[part~="listbox"]')!;
      const opt1 = el.querySelector('[value="opt1"]')!;
      listbox.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      opt1.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      await el.updateComplete;

      expect(changed).toBe(true);
    });

    it('does not select a disabled option on click', async () => {
      const el = createSelect('open');
      await settled(el);

      let changed = false;
      el.addEventListener('t1-change', () => { changed = true; });

      const opt4 = el.querySelector('[value="opt4"]')!;
      opt4.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      await el.updateComplete;

      expect(changed).toBe(false);
      expect(el.value).toBe('');
    });
  });

  describe('multiple selection', () => {
    it('value is an array when multiple is set', async () => {
      const el = createSelect('multiple');
      await settled(el);

      expect(Array.isArray(el.value)).toBe(true);
    });

    it('selects multiple values', async () => {
      const el = createSelect('multiple');
      await settled(el);

      el.value = ['opt1', 'opt2'];
      await settled(el);

      const opt1 = el.querySelector('[value="opt1"]') as HTMLElement & { selected: boolean };
      const opt2 = el.querySelector('[value="opt2"]') as HTMLElement & { selected: boolean };
      expect(opt1.selected).toBe(true);
      expect(opt2.selected).toBe(true);
    });

    it('renders t1-tag elements for selected options', async () => {
      const el = createSelect('multiple');
      await settled(el);

      el.value = ['opt1', 'opt2'];
      await settled(el);

      const tags = el.shadowRoot!.querySelectorAll('t1-tag');
      expect(tags.length).toBe(2);
    });
  });

  describe('clearable', () => {
    it('shows the clear button when value is set', async () => {
      const el = createSelect('clearable');
      await settled(el);

      el.value = 'opt1';
      await settled(el);

      expect(el.shadowRoot!.querySelector('[part~="clear-button"]')).not.toBeNull();
    });

    it('does not show clear button when no value', async () => {
      const el = createSelect('clearable');
      await settled(el);

      expect(el.shadowRoot!.querySelector('[part~="clear-button"]')).toBeNull();
    });

    it('emits t1-clear when clear button clicked', async () => {
      const el = createSelect('clearable');
      await settled(el);

      el.value = 'opt1';
      await settled(el);

      let cleared = false;
      el.addEventListener('t1-clear', () => { cleared = true; }, { once: true });

      const clearBtn = el.shadowRoot!.querySelector<HTMLElement>('[part~="clear-button"]')!;
      clearBtn.click();
      await el.updateComplete;

      expect(cleared).toBe(true);
      expect(el.value).toBe('');
    });
  });

  describe('placeholder', () => {
    it('forwards placeholder to the display input', async () => {
      const el = createSelect('placeholder="Choose one"');
      await settled(el);

      const input = el.shadowRoot!.querySelector<HTMLInputElement>('.select__display-input')!;
      expect(input.placeholder).toBe('Choose one');
    });
  });

  describe('label', () => {
    it('renders a label element when label is set', async () => {
      const el = createSelect('label="Pick an option"');
      await settled(el);

      const label = el.shadowRoot!.querySelector('.select__label')!;
      expect(label).not.toBeNull();
      expect(label.textContent?.trim()).toBe('Pick an option');
    });
  });

  describe('getOptions()', () => {
    it('returns all t1-option children', async () => {
      const el = createSelect();
      await settled(el);

      expect(el.getOptions().length).toBe(4);
    });
  });

  describe('disabled', () => {
    it('does not open when disabled', async () => {
      const el = createSelect('disabled');
      await settled(el);

      el.show();
      await el.updateComplete;

      expect(el.open).toBe(false);
    });
  });

  describe('keyboard interaction', () => {
    it('opens on ArrowDown key', async () => {
      const el = createSelect();
      await settled(el);

      const combobox = el.shadowRoot!.querySelector('[part~="combobox"]')!;
      combobox.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await el.updateComplete;

      expect(el.open).toBe(true);
    });

    it('opens on Enter key', async () => {
      const el = createSelect();
      await settled(el);

      const combobox = el.shadowRoot!.querySelector('[part~="combobox"]')!;
      combobox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      await el.updateComplete;

      expect(el.open).toBe(true);
    });

    it('closes on Escape key', async () => {
      const el = createSelect('open');
      await settled(el);

      const combobox = el.shadowRoot!.querySelector('[part~="combobox"]')!;
      combobox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await el.updateComplete;

      expect(el.open).toBe(false);
    });
  });

  describe('focus and blur events', () => {
    it('emits t1-focus when combobox is focused', async () => {
      const el = createSelect();
      await settled(el);

      let focused = false;
      el.addEventListener('t1-focus', () => { focused = true; }, { once: true });

      const combobox = el.shadowRoot!.querySelector('[part~="combobox"]')!;
      combobox.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
      await el.updateComplete;

      expect(focused).toBe(true);
    });

    it('emits t1-blur when combobox loses focus', async () => {
      const el = createSelect();
      await settled(el);

      let blurred = false;
      el.addEventListener('t1-blur', () => { blurred = true; }, { once: true });

      const combobox = el.shadowRoot!.querySelector('[part~="combobox"]')!;
      combobox.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
      await el.updateComplete;

      expect(blurred).toBe(true);
    });
  });
});
