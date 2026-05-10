import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { property, query } from 'lit/decorators.js';
import { HasSlotController } from '@utils/slot';
import { watch } from '@utils/watch';
import styles from './alert.styles';
import type { CSSResultGroup } from 'lit';

const componentStyles = css`
  :host {
    box-sizing: border-box;
  }
  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }
  [hidden] {
    display: none !important;
  }
`;

const CLOSE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>`;

export default class T1Alert extends LitElement {
  static styles: CSSResultGroup = [componentStyles, styles];

  private autoHideTimeout: ReturnType<typeof setTimeout> | undefined;
  private readonly hasSlotController = new HasSlotController(this, 'icon');

  private static toastStackEl: HTMLDivElement | null = null;

  private static get toastStack(): HTMLDivElement {
    if (!T1Alert.toastStackEl) {
      T1Alert.toastStackEl = Object.assign(document.createElement('div'), {
        className: 't1-toast-stack',
      });
    }
    return T1Alert.toastStackEl;
  }

  @query('[part~="base"]') base!: HTMLElement;

  /** Whether the alert is open. */
  @property({ type: Boolean, reflect: true }) open = false;

  /** Enables a close button that lets the user dismiss the alert. */
  @property({ type: Boolean, reflect: true }) closable = false;

  /** The alert's theme variant. */
  @property({ reflect: true }) variant: 'primary' | 'success' | 'neutral' | 'warning' | 'danger' =
    'primary';

  /**
   * Milliseconds before the alert closes itself. Defaults to `Infinity` (never auto-closes).
   * When the user mouses over the alert the timer pauses and resets on mouse-leave.
   */
  @property({ type: Number }) duration = Infinity;

  firstUpdated() {
    this.base.hidden = !this.open;
  }

  private startAutoHide() {
    clearTimeout(this.autoHideTimeout);
    if (this.open && this.duration < Infinity) {
      this.autoHideTimeout = setTimeout(() => this.hide(), this.duration);
    }
  }

  private pauseAutoHide() {
    clearTimeout(this.autoHideTimeout);
  }

  private resumeAutoHide() {
    if (this.open && this.duration < Infinity) {
      this.autoHideTimeout = setTimeout(() => this.hide(), this.duration);
    }
  }

  private handleCloseClick() {
    this.hide();
  }

  @watch('open', { waitUntilFirstUpdate: true })
  async handleOpenChange() {
    if (this.open) {
      this.dispatchEvent(new CustomEvent('t1-show', { bubbles: true, composed: true }));
      this.base.hidden = false;
      this.startAutoHide();
      await this.updateComplete;
      this.dispatchEvent(new CustomEvent('t1-after-show', { bubbles: true, composed: true }));
    } else {
      this.dispatchEvent(new CustomEvent('t1-hide', { bubbles: true, composed: true }));
      clearTimeout(this.autoHideTimeout);
      this.base.hidden = true;
      await this.updateComplete;
      this.dispatchEvent(new CustomEvent('t1-after-hide', { bubbles: true, composed: true }));
    }
  }

  @watch('duration')
  handleDurationChange() {
    this.startAutoHide();
  }

  /** Shows the alert. */
  show(): Promise<void> {
    if (this.open) return Promise.resolve();
    return new Promise((resolve) => {
      this.open = true;
      this.addEventListener('t1-after-show', () => resolve(), { once: true });
    });
  }

  /** Hides the alert. */
  hide(): Promise<void> {
    if (!this.open) return Promise.resolve();
    return new Promise((resolve) => {
      this.open = false;
      this.addEventListener('t1-after-hide', () => resolve(), { once: true });
    });
  }

  /**
   * Moves the alert into a toast stack on `document.body`, shows it, and removes it from the
   * DOM once hidden. Reuse the element reference to toast again.
   */
  async toast(): Promise<void> {
    return new Promise((resolve) => {
      if (T1Alert.toastStack.parentElement === null) {
        document.body.append(T1Alert.toastStack);
      }
      T1Alert.toastStack.appendChild(this);

      requestAnimationFrame(() => {
        this.clientWidth; // force reflow
        this.show();
      });

      this.addEventListener(
        't1-after-hide',
        () => {
          T1Alert.toastStack.removeChild(this);
          resolve();
          if (T1Alert.toastStack.querySelector('t1-alert') === null) {
            T1Alert.toastStack.remove();
            T1Alert.toastStackEl = null;
          }
        },
        { once: true },
      );
    });
  }

  render() {
    return html`
      <div
        part="base"
        class=${classMap({
          alert: true,
          'alert--open': this.open,
          'alert--closable': this.closable,
          'alert--has-icon': this.hasSlotController.test('icon'),
          'alert--primary': this.variant === 'primary',
          'alert--success': this.variant === 'success',
          'alert--neutral': this.variant === 'neutral',
          'alert--warning': this.variant === 'warning',
          'alert--danger': this.variant === 'danger',
        })}
        role="alert"
        aria-hidden=${this.open ? 'false' : 'true'}
        @mouseenter=${this.pauseAutoHide}
        @mouseleave=${this.resumeAutoHide}
      >
        <div part="icon" class="alert__icon">
          <slot name="icon"></slot>
        </div>

        <div part="message" class="alert__message" aria-live="polite">
          <slot></slot>
        </div>

        ${this.closable
          ? html`
              <button
                part="close-button"
                class="alert__close-button"
                aria-label="Close"
                @click=${this.handleCloseClick}
              >
                ${document.createRange().createContextualFragment(CLOSE_ICON)}
              </button>
            `
          : ''}
      </div>
    `;
  }
}
