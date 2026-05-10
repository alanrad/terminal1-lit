import { ReactiveElement } from '@lit/reactive-element';
import { type Subscribable } from './signal';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = object> = new (...args: any[]) => T;

/** Public surface added by SignalMixin. */
export interface SignalMixinInterface {
  watchSignal<T>(sig: Subscribable<T>): void;
}

/**
 * Mixin that bridges Subscribable signals with Lit's update lifecycle.
 * Call `this.watchSignal(sig)` inside `connectedCallback` for any Signal or
 * Computed whose changes should trigger a re-render.
 *
 * Usage:
 *   class MyWidget extends SignalMixin(LitElement) { ... }
 */
export function SignalMixin<Base extends Constructor<ReactiveElement>>(
  Base: Base,
): Base & Constructor<SignalMixinInterface> {
  class SignalElement extends Base {
    // Using array index signature avoids TS4094 on private members
    private readonly _disposers: Array<() => void> = [];

    disconnectedCallback() {
      super.disconnectedCallback();
      for (const d of this._disposers) d();
      this._disposers.length = 0;
    }

    watchSignal<T>(sig: Subscribable<T>): void {
      this._disposers.push(sig.subscribe(() => this.requestUpdate()));
    }
  }

  return SignalElement as unknown as Base & Constructor<SignalMixinInterface>;
}
