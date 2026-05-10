import { LitElement, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { html as staticHtml, literal } from 'lit/static-html.js';
import { property, query, state } from 'lit/decorators.js';
import styles from './icon-button.styles';
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

export default class T1IconButton extends LitElement {
  static styles: CSSResultGroup = [componentStyles, styles];

  @query('.icon-button') button!: HTMLButtonElement | HTMLAnchorElement;

  @state() private hasFocus = false;

  /** The name of the icon to draw. */
  @property() name?: string;

  /** The name of a registered custom icon library. */
  @property() library?: string;

  /** An external URL of an SVG file. */
  @property() src?: string;

  /** When set, renders as an `<a>` with this href. */
  @property() href?: string;

  /** Tells the browser where to open the link. */
  @property() target?: '_blank' | '_parent' | '_self' | '_top';

  /** Tells the browser to download the linked file as this filename. */
  @property() download?: string;

  /** A description that gets read by assistive devices. */
  @property() label = '';

  /** Disables the button. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  private handleBlur() {
    this.hasFocus = false;
    this.dispatchEvent(new CustomEvent('t1-blur', { bubbles: true, composed: true }));
  }

  private handleFocus() {
    this.hasFocus = true;
    this.dispatchEvent(new CustomEvent('t1-focus', { bubbles: true, composed: true }));
  }

  private handleClick(event: MouseEvent) {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  /** Simulates a click on the icon button. */
  click() {
    this.button.click();
  }

  /** Sets focus on the icon button. */
  focus(options?: FocusOptions) {
    this.button.focus(options);
  }

  /** Removes focus from the icon button. */
  blur() {
    this.button.blur();
  }

  render() {
    const isLink = !!this.href;
    const tag = isLink ? literal`a` : literal`button`;

    /* eslint-disable lit/binding-positions, lit/no-invalid-html */
    return staticHtml`
      <${tag}
        part="base"
        class=${classMap({
          'icon-button': true,
          'icon-button--disabled': !isLink && this.disabled,
          'icon-button--focused': this.hasFocus,
        })}
        ?disabled=${ifDefined(isLink ? undefined : this.disabled)}
        type=${ifDefined(isLink ? undefined : 'button')}
        href=${ifDefined(isLink ? this.href : undefined)}
        target=${ifDefined(isLink ? this.target : undefined)}
        download=${ifDefined(isLink ? this.download : undefined)}
        rel=${ifDefined(isLink && this.target ? 'noreferrer noopener' : undefined)}
        role=${ifDefined(isLink ? undefined : 'button')}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        aria-label="${this.label}"
        tabindex=${this.disabled ? '-1' : '0'}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        <t1-icon
          class="icon-button__icon"
          name=${ifDefined(this.name)}
          library=${ifDefined(this.library)}
          src=${ifDefined(this.src)}
          aria-hidden="true"
        ></t1-icon>
      </${tag}>
    `;
    /* eslint-enable lit/binding-positions, lit/no-invalid-html */
  }
}
