import { test, expect, afterEach, vi } from 'vitest';
import './index';

type SearchPropertyWidgetEl = HTMLElement & {
  updateComplete: Promise<boolean>;
  debounce: number;
  search: (term: string) => void;
  onSelect: (property: unknown) => void;
  _state: {
    results: { value: unknown[] };
    properties: { value: unknown[] | null };
    popupVisible: { value: boolean };
    setResults: (data: unknown[]) => void;
    setProperties: (data: unknown[]) => void;
  };
};

function createElement(attrs: Record<string, string | number> = {}): SearchPropertyWidgetEl {
  const element = document.createElement(
    'search-property-widget',
  ) as unknown as SearchPropertyWidgetEl;
  Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, String(value)));
  document.body.appendChild(element);
  return element;
}

function dispatchInput(el: SearchPropertyWidgetEl, value: string) {
  const input = el.shadowRoot!.querySelector('t1-input') as HTMLElement & { value: string };
  input.value = value;
  input.dispatchEvent(new CustomEvent('t1-input', { bubbles: true, composed: true }));
}

function makeStub(id: number) {
  return {
    id,
    name: `Property ${id}`,
    rating: 3,
    propertyType: 'hotel',
    facilities: [],
    address: '1 St',
    city: 'Sydney',
    state: 'NSW',
    postcode: '2000',
    country: 'Australia',
    price: { total: 100, currency: 'AUD' },
    fullAddress: '1 St, Sydney, NSW, 2000, Australia',
  };
}

afterEach(() => {
  document.body.querySelectorAll('search-property-widget').forEach((element) => element.remove());
  vi.restoreAllMocks();
  vi.useRealTimers();
});

test('renders a t1-input with the correct placeholder', async () => {
  const el = createElement();
  await el.updateComplete;
  const input = el.shadowRoot!.querySelector('t1-input')!;
  expect(input.getAttribute('placeholder')).toBe('Where would you like to go?');
});

test('renders a t1-icon with slot prefix and name search', async () => {
  const el = createElement();
  await el.updateComplete;
  const icon = el.shadowRoot!.querySelector('t1-icon')!;
  expect(icon.getAttribute('slot')).toBe('prefix');
  expect(icon.getAttribute('name')).toBe('search');
});

test('has clearable attribute on the input', async () => {
  const el = createElement();
  await el.updateComplete;
  const input = el.shadowRoot!.querySelector('t1-input')!;
  expect(input.hasAttribute('clearable')).toBe(true);
});

test('does not call search when input is empty', async () => {
  vi.useFakeTimers();
  const el = createElement();
  await el.updateComplete;
  const spy = vi.fn();
  el.search = spy;
  dispatchInput(el, '');
  vi.runAllTimers();
  expect(spy).not.toHaveBeenCalled();
});

test('does not call search when input has 1 character', async () => {
  vi.useFakeTimers();
  const el = createElement();
  await el.updateComplete;
  const spy = vi.fn();
  el.search = spy;
  dispatchInput(el, 'a');
  vi.runAllTimers();
  expect(spy).not.toHaveBeenCalled();
});

test('calls search when input has 2 characters', async () => {
  vi.useFakeTimers();
  const el = createElement();
  await el.updateComplete;
  const spy = vi.fn();
  el.search = spy;
  dispatchInput(el, 'ab');
  vi.runAllTimers();
  expect(spy).toHaveBeenCalledOnce();
  expect(spy).toHaveBeenCalledWith('ab');
});

test('calls search when input has 4 characters', async () => {
  vi.useFakeTimers();
  const el = createElement();
  await el.updateComplete;
  const spy = vi.fn();
  el.search = spy;
  dispatchInput(el, 'abcd');
  vi.runAllTimers();
  expect(spy).toHaveBeenCalledOnce();
  expect(spy).toHaveBeenCalledWith('abcd');
});

test('calls search with the full query string', async () => {
  vi.useFakeTimers();
  const el = createElement();
  await el.updateComplete;
  const spy = vi.fn();
  el.search = spy;
  dispatchInput(el, 'Where would you like to go?');
  vi.runAllTimers();
  expect(spy).toHaveBeenCalledWith('Where would you like to go?');
});

test('clears results immediately when input drops to 1 character', async () => {
  vi.useFakeTimers();
  const el = createElement();
  await el.updateComplete;
  el._state.setResults([{ id: 1 }] as never);
  dispatchInput(el, 'a');
  expect(el._state.results.value).toEqual([]);
});

test('clears results immediately when input is cleared to empty', async () => {
  vi.useFakeTimers();
  const el = createElement();
  await el.updateComplete;
  el._state.setResults([{ id: 1 }] as never);
  dispatchInput(el, '');
  expect(el._state.results.value).toEqual([]);
});

test('cancels any pending debounce timer when input drops below 2 characters', async () => {
  vi.useFakeTimers();
  const el = createElement();
  await el.updateComplete;
  const spy = vi.fn();
  el.search = spy;
  dispatchInput(el, 'Paris');
  dispatchInput(el, 'P');
  vi.runAllTimers();
  expect(spy).not.toHaveBeenCalled();
});

test('does not call search before the debounce delay elapses', async () => {
  vi.useFakeTimers();
  const el = createElement();
  await el.updateComplete;
  const spy = vi.fn();
  el.search = spy;
  dispatchInput(el, 'Paris');
  expect(spy).not.toHaveBeenCalled();
  vi.advanceTimersByTime(999);
  expect(spy).not.toHaveBeenCalled();
});

test('calls search after the default 1s debounce delay', async () => {
  vi.useFakeTimers();
  const el = createElement();
  await el.updateComplete;
  const spy = vi.fn();
  el.search = spy;
  dispatchInput(el, 'Paris');
  vi.advanceTimersByTime(1000);
  expect(spy).toHaveBeenCalledOnce();
});

test('debounces rapid input and only calls search once with the last value', async () => {
  vi.useFakeTimers();
  const el = createElement();
  await el.updateComplete;
  const spy = vi.fn();
  el.search = spy;
  ['Pari', 'Paris', 'Paris ', 'Paris F'].forEach((term) => dispatchInput(el, term));
  vi.runAllTimers();
  expect(spy).toHaveBeenCalledOnce();
  expect(spy).toHaveBeenCalledWith('Paris F');
});

test('respects a custom debounce attribute value', async () => {
  vi.useFakeTimers();
  const el = createElement({ debounce: 500 });
  await el.updateComplete;
  const spy = vi.fn();
  el.search = spy;
  dispatchInput(el, 'Paris');
  vi.advanceTimersByTime(499);
  expect(spy).not.toHaveBeenCalled();
  vi.advanceTimersByTime(1);
  expect(spy).toHaveBeenCalledOnce();
});

test('hides the popup when a menu item is selected', async () => {
  const el = createElement();
  await el.updateComplete;
  const stub = [makeStub(1)] as never;
  el._state.setProperties(stub);
  el._state.setResults(stub);
  await el.updateComplete;

  el.shadowRoot!.querySelector('t1-menu')!.dispatchEvent(
    new CustomEvent('t1-select', {
      detail: { item: { value: '1' } },
      bubbles: true,
      composed: true,
    }),
  );

  expect(el._state.popupVisible.value).toBe(false);
});

test('preserves results after selection so the popup can reopen', async () => {
  const el = createElement();
  await el.updateComplete;
  const stub = [makeStub(1)] as never;
  el._state.setProperties(stub);
  el._state.setResults(stub);
  await el.updateComplete;

  el.shadowRoot!.querySelector('t1-menu')!.dispatchEvent(
    new CustomEvent('t1-select', {
      detail: { item: { value: '1' } },
      bubbles: true,
      composed: true,
    }),
  );

  expect(el._state.results.value).toHaveLength(1);
});

test('calls onSelect with the matched property', async () => {
  const el = createElement();
  await el.updateComplete;
  const stub = [makeStub(42)] as never;
  el._state.setProperties(stub);
  el._state.setResults(stub);
  await el.updateComplete;

  const spy = vi.fn();
  el.onSelect = spy;

  el.shadowRoot!.querySelector('t1-menu')!.dispatchEvent(
    new CustomEvent('t1-select', {
      detail: { item: { value: '42' } },
      bubbles: true,
      composed: true,
    }),
  );

  expect(spy).toHaveBeenCalledOnce();
  expect(spy.mock.calls[0][0]).toMatchObject({ id: 42, name: 'Property 42' });
});

test('does not call onSelect when the id does not match any property', async () => {
  const el = createElement();
  await el.updateComplete;
  el._state.setProperties([makeStub(1)] as never);
  el._state.setResults([makeStub(1)] as never);
  await el.updateComplete;

  const spy = vi.fn();
  el.onSelect = spy;

  el.shadowRoot!.querySelector('t1-menu')!.dispatchEvent(
    new CustomEvent('t1-select', {
      detail: { item: { value: '999' } },
      bubbles: true,
      composed: true,
    }),
  );

  expect(spy).not.toHaveBeenCalled();
});
