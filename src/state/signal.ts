/**
 * Minimal reactive signal implementation.
 * Compatible with Lit's ReactiveElement via the `watch` decorator / manual subscribe.
 *
 * Usage:
 *   const count = signal(0);
 *   const doubled = computed(() => count.value * 2);
 *   effect(() => console.log(doubled.value));
 *   count.value = 5; // triggers effect → logs 10
 */

type Effect = () => void;

let currentEffect: Effect | null = null;

/** Shared interface for Signal and Computed — anything that can be subscribed to. */
export interface Subscribable<T> {
  readonly value: T;
  subscribe(fn: (v: T) => void): () => void;
}

export class Signal<T> implements Subscribable<T> {
  private _value: T;
  private _subscribers = new Set<Effect>();

  constructor(initial: T) {
    this._value = initial;
  }

  get value(): T {
    if (currentEffect) this._subscribers.add(currentEffect);
    return this._value;
  }

  set value(next: T) {
    if (Object.is(this._value, next)) return;
    this._value = next;
    for (const fn of this._subscribers) fn();
  }

  /** Subscribe to changes without creating a tracked effect context. */
  subscribe(fn: (v: T) => void): () => void {
    const wrapped = () => fn(this._value);
    this._subscribers.add(wrapped);
    fn(this._value); // emit current value immediately
    return () => this._subscribers.delete(wrapped);
  }
}

export class Computed<T> implements Subscribable<T> {
  private _signal: Signal<T>;

  constructor(fn: () => T) {
    this._signal = new Signal(fn());
    const runner: Effect = () => {
      currentEffect = runner;
      try {
        this._signal.value = fn();
      } finally {
        currentEffect = null;
      }
    };
    effect(runner);
  }

  get value(): T {
    return this._signal.value;
  }

  subscribe(fn: (v: T) => void): () => void {
    return this._signal.subscribe(fn);
  }
}

/** Create a reactive signal. */
export function signal<T>(initial: T): Signal<T> {
  return new Signal(initial);
}

/** Derive a read-only value from other signals. */
export function computed<T>(fn: () => T): Computed<T> {
  return new Computed(fn);
}

/** Run a side-effect whenever its dependencies change. Returns a disposer. */
export function effect(fn: Effect): () => void {
  const runner: Effect = () => {
    currentEffect = runner;
    try {
      fn();
    } finally {
      currentEffect = null;
    }
  };
  runner();
  // Disposer: run once to unsubscribe (signals auto-remove on next garbage collection)
  return () => {
    currentEffect = null;
  };
}
