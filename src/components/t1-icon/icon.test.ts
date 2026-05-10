import { expect, beforeAll, vi, afterEach, test } from 'vitest';
import { registerIconLibrary } from './icon.library';
import '.';

const SIMPLE_SVG =
  '<svg id="test-icon" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8"/></svg>';
const BAD_SVG = '<div>not an svg</div>';

let urlCounter = 0;
function uniqueUrl(name = 'icon') {
  return `https://example.com/${name}-${urlCounter++}.svg`;
}

function mockFetch(svgText: string, ok = true, status = 200) {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok,
    status,
    text: async () => svgText,
  } as Response);
}

beforeAll(() => {
  registerIconLibrary('test-lib', {
    resolver: (name) => `https://example.com/test-lib/${name}-${urlCounter}.svg`,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

function createElement() {
  const el = document.createElement('t1-icon') as HTMLElement & {
    updateComplete: Promise<boolean>;
    name?: string;
    src?: string;
    label: string;
    library: string;
    setIcon(): Promise<void>;
  };
  document.body.appendChild(el);
  return el;
}

test('default properties', async () => {
  const el = createElement();
  await el.updateComplete;

  expect(el.name).toBeUndefined();
  expect(el.src).toBeUndefined();
  expect(el.label).toBe('');
  expect(el.library).toBe('default');
  el.remove();
});

test('sets aria attrs when label is provided', async () => {
  const el = createElement();
  el.label = 'An icon';
  await el.updateComplete;

  expect(el.getAttribute('role')).toBe('img');
  expect(el.getAttribute('aria-label')).toBe('An icon');
  expect(el.hasAttribute('aria-hidden')).toBe(false);
  el.remove();
});

test('sets aria-hidden when no label', async () => {
  const el = createElement();
  await el.updateComplete;

  expect(el.getAttribute('aria-hidden')).toBe('true');
  expect(el.hasAttribute('role')).toBe(false);
  expect(el.hasAttribute('aria-label')).toBe(false);
  el.remove();
});

test('renders svg from src and emits t1-load', async () => {
  mockFetch(SIMPLE_SVG);
  const el = createElement();
  await el.updateComplete;

  const loadPromise = new Promise<void>((resolve) =>
    el.addEventListener('t1-load', () => resolve(), { once: true }),
  );
  el.src = uniqueUrl('src-test');
  await loadPromise;
  await el.updateComplete;

  expect(el.shadowRoot!.querySelector('svg')).not.toBeNull();
  el.remove();
});

test('renders icon from test library', async () => {
  mockFetch(SIMPLE_SVG);
  const el = createElement();
  el.library = 'test-lib';
  await el.updateComplete;

  const loadPromise = new Promise<void>((resolve) =>
    el.addEventListener('t1-load', () => resolve(), { once: true }),
  );
  urlCounter++;
  el.name = 'test-icon';
  await loadPromise;
  await el.updateComplete;

  expect(el.shadowRoot!.querySelector('svg')).not.toBeNull();
  el.remove();
});

test('emits t1-load when icon loads', async () => {
  mockFetch(SIMPLE_SVG);
  const el = createElement();
  await el.updateComplete;

  let loaded = false;
  const loadPromise = new Promise<void>((resolve) =>
    el.addEventListener(
      't1-load',
      () => {
        loaded = true;
        resolve();
      },
      { once: true },
    ),
  );
  el.src = uniqueUrl('load-test');
  await loadPromise;

  expect(loaded).toBe(true);
  el.remove();
});

test('emits t1-error for bad icon content', async () => {
  mockFetch(BAD_SVG);
  const el = createElement();
  await el.updateComplete;

  const errorPromise = new Promise<void>((resolve) =>
    el.addEventListener('t1-error', () => resolve(), { once: true }),
  );
  el.src = uniqueUrl('bad-content');
  await errorPromise;

  expect(el.shadowRoot!.querySelector('svg')).toBeNull();
  el.remove();
});

test('emits t1-error for failed fetch (410)', async () => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: false,
    status: 410,
  } as Response);
  const el = createElement();
  await el.updateComplete;

  const errorPromise = new Promise<void>((resolve) =>
    el.addEventListener('t1-error', () => resolve(), { once: true }),
  );
  el.src = uniqueUrl('error-test');
  await errorPromise;

  expect(el.shadowRoot!.querySelector('svg')).toBeNull();
  el.remove();
});

test('SVG has part="svg"', async () => {
  mockFetch(SIMPLE_SVG);
  const el = createElement();
  await el.updateComplete;

  const loadPromise = new Promise<void>((resolve) =>
    el.addEventListener('t1-load', () => resolve(), { once: true }),
  );
  el.src = uniqueUrl('part-test');
  await loadPromise;
  await el.updateComplete;

  const svg = el.shadowRoot!.querySelector('svg');
  expect(svg).not.toBeNull();
  const hasPart = svg!.part?.contains('svg') || svg!.getAttribute('part') === 'svg';
  expect(hasPart).toBe(true);
  el.remove();
});
