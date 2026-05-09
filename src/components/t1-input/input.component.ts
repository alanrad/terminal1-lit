import { LitElement, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { property, query, state } from 'lit/decorators.js';
import { LocalizeController } from '@utils/localize';
import { watch } from '@utils/watch';
import '@components/t1-icon/index';
import styles from './input.styles';
import type { CSSResultGroup } from 'lit';

export default class T1Input extends LitElement {
  static styles: CSSResultGroup = styles;
  static formAssociated = true;

  private _internals: ElementInternals | undefined = (() => {
    try {
      const i = this.attachInternals?.();
      return (typeof i?.setFormValue === 'function') ? i : undefined;
    } catch {
      return undefined;
    }
  })();
  private _localize = new LocalizeController(this);

  @query('.input__control') input!: HTMLInputElement;

  @state() private hasFocus = false;
  @state() private hasPrefix = false;
  @state() private hasSuffix = false;

  private __numberInput = Object.assign(document.createElement('input'), { type: 'number' });
  private __dateInput = Object.assign(document.createElement('input'), { type: 'date' });

  @property({ reflect: true }) type:
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'number'
    | 'password'
    | 'search'
    | 'tel'
    | 'text'
    | 'time'
    | 'url' = 'text';

  @property() name = '';

  @property() value = '';

  @property() defaultValue = '';

  @property({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  @property({ type: Boolean, reflect: true }) filled = false;

  @property({ type: Boolean, reflect: true }) pill = false;

  @property() label = '';

  @property({ attribute: 'help-text' }) helpText = '';

  @property({ type: Boolean }) clearable = false;

  @property({ type: Boolean, reflect: true }) disabled = false;

  @property() placeholder = '';

  @property({ type: Boolean, reflect: true }) readonly = false;

  @property({ attribute: 'password-toggle', type: Boolean }) passwordToggle = false;

  @property({ attribute: 'password-visible', type: Boolean }) passwordVisible = false;

  @property({ attribute: 'no-spin-buttons', type: Boolean }) noSpinButtons = false;

  @property({ reflect: true }) form = '';

  @property({ type: Boolean, reflect: true }) required = false;

  @property() pattern: string | undefined;

  @property({ type: Number }) minlength: number | undefined;

  @property({ type: Number }) maxlength: number | undefined;

  @property() min: number | string | undefined;

  @property() max: number | string | undefined;

  @property() step: number | 'any' | undefined;

  @property({ attribute: 'autocapitalize' }) inputAutocapitalize: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters' | undefined;

  @property({ attribute: 'autocorrect' }) inputAutocorrect: 'off' | 'on' | undefined;

  @property() autocomplete: string | undefined;

  @property({ type: Boolean }) inputAutofocus: boolean | undefined;

  @property() enterkeyhint: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send' | undefined;

  @property({
    type: Boolean,
    converter: {
      fromAttribute: (value: string | null) => (!value || value === 'false' ? false : true),
      toAttribute: (value: boolean) => (value ? 'true' : 'false'),
    },
  })
  spellcheck = true;

  @property() inputmode: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url' | undefined;

  get valueAsDate() {
    this.__dateInput.type = this.type;
    this.__dateInput.value = this.value;
    return this.input?.valueAsDate || this.__dateInput.valueAsDate;
  }

  set valueAsDate(newValue: Date | null) {
    this.__dateInput.type = this.type;
    this.__dateInput.valueAsDate = newValue;
    this.value = this.__dateInput.value;
  }

  get valueAsNumber() {
    this.__numberInput.value = this.value;
    return this.input?.valueAsNumber || this.__numberInput.valueAsNumber;
  }

  set valueAsNumber(newValue: number) {
    this.__numberInput.valueAsNumber = newValue;
    this.value = this.__numberInput.value;
  }

  get validity() {
    return this.input.validity;
  }

  get validationMessage() {
    return this.input.validationMessage;
  }

  private _emit(name: string, detail?: object) {
    this.dispatchEvent(
      new CustomEvent(name, {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: detail ?? {},
      })
    );
  }

  private handleBlur() {
    this.hasFocus = false;
    this._emit('t1-blur');
  }

  private handleChange() {
    this.value = this.input.value;
    this._emit('t1-change');
  }

  private handleClearClick(event: MouseEvent) {
    event.preventDefault();
    if (this.value !== '') {
      this.value = '';
      this._internals?.setFormValue(this.value);
      this._emit('t1-clear');
      this._emit('t1-input');
      this._emit('t1-change');
    }
    this.input.focus();
  }

  private handleFocus() {
    this.hasFocus = true;
    this._emit('t1-focus');
  }

  private handleInput() {
    this.value = this.input.value;
    this._internals?.setFormValue(this.value);
    this._emit('t1-input');
  }

  private handleInvalid(event: Event) {
    event.preventDefault();
    this._emit('t1-invalid');
  }

  private handleKeyDown(event: KeyboardEvent) {
    const hasModifier = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (event.key === 'Enter' && !hasModifier) {
      setTimeout(() => {
        if (!event.defaultPrevented && !event.isComposing) {
          const form = this._internals?.form;
          if (form) {
            const submitter = form.querySelector<HTMLButtonElement>('[type="submit"]');
            if (submitter) {
              submitter.click();
            } else {
              form.requestSubmit();
            }
          }
        }
      });
    }
  }

  private handlePasswordToggle() {
    this.passwordVisible = !this.passwordVisible;
  }

  private handlePrefixSlotChange(event: Event) {
    this.hasPrefix = (event.target as HTMLSlotElement).assignedElements().length > 0;
  }

  private handleSuffixSlotChange(event: Event) {
    this.hasSuffix = (event.target as HTMLSlotElement).assignedElements().length > 0;
  }

  @watch('disabled', { waitUntilFirstUpdate: true })
  handleDisabledChange() {
    if (this.disabled) {
      this._internals?.setValidity({});
    } else {
      this._internals?.setValidity(
        this.input.validity,
        this.input.validationMessage,
        this.input
      );
    }
  }

  @watch('value', { waitUntilFirstUpdate: true })
  handleValueChange() {
    this._internals?.setFormValue(this.value);
  }

  focus(options?: FocusOptions) {
    this.input.focus(options);
  }

  blur() {
    this.input.blur();
  }

  select() {
    this.input.select();
  }

  setSelectionRange(
    selectionStart: number,
    selectionEnd: number,
    selectionDirection: 'forward' | 'backward' | 'none' = 'none'
  ) {
    this.input.setSelectionRange(selectionStart, selectionEnd, selectionDirection);
  }

  setRangeText(
    replacement: string,
    start?: number,
    end?: number,
    selectMode: 'select' | 'start' | 'end' | 'preserve' = 'preserve'
  ) {
    const selectionStart = start ?? this.input.selectionStart!;
    const selectionEnd = end ?? this.input.selectionEnd!;
    this.input.setRangeText(replacement, selectionStart, selectionEnd, selectMode);
    if (this.value !== this.input.value) {
      this.value = this.input.value;
    }
  }

  showPicker() {
    if ('showPicker' in HTMLInputElement.prototype) {
      this.input.showPicker();
    }
  }

  stepUp() {
    this.input.stepUp();
    if (this.value !== this.input.value) {
      this.value = this.input.value;
    }
  }

  stepDown() {
    this.input.stepDown();
    if (this.value !== this.input.value) {
      this.value = this.input.value;
    }
  }

  checkValidity() {
    return this.input.checkValidity();
  }

  reportValidity() {
    return this.input.reportValidity();
  }

  setCustomValidity(message: string) {
    this.input.setCustomValidity(message);
    if (message) {
      this._internals?.setValidity({ customError: true }, message, this.input);
    } else {
      this._internals?.setValidity(this.input.validity, this.input.validationMessage, this.input);
    }
  }

  render() {
    const hasLabel = !!this.label;
    const hasHelpText = !!this.helpText;
    const hasClearIcon = this.clearable && !this.disabled && !this.readonly;
    const isClearIconVisible = hasClearIcon && (typeof this.value === 'number' || this.value.length > 0);

    return html`
      <div
        part="form-control"
        class=${classMap({
          'form-control': true,
          'form-control--small': this.size === 'small',
          'form-control--medium': this.size === 'medium',
          'form-control--large': this.size === 'large',
          'form-control--has-label': hasLabel,
          'form-control--has-help-text': hasHelpText,
        })}
      >
        <label
          part="form-control-label"
          class="form-control__label"
          for="input"
          aria-hidden=${hasLabel ? 'false' : 'true'}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <div
            part="base"
            class=${classMap({
              input: true,
              'input--small': this.size === 'small',
              'input--medium': this.size === 'medium',
              'input--large': this.size === 'large',
              'input--pill': this.pill,
              'input--standard': !this.filled,
              'input--filled': this.filled,
              'input--disabled': this.disabled,
              'input--focused': this.hasFocus,
              'input--empty': !this.value,
              'input--no-spin-buttons': this.noSpinButtons,
              'input--has-prefix': this.hasPrefix,
              'input--has-suffix': this.hasSuffix,
            })}
          >
            <span part="prefix" class="input__prefix">
              <slot name="prefix" @slotchange=${this.handlePrefixSlotChange}></slot>
            </span>

            <input
              part="input"
              id="input"
              class="input__control"
              type=${this.type === 'password' && this.passwordVisible ? 'text' : this.type}
              name=${ifDefined(this.name || undefined)}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
              ?required=${this.required}
              placeholder=${ifDefined(this.placeholder || undefined)}
              minlength=${ifDefined(this.minlength)}
              maxlength=${ifDefined(this.maxlength)}
              min=${ifDefined(this.min as number | undefined)}
              max=${ifDefined(this.max as number | undefined)}
              step=${ifDefined(this.step as number | undefined)}
              .value=${live(this.value)}
              autocapitalize=${ifDefined(this.inputAutocapitalize)}
              autocomplete=${ifDefined(this.autocomplete)}
              autocorrect=${ifDefined(this.inputAutocorrect)}
              ?autofocus=${this.inputAutofocus}
              spellcheck=${this.spellcheck}
              pattern=${ifDefined(this.pattern)}
              enterkeyhint=${ifDefined(this.enterkeyhint)}
              inputmode=${ifDefined(this.inputmode)}
              aria-describedby="help-text"
              @change=${this.handleChange}
              @input=${this.handleInput}
              @invalid=${this.handleInvalid}
              @keydown=${this.handleKeyDown}
              @focus=${this.handleFocus}
              @blur=${this.handleBlur}
            />

            ${isClearIconVisible
              ? html`
                  <button
                    part="clear-button"
                    class="input__clear"
                    type="button"
                    aria-label=${this._localize.term('clearEntry')}
                    @click=${this.handleClearClick}
                    tabindex="-1"
                  >
                    <slot name="clear-icon">
                      <t1-icon name="x-circle-fill" library="system"></t1-icon>
                    </slot>
                  </button>
                `
              : ''}
            ${this.passwordToggle && !this.disabled
              ? html`
                  <button
                    part="password-toggle-button"
                    class="input__password-toggle"
                    type="button"
                    aria-label=${this._localize.term(this.passwordVisible ? 'hidePassword' : 'showPassword')}
                    @click=${this.handlePasswordToggle}
                    tabindex="-1"
                  >
                    ${this.passwordVisible
                      ? html`
                          <slot name="show-password-icon">
                            <t1-icon name="eye-slash" library="system"></t1-icon>
                          </slot>
                        `
                      : html`
                          <slot name="hide-password-icon">
                            <t1-icon name="eye" library="system"></t1-icon>
                          </slot>
                        `}
                  </button>
                `
              : ''}

            <span part="suffix" class="input__suffix">
              <slot name="suffix" @slotchange=${this.handleSuffixSlotChange}></slot>
            </span>
          </div>
        </div>

        <div
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${hasHelpText ? 'false' : 'true'}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `;
  }
}
