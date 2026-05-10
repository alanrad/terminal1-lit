import { expect, afterEach, test } from 'vitest';
import '.';

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
  document.body.querySelectorAll('t1-option').forEach((el) => el.remove());
});

test('has correct default values', async () => {
  const el = createElement();
  await el.updateComplete;

  expect(el.value).toBe('');
  expect(el.disabled).toBe(false);
  expect(el.selected).toBe(false);
  expect(el.current).toBe(false);
});

test('has role="option"', async () => {
  const el = createElement();
  await el.updateComplete;

  expect(el.getAttribute('role')).toBe('option');
});

test('has aria-selected="false" by default', async () => {
  const el = createElement();
  await el.updateComplete;

  expect(el.getAttribute('aria-selected')).toBe('false');
});

test('sets aria-disabled="true" when disabled', async () => {
  const el = createElement('disabled');
  await el.updateComplete;

  expect(el.getAttribute('aria-disabled')).toBe('true');
});

test('applies option--disabled class when disabled', async () => {
  const el = createElement('disabled');
  await el.updateComplete;

  const base = el.shadowRoot!.querySelector('[part~="base"]')!;
  expect(base.classList.contains('option--disabled')).toBe(true);
});

test('sets aria-selected="true" when selected is true', async () => {
  const el = createElement();
  el.selected = true;
  await el.updateComplete;

  expect(el.getAttribute('aria-selected')).toBe('true');
});

test('applies option--selected class when selected', async () => {
  const el = createElement();
  el.selected = true;
  await el.updateComplete;

  const base = el.shadowRoot!.querySelector('[part~="base"]')!;
  expect(base.classList.contains('option--selected')).toBe(true);
});

test('applies option--current class when current', async () => {
  const el = createElement();
  el.current = true;
  await el.updateComplete;

  const base = el.shadowRoot!.querySelector('[part~="base"]')!;
  expect(base.classList.contains('option--current')).toBe(true);
});

test('reflects the value attribute', async () => {
  const el = createElement('value="hello"');
  await el.updateComplete;

  expect(el.value).toBe('hello');
});

test('converts non-string values to string', async () => {
  const el = createElement();
  await el.updateComplete;

  (el as unknown as { value: unknown }).value = 42;
  await el.updateComplete;

  expect(el.value).toBe('42');
});

test('replaces spaces in value with underscores', async () => {
  const el = createElement();
  await el.updateComplete;

  el.value = 'hello world';
  await el.updateComplete;

  expect(el.value).toBe('hello_world');
});

test('getTextLabel returns the text content of the label slot', async () => {
  const el = createElement('', 'Save File');
  await el.updateComplete;

  expect(el.getTextLabel()).toBe('Save File');
});

test('getTextLabel strips HTML element text from slotted elements', async () => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = '<t1-option><strong>Bold Option</strong></t1-option>';
  document.body.appendChild(wrapper);
  const el = wrapper.querySelector('t1-option') as unknown as T1OptionEl;
  await el.updateComplete;

  expect(el.getTextLabel()).toBe('Bold Option');
  wrapper.remove();
});

test('getTextLabel excludes prefix/suffix slot text from label', async () => {
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

test('applies option--hover class on mouseenter', async () => {
  const el = createElement();
  await el.updateComplete;

  const base = el.shadowRoot!.querySelector('[part~="base"]')!;
  base.dispatchEvent(new MouseEvent('mouseenter'));
  await el.updateComplete;

  expect(base.classList.contains('option--hover')).toBe(true);
});

test('removes option--hover class on mouseleave', async () => {
  const el = createElement();
  await el.updateComplete;

  const base = el.shadowRoot!.querySelector('[part~="base"]')!;
  base.dispatchEvent(new MouseEvent('mouseenter'));
  await el.updateComplete;

  base.dispatchEvent(new MouseEvent('mouseleave'));
  await el.updateComplete;

  expect(base.classList.contains('option--hover')).toBe(false);
});
