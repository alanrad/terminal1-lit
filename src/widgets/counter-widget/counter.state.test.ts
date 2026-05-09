import { describe, it, expect } from "vitest";
import { createCounterState } from "./counter.state";

describe("createCounterState", () => {
  it("initialises at the given value", () => {
    const s = createCounterState(10);
    expect(s.count.value).toBe(10);
  });

  it("increments", () => {
    const s = createCounterState(0);
    s.increment();
    expect(s.count.value).toBe(1);
  });

  it("decrements", () => {
    const s = createCounterState(5);
    s.decrement();
    expect(s.count.value).toBe(4);
  });

  it("resets to the initial value", () => {
    const s = createCounterState(3);
    s.increment();
    s.increment();
    s.reset();
    expect(s.count.value).toBe(3);
  });

  it("marks negative", () => {
    const s = createCounterState(0);
    expect(s.isNegative.value).toBe(false);
    s.decrement();
    expect(s.isNegative.value).toBe(true);
  });
});
