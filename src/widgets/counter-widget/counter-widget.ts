import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { SignalMixin } from '@state/lit-signal';
import { createCounterState, type CounterState } from './counter.state';
import { baseStyles } from '@styles/base';

/**
 * <counter-widget> — self-contained counter with signal-driven state.
 *
 * Attributes:
 *   initial-count  – starting value (default 0)
 *   step           – amount to increment/decrement (default 1)
 *
 * Events:
 *   w-change       – fired on every state change with { count }
 *
 * CSS parts:
 *   container, value, controls
 *
 * CSS custom properties:
 *   all --t1-* tokens from theme.css
 */
@customElement('counter-widget')
export class CounterWidget extends SignalMixin(LitElement) {
  static styles = [
    baseStyles,
    css`
      :host {
        display: inline-block;
        padding: var(--t1-spacing-medium);
        border: 1px solid var(--t1-color-neutral-300);
        border-radius: var(--t1-border-radius-large);
        background: var(--t1-color-neutral-0);
        box-shadow: var(--t1-shadow-small);
      }

      [part='container'] {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--t1-spacing-medium);
      }

      [part='value'] {
        font-size: 2.5rem;
        font-weight: var(--t1-font-weight-bold);
        color: var(--t1-color-primary-600);
        min-width: 5ch;
        text-align: center;
        transition: color var(--t1-transition-medium) cubic-bezier(0.2, 0, 0, 1);
      }

      [part='value'].negative {
        color: var(--t1-color-danger-600);
      }

      [part='controls'] {
        display: flex;
        gap: var(--t1-spacing-x-small);
        align-items: center;
      }

      button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 2rem;
        height: 2rem;
        padding: 0 var(--t1-spacing-x-small);
        font-size: var(--t1-font-size-small);
        font-weight: var(--t1-font-weight-semibold);
        font-family: inherit;
        border-radius: var(--t1-border-radius-medium);
        border: 1px solid var(--t1-color-primary-600);
        cursor: pointer;
        transition: background var(--t1-transition-fast) cubic-bezier(0.2, 0, 0, 1);
      }

      button.primary {
        background: var(--t1-color-primary-600);
        color: #fff;
      }

      button.primary:hover {
        background: var(--t1-color-primary-700);
      }

      button.secondary {
        background: transparent;
        color: var(--t1-color-primary-600);
      }

      button.secondary:hover {
        background: color-mix(in srgb, var(--t1-color-primary-600) 8%, transparent);
      }

      button.ghost {
        background: transparent;
        color: var(--t1-color-neutral-900);
        border-color: var(--t1-color-neutral-300);
      }

      button.ghost:hover {
        background: var(--t1-color-neutral-50);
      }
    `,
  ];

  @property({ attribute: 'initial-count', type: Number }) initialCount = 0;
  @property({ type: Number }) step = 1;

  private _state!: CounterState;

  connectedCallback() {
    super.connectedCallback();
    this._state = createCounterState(this.initialCount);
    this.watchSignal(this._state.count);
    this.watchSignal(this._state.isNegative);
    this.watchSignal(this._state.label);
  }

  private _emit() {
    this.dispatchEvent(
      new CustomEvent('w-change', {
        detail: { count: this._state.count.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _increment() {
    this._state.increment();
    this._emit();
  }
  private _decrement() {
    this._state.decrement();
    this._emit();
  }
  private _reset() {
    this._state.reset();
    this._emit();
  }

  render() {
    const { count, isNegative, label } = this._state;
    return html`
      <div part="container">
        <div
          part="value"
          class="${isNegative.value ? 'negative' : ''}"
          aria-live="polite"
          aria-label="${label.value}"
        >
          ${count.value}
        </div>
        <div part="controls">
          <button class="secondary" @click="${this._decrement}">−</button>
          <button class="ghost" @click="${this._reset}">Reset</button>
          <button class="primary" @click="${this._increment}">+</button>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'counter-widget': CounterWidget;
  }
}
