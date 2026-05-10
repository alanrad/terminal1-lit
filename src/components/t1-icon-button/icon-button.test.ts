import { expect, afterEach, test } from 'vitest';
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
  document.body.querySelectorAll('t1-icon-button').forEach((el) => el.remove());
});

test('has correct default values', async () => {
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

test('renders as a <button> by default', async () => {
  const el = createElement();
  await el.updateComplete;

  expect(el.shadowRoot!.querySelector('button')).not.toBeNull();
  expect(el.shadowRoot!.querySelector('a')).toBeNull();
});

test('always renders a t1-icon inside', async () => {
  const el = createElement();
  await el.updateComplete;

  expect(el.shadowRoot!.querySelector('t1-icon')).not.toBeNull();
});

test('forwards name to t1-icon', async () => {
  const el = createElement('name="check"');
  await el.updateComplete;

  const icon = el.shadowRoot!.querySelector('t1-icon')!;
  expect(icon.getAttribute('name')).toBe('check');
});

test('forwards library to t1-icon', async () => {
  const el = createElement('library="system" name="check"');
  await el.updateComplete;

  const icon = el.shadowRoot!.querySelector('t1-icon')!;
  expect(icon.getAttribute('library')).toBe('system');
});

test('renders as an <a> when href is present', async () => {
  const el = createElement('href="some/path"');
  await el.updateComplete;

  expect(el.shadowRoot!.querySelector('a')).not.toBeNull();
  expect(el.shadowRoot!.querySelector('button')).toBeNull();
});

test('does not set rel when no target', async () => {
  const el = createElement('href="some/path"');
  await el.updateComplete;

  expect(el.shadowRoot!.querySelector('a[rel]')).toBeNull();
});

(['_blank', '_parent', '_self', '_top'] as const).forEach((target) => {
  test(`sets target="${target}" on the anchor`, async () => {
    const el = createElement(`href="some/path" target="${target}"`);
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector(`a[target="${target}"]`)).not.toBeNull();
  });

  test(`sets rel="noreferrer noopener" when target="${target}"`, async () => {
    const el = createElement(`href="some/path" target="${target}"`);
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('a[rel="noreferrer noopener"]')).not.toBeNull();
  });
});

test('sets the download attribute on the anchor', async () => {
  const el = createElement('href="some/path" download="file.pdf"');
  await el.updateComplete;

  expect(el.shadowRoot!.querySelector('a[download="file.pdf"]')).not.toBeNull();
});

test('sets aria-label on the button when label is set', async () => {
  const el = createElement('label="close"');
  await el.updateComplete;

  expect(el.shadowRoot!.querySelector('button[aria-label="close"]')).not.toBeNull();
});

test('sets aria-label on the anchor when label is set', async () => {
  const el = createElement('href="some/path" label="close"');
  await el.updateComplete;

  expect(el.shadowRoot!.querySelector('a[aria-label="close"]')).not.toBeNull();
});

test('the button has disabled attribute when disabled', async () => {
  const el = createElement('disabled');
  await el.updateComplete;

  expect(el.shadowRoot!.querySelector('button[disabled]')).not.toBeNull();
});

test('the anchor has aria-disabled="true" when href and disabled', async () => {
  const el = createElement('href="some/path" disabled');
  await el.updateComplete;

  expect(el.shadowRoot!.querySelector('a[aria-disabled="true"]')).not.toBeNull();
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

test('click() on enabled button triggers handleClick', async () => {
  const el = createElement('label="test"');
  await el.updateComplete;

  const button = el.shadowRoot!.querySelector<HTMLButtonElement>('button')!;
  let nativeClicked = false;
  button.addEventListener(
    'click',
    () => {
      nativeClicked = true;
    },
    { once: true },
  );
  el.click();

  expect(nativeClicked).toBe(true);
});
