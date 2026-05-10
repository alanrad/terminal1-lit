import { expect, afterEach, vi, test } from 'vitest';
import './index';

type T1AlertEl = HTMLElement & {
  updateComplete: Promise<boolean>;
  open: boolean;
  closable: boolean;
  variant: string;
  duration: number;
  show: () => Promise<void>;
  hide: () => Promise<void>;
  toast: () => Promise<void>;
};

function createElement(
  attrs: Record<string, string | boolean | number> = {},
  content = 'Alert message',
): T1AlertEl {
  const el = document.createElement('t1-alert') as unknown as T1AlertEl;
  Object.entries(attrs).forEach(([k, v]) => {
    if (v === true) el.setAttribute(k, '');
    else if (v !== false) el.setAttribute(k, String(v));
  });
  el.textContent = content;
  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  document.body.querySelectorAll('t1-alert').forEach((el) => el.remove());
  document.body.querySelectorAll('.t1-toast-stack').forEach((el) => el.remove());
});

test('is hidden when open is not set', async () => {
  const el = createElement();
  await el.updateComplete;
  const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
  expect(base.hidden).toBe(true);
});

test('is visible when open is set', async () => {
  const el = createElement({ open: true });
  await el.updateComplete;
  const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
  expect(base.hidden).toBe(false);
});

test('base has role="alert"', async () => {
  const el = createElement({ open: true });
  await el.updateComplete;
  const base = el.shadowRoot!.querySelector('[part~="base"]')!;
  expect(base.getAttribute('role')).toBe('alert');
});

test('show() reveals the alert and emits t1-show + t1-after-show', async () => {
  const el = createElement();
  await el.updateComplete;

  const showHandler = vi.fn();
  const afterShowHandler = vi.fn();
  el.addEventListener('t1-show', showHandler);
  el.addEventListener('t1-after-show', afterShowHandler);

  await el.show();

  const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
  expect(base.hidden).toBe(false);
  expect(showHandler).toHaveBeenCalledOnce();
  expect(afterShowHandler).toHaveBeenCalledOnce();
});

test('hide() hides the alert and emits t1-hide + t1-after-hide', async () => {
  const el = createElement({ open: true });
  await el.updateComplete;

  const hideHandler = vi.fn();
  const afterHideHandler = vi.fn();
  el.addEventListener('t1-hide', hideHandler);
  el.addEventListener('t1-after-hide', afterHideHandler);

  await el.hide();

  const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
  expect(base.hidden).toBe(true);
  expect(hideHandler).toHaveBeenCalledOnce();
  expect(afterHideHandler).toHaveBeenCalledOnce();
});

test('show() is a no-op when already open', async () => {
  const el = createElement({ open: true });
  await el.updateComplete;

  const showHandler = vi.fn();
  el.addEventListener('t1-show', showHandler);
  await el.show();

  expect(showHandler).not.toHaveBeenCalled();
});

test('setting open=true emits t1-show', async () => {
  const el = createElement();
  await el.updateComplete;

  const showHandler = vi.fn();
  el.addEventListener('t1-show', showHandler);

  el.open = true;
  await el.updateComplete;
  await el.updateComplete;

  expect(showHandler).toHaveBeenCalledOnce();
});

test('setting open=false emits t1-hide', async () => {
  const el = createElement({ open: true });
  await el.updateComplete;

  const hideHandler = vi.fn();
  el.addEventListener('t1-hide', hideHandler);

  el.open = false;
  await el.updateComplete;
  await el.updateComplete;

  expect(hideHandler).toHaveBeenCalledOnce();
});

(['primary', 'success', 'neutral', 'warning', 'danger'] as const).forEach((variant) => {
  test(`applies alert--${variant} class for variant="${variant}"`, async () => {
    const el = createElement({ variant, open: true });
    await el.updateComplete;

    const base = el.shadowRoot!.querySelector('[part~="base"]')!;
    expect(base.classList.contains(`alert--${variant}`)).toBe(true);
  });
});

test('shows close button when closable is set', async () => {
  const el = createElement({ open: true, closable: true });
  await el.updateComplete;

  const closeButton = el.shadowRoot!.querySelector('[part="close-button"]');
  expect(closeButton).not.toBeNull();
});

test('does not show close button without closable', async () => {
  const el = createElement({ open: true });
  await el.updateComplete;

  const closeButton = el.shadowRoot!.querySelector('[part="close-button"]');
  expect(closeButton).toBeNull();
});

test('clicking close button hides the alert', async () => {
  const el = createElement({ open: true, closable: true });
  await el.updateComplete;

  const closeButton = el.shadowRoot!.querySelector<HTMLElement>('[part="close-button"]')!;
  const hideHandler = vi.fn();
  el.addEventListener('t1-hide', hideHandler);

  closeButton.click();
  await el.updateComplete;
  await el.updateComplete;

  expect(hideHandler).toHaveBeenCalledOnce();
});

test('applies alert--has-icon when icon slot is filled', async () => {
  const el = createElement({ open: true });
  const icon = document.createElement('span');
  icon.setAttribute('slot', 'icon');
  icon.textContent = '!';
  el.appendChild(icon);
  await el.updateComplete;

  const base = el.shadowRoot!.querySelector('[part~="base"]')!;
  expect(base.classList.contains('alert--has-icon')).toBe(true);
});

test('closes automatically after duration ms', async () => {
  vi.useFakeTimers();
  const el = createElement({ open: true, duration: '2000' });
  await el.updateComplete;

  const hideHandler = vi.fn();
  el.addEventListener('t1-hide', hideHandler);

  vi.advanceTimersByTime(1999);
  expect(hideHandler).not.toHaveBeenCalled();

  vi.advanceTimersByTime(1);
  await el.updateComplete;
  expect(hideHandler).toHaveBeenCalledOnce();

  vi.useRealTimers();
});

test('pauseAutoHide stops the auto-hide timer on mouseenter', async () => {
  vi.useFakeTimers();
  const el = createElement({ open: true, duration: '1000' });
  await el.updateComplete;

  const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
  const hideHandler = vi.fn();
  el.addEventListener('t1-hide', hideHandler);

  base.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  vi.advanceTimersByTime(1500);
  await el.updateComplete;

  expect(hideHandler).not.toHaveBeenCalled();

  vi.useRealTimers();
});

test('resumeAutoHide restarts the auto-hide timer on mouseleave', async () => {
  vi.useFakeTimers();
  const el = createElement({ open: true, duration: '1000' });
  await el.updateComplete;

  const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
  const hideHandler = vi.fn();
  el.addEventListener('t1-hide', hideHandler);

  base.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  vi.advanceTimersByTime(500);

  base.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
  vi.advanceTimersByTime(1001);
  await el.updateComplete;

  expect(hideHandler).toHaveBeenCalledOnce();

  vi.useRealTimers();
});

test('appends alert to toast stack on body', async () => {
  const el = createElement();
  await el.updateComplete;

  const afterShowPromise = new Promise<void>((resolve) => {
    el.addEventListener('t1-after-show', () => resolve(), { once: true });
  });

  el.toast();
  await afterShowPromise;

  const stack = document.body.querySelector('.t1-toast-stack');
  expect(stack).not.toBeNull();
  expect(stack?.contains(el)).toBe(true);
});
