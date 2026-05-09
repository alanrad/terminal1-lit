import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { eventOptions, property, query, state } from 'lit/decorators.js';
import { LocalizeController } from '@utils/localize';
import { watch } from '@utils/watch';
import styles from './rating.styles';
import type { CSSResultGroup } from 'lit';

const componentStyles = css`
  :host { box-sizing: border-box; }
  :host *, :host *::before, :host *::after { box-sizing: inherit; }
  [hidden] { display: none !important; }
`;

const STAR_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>`;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default class T1Rating extends LitElement {
  static styles: CSSResultGroup = [componentStyles, styles];

  private readonly localize = new LocalizeController(this);

  @query('.rating') rating!: HTMLElement;

  @state() private hoverValue = 0;
  @state() private isHovering = false;

  /** A label that describes the rating to assistive devices. */
  @property() label = '';

  /** The current rating value. */
  @property({ type: Number }) value = 0;

  /** The highest rating to show. */
  @property({ type: Number }) max = 5;

  /** The precision at which the rating increases/decreases (e.g. 0.5 for half-stars). */
  @property({ type: Number }) precision = 1;

  /** Makes the rating read-only. */
  @property({ type: Boolean, reflect: true }) readonly = false;

  /** Disables the rating. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * A function that returns the HTML string for each symbol. Receives the symbol's
   * 1-based position value.
   */
  @property() getSymbol: (value: number) => string = () => STAR_ICON;

  private getValueFromXCoordinate(coordinate: number) {
    const isRtl = this.localize.dir() === 'rtl';
    const { left, right, width } = this.rating.getBoundingClientRect();
    const value = isRtl
      ? this.roundToPrecision(((right - coordinate) / width) * this.max, this.precision)
      : this.roundToPrecision(((coordinate - left) / width) * this.max, this.precision);
    return clamp(value, 0, this.max);
  }

  private getValueFromMousePosition(event: MouseEvent) {
    return this.getValueFromXCoordinate(event.clientX);
  }

  private getValueFromTouchPosition(event: TouchEvent) {
    return this.getValueFromXCoordinate(event.touches[0].clientX);
  }

  private handleClick(event: MouseEvent) {
    if (this.disabled) return;
    this.setValue(this.getValueFromMousePosition(event));
    this.dispatchEvent(new CustomEvent('t1-change', { bubbles: true, composed: true }));
  }

  private setValue(newValue: number) {
    if (this.disabled || this.readonly) return;
    this.value = newValue === this.value ? 0 : newValue;
    this.isHovering = false;
  }

  private handleKeyDown(event: KeyboardEvent) {
    const isLtr = this.localize.dir() === 'ltr';
    const isRtl = this.localize.dir() === 'rtl';
    const oldValue = this.value;

    if (this.disabled || this.readonly) return;

    if (event.key === 'ArrowDown' || (isLtr && event.key === 'ArrowLeft') || (isRtl && event.key === 'ArrowRight')) {
      const decrement = event.shiftKey ? 1 : this.precision;
      this.value = Math.max(0, this.value - decrement);
      event.preventDefault();
    }

    if (event.key === 'ArrowUp' || (isLtr && event.key === 'ArrowRight') || (isRtl && event.key === 'ArrowLeft')) {
      const increment = event.shiftKey ? 1 : this.precision;
      this.value = Math.min(this.max, this.value + increment);
      event.preventDefault();
    }

    if (event.key === 'Home') {
      this.value = 0;
      event.preventDefault();
    }

    if (event.key === 'End') {
      this.value = this.max;
      event.preventDefault();
    }

    if (this.value !== oldValue) {
      this.dispatchEvent(new CustomEvent('t1-change', { bubbles: true, composed: true }));
    }
  }

  private handleMouseEnter(event: MouseEvent) {
    this.isHovering = true;
    this.hoverValue = this.getValueFromMousePosition(event);
  }

  private handleMouseMove(event: MouseEvent) {
    this.hoverValue = this.getValueFromMousePosition(event);
  }

  private handleMouseLeave() {
    this.isHovering = false;
  }

  private handleTouchStart(event: TouchEvent) {
    this.isHovering = true;
    this.hoverValue = this.getValueFromTouchPosition(event);
    event.preventDefault();
  }

  @eventOptions({ passive: true })
  private handleTouchMove(event: TouchEvent) {
    this.hoverValue = this.getValueFromTouchPosition(event);
  }

  private handleTouchEnd(event: TouchEvent) {
    this.isHovering = false;
    this.setValue(this.hoverValue);
    this.dispatchEvent(new CustomEvent('t1-change', { bubbles: true, composed: true }));
    event.preventDefault();
  }

  private roundToPrecision(numberToRound: number, precision = 0.5) {
    const multiplier = 1 / precision;
    return Math.ceil(numberToRound * multiplier) / multiplier;
  }

  @watch('hoverValue')
  handleHoverValueChange() {
    this.dispatchEvent(
      new CustomEvent('t1-hover', {
        detail: { phase: 'move', value: this.hoverValue },
        bubbles: true,
        composed: true,
      })
    );
  }

  @watch('isHovering')
  handleIsHoveringChange() {
    this.dispatchEvent(
      new CustomEvent('t1-hover', {
        detail: { phase: this.isHovering ? 'start' : 'end', value: this.hoverValue },
        bubbles: true,
        composed: true,
      })
    );
  }

  /** Sets focus on the rating. */
  focus(options?: FocusOptions) {
    this.rating.focus(options);
  }

  /** Removes focus from the rating. */
  blur() {
    this.rating.blur();
  }

  render() {
    const isRtl = this.localize.dir() === 'rtl';
    const counter = Array.from(Array(this.max).keys());
    let displayValue = 0;

    if (this.disabled || this.readonly) {
      displayValue = this.value;
    } else {
      displayValue = this.isHovering ? this.hoverValue : this.value;
    }

    return html`
      <div
        part="base"
        class=${classMap({
          rating: true,
          'rating--readonly': this.readonly,
          'rating--disabled': this.disabled,
          'rating--rtl': isRtl,
        })}
        role="slider"
        aria-label=${this.label}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        aria-readonly=${this.readonly ? 'true' : 'false'}
        aria-valuenow=${this.value}
        aria-valuemin=${0}
        aria-valuemax=${this.max}
        tabindex=${this.disabled || this.readonly ? '-1' : '0'}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
        @mouseenter=${this.handleMouseEnter}
        @mouseleave=${this.handleMouseLeave}
        @mousemove=${this.handleMouseMove}
        @touchstart=${this.handleTouchStart}
        @touchmove=${this.handleTouchMove}
        @touchend=${this.handleTouchEnd}
      >
        <span class="rating__symbols">
          ${counter.map(index => {
            if (displayValue > index && displayValue < index + 1) {
              return html`
                <span
                  class=${classMap({
                    rating__symbol: true,
                    'rating__partial-symbol-container': true,
                    'rating__symbol--hover': this.isHovering && Math.ceil(displayValue) === index + 1,
                  })}
                  role="presentation"
                >
                  <div
                    style=${styleMap({
                      clipPath: isRtl
                        ? `inset(0 ${(displayValue - index) * 100}% 0 0)`
                        : `inset(0 0 0 ${(displayValue - index) * 100}%)`,
                    })}
                  >
                    ${unsafeHTML(this.getSymbol(index + 1))}
                  </div>
                  <div
                    class="rating__partial--filled"
                    style=${styleMap({
                      clipPath: isRtl
                        ? `inset(0 0 0 ${100 - (displayValue - index) * 100}%)`
                        : `inset(0 ${100 - (displayValue - index) * 100}% 0 0)`,
                    })}
                  >
                    ${unsafeHTML(this.getSymbol(index + 1))}
                  </div>
                </span>
              `;
            }

            return html`
              <span
                class=${classMap({
                  rating__symbol: true,
                  'rating__symbol--hover': this.isHovering && Math.ceil(displayValue) === index + 1,
                  'rating__symbol--active': displayValue >= index + 1,
                })}
                role="presentation"
              >
                ${unsafeHTML(this.getSymbol(index + 1))}
              </span>
            `;
          })}
        </span>
      </div>
    `;
  }
}
