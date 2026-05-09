import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { SignalMixin } from '@state/lit-signal';
import { createSearchPropertyState, type SearchPropertyState } from './search-property.state';
import { baseStyles } from '@styles/base';
import '@components/t1-input/index';
import '@components/t1-icon/index';

@customElement('search-property-widget')
export class SearchPropertyWidget extends SignalMixin(LitElement) {
  static styles = [
    baseStyles,
    css`
      :host {
        display: block;
        max-width: 480px;
      }
    `,
  ];

  @property({ type: Number }) debounce = 300;

  search: (term: string) => void = (term: string) => {
    console.log('[search-property] search:', term);
  };

  private _state: SearchPropertyState = createSearchPropertyState();
  private _debounceTimer = 0;

  connectedCallback() {
    super.connectedCallback();
    this.watchSignal(this._state.query);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this._debounceTimer);
  }

  private handleInput(event: Event) {
    const value = (event.target as HTMLInputElement & { value: string }).value ?? '';

    clearTimeout(this._debounceTimer);
    this._debounceTimer = window.setTimeout(() => {
      if (value.length > 3) {
        this._state.setQuery(value);
        this.search(value);
      }
    }, this.debounce);
  }

  render() {
    return html`
      <t1-input
        placeholder="Where would you like to go?"
        clearable
        @t1-input=${this.handleInput}
      >
        <t1-icon slot="prefix" name="search"></t1-icon>
      </t1-input>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'search-property-widget': SearchPropertyWidget;
  }
}
