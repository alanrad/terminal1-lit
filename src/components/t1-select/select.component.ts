import { LitElement, html, css, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { property, query, state } from 'lit/decorators.js';
import { watch } from '@utils/watch';
import styles from './select.styles';
import type { CSSResultGroup } from 'lit';
import type T1Option from '@components/t1-option/option.component';
import type T1Popup from '@components/t1-popup/popup.component';

const componentStyles = css`
  :host {
    box-sizing: border-box;
    display: block;
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

export default class T1Select extends LitElement {
  static styles: CSSResultGroup = [componentStyles, styles];
  static formAssociated = true;

  private _internals: ElementInternals | undefined = (() => {
    try {
      const i = this.attachInternals();
      return typeof i?.setFormValue === 'function' ? i : undefined;
    } catch {
      return undefined;
    }
  })();

  @query('.select') popup!: T1Popup;
  @query('.select__combobox') combobox!: HTMLElement;
  @query('.select__display-input') displayInput!: HTMLInputElement;
  @query('.select__value-input') valueInput!: HTMLInputElement;
  @query('.select__listbox') listbox!: HTMLElement;

  @state() displayLabel = '';
  @state() currentOption: T1Option | undefined;
  @state() selectedOptions: T1Option[] = [];

  /** The name attribute for form submission. */
  @property() name = '';

  private _value: string | string[] = '';

  get value(): string | string[] {
    if (this.multiple && !Array.isArray(this._value)) {
      return this._value ? [this._value as string] : [];
    }
    return this._value;
  }
  set value(val: string | string[]) {
    this._value = val;
    this.requestUpdate('value');
  }

  /** The select's size. */
  @property({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** Placeholder text shown when no option is selected. */
  @property() placeholder = '';

  /** Allows multiple options to be selected. */
  @property({ type: Boolean, reflect: true }) multiple = false;

  /** Maximum tags visible in multiple mode before "+n" overflow. */
  @property({ attribute: 'max-options-visible', type: Number }) maxOptionsVisible = 3;

  /** Disables the select. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Shows a clear button when a value is selected. */
  @property({ type: Boolean }) clearable = false;

  /** Whether the listbox is open. */
  @property({ type: Boolean, reflect: true }) open = false;

  /** Draws a pill-style combobox. */
  @property({ type: Boolean, reflect: true }) pill = false;

  /** A label shown above the combobox. */
  @property() label = '';

  /** Help text shown below the combobox. */
  @property({ attribute: 'help-text' }) helpText = '';

  /** Marks the field as required. */
  @property({ type: Boolean, reflect: true }) required = false;

  /** The preferred placement of the dropdown panel. */
  @property({ reflect: true }) placement: 'top' | 'bottom' = 'bottom';

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'combobox');
  }

  firstUpdated() {
    this.syncOptionsFromValue();
    this.updateDisplayLabel();
  }

  // ─── Options ───────────────────────────────────────────────────────────────

  getOptions(): T1Option[] {
    return [...this.querySelectorAll<T1Option>('t1-option')];
  }

  handleDefaultSlotChange() {
    this.syncOptionsFromValue();
    this.updateDisplayLabel();
    this.requestUpdate();
  }

  private syncOptionsFromValue() {
    const options = this.getOptions();
    const values = this.multiple
      ? Array.isArray(this._value)
        ? this._value
        : this._value
          ? [this._value as string]
          : []
      : typeof this._value === 'string'
        ? this._value
          ? [this._value]
          : []
        : [];

    options.forEach((opt) => {
      opt.selected = values.includes(opt.value);
    });
    this.selectedOptions = options.filter((o) => o.selected);
    this._internals?.setFormValue(
      this.multiple
        ? (Array.isArray(this._value) ? this._value : []).join(' ')
        : (this._value as string),
    );
  }

  private updateDisplayLabel() {
    if (this.multiple) {
      this.displayLabel = '';
    } else {
      const selected = this.selectedOptions[0];
      this.displayLabel = selected ? selected.getTextLabel() : '';
    }
  }

  // ─── Show / Hide ───────────────────────────────────────────────────────────

  show() {
    if (this.open || this.disabled) return;
    this.open = true;
  }

  hide() {
    if (!this.open) return;
    this.open = false;
  }

  // ─── Selection ─────────────────────────────────────────────────────────────

  private selectOption(option: T1Option) {
    if (option.disabled) return;

    if (this.multiple) {
      const values = Array.isArray(this._value) ? [...this._value] : [];
      const idx = values.indexOf(option.value);
      if (idx > -1) {
        values.splice(idx, 1);
      } else {
        values.push(option.value);
      }
      this._value = values;
    } else {
      this._value = option.value;
    }

    this.syncOptionsFromValue();
    this.updateDisplayLabel();
    this.requestUpdate();
    this._internals?.setFormValue(
      this.multiple ? (this._value as string[]).join(' ') : (this._value as string),
    );

    this.dispatchEvent(new CustomEvent('t1-input', { bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('t1-change', { bubbles: true, composed: true }));
  }

  private removeTag(option: T1Option) {
    const values = Array.isArray(this._value) ? [...this._value] : [];
    const idx = values.indexOf(option.value);
    if (idx > -1) values.splice(idx, 1);
    this._value = values;
    this.syncOptionsFromValue();
    this.updateDisplayLabel();
    this.requestUpdate();
    this._internals?.setFormValue((this._value as string[]).join(' '));
    this.dispatchEvent(new CustomEvent('t1-input', { bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('t1-change', { bubbles: true, composed: true }));
  }

  private clearValue() {
    this._value = this.multiple ? [] : '';
    this.syncOptionsFromValue();
    this.updateDisplayLabel();
    this.requestUpdate();
    this._internals?.setFormValue('');
    this.dispatchEvent(new CustomEvent('t1-clear', { bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('t1-input', { bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('t1-change', { bubbles: true, composed: true }));
  }

  // ─── Keyboard navigation ───────────────────────────────────────────────────

  private setCurrentOption(option: T1Option | undefined) {
    this.getOptions().forEach((o) => {
      o.current = false;
    });
    if (option) option.current = true;
    this.currentOption = option;
  }

  private handleComboboxKeyDown(event: KeyboardEvent) {
    if (this.disabled) return;

    const options = this.getOptions().filter((o) => !o.disabled);
    const currentIdx = this.currentOption ? options.indexOf(this.currentOption) : -1;

    if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      if (!this.open) this.show();

      let idx = currentIdx;
      if (event.key === 'ArrowDown') idx = Math.min(idx + 1, options.length - 1);
      else if (event.key === 'ArrowUp') idx = Math.max(idx - 1, 0);
      else if (event.key === 'Home') idx = 0;
      else if (event.key === 'End') idx = options.length - 1;

      if (idx < 0) idx = 0;
      this.setCurrentOption(options[idx]);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!this.open) {
        this.show();
      } else if (this.currentOption) {
        this.selectOption(this.currentOption);
        if (!this.multiple) this.hide();
      }
    } else if (event.key === 'Escape') {
      if (this.open) {
        event.preventDefault();
        event.stopPropagation();
        this.hide();
      }
    } else if (event.key === 'Tab') {
      this.hide();
    }
  }

  // ─── Event handlers ────────────────────────────────────────────────────────

  private handleComboboxClick() {
    if (this.disabled) return;
    this.open ? this.hide() : this.show();
  }

  private handleComboboxFocus() {
    this.dispatchEvent(new CustomEvent('t1-focus', { bubbles: true, composed: true }));
  }

  private handleComboboxBlur() {
    this.dispatchEvent(new CustomEvent('t1-blur', { bubbles: true, composed: true }));
  }

  private handleOptionClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const option = target.closest('t1-option') as T1Option | null;
    if (!option || option.disabled) return;
    this.selectOption(option);
    if (!this.multiple) this.hide();
  }

  private handleDocumentMouseDown = (event: MouseEvent) => {
    const path = event.composedPath();
    if (!path.includes(this)) {
      this.hide();
    }
  };

  // ─── Watchers ──────────────────────────────────────────────────────────────

  @watch('open', { waitUntilFirstUpdate: true })
  handleOpenChange() {
    if (this.open) {
      const popupEl = this.shadowRoot?.querySelector('t1-popup') as T1Popup | null;
      if (popupEl) popupEl.active = true;
      this.dispatchEvent(new CustomEvent('t1-show', { bubbles: true, composed: true }));
      document.addEventListener('mousedown', this.handleDocumentMouseDown);
      this.updateComplete.then(() => {
        this.dispatchEvent(new CustomEvent('t1-after-show', { bubbles: true, composed: true }));
        const selected = this.selectedOptions[0];
        if (selected) this.setCurrentOption(selected);
        else {
          const first = this.getOptions().find((o) => !o.disabled);
          if (first) this.setCurrentOption(first);
        }
      });
    } else {
      const popupEl = this.shadowRoot?.querySelector('t1-popup') as T1Popup | null;
      if (popupEl) popupEl.active = false;
      this.dispatchEvent(new CustomEvent('t1-hide', { bubbles: true, composed: true }));
      document.removeEventListener('mousedown', this.handleDocumentMouseDown);
      this.setCurrentOption(undefined);
      this.updateComplete.then(() => {
        this.dispatchEvent(new CustomEvent('t1-after-hide', { bubbles: true, composed: true }));
      });
    }
  }

  @watch('value', { waitUntilFirstUpdate: true })
  handleValueChange() {
    this.syncOptionsFromValue();
    this.updateDisplayLabel();
  }

  @watch('disabled', { waitUntilFirstUpdate: true })
  handleDisabledChange() {
    if (this.disabled) this.open = false;
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  private renderTags() {
    if (!this.multiple) return nothing;
    const values = Array.isArray(this._value) ? this._value : [];
    const selected = this.selectedOptions;
    const visible =
      this.maxOptionsVisible > 0 ? selected.slice(0, this.maxOptionsVisible) : selected;
    const overflow = selected.length - visible.length;

    return html`
      <div class="select__tags" part="tags" aria-live="polite">
        ${visible.map(
          (opt) => html`
            <t1-tag
              part="tag"
              exportparts="base:tag__base, content:tag__content, remove-button:tag__remove-button"
              size=${this.size}
              ?pill=${this.pill}
              removable
              @t1-remove=${() => this.removeTag(opt)}
              @click=${(e: Event) => e.stopPropagation()}
              >${opt.getTextLabel()}</t1-tag
            >
          `,
        )}
        ${overflow > 0 ? html`<span class="select__tags-overflow">+${overflow}</span>` : nothing}
        <input
          class="select__display-input"
          type="text"
          placeholder=${values.length === 0 ? this.placeholder : ''}
          .value=${''}
          tabindex="-1"
          aria-hidden="true"
          readonly
        />
      </div>
    `;
  }

  render() {
    const hasValue = this.multiple
      ? Array.isArray(this._value) && this._value.length > 0
      : this._value !== '';

    const showClearButton = this.clearable && hasValue && !this.disabled;
    const showPlaceholder = !hasValue;

    return html`
      ${this.label
        ? html`<label class="select__label" @click=${() => this.displayInput?.focus()}
            >${this.label}</label
          >`
        : nothing}

      <t1-popup
        class=${classMap({
          select: true,
          'select--open': this.open,
          'select--disabled': this.disabled,
          'select--multiple': this.multiple,
          'select--placeholder-visible': showPlaceholder,
          [`select--${this.size}`]: true,
          'select--pill': this.pill,
        })}
        placement=${this.placement}
        flip
        shift
        auto-size="vertical"
        auto-size-padding="10"
        sync="width"
      >
        <div
          part="combobox"
          class="select__combobox"
          slot="anchor"
          aria-haspopup="listbox"
          aria-expanded=${this.open ? 'true' : 'false'}
          aria-controls="listbox"
          aria-disabled=${this.disabled ? 'true' : 'false'}
          tabindex=${this.disabled ? '-1' : '0'}
          @click=${this.handleComboboxClick}
          @keydown=${this.handleComboboxKeyDown}
          @focus=${this.handleComboboxFocus}
          @blur=${this.handleComboboxBlur}
        >
          <slot name="prefix" part="prefix" class="select__prefix"></slot>

          ${this.multiple
            ? this.renderTags()
            : html`
                <input
                  class="select__display-input"
                  type="text"
                  placeholder=${this.placeholder}
                  .value=${this.displayLabel}
                  tabindex="-1"
                  aria-hidden="true"
                  readonly
                />
              `}
          ${showClearButton
            ? html`
                <button
                  part="clear-button"
                  class="select__clear-button"
                  type="button"
                  aria-label="Clear"
                  tabindex="-1"
                  @click=${(e: MouseEvent) => {
                    e.stopPropagation();
                    this.clearValue();
                  }}
                >
                  <t1-icon library="system" name="x-circle-fill"></t1-icon>
                </button>
              `
            : nothing}

          <span part="expand-icon" class="select__expand-icon">
            <t1-icon library="system" name="chevron-down"></t1-icon>
          </span>

          <slot name="suffix" part="suffix" class="select__suffix"></slot>
        </div>

        <div
          id="listbox"
          role="listbox"
          aria-multiselectable=${this.multiple ? 'true' : 'false'}
          aria-label=${ifDefined(this.label || undefined)}
          class="select__listbox"
          part="listbox"
          @click=${this.handleOptionClick}
          @mousedown=${(e: Event) => e.preventDefault()}
        >
          <slot @slotchange=${() => this.handleDefaultSlotChange()}></slot>
        </div>
      </t1-popup>

      <input
        class="select__value-input"
        type="text"
        name=${ifDefined(this.name || undefined)}
        .value=${Array.isArray(this._value) ? this._value.join(' ') : (this._value as string)}
        tabindex="-1"
        aria-hidden="true"
        ?required=${this.required}
        ?disabled=${this.disabled}
      />

      ${this.helpText
        ? html`<div class="select__help-text" part="help-text">${this.helpText}</div>`
        : nothing}
    `;
  }
}
