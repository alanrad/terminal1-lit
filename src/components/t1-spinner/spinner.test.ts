import { describe, it, expect, afterEach } from 'vitest';
import './index';

type T1SpinnerEl = HTMLElement & {
  updateComplete: Promise<boolean>;
};

function createElement(): T1SpinnerEl {
  const el = document.createElement('t1-spinner') as unknown as T1SpinnerEl;
  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  document.body.querySelectorAll('t1-spinner').forEach(el => el.remove());
});

describe('t1-spinner', () => {
  it('renders an SVG base element', async () => {
    const el = createElement();
    await el.updateComplete;

    const base = el.shadowRoot!.querySelector('[part~="base"]');
    expect(base).not.toBeNull();
    expect(base!.tagName.toLowerCase()).toBe('svg');
  });

  it('base element has role="progressbar"', async () => {
    const el = createElement();
    await el.updateComplete;

    const base = el.shadowRoot!.querySelector('[part~="base"]')!;
    expect(base.getAttribute('role')).toBe('progressbar');
  });

  it('base element has aria-label', async () => {
    const el = createElement();
    await el.updateComplete;

    const base = el.shadowRoot!.querySelector('[part~="base"]')!;
    expect(base.hasAttribute('aria-label')).toBe(true);
    expect(base.getAttribute('aria-label')).toBeTruthy();
  });

  it('renders a track circle', async () => {
    const el = createElement();
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('.spinner__track')).not.toBeNull();
  });

  it('renders an indicator circle', async () => {
    const el = createElement();
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('.spinner__indicator')).not.toBeNull();
  });
});
