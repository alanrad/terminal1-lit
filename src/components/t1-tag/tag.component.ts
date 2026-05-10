import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { property } from 'lit/decorators.js';
import styles from './tag.styles';
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

export default class T1Tag extends LitElement {
  static styles: CSSResultGroup = [componentStyles, styles];

  /** The tag's theme variant. */
  @property({ reflect: true }) variant:
    | 'primary'
    | 'success'
    | 'neutral'
    | 'warning'
    | 'danger'
    | 'text' = 'neutral';

  /** The tag's size. */
  @property({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** Draws a pill-style tag with rounded edges. */
  @property({ type: Boolean, reflect: true }) pill = false;

  /** Makes the tag removable and shows a remove button. */
  @property({ type: Boolean, reflect: true }) removable = false;

  private handleRemoveClick(event: MouseEvent) {
    event.stopPropagation();
    this.dispatchEvent(new CustomEvent('t1-remove', { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <span
        part="base"
        class=${classMap({
          tag: true,
          'tag--primary': this.variant === 'primary',
          'tag--success': this.variant === 'success',
          'tag--neutral': this.variant === 'neutral',
          'tag--warning': this.variant === 'warning',
          'tag--danger': this.variant === 'danger',
          'tag--text': this.variant === 'text',
          'tag--small': this.size === 'small',
          'tag--medium': this.size === 'medium',
          'tag--large': this.size === 'large',
          'tag--pill': this.pill,
          'tag--removable': this.removable,
        })}
      >
        <slot part="content" class="tag__content"></slot>
        ${this.removable
          ? html`
              <t1-icon-button
                part="remove-button"
                exportparts="base:remove-button__base"
                name="x-lg"
                library="system"
                label="Remove"
                class="tag__remove"
                @click=${this.handleRemoveClick}
                tabindex="-1"
              ></t1-icon-button>
            `
          : ''}
      </span>
    `;
  }
}
