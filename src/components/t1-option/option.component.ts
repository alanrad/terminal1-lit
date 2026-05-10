import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { property, query, state } from 'lit/decorators.js';
import { watch } from '@utils/watch';
import styles from './option.styles';
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

export default class T1Option extends LitElement {
  static styles: CSSResultGroup = [componentStyles, styles];

  private isInitialized = false;

  @query('.option__label') defaultSlot!: HTMLSlotElement;

  @state() current = false;
  @state() selected = false;
  @state() hasHover = false;

  /** The option's value. Values may not contain spaces. */
  @property({ reflect: true }) value = '';

  /** Draws the option in a disabled state. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'option');
    this.setAttribute('aria-selected', 'false');
  }

  private handleDefaultSlotChange() {
    if (this.isInitialized) {
      customElements.whenDefined('t1-select').then(() => {
        const controller = this.closest('t1-select') as
          | (HTMLElement & { handleDefaultSlotChange?(): void })
          | null;
        if (controller?.handleDefaultSlotChange) {
          controller.handleDefaultSlotChange();
        }
      });
    } else {
      this.isInitialized = true;
    }
  }

  private handleMouseEnter() {
    this.hasHover = true;
  }

  private handleMouseLeave() {
    this.hasHover = false;
  }

  @watch('disabled')
  handleDisabledChange() {
    this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
  }

  @watch('selected')
  handleSelectedChange() {
    this.setAttribute('aria-selected', this.selected ? 'true' : 'false');
  }

  @watch('value')
  handleValueChange() {
    if (typeof this.value !== 'string') {
      this.value = String(this.value);
    }
    if (this.value.includes(' ')) {
      console.error(
        'Option values cannot include a space. All spaces have been replaced with underscores.',
        this,
      );
      this.value = this.value.replace(/ /g, '_');
    }
  }

  /** Returns a plain text label based on the option's content. */
  getTextLabel() {
    const nodes = this.childNodes;
    let label = '';
    [...nodes].forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (!(node as HTMLElement).hasAttribute('slot')) {
          label += (node as HTMLElement).textContent;
        }
      }
      if (node.nodeType === Node.TEXT_NODE) {
        label += node.textContent;
      }
    });
    return label.trim();
  }

  render() {
    return html`
      <div
        part="base"
        class=${classMap({
          option: true,
          'option--current': this.current,
          'option--disabled': this.disabled,
          'option--selected': this.selected,
          'option--hover': this.hasHover,
        })}
        @mouseenter=${this.handleMouseEnter}
        @mouseleave=${this.handleMouseLeave}
      >
        <t1-icon
          part="checked-icon"
          class="option__check"
          name="check"
          library="system"
          aria-hidden="true"
        ></t1-icon>
        <slot part="prefix" name="prefix" class="option__prefix"></slot>
        <slot part="label" class="option__label" @slotchange=${this.handleDefaultSlotChange}></slot>
        <slot part="suffix" name="suffix" class="option__suffix"></slot>
      </div>
    `;
  }
}
