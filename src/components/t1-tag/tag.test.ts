import { expect, afterEach, test } from 'vitest';
import '.';

type T1TagEl = HTMLElement & {
  updateComplete: Promise<boolean>;
  variant: string;
  size: string;
  pill: boolean;
  removable: boolean;
};

function createElement(attrs = '', content = 'Tag'): T1TagEl {
  const el = document.createElement('t1-tag') as unknown as T1TagEl;
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
  document.body.querySelectorAll('t1-tag').forEach((el) => el.remove());
});

test('has correct defaults', async () => {
  const el = createElement();
  await el.updateComplete;

  expect(el.variant).toBe('neutral');
  expect(el.size).toBe('medium');
  expect(el.pill).toBe(false);
  expect(el.removable).toBe(false);
});

test('renders base span with tag--neutral and tag--medium classes', async () => {
  const el = createElement();
  await el.updateComplete;

  const base = el.shadowRoot!.querySelector('[part~="base"]')!;
  expect(base.classList.contains('tag--neutral')).toBe(true);
  expect(base.classList.contains('tag--medium')).toBe(true);
});

test('does not render a remove button by default', async () => {
  const el = createElement();
  await el.updateComplete;

  expect(el.shadowRoot!.querySelector('[part~="remove-button"]')).toBeNull();
});

(['primary', 'success', 'neutral', 'warning', 'danger', 'text'] as const).forEach((variant) => {
  test(`applies tag--${variant} class for variant="${variant}"`, async () => {
    const el = createElement(`variant="${variant}"`);
    await el.updateComplete;

    const base = el.shadowRoot!.querySelector('[part~="base"]')!;
    expect(base.classList.contains(`tag--${variant}`)).toBe(true);
    expect(el.getAttribute('variant')).toBe(variant);
  });
});

(['small', 'medium', 'large'] as const).forEach((size) => {
  test(`applies tag--${size} class for size="${size}"`, async () => {
    const el = createElement(`size="${size}"`);
    await el.updateComplete;

    const base = el.shadowRoot!.querySelector('[part~="base"]')!;
    expect(base.classList.contains(`tag--${size}`)).toBe(true);
  });
});

test('applies tag--pill class when pill is set', async () => {
  const el = createElement('pill');
  await el.updateComplete;

  const base = el.shadowRoot!.querySelector('[part~="base"]')!;
  expect(base.classList.contains('tag--pill')).toBe(true);
});

test('renders the remove button when removable', async () => {
  const el = createElement('removable');
  await el.updateComplete;

  expect(el.shadowRoot!.querySelector('[part~="remove-button"]')).not.toBeNull();
});

test('applies tag--removable class when removable', async () => {
  const el = createElement('removable');
  await el.updateComplete;

  const base = el.shadowRoot!.querySelector('[part~="base"]')!;
  expect(base.classList.contains('tag--removable')).toBe(true);
});

test('emits t1-remove when remove button is clicked', async () => {
  const el = createElement('removable');
  await el.updateComplete;

  let removed = false;
  el.addEventListener(
    't1-remove',
    () => {
      removed = true;
    },
    { once: true },
  );

  const removeBtn = el.shadowRoot!.querySelector<HTMLElement>('[part~="remove-button"]')!;
  removeBtn.click();

  expect(removed).toBe(true);
});

test('renders slotted text', async () => {
  const el = createElement('', 'Hello World');
  await el.updateComplete;

  expect(el.textContent).toBe('Hello World');
});
