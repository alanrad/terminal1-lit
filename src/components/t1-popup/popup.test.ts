import { expect, afterEach, test } from 'vitest';
import '.';

type T1PopupEl = HTMLElement & {
  updateComplete: Promise<boolean>;
  active: boolean;
  placement: string;
  strategy: string;
  distance: number;
  skidding: number;
  arrow: boolean;
  flip: boolean;
  shift: boolean;
  reposition(): void;
};

function createElement(attrs = ''): T1PopupEl {
  const el = document.createElement('t1-popup') as unknown as T1PopupEl;
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
  document.body.querySelectorAll('t1-popup').forEach((el) => el.remove());
});

test('has correct default values', async () => {
  const el = createElement();
  await el.updateComplete;

  expect(el.active).toBe(false);
  expect(el.placement).toBe('top');
  expect(el.strategy).toBe('absolute');
  expect(el.distance).toBe(0);
  expect(el.skidding).toBe(0);
  expect(el.arrow).toBe(false);
  expect(el.flip).toBe(false);
  expect(el.shift).toBe(false);
});

test('renders a popup container in the shadow DOM', async () => {
  const el = createElement();
  await el.updateComplete;

  expect(el.shadowRoot!.querySelector('[part~="popup"]')).not.toBeNull();
});

test('adds popup--active class to the popup container when active', async () => {
  const el = createElement('active');
  await el.updateComplete;

  const popup = el.shadowRoot!.querySelector('[part~="popup"]')!;
  expect(popup.classList.contains('popup--active')).toBe(true);
});

test('reflects active attribute', async () => {
  const el = createElement('active');
  await el.updateComplete;

  expect(el.getAttribute('active')).not.toBeNull();
});

test('does not add popup--active class when inactive', async () => {
  const el = createElement();
  await el.updateComplete;

  const popup = el.shadowRoot!.querySelector('[part~="popup"]')!;
  expect(popup.classList.contains('popup--active')).toBe(false);
});

test('does not throw when toggling active on and off', async () => {
  const el = createElement();
  await el.updateComplete;

  expect(() => {
    el.active = true;
    el.active = false;
    el.active = true;
  }).not.toThrow();
});

test('does not throw when a scroll event fires while active', async () => {
  const el = createElement();
  await el.updateComplete;

  el.active = true;
  await el.updateComplete;

  expect(() => {
    window.dispatchEvent(new Event('scroll'));
  }).not.toThrow();

  el.active = false;
  await el.updateComplete;
});

test('renders the arrow element when arrow is set', async () => {
  const el = createElement('arrow');
  await el.updateComplete;

  expect(el.shadowRoot!.querySelector('[part~="arrow"]')).not.toBeNull();
});

test('does not render the arrow element when arrow is not set', async () => {
  const el = createElement();
  await el.updateComplete;

  expect(el.shadowRoot!.querySelector('[part~="arrow"]')).toBeNull();
});

test('reflects the placement attribute', async () => {
  const el = createElement('placement="bottom"');
  await el.updateComplete;

  expect(el.placement).toBe('bottom');
  expect(el.getAttribute('placement')).toBe('bottom');
});

test('emits t1-reposition when active with an anchor element', async () => {
  const anchor = document.createElement('div');
  document.body.appendChild(anchor);

  const el = createElement('active');
  (el as unknown as { anchorEl: Element }).anchorEl = anchor;
  await el.updateComplete;

  let repositioned = false;
  el.addEventListener(
    't1-reposition',
    () => {
      repositioned = true;
    },
    { once: true },
  );
  el.reposition();

  anchor.remove();
  expect(repositioned).toBe(true);
});

test('does not throw when reposition is called while inactive', async () => {
  const el = createElement();
  await el.updateComplete;

  expect(() => el.reposition()).not.toThrow();
});

test('does not throw when reposition is called with no anchor', async () => {
  const el = createElement('active');
  await el.updateComplete;

  expect(() => el.reposition()).not.toThrow();
});
