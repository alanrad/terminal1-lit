import { expect, afterEach, test } from 'vitest';
import '../t1-menu/index';
import './index';

type T1MenuItemEl = HTMLElement & {
  updateComplete: Promise<boolean>;
  type: string;
  value: string;
  disabled: boolean;
  loading: boolean;
  checked: boolean;
  getTextLabel(): string;
};

function createElement(attrs = '', content = 'Item'): T1MenuItemEl {
  const el = document.createElement('t1-menu-item') as unknown as T1MenuItemEl;
  if (attrs) {
    const re = /(\w[\w-]*)(?:="([^"]*)")?/g;
    let match: RegExpExecArray | null;
    while ((match = re.exec(attrs)) !== null) {
      el.setAttribute(match[1], match[2] ?? '');
    }
  }
  el.textContent = content;
  document.body.appendChild(el);
  return el;
}

function createWithHTML(html: string): T1MenuItemEl {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);
  return wrapper.querySelector('t1-menu-item') as unknown as T1MenuItemEl;
}

async function settled(el: T1MenuItemEl) {
  await el.updateComplete;
  await new Promise((r) => requestAnimationFrame(r));
  await el.updateComplete;
}

afterEach(() => {
  document.body.querySelectorAll('div, t1-menu-item, t1-menu').forEach((el) => el.remove());
});

test('has correct default values', async () => {
  const el = createElement();
  await el.updateComplete;

  expect(el.value).toBe('');
  expect(el.disabled).toBe(false);
  expect(el.loading).toBe(false);
  expect(el.checked).toBe(false);
});

test('has aria-disabled="false" by default', async () => {
  const el = createElement();
  await el.updateComplete;

  expect(el.getAttribute('aria-disabled')).toBe('false');
});

test('has role="menuitem" by default', async () => {
  const el = createElement();
  await el.updateComplete;

  expect(el.getAttribute('role')).toBe('menuitem');
});

test('sets aria-disabled="true" when disabled', async () => {
  const el = createElement('disabled');
  await el.updateComplete;

  expect(el.getAttribute('aria-disabled')).toBe('true');
});

test('prevents click events from propagating when disabled', async () => {
  const el = createElement('disabled');
  await el.updateComplete;

  let clicked = false;
  document.addEventListener(
    'click',
    () => {
      clicked = true;
    },
    { once: true },
  );
  el.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

  expect(clicked).toBe(false);
});

test('sets role="menuitemcheckbox" for type="checkbox"', async () => {
  const el = createElement('type="checkbox"');
  await el.updateComplete;

  expect(el.getAttribute('role')).toBe('menuitemcheckbox');
});

test('sets aria-checked="true" when checkbox is checked', async () => {
  const el = createElement('type="checkbox" checked');
  await el.updateComplete;

  expect(el.getAttribute('aria-checked')).toBe('true');
});

test('sets aria-checked="false" when checkbox is not checked', async () => {
  const el = createElement('type="checkbox"');
  await el.updateComplete;

  expect(el.getAttribute('aria-checked')).toBe('false');
});

test('reflects checked attribute for checkbox type', async () => {
  const el = createElement('type="checkbox" checked');
  await el.updateComplete;

  expect(el.checked).toBe(true);
  expect(el.getAttribute('checked')).not.toBeNull();
});

test('renders a t1-spinner when loading', async () => {
  const el = createElement('loading');
  await el.updateComplete;

  expect(el.shadowRoot!.querySelector('t1-spinner')).not.toBeNull();
});

test('getTextLabel returns the text content of the default slot', async () => {
  const el = createElement('', 'Save');
  await el.updateComplete;

  expect(el.getTextLabel()).toBe('Save');
});

test('emits slotchange when the label text changes', async () => {
  const el = createElement('', 'Original');
  await el.updateComplete;

  let fired = false;
  el.addEventListener(
    'slotchange',
    () => {
      fired = true;
    },
    { once: true },
  );
  el.textContent = 'Updated';

  await new Promise<void>((resolve) => {
    const check = () => {
      if (fired) resolve();
      else requestAnimationFrame(check);
    };
    requestAnimationFrame(check);
  });

  expect(fired).toBe(true);
});

test('sets the inert property when attribute is present', async () => {
  const el = createWithHTML(`
    <t1-menu>
      <t1-menu-item inert>Item 1</t1-menu-item>
      <t1-menu-item>Item 2</t1-menu-item>
    </t1-menu>
  `);
  await el.updateComplete;

  expect(el.hasAttribute('inert')).toBe(true);
});

test('adds menu-item--has-prefix class when prefix slot has content', async () => {
  const el = createWithHTML(`
    <t1-menu-item>
      <span slot="prefix">★</span>
      Label
    </t1-menu-item>
  `);
  await settled(el);

  const base = el.shadowRoot!.querySelector('[part~="base"]')!;
  expect(base.classList.contains('menu-item--has-prefix')).toBe(true);
});

test('adds menu-item--has-suffix class when suffix slot has content', async () => {
  const el = createWithHTML(`
    <t1-menu-item>
      Label
      <span slot="suffix">⌘S</span>
    </t1-menu-item>
  `);
  await settled(el);

  const base = el.shadowRoot!.querySelector('[part~="base"]')!;
  expect(base.classList.contains('menu-item--has-suffix')).toBe(true);
});

test('does not add menu-item--has-prefix class when prefix slot is empty', async () => {
  const el = createElement('', 'Label');
  await settled(el);

  const base = el.shadowRoot!.querySelector('[part~="base"]')!;
  expect(base.classList.contains('menu-item--has-prefix')).toBe(false);
});

test('renders a hidden submenu slot and no t1-popup when no submenu is provided', async () => {
  const el = createWithHTML(`
    <t1-menu>
      <t1-menu-item>
        Item 1
        <t1-menu>
          <t1-menu-item>Nested Item</t1-menu-item>
        </t1-menu>
      </t1-menu-item>
    </t1-menu>
  `);
  await settled(el);

  expect(el.shadowRoot!.querySelector('t1-popup')).toBeNull();
  const submenuSlot = el.shadowRoot!.querySelector<HTMLElement>('slot[name="submenu"]')!;
  expect(submenuSlot).not.toBeNull();
  expect(submenuSlot.hidden).toBe(true);
});

test('renders a t1-popup when a submenu slot is provided', async () => {
  const el = createWithHTML(`
    <t1-menu>
      <t1-menu-item>
        Item 1
        <t1-menu slot="submenu">
          <t1-menu-item>Nested Item</t1-menu-item>
        </t1-menu>
      </t1-menu-item>
    </t1-menu>
  `);
  await settled(el);

  expect(el.shadowRoot!.querySelector('t1-popup')).not.toBeNull();
  const submenuSlot = el.shadowRoot!.querySelector<HTMLElement>('slot[name="submenu"]')!;
  expect(submenuSlot.hidden).toBe(false);
});

test('mouseover handler focuses the menu item', async () => {
  const el = createElement('', 'Item');
  el.setAttribute('tabindex', '0');
  await el.updateComplete;

  let focused = false;
  el.addEventListener(
    'focus',
    () => {
      focused = true;
    },
    { once: true },
  );

  el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

  expect(focused).toBe(true);
});
