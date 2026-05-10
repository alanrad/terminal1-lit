import { test, expect, afterEach, vi } from 'vitest';
import '.';

type SearchPropertyWidgetEl = HTMLElement & {
  updateComplete: Promise<boolean>;
  debounce: number;
  search: (term: string) => void;
  onSelect: (property: unknown) => void;
  _state: {
    results: { value: unknown[] };
    properties: { value: unknown[] | null };
    popupVisible: { value: boolean };
    loading: { value: boolean };
    selectedProperty: { value: unknown | null };
    showSkeleton: { value: boolean };
    setResults: (data: unknown[]) => void;
    setProperties: (data: unknown[]) => void;
    setLoading: (value: boolean) => void;
    setSelectedProperty: (property: unknown) => void;
    setShowSkeleton: (value: boolean) => void;
    clearResults: () => void;
    showPopup: () => void;
    hidePopup: () => void;
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

// ── Loading spinner ───────────────────────────────────────────────────────────

test('shows spinner while loading', async () => {
  const el = createElement();
  await el.updateComplete;
  el._state.setLoading(true);
  await el.updateComplete;
  expect(el.shadowRoot!.querySelector('t1-spinner')).not.toBeNull();
});

test('hides spinner when not loading', async () => {
  const el = createElement();
  await el.updateComplete;
  expect(el.shadowRoot!.querySelector('t1-spinner')).toBeNull();
});

// ── Menu item rendering ───────────────────────────────────────────────────────

test('renders one menu item per result', async () => {
  const el = createElement();
  await el.updateComplete;
  el._state.setProperties([makeStub(1), makeStub(2)] as never);
  el._state.setResults([makeStub(1), makeStub(2)] as never);
  await el.updateComplete;
  expect(el.shadowRoot!.querySelectorAll('t1-menu-item').length).toBe(2);
});

test('menu item text contains fullAddress', async () => {
  const el = createElement();
  await el.updateComplete;
  el._state.setProperties([makeStub(1)] as never);
  el._state.setResults([makeStub(1)] as never);
  await el.updateComplete;
  const item = el.shadowRoot!.querySelector('t1-menu-item')!;
  expect(item.textContent?.trim()).toContain('1 St, Sydney, NSW, 2000, Australia');
});

test('menu item prefix icon reflects property type', async () => {
  const el = createElement();
  await el.updateComplete;
  el._state.setProperties([makeStub(1)] as never);
  el._state.setResults([makeStub(1)] as never);
  await el.updateComplete;
  const icon = el.shadowRoot!.querySelector('t1-menu-item t1-icon[slot="prefix"]');
  expect(icon?.getAttribute('name')).toBe('buildings');
});

// ── Focus handling ────────────────────────────────────────────────────────────

test('shows popup when input is focused and results exist', async () => {
  const el = createElement();
  await el.updateComplete;
  el._state.setResults([makeStub(1)] as never);
  el._state.hidePopup();

  el.shadowRoot!.querySelector('t1-input')!.dispatchEvent(
    new CustomEvent('t1-focus', { bubbles: true, composed: true }),
  );

  expect(el._state.popupVisible.value).toBe(true);
});

test('does not open popup when input is focused but results are empty', async () => {
  const el = createElement();
  await el.updateComplete;

  el.shadowRoot!.querySelector('t1-input')!.dispatchEvent(
    new CustomEvent('t1-focus', { bubbles: true, composed: true }),
  );

  expect(el._state.popupVisible.value).toBe(false);
});

// ── Escape key ────────────────────────────────────────────────────────────────

test('clears results when Escape is pressed', async () => {
  const el = createElement();
  await el.updateComplete;
  el._state.setResults([makeStub(1)] as never);
  await el.updateComplete;

  el.shadowRoot!.querySelector('.autocomplete')!.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
  );

  expect(el._state.results.value).toEqual([]);
  expect(el._state.popupVisible.value).toBe(false);
});

// ── Skeleton lifecycle ────────────────────────────────────────────────────────

test('shows property-card-skeleton immediately after selection', async () => {
  vi.useFakeTimers();
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
  await el.updateComplete;

  expect(el.shadowRoot!.querySelector('property-card-skeleton')).not.toBeNull();
  expect(el.shadowRoot!.querySelector('property-card')).toBeNull();
});

test('replaces skeleton with property-card after 2 seconds', async () => {
  vi.useFakeTimers();
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
  await el.updateComplete;

  vi.advanceTimersByTime(2000);
  await el.updateComplete;

  expect(el.shadowRoot!.querySelector('property-card-skeleton')).toBeNull();
  expect(el.shadowRoot!.querySelector('property-card')).not.toBeNull();
});

test('cancels pending skeleton timer when input drops below threshold', async () => {
  vi.useFakeTimers();
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
  await el.updateComplete;

  dispatchInput(el, 'a');
  vi.advanceTimersByTime(2000);
  await el.updateComplete;

  expect(el._state.showSkeleton.value).toBe(false);
  expect(el.shadowRoot!.querySelector('property-card-skeleton')).toBeNull();
});

test('clears skeleton when Escape is pressed', async () => {
  vi.useFakeTimers();
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
  await el.updateComplete;

  el.shadowRoot!.querySelector('.autocomplete')!.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
  );
  await el.updateComplete;

  expect(el._state.showSkeleton.value).toBe(false);
  expect(el.shadowRoot!.querySelector('property-card-skeleton')).toBeNull();
});

test('does not show skeleton or card while popup is open', async () => {
  const el = createElement();
  await el.updateComplete;
  el._state.setShowSkeleton(true);
  el._state.showPopup();
  await el.updateComplete;

  expect(el.shadowRoot!.querySelector('property-card-skeleton')).toBeNull();
  expect(el.shadowRoot!.querySelector('property-card')).toBeNull();
});

test('shows property-card when showSkeleton is false and selectedProperty is set', async () => {
  const el = createElement();
  await el.updateComplete;
  el._state.setSelectedProperty(makeStub(1));
  el._state.setShowSkeleton(false);
  await el.updateComplete;

  expect(el.shadowRoot!.querySelector('property-card')).not.toBeNull();
  expect(el.shadowRoot!.querySelector('property-card-skeleton')).toBeNull();
});

// ── Arrow key navigation ──────────────────────────────────────────────────────

test('ArrowDown does nothing when results are empty', async () => {
  const el = createElement();
  await el.updateComplete;

  el.shadowRoot!.querySelector('.autocomplete')!.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
  );

  expect(el._state.results.value).toEqual([]);
});

test('ArrowDown focuses the first menu item when no item is active', async () => {
  const el = createElement();
  await el.updateComplete;
  el._state.setResults([makeStub(1)] as never);
  await el.updateComplete;

  const menu = el.shadowRoot!.querySelector('t1-menu') as any;
  const mockItem = { focus: vi.fn() } as unknown as HTMLElement;
  menu.getAllItems = vi.fn().mockReturnValue([mockItem]);
  menu.getCurrentItem = vi.fn().mockReturnValue(null);
  menu.setCurrentItem = vi.fn();

  el.shadowRoot!.querySelector('.autocomplete')!.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
  );

  expect(menu.setCurrentItem).toHaveBeenCalledWith(mockItem);
  expect(mockItem.focus).toHaveBeenCalled();
});

test('ArrowDown focuses the active item when one already exists', async () => {
  const el = createElement();
  await el.updateComplete;
  el._state.setResults([makeStub(1)] as never);
  await el.updateComplete;

  const menu = el.shadowRoot!.querySelector('t1-menu') as any;
  const mockItem = { focus: vi.fn() } as unknown as HTMLElement;
  const activeItem = { focus: vi.fn() } as unknown as HTMLElement;
  menu.getAllItems = vi.fn().mockReturnValue([mockItem]);
  menu.getCurrentItem = vi.fn().mockReturnValue(activeItem);
  menu.setCurrentItem = vi.fn();

  el.shadowRoot!.querySelector('.autocomplete')!.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
  );

  expect(menu.setCurrentItem).toHaveBeenCalledWith(activeItem);
  expect(activeItem.focus).toHaveBeenCalled();
});

test('ArrowDown does nothing when menu has no items', async () => {
  const el = createElement();
  await el.updateComplete;
  el._state.setResults([makeStub(1)] as never);
  await el.updateComplete;

  const menu = el.shadowRoot!.querySelector('t1-menu') as any;
  menu.getAllItems = vi.fn().mockReturnValue([]);
  menu.setCurrentItem = vi.fn();

  el.shadowRoot!.querySelector('.autocomplete')!.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
  );

  expect(menu.setCurrentItem).not.toHaveBeenCalled();
});

test('ArrowUp focuses the last menu item', async () => {
  const el = createElement();
  await el.updateComplete;
  el._state.setResults([makeStub(1), makeStub(2)] as never);
  await el.updateComplete;

  const menu = el.shadowRoot!.querySelector('t1-menu') as any;
  const item1 = { focus: vi.fn() } as unknown as HTMLElement;
  const item2 = { focus: vi.fn() } as unknown as HTMLElement;
  menu.getAllItems = vi.fn().mockReturnValue([item1, item2]);
  menu.setCurrentItem = vi.fn();

  el.shadowRoot!.querySelector('.autocomplete')!.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }),
  );

  expect(menu.setCurrentItem).toHaveBeenCalledWith(item2);
  expect(item2.focus).toHaveBeenCalled();
});

test('ArrowUp does nothing when menu has no items', async () => {
  const el = createElement();
  await el.updateComplete;
  el._state.setResults([makeStub(1)] as never);
  await el.updateComplete;

  const menu = el.shadowRoot!.querySelector('t1-menu') as any;
  menu.getAllItems = vi.fn().mockReturnValue([]);
  menu.setCurrentItem = vi.fn();

  el.shadowRoot!.querySelector('.autocomplete')!.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }),
  );

  expect(menu.setCurrentItem).not.toHaveBeenCalled();
});

test('unrecognized key with results present does not change state', async () => {
  const el = createElement();
  await el.updateComplete;
  el._state.setResults([makeStub(1)] as never);
  await el.updateComplete;

  el.shadowRoot!.querySelector('.autocomplete')!.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }),
  );

  expect(el._state.results.value).toHaveLength(1);
  expect(el._state.popupVisible.value).toBe(true);
});

// ── Input value management ────────────────────────────────────────────────────

test('sets input value to selected property fullAddress after menu selection', async () => {
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

  const input = el.shadowRoot!.querySelector('t1-input') as HTMLElement & { value: string };
  expect(input.value).toBe('1 St, Sydney, NSW, 2000, Australia');
});

test('restores user query in input when focused after a selection', async () => {
  const el = createElement();
  await el.updateComplete;
  const stub = [makeStub(1)] as never;
  el._state.setProperties(stub);

  dispatchInput(el, 'Sydney');
  el._state.setResults(stub);

  el.shadowRoot!.querySelector('t1-menu')!.dispatchEvent(
    new CustomEvent('t1-select', {
      detail: { item: { value: '1' } },
      bubbles: true,
      composed: true,
    }),
  );

  el.shadowRoot!.querySelector('t1-input')!.dispatchEvent(
    new CustomEvent('t1-focus', { bubbles: true, composed: true }),
  );

  const input = el.shadowRoot!.querySelector('t1-input') as HTMLElement & { value: string };
  expect(input.value).toBe('Sydney');
});

test('focus with no selected property does not modify input value', async () => {
  const el = createElement();
  await el.updateComplete;

  const input = el.shadowRoot!.querySelector('t1-input') as HTMLElement & { value: string };
  input.value = 'typed text';

  el.shadowRoot!.querySelector('t1-input')!.dispatchEvent(
    new CustomEvent('t1-focus', { bubbles: true, composed: true }),
  );

  expect(input.value).toBe('typed text');
});

// ── Actual search implementation ──────────────────────────────────────────────

test('search loads properties from service when none are cached', async () => {
  const el = createElement();
  await el.updateComplete;

  const mockData = [makeStub(1), makeStub(2)];
  const getSpy = vi.fn().mockResolvedValue(mockData);
  (el as any)._propertyService = { getProperties: getSpy };

  await el.search('Sydney');

  expect(getSpy).toHaveBeenCalledOnce();
  expect(el._state.properties.value).toStrictEqual(mockData);
  expect(el._state.loading.value).toBe(false);
  expect(el._state.results.value).toHaveLength(2);
});

test('search uses cached properties without calling the service again', async () => {
  const el = createElement();
  await el.updateComplete;

  const cached = [makeStub(1), makeStub(2)];
  el._state.setProperties(cached as never);

  const getSpy = vi.fn();
  (el as any)._propertyService = { getProperties: getSpy };

  await el.search('Sydney');

  expect(getSpy).not.toHaveBeenCalled();
  expect(el._state.results.value).toHaveLength(2);
});

test('search clears loading even when the service throws', async () => {
  const el = createElement();
  await el.updateComplete;

  (el as any)._propertyService = {
    getProperties: vi.fn().mockRejectedValue(new Error('Network error')),
  };

  await expect(el.search('Sydney')).rejects.toThrow('Network error');
  expect(el._state.loading.value).toBe(false);
});

// ── Lifecycle ─────────────────────────────────────────────────────────────────

test('disconnectedCallback clears the debounce timer', async () => {
  vi.useFakeTimers();
  const el = createElement();
  await el.updateComplete;
  const spy = vi.fn();
  el.search = spy;

  dispatchInput(el, 'Paris');
  el.remove();

  vi.runAllTimers();
  expect(spy).not.toHaveBeenCalled();
});
