import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { html as staticHtml, literal } from 'lit/static-html.js';
import { property, query, state } from 'lit/decorators.js';
import { HasSlotController } from '@utils/slot';
import { LocalizeController } from '@utils/localize';
import { watch } from '@utils/watch';
import styles from './button.styles';
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

export default class T1Button extends LitElement {
  static styles: CSSResultGroup = [componentStyles, styles];

  private readonly hasSlotController = new HasSlotController(this, '[default]', 'prefix', 'suffix');
  private readonly localize = new LocalizeController(this);

  @query('.button') button!: HTMLButtonElement | HTMLAnchorElement;

  @state() private hasFocus = false;
  @property() title = '';

  /** The button's theme variant. */
  @property({ reflect: true }) variant:
    | 'default'
    | 'primary'
    | 'success'
    | 'neutral'
    | 'warning'
    | 'danger'
    | 'text' = 'default';

  /** The button's size. */
  @property({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** Draws the button with a caret. */
  @property({ type: Boolean, reflect: true }) caret = false;

  /** Disables the button. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Draws the button in a loading state. */
  @property({ type: Boolean, reflect: true }) loading = false;

  /** Draws an outlined button. */
  @property({ type: Boolean, reflect: true }) outline = false;

  /** Draws a pill-style button with rounded edges. */
  @property({ type: Boolean, reflect: true }) pill = false;

  /** Draws a circular icon button. */
  @property({ type: Boolean, reflect: true }) circle = false;

  /** The type of button. */
  @property() type: 'button' | 'submit' | 'reset' = 'button';

  /** The name of the button. */
  @property() name = '';

  /** The value of the button. */
  @property() value = '';

  /** When set, renders as an `<a>` with this href. */
  @property() href = '';

  /** Tells the browser where to open the link. */
  @property() target: '_blank' | '_parent' | '_self' | '_top' | undefined;

  /** The rel attribute for link buttons. */
  @property() rel = 'noreferrer noopener';

  /** Tells the browser to download the linked file as this filename. */
  @property() download?: string;

  /** The form owner to associate the button with. */
  @property() form: string | undefined;

  /** Used to override the form owner's action attribute. */
  @property({ attribute: 'formaction' }) formAction: string | undefined;

  /** Used to override the form owner's enctype attribute. */
  @property({ attribute: 'formenctype' })
  formEnctype:
    | 'application/x-www-form-urlencoded'
    | 'multipart/form-data'
    | 'text/plain'
    | undefined;

  /** Used to override the form owner's method attribute. */
  @property({ attribute: 'formmethod' }) formMethod: 'post' | 'get' | undefined;

  /** Used to override the form owner's novalidate attribute. */
  @property({ attribute: 'formnovalidate', type: Boolean }) formNoValidate: boolean | undefined;

  /** Used to override the form owner's target attribute. */
  @property({ attribute: 'formtarget' }) formTarget:
    | '_self'
    | '_blank'
    | '_parent'
    | '_top'
    | string
    | undefined;

  private isButton() {
    return !this.href;
  }

  private isLink() {
    return !!this.href;
  }

  private handleBlur() {
    this.hasFocus = false;
    this.dispatchEvent(new CustomEvent('t1-blur', { bubbles: true, composed: true }));
  }

  private handleFocus() {
    this.hasFocus = true;
    this.dispatchEvent(new CustomEvent('t1-focus', { bubbles: true, composed: true }));
  }

  private handleClick() {
    // Native button handles form submission
  }

  private handleInvalid(event: Event) {
    event.preventDefault();
    this.dispatchEvent(new CustomEvent('t1-invalid', { bubbles: true, composed: true }));
  }

  @watch('disabled', { waitUntilFirstUpdate: true })
  handleDisabledChange() {
    // handled via attribute binding
  }

  /** Simulates a click on the button. */
  click() {
    this.button.click();
  }

  /** Sets focus on the button. */
  focus(options?: FocusOptions) {
    this.button.focus(options);
  }

  /** Removes focus from the button. */
  blur() {
    this.button.blur();
  }

  /** Checks for validity but does not show a validation message. */
  checkValidity() {
    if (this.isButton()) {
      return (this.button as HTMLButtonElement).checkValidity();
    }
    return true;
  }

  /** Checks for validity and shows the browser's validation message if the control is invalid. */
  reportValidity() {
    if (this.isButton()) {
      return (this.button as HTMLButtonElement).reportValidity();
    }
    return true;
  }

  /** Sets a custom validation message. Pass an empty string to restore validity. */
  setCustomValidity(message: string) {
    if (this.isButton()) {
      (this.button as HTMLButtonElement).setCustomValidity(message);
    }
  }

  render() {
    const isLink = this.isLink();
    const tag = isLink ? literal`a` : literal`button`;

    /* eslint-disable lit/no-invalid-html */
    /* eslint-disable lit/binding-positions */
    return staticHtml`
      <${tag}
        part="base"
        class=${classMap({
          button: true,
          'button--default': this.variant === 'default',
          'button--primary': this.variant === 'primary',
          'button--success': this.variant === 'success',
          'button--neutral': this.variant === 'neutral',
          'button--warning': this.variant === 'warning',
          'button--danger': this.variant === 'danger',
          'button--text': this.variant === 'text',
          'button--small': this.size === 'small',
          'button--medium': this.size === 'medium',
          'button--large': this.size === 'large',
          'button--caret': this.caret,
          'button--circle': this.circle,
          'button--disabled': this.disabled,
          'button--focused': this.hasFocus,
          'button--loading': this.loading,
          'button--standard': !this.outline,
          'button--outline': this.outline,
          'button--pill': this.pill,
          'button--rtl': this.localize.dir() === 'rtl',
          'button--has-label': this.hasSlotController.test('[default]'),
          'button--has-prefix': this.hasSlotController.test('prefix'),
          'button--has-suffix': this.hasSlotController.test('suffix'),
        })}
        ?disabled=${ifDefined(isLink ? undefined : this.disabled)}
        type=${ifDefined(isLink ? undefined : this.type)}
        title=${this.title}
        name=${ifDefined(isLink ? undefined : this.name || undefined)}
        value=${ifDefined(isLink ? undefined : this.value || undefined)}
        href=${ifDefined(isLink && !this.disabled ? this.href : undefined)}
        target=${ifDefined(isLink ? this.target : undefined)}
        download=${ifDefined(isLink ? this.download : undefined)}
        rel=${ifDefined(isLink ? this.rel : undefined)}
        role=${ifDefined(isLink ? undefined : 'button')}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        tabindex=${this.disabled ? '-1' : '0'}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @invalid=${this.isButton() ? this.handleInvalid : null}
        @click=${this.handleClick}
      >
        <slot name="prefix" part="prefix" class="button__prefix"></slot>
        <slot part="label" class="button__label"></slot>
        <slot name="suffix" part="suffix" class="button__suffix"></slot>
        ${this.caret ? html`<t1-icon part="caret" class="button__caret" library="system" name="caret"></t1-icon>` : ''}
        ${this.loading ? html`<t1-spinner part="spinner"></t1-spinner>` : ''}
      </${tag}>
    `;
    /* eslint-enable lit/no-invalid-html */
    /* eslint-enable lit/binding-positions */
  }
}
