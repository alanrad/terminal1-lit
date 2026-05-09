import { describe, it, expect, afterEach } from 'vitest';
import '../t1-menu-item/index';
import './index';

type T1MenuEl = HTMLElement & {
  updateComplete: Promise<boolean>;
  getAllItems(): HTMLElement[];
  getCurrentItem(): HTMLElement | undefined;
  setCurrentItem(item: HTMLElement): void;
};

type T1MenuItemEl = HTMLElement & {
  updateComplete: Promise<boolean>;
  value: string;
  disabled: boolean;
  type: string;
  checked: boolean;
};

function createMenu(innerHTML: string): T1MenuEl {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `<t1-menu>${innerHTML}</t1-menu>`;
  document.body.appendChild(wrapper);
  return wrapper.querySelector('t1-menu') as unknown as T1MenuEl;
}

afterEach(() => {
  document.body.querySelectorAll('div').forEach(el => el.remove());
});

describe('t1-menu', () => {
  describe('default structure', () => {
    it('has role="menu" on the host', async () => {
      const menu = createMenu('<t1-menu-item>Item 1</t1-menu-item>');
      await menu.updateComplete;

      expect(menu.getAttribute('role')).toBe('menu');
    });

    it('renders slotted menu items', async () => {
      const menu = createMenu(`
        <t1-menu-item value="a">Item A</t1-menu-item>
        <t1-menu-item value="b">Item B</t1-menu-item>
      `);
      await menu.updateComplete;

      expect(menu.querySelectorAll('t1-menu-item').length).toBe(2);
    });
  });

  describe('getAllItems()', () => {
    it('returns all enabled menu items', async () => {
      const menu = createMenu(`
        <t1-menu-item value="1">Item 1</t1-menu-item>
        <t1-menu-item value="2">Item 2</t1-menu-item>
        <t1-menu-item value="3">Item 3</t1-menu-item>
      `);
      await menu.updateComplete;
      // Wait for slot assignment
      await new Promise(r => requestAnimationFrame(r));

      const items = menu.getAllItems();
      expect(items.length).toBe(3);
    });

    it('includes disabled items (only inert items are excluded)', async () => {
      const menu = createMenu(`
        <t1-menu-item value="1">Item 1</t1-menu-item>
        <t1-menu-item value="2" disabled>Item 2</t1-menu-item>
        <t1-menu-item value="3">Item 3</t1-menu-item>
      `);
      await menu.updateComplete;
      await new Promise(r => requestAnimationFrame(r));

      const items = menu.getAllItems();
      expect(items.length).toBe(3);
    });
  });

  describe('t1-select event', () => {
    it('emits t1-select with the clicked item in detail', async () => {
      const menu = createMenu(`
        <t1-menu-item value="item-1">Item 1</t1-menu-item>
        <t1-menu-item value="item-2">Item 2</t1-menu-item>
      `);
      await menu.updateComplete;

      const [, item2] = menu.querySelectorAll('t1-menu-item') as unknown as T1MenuItemEl[];
      let selectedItem: T1MenuItemEl | null = null;

      menu.addEventListener('t1-select', (e: Event) => {
        selectedItem = (e as CustomEvent).detail.item;
      }, { once: true });

      item2.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      await menu.updateComplete;

      expect(selectedItem).toBe(item2);
    });

    it('does not emit t1-select for disabled items', async () => {
      const menu = createMenu(`
        <t1-menu-item value="item-1">Item 1</t1-menu-item>
        <t1-menu-item value="item-2" disabled>Item 2</t1-menu-item>
      `);
      await menu.updateComplete;

      let selected = false;
      menu.addEventListener('t1-select', () => { selected = true; });

      const [, item2] = menu.querySelectorAll('t1-menu-item') as unknown as T1MenuItemEl[];
      item2.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      await menu.updateComplete;

      expect(selected).toBe(false);
    });
  });

  describe('keyboard navigation', () => {
    function dispatchKey(menu: T1MenuEl, key: string) {
      // The @keydown listener lives on the <slot> inside shadow DOM; dispatch directly there.
      const slot = menu.shadowRoot!.querySelector('slot')!;
      slot.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    }

    it('moves focus down on ArrowDown', async () => {
      const menu = createMenu(`
        <t1-menu-item value="1">Item 1</t1-menu-item>
        <t1-menu-item value="2">Item 2</t1-menu-item>
        <t1-menu-item value="3">Item 3</t1-menu-item>
      `);
      await menu.updateComplete;
      await new Promise(r => requestAnimationFrame(r));

      const items = menu.getAllItems();
      menu.setCurrentItem(items[0]);

      dispatchKey(menu, 'ArrowDown');
      await menu.updateComplete;

      expect(menu.getCurrentItem()).toBe(items[1]);
    });

    it('moves focus up on ArrowUp', async () => {
      const menu = createMenu(`
        <t1-menu-item value="1">Item 1</t1-menu-item>
        <t1-menu-item value="2">Item 2</t1-menu-item>
        <t1-menu-item value="3">Item 3</t1-menu-item>
      `);
      await menu.updateComplete;
      await new Promise(r => requestAnimationFrame(r));

      const items = menu.getAllItems();
      menu.setCurrentItem(items[2]);

      dispatchKey(menu, 'ArrowUp');
      await menu.updateComplete;

      expect(menu.getCurrentItem()).toBe(items[1]);
    });

    it('wraps focus to last item when ArrowUp on first item', async () => {
      const menu = createMenu(`
        <t1-menu-item value="1">Item 1</t1-menu-item>
        <t1-menu-item value="2">Item 2</t1-menu-item>
        <t1-menu-item value="3">Item 3</t1-menu-item>
      `);
      await menu.updateComplete;
      await new Promise(r => requestAnimationFrame(r));

      const items = menu.getAllItems();
      menu.setCurrentItem(items[0]);

      dispatchKey(menu, 'ArrowUp');
      await menu.updateComplete;

      expect(menu.getCurrentItem()).toBe(items[items.length - 1]);
    });

    it('moves focus to first item on Home', async () => {
      const menu = createMenu(`
        <t1-menu-item value="1">Item 1</t1-menu-item>
        <t1-menu-item value="2">Item 2</t1-menu-item>
        <t1-menu-item value="3">Item 3</t1-menu-item>
      `);
      await menu.updateComplete;
      await new Promise(r => requestAnimationFrame(r));

      const items = menu.getAllItems();
      menu.setCurrentItem(items[2]);

      dispatchKey(menu, 'Home');
      await menu.updateComplete;

      expect(menu.getCurrentItem()).toBe(items[0]);
    });

    it('moves focus to last item on End', async () => {
      const menu = createMenu(`
        <t1-menu-item value="1">Item 1</t1-menu-item>
        <t1-menu-item value="2">Item 2</t1-menu-item>
        <t1-menu-item value="3">Item 3</t1-menu-item>
      `);
      await menu.updateComplete;
      await new Promise(r => requestAnimationFrame(r));

      const items = menu.getAllItems();
      menu.setCurrentItem(items[0]);

      dispatchKey(menu, 'End');
      await menu.updateComplete;

      expect(menu.getCurrentItem()).toBe(items[items.length - 1]);
    });
  });

  describe('checkbox menu items', () => {
    it('toggles checked state on click', async () => {
      const menu = createMenu(`
        <t1-menu-item type="checkbox" value="opt">Option</t1-menu-item>
      `);
      await menu.updateComplete;

      const item = menu.querySelector('t1-menu-item') as unknown as T1MenuItemEl;
      const initialChecked = item.checked;

      item.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      await menu.updateComplete;

      expect(item.checked).toBe(!initialChecked);
    });
  });
});
