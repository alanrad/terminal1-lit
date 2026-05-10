import { expect, afterEach, test } from 'vitest';
import './index';

type T1FormatDateEl = HTMLElement & {
  updateComplete: Promise<boolean>;
  date: Date | string;
  weekday: string | undefined;
  era: string | undefined;
  year: string | undefined;
  month: string | undefined;
  day: string | undefined;
  hour: string | undefined;
  minute: string | undefined;
  second: string | undefined;
  timeZoneName: string | undefined;
  timeZone: string | undefined;
  hourFormat: 'auto' | '12' | '24';
};

const JAN_1 = new Date(new Date().getFullYear(), 0, 1);

function createElement(): T1FormatDateEl {
  const el = document.createElement('t1-format-date') as unknown as T1FormatDateEl;
  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  document.body.querySelectorAll('t1-format-date').forEach((el) => el.remove());
});

function text(el: T1FormatDateEl): string {
  return el.shadowRoot!.textContent?.trim() ?? '';
}

test('has correct defaults', async () => {
  const el = createElement();
  await el.updateComplete;
  expect(el.hourFormat).toBe('auto');
  expect(el.weekday).toBeUndefined();
  expect(el.year).toBeUndefined();
  expect(el.month).toBeUndefined();
  expect(el.day).toBeUndefined();
});

test('renders nothing for an invalid date', async () => {
  const el = createElement();
  el.date = 'not-a-date';
  await el.updateComplete;
  expect(text(el)).toBe('');
});

(['narrow', 'short', 'long'] as const).forEach((fmt) => {
  test(`formats weekday as "${fmt}"`, async () => {
    const el = createElement();
    el.date = JAN_1;
    el.weekday = fmt;
    await el.updateComplete;
    const expected = new Intl.DateTimeFormat('en', { weekday: fmt }).format(JAN_1);
    expect(text(el)).toBe(expected);
  });
});

(['narrow', 'short', 'long'] as const).forEach((fmt) => {
  test(`formats era as "${fmt}"`, async () => {
    const el = createElement();
    el.date = JAN_1;
    el.era = fmt;
    await el.updateComplete;
    const expected = new Intl.DateTimeFormat('en', { era: fmt }).format(JAN_1);
    expect(text(el)).toBe(expected);
  });
});

(['numeric', '2-digit'] as const).forEach((fmt) => {
  test(`formats year as "${fmt}"`, async () => {
    const el = createElement();
    el.date = JAN_1;
    el.year = fmt;
    await el.updateComplete;
    const expected = new Intl.DateTimeFormat('en', { year: fmt }).format(JAN_1);
    expect(text(el)).toBe(expected);
  });
});

(['numeric', '2-digit', 'narrow', 'short', 'long'] as const).forEach((fmt) => {
  test(`formats month as "${fmt}"`, async () => {
    const el = createElement();
    el.date = JAN_1;
    el.month = fmt;
    await el.updateComplete;
    const expected = new Intl.DateTimeFormat('en', { month: fmt }).format(JAN_1);
    expect(text(el)).toBe(expected);
  });
});

(['numeric', '2-digit'] as const).forEach((fmt) => {
  test(`formats day as "${fmt}"`, async () => {
    const el = createElement();
    el.date = JAN_1;
    el.day = fmt;
    await el.updateComplete;
    const expected = new Intl.DateTimeFormat('en', { day: fmt }).format(JAN_1);
    expect(text(el)).toBe(expected);
  });
});

(['numeric', '2-digit'] as const).forEach((fmt) => {
  test(`formats hour as "${fmt}"`, async () => {
    const el = createElement();
    el.date = JAN_1;
    el.hour = fmt;
    await el.updateComplete;
    const expected = new Intl.DateTimeFormat('en', { hour: fmt }).format(JAN_1);
    expect(text(el)).toBe(expected);
  });
});

(['numeric', '2-digit'] as const).forEach((fmt) => {
  test(`formats minute as "${fmt}"`, async () => {
    const el = createElement();
    el.date = JAN_1;
    el.minute = fmt;
    await el.updateComplete;
    const expected = new Intl.DateTimeFormat('en', { minute: fmt }).format(JAN_1);
    expect(text(el)).toBe(expected);
  });
});

(['numeric', '2-digit'] as const).forEach((fmt) => {
  test(`formats second as "${fmt}"`, async () => {
    const el = createElement();
    el.date = JAN_1;
    el.second = fmt;
    await el.updateComplete;
    const expected = new Intl.DateTimeFormat('en', { second: fmt }).format(JAN_1);
    expect(text(el)).toBe(expected);
  });
});

(['auto', '12', '24'] as const).forEach((fmt) => {
  test(`respects hourFormat="${fmt}"`, async () => {
    const el = createElement();
    el.date = JAN_1;
    el.hourFormat = fmt;
    el.hour = 'numeric';
    await el.updateComplete;
    const hour12 = fmt === 'auto' ? undefined : fmt === '12';
    const expected = new Intl.DateTimeFormat('en', { hour: 'numeric', hour12 }).format(JAN_1);
    expect(text(el)).toBe(expected);
  });
});

test('formats with a given timeZone', async () => {
  const el = createElement();
  el.date = JAN_1;
  el.timeZone = 'America/New_York';
  el.hour = 'numeric';
  el.minute = 'numeric';
  await el.updateComplete;
  const expected = new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'America/New_York',
  }).format(JAN_1);
  expect(text(el)).toBe(expected);
});

(['short', 'long'] as const).forEach((fmt) => {
  test(`formats timeZoneName as "${fmt}"`, async () => {
    const el = createElement();
    el.date = JAN_1;
    el.timeZoneName = fmt;
    el.hour = 'numeric';
    await el.updateComplete;
    const expected = new Intl.DateTimeFormat('en', { hour: 'numeric', timeZoneName: fmt }).format(
      JAN_1,
    );
    expect(text(el)).toBe(expected);
  });
});

test('renders a <time> element with a datetime attribute', async () => {
  const el = createElement();
  el.date = JAN_1;
  el.year = 'numeric';
  await el.updateComplete;
  const time = el.shadowRoot!.querySelector('time');
  expect(time).not.toBeNull();
  expect(time!.getAttribute('datetime')).toBe(JAN_1.toISOString());
});
