import { signal, computed } from "@state/signal";

/** Encapsulated state for the counter widget. */
export function createCounterState(initial = 0) {
  const count = signal(initial);
  const isNegative = computed(() => count.value < 0);
  const label = computed(() =>
    `Count: ${count.value}${isNegative.value ? " (negative)" : ""}`
  );

  return {
    count,
    isNegative,
    label,
    increment: () => { count.value += 1; },
    decrement: () => { count.value -= 1; },
    reset: () => { count.value = initial; },
  };
}

export type CounterState = ReturnType<typeof createCounterState>;
