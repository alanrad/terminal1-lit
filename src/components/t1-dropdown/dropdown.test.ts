import { describe, it, expect, afterEach } from 'vitest';
import '../t1-menu/index';
import '../t1-menu-item/index';
import './index';

type T1DropdownEl = HTMLElement & {
  updateComplete: Promise<boolean>;
  open: boolean;
  placement: string;
  disabled: boolean;
  stayOpenOnSelect: boolean;
  distance: number;
  skidding: number;
  hoist: boolean;
  show(): void;
  hide(): void;
};

const MENU_HTML = `
  <button slot="trigger">Toggle</button>
  <t1-menu>
    <t1-menu-item value="1">Item 1</t1-menu-item>
    <t1-menu-item value="2">Item 2</t1-menu-item>
    <t1-menu-item value="3">Item 3</t1-menu-item>
  </t1-menu>
`;

function createDropdown(attrs = '', innerHTML = MENU_HTML): T1DropdownEl {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `<t1-dropdown ${attrs}>${innerHTML}</t1-dropdown>`;
  document.body.appendChild(wrapper);
  return wrapper.querySelector('t1-dropdown') as unknown as T1DropdownEl;
}

afterEach(() => {
  document.body.querySelectorAll('div').forEach((el) => el.remove());
});

describe('t1-dropdown', () => {
  describe('default properties', () => {
    it('has correct default values', async () => {
      const el = createDropdown();
      await el.updateComplete;

      expect(el.open).toBe(false);
      expect(el.placement).toBe('bottom-start');
      expect(el.disabled).toBe(false);
      expect(el.stayOpenOnSelect).toBe(false);
      expect(el.distance).toBe(0);
      expect(el.skidding).toBe(0);
      expect(el.hoist).toBe(false);
    });

    it('panel is hidden by default', async () => {
      const el = createDropdown();
      await el.updateComplete;

      const panel = el.shadowRoot!.querySelector<HTMLElement>('[part~="panel"]')!;
      expect(panel.hidden).toBe(true);
    });
  });

  describe('when open attribute is set', () => {
    it('panel is visible', async () => {
      const el = createDropdown('open');
      await el.updateComplete;

      const panel = el.shadowRoot!.querySelector<HTMLElement>('[part~="panel"]')!;
      expect(panel.hidden).toBe(false);
    });

    it('reflects open attribute', async () => {
      const el = createDropdown('open');
      await el.updateComplete;

      expect(el.getAttribute('open')).not.toBeNull();
    });
  });

  describe('show()', () => {
    it('sets open to true', async () => {
      const el = createDropdown();
      await el.updateComplete;

      el.show();
      await el.updateComplete;

      expect(el.open).toBe(true);
    });

    it('makes the panel visible', async () => {
      const el = createDropdown();
      await el.updateComplete;

      el.show();
      await el.updateComplete;

      const panel = el.shadowRoot!.querySelector<HTMLElement>('[part~="panel"]')!;
      expect(panel.hidden).toBe(false);
    });

    it('emits t1-show', async () => {
      const el = createDropdown();
      await el.updateComplete;

      let shown = false;
      el.addEventListener(
        't1-show',
        () => {
          shown = true;
        },
        { once: true },
      );
      el.show();
      await el.updateComplete;

      expect(shown).toBe(true);
    });

    it('emits t1-after-show after update', async () => {
      const el = createDropdown();
      await el.updateComplete;

      const afterShowPromise = new Promise<void>((resolve) =>
        el.addEventListener('t1-after-show', () => resolve(), { once: true }),
      );
      el.show();
      await afterShowPromise;

      expect(el.open).toBe(true);
    });

    it('is a no-op when already open', async () => {
      const el = createDropdown('open');
      await el.updateComplete;

      let count = 0;
      el.addEventListener('t1-show', () => count++);
      el.show();
      await el.updateComplete;

      expect(count).toBe(0);
    });
  });

  describe('hide()', () => {
    it('sets open to false', async () => {
      const el = createDropdown('open');
      await el.updateComplete;

      el.hide();
      await el.updateComplete;

      expect(el.open).toBe(false);
    });

    it('hides the panel', async () => {
      const el = createDropdown('open');
      await el.updateComplete;

      el.hide();
      await el.updateComplete;

      const panel = el.shadowRoot!.querySelector<HTMLElement>('[part~="panel"]')!;
      expect(panel.hidden).toBe(true);
    });

    it('emits t1-hide', async () => {
      const el = createDropdown('open');
      await el.updateComplete;

      let hidden = false;
      el.addEventListener(
        't1-hide',
        () => {
          hidden = true;
        },
        { once: true },
      );
      el.hide();
      await el.updateComplete;

      expect(hidden).toBe(true);
    });

    it('emits t1-after-hide after update', async () => {
      const el = createDropdown('open');
      await el.updateComplete;

      const afterHidePromise = new Promise<void>((resolve) =>
        el.addEventListener('t1-after-hide', () => resolve(), { once: true }),
      );
      el.hide();
      await afterHidePromise;

      expect(el.open).toBe(false);
    });

    it('is a no-op when already closed', async () => {
      const el = createDropdown();
      await el.updateComplete;

      let count = 0;
      el.addEventListener('t1-hide', () => count++);
      el.hide();
      await el.updateComplete;

      expect(count).toBe(0);
    });
  });

  describe('when disabled', () => {
    it('does not open when show() is called', async () => {
      const el = createDropdown('disabled');
      await el.updateComplete;

      el.show();
      await el.updateComplete;

      expect(el.open).toBe(false);
    });
  });

  describe('when a menu item is selected', () => {
    it('closes the dropdown by default', async () => {
      const el = createDropdown('open');
      await el.updateComplete;

      const menu = el.querySelector('t1-menu')!;
      menu.dispatchEvent(
        new CustomEvent('t1-select', { bubbles: true, composed: true, detail: { item: {} } }),
      );
      await el.updateComplete;

      expect(el.open).toBe(false);
    });

    it('stays open when stayOpenOnSelect is set', async () => {
      const el = createDropdown('open stay-open-on-select');
      await el.updateComplete;

      const menu = el.querySelector('t1-menu')!;
      menu.dispatchEvent(
        new CustomEvent('t1-select', { bubbles: true, composed: true, detail: { item: {} } }),
      );
      await el.updateComplete;

      expect(el.open).toBe(true);
    });
  });

  describe('closing on outside click', () => {
    it('closes when a mousedown fires outside the dropdown', async () => {
      const el = createDropdown('open');
      await el.updateComplete;

      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      await el.updateComplete;

      expect(el.open).toBe(false);
    });
  });

  describe('keyboard handling', () => {
    it('closes on Escape key', async () => {
      const el = createDropdown('open');
      await el.updateComplete;

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await el.updateComplete;

      expect(el.open).toBe(false);
    });
  });
});
