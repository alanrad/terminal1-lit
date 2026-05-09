import { describe, it, expect, vi } from "vitest";
import { signal, computed, effect } from "./signal";

describe("signal", () => {
  it("holds an initial value", () => {
    const s = signal(42);
    expect(s.value).toBe(42);
  });

  it("updates and notifies subscribers", () => {
    const s = signal(0);
    const cb = vi.fn();
    s.subscribe(cb);
    s.value = 1;
    expect(cb).toHaveBeenCalledWith(1);
  });

  it("does not notify when value is the same", () => {
    const s = signal("hello");
    const cb = vi.fn();
    s.subscribe(cb);
    cb.mockClear();
    s.value = "hello";
    expect(cb).not.toHaveBeenCalled();
  });

  it("subscribe returns a disposer", () => {
    const s = signal(0);
    const cb = vi.fn();
    const dispose = s.subscribe(cb);
    cb.mockClear();
    dispose();
    s.value = 99;
    expect(cb).not.toHaveBeenCalled();
  });
});

describe("computed", () => {
  it("derives a value from a signal", () => {
    const n = signal(3);
    const doubled = computed(() => n.value * 2);
    expect(doubled.value).toBe(6);
  });
});

describe("effect", () => {
  it("runs immediately and on dependency change", () => {
    const s = signal(0);
    const log: number[] = [];
    effect(() => { log.push(s.value); });
    s.value = 1;
    s.value = 2;
    expect(log).toEqual([0, 1, 2]);
  });
});
