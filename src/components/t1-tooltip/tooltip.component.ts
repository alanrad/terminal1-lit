import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { property, query } from 'lit/decorators.js';
import { watch } from '@utils/watch';
import styles from './tooltip.styles';
import type T1Popup from '@components/t1-popup/popup.component';
import type { CSSResultGroup } from 'lit';

const componentStyles = css`
  :host { box-sizing: border-box; }
  :host *, :host *::before, :host *::after { box-sizing: inherit; }
  [hidden] { display: none !important; }
`;

export default class T1Tooltip extends LitElement {
  static styles: CSSResultGroup = [componentStyles, styles];

  private hoverTimeout: ReturnType<typeof setTimeout> | undefined;

  @query('.tooltip__body') body!: HTMLElement;
  @query('t1-popup') popup!: T1Popup;

  /** The tooltip's text content. Use the `content` slot for HTML. */
  @property() content = '';

  /** The preferred placement of the tooltip. */
  @property() placement:
    | 'top' | 'top-start' | 'top-end'
    | 'right' | 'right-start' | 'right-end'
    | 'bottom' | 'bottom-start' | 'bottom-end'
    | 'left' | 'left-start' | 'left-end' = 'top';

  /** Disables the tooltip so it won't show when triggered. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Distance in pixels to offset the tooltip away from its target. */
  @property({ type: Number }) distance = 8;

  /** Whether the tooltip is open. */
  @property({ type: Boolean, reflect: true }) open = false;

  /** Distance in pixels to offset the tooltip along its target. */
  @property({ type: Number }) skidding = 0;

  /**
   * Controls how the tooltip is activated. Options: `click`, `hover`, `focus`, `manual`.
   * Multiple options can be combined with a space.
   */
  @property() trigger = 'hover focus';

  /** Use fixed positioning to escape overflow-hidden containers. */
  @property({ type: Boolean }) hoist = false;

  constructor() {
    super();
    this.addEventListener('blur', this.handleBlur, true);
    this.addEventListener('focus', this.handleFocus, true);
    this.addEventListener('click', this.handleClick);
    this.addEventListener('mouseover', this.handleMouseOver);
    this.addEventListener('mouseout', this.handleMouseOut);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this.handleDocumentKeyDown);
  }

  firstUpdated() {
    this.body.hidden = !this.open;
    if (this.open) {
      this.popup.active = true;
    }
  }

  private hasTrigger(type: string) {
    return this.trigger.split(' ').includes(type);
  }

  private handleBlur = () => {
    if (this.hasTrigger('focus')) this.hide();
  };

  private handleFocus = () => {
    if (this.hasTrigger('focus')) this.show();
  };

  private handleClick = () => {
    if (this.hasTrigger('click')) {
      this.open ? this.hide() : this.show();
    }
  };

  private handleMouseOver = () => {
    if (this.hasTrigger('hover')) {
      const delay = parseInt(getComputedStyle(this).getPropertyValue('--show-delay')) || 150;
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = setTimeout(() => this.show(), delay);
    }
  };

  private handleMouseOut = () => {
    if (this.hasTrigger('hover')) {
      const delay = parseInt(getComputedStyle(this).getPropertyValue('--hide-delay')) || 0;
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = setTimeout(() => this.hide(), delay);
    }
  };

  private handleDocumentKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      this.hide();
    }
  };

  @watch('open', { waitUntilFirstUpdate: true })
  async handleOpenChange() {
    if (this.open) {
      if (this.disabled) {
        this.open = false;
        return;
      }
      this.dispatchEvent(new CustomEvent('t1-show', { bubbles: true, composed: true }));
      document.addEventListener('keydown', this.handleDocumentKeyDown);
      this.body.hidden = false;
      this.popup.active = true;
      this.popup.reposition();
      await this.updateComplete;
      this.dispatchEvent(new CustomEvent('t1-after-show', { bubbles: true, composed: true }));
    } else {
      this.dispatchEvent(new CustomEvent('t1-hide', { bubbles: true, composed: true }));
      document.removeEventListener('keydown', this.handleDocumentKeyDown);
      this.popup.active = false;
      this.body.hidden = true;
      await this.updateComplete;
      this.dispatchEvent(new CustomEvent('t1-after-hide', { bubbles: true, composed: true }));
    }
  }

  @watch('disabled')
  handleDisabledChange() {
    if (this.disabled && this.open) this.hide();
  }

  /** Shows the tooltip. */
  show(): Promise<void> {
    if (this.open) return Promise.resolve();
    return new Promise(resolve => {
      this.open = true;
      this.addEventListener('t1-after-show', () => resolve(), { once: true });
    });
  }

  /** Hides the tooltip. */
  hide(): Promise<void> {
    if (!this.open) return Promise.resolve();
    return new Promise(resolve => {
      this.open = false;
      this.addEventListener('t1-after-hide', () => resolve(), { once: true });
    });
  }

  render() {
    return html`
      <t1-popup
        part="base"
        class=${classMap({ tooltip: true, 'tooltip--open': this.open })}
        placement=${this.placement}
        distance=${this.distance}
        skidding=${this.skidding}
        strategy=${this.hoist ? 'fixed' : 'absolute'}
        ?flip=${true}
        ?shift=${true}
        ?arrow=${true}
      >
        <slot slot="anchor" aria-describedby="tooltip"></slot>
        <div
          part="body"
          id="tooltip"
          class="tooltip__body"
          role="tooltip"
          aria-live=${this.open ? 'polite' : 'off'}
        >
          <slot name="content">${this.content}</slot>
        </div>
      </t1-popup>
    `;
  }
}
