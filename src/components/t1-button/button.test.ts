import { expect, beforeEach, afterEach, test } from 'vitest';
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
  checkValidity(): boolean;
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

test('has correct default values', async () => {
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

test('renders as a <button> element', async () => {
  const el = createElement();
  await el.updateComplete;

  expect(el.shadowRoot!.querySelector('button')).not.toBeNull();
  expect(el.shadowRoot!.querySelector('a')).toBeNull();
});

test('has no spinner by default', async () => {
  const el = createElement();
  await el.updateComplete;

  expect(el.shadowRoot!.querySelector('t1-spinner')).toBeNull();
});

test('has no caret by default', async () => {
  const el = createElement();
  await el.updateComplete;

  expect(el.shadowRoot!.querySelector('[part~="caret"]')).toBeNull();
});

test('disables the native <button> when disabled', async () => {
  const el = createElement('disabled');
  await el.updateComplete;

  expect(el.shadowRoot!.querySelector('button[disabled]')).not.toBeNull();
});

test('does not disable the native <a> when rendering as link with disabled', async () => {
  const el = createElement('href="some/path" disabled');
  await el.updateComplete;

  expect(el.shadowRoot!.querySelector('a[disabled]')).toBeNull();
});

test('sets aria-disabled="true" when disabled', async () => {
  const el = createElement('disabled');
  await el.updateComplete;

  const base = el.shadowRoot!.querySelector('[part~="base"]')!;
  expect(base.getAttribute('aria-disabled')).toBe('true');
});

test('sets tabindex="-1" when disabled', async () => {
  const el = createElement('disabled');
  await el.updateComplete;

  const base = el.shadowRoot!.querySelector('[part~="base"]')!;
  expect(base.getAttribute('tabindex')).toBe('-1');
});

test('renders a spinner when loading', async () => {
  const el = createElement('loading');
  await el.updateComplete;

  expect(el.shadowRoot!.querySelector('t1-spinner')).not.toBeNull();
});

test('renders the caret icon when caret is set', async () => {
  const el = createElement('caret');
  await el.updateComplete;

  expect(el.shadowRoot!.querySelector('[part~="caret"]')).not.toBeNull();
});

test('forwards the title to the base element', async () => {
  const el = createElement('title="Test"');
  await el.updateComplete;

  const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
  expect(base.title).toBe('Test');
});

test('renders as an <a> when href is present', async () => {
  const el = createElement('href="some/path"');
  await el.updateComplete;

  expect(el.shadowRoot!.querySelector('a')).not.toBeNull();
  expect(el.shadowRoot!.querySelector('button')).toBeNull();
});

test('includes rel="noreferrer noopener" by default for external link', async () => {
  const el = createElement('href="https://example.com/" target="_blank"');
  await el.updateComplete;

  const link = el.shadowRoot!.querySelector('a')!;
  expect(link.getAttribute('rel')).toBe('noreferrer noopener');
});

test('respects a custom rel attribute', async () => {
  const el = createElement('href="https://example.com/" target="_blank" rel="nofollow"');
  await el.updateComplete;

  const link = el.shadowRoot!.querySelector('a')!;
  expect(link.getAttribute('rel')).toBe('nofollow');
});

test('does not set href on disabled link buttons', async () => {
  const el = createElement('href="some/path" disabled');
  await el.updateComplete;

  const link = el.shadowRoot!.querySelector('a')!;
  expect(link.hasAttribute('href')).toBe(false);
});

test('emits t1-focus when focused', async () => {
  const el = createElement();
  await el.updateComplete;

  let focused = false;
  el.addEventListener(
    't1-focus',
    () => {
      focused = true;
    },
    { once: true },
  );
  el.focus();
  await el.updateComplete;

  expect(focused).toBe(true);
});

test('emits t1-blur when blurred', async () => {
  const el = createElement();
  await el.updateComplete;

  el.focus();
  await el.updateComplete;

  let blurred = false;
  el.addEventListener(
    't1-blur',
    () => {
      blurred = true;
    },
    { once: true },
  );
  el.blur();
  await el.updateComplete;

  expect(blurred).toBe(true);
});

test('emits a click event when .click() is called', async () => {
  const el = createElement();
  await el.updateComplete;

  let clicked = false;
  el.addEventListener(
    'click',
    () => {
      clicked = true;
    },
    { once: true },
  );
  el.click();

  expect(clicked).toBe(true);
});

test('reflects variant attribute', async () => {
  const el = createElement('variant="primary"');
  await el.updateComplete;

  expect(el.variant).toBe('primary');
  expect(el.getAttribute('variant')).toBe('primary');
});

test('reflects size attribute', async () => {
  const el = createElement('size="small"');
  await el.updateComplete;

  expect(el.size).toBe('small');
  expect(el.getAttribute('size')).toBe('small');
});

test('reflects outline attribute', async () => {
  const el = createElement('outline');
  await el.updateComplete;

  expect(el.outline).toBe(true);
});

test('reflects pill attribute', async () => {
  const el = createElement('pill');
  await el.updateComplete;

  expect(el.pill).toBe(true);
});

test('reflects circle attribute', async () => {
  const el = createElement('circle');
  await el.updateComplete;

  expect(el.circle).toBe(true);
});

test('renders prefix slot', async () => {
  const wrapper2 = document.createElement('div');
  wrapper2.innerHTML = `<t1-button><span slot="prefix">★</span>Label</t1-button>`;
  document.body.appendChild(wrapper2);
  const el = wrapper2.querySelector('t1-button') as unknown as T1ButtonEl;
  await el.updateComplete;

  const prefix = el.shadowRoot!.querySelector('[part~="prefix"]');
  expect(prefix).not.toBeNull();
  wrapper2.remove();
});

test('renders suffix slot', async () => {
  const wrapper2 = document.createElement('div');
  wrapper2.innerHTML = `<t1-button>Label<span slot="suffix">→</span></t1-button>`;
  document.body.appendChild(wrapper2);
  const el = wrapper2.querySelector('t1-button') as unknown as T1ButtonEl;
  await el.updateComplete;

  const suffix = el.shadowRoot!.querySelector('[part~="suffix"]');
  expect(suffix).not.toBeNull();
  wrapper2.remove();
});

test('checkValidity returns true for a valid button', async () => {
  const el = createElement();
  await el.updateComplete;

  expect(el.checkValidity()).toBe(true);
});
