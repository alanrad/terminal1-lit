import { LitElement, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { SignalMixin } from '@state/lit-signal';
import createSearchPropertyState, { type SearchPropertyState } from './search-property.state';
import { baseStyles } from '@styles/base';
import styles from './search-property-widget.styles';
import '@components/t1-input';
import '@components/t1-icon';
import '@components/t1-popup';
import '@components/t1-menu';
import '@components/t1-menu-item';
import PropertyService from '@services/property.service';
import type { TransformedProperty } from '@services/property.service';
import { findProperty, getPropertyIcon } from './utils';
import './components/property-card/';
import './components/property-card-skeleton/';

@customElement('search-property-widget')
class SearchPropertyWidget extends SignalMixin(LitElement) {
  static styles = [baseStyles, styles];

  @property({ type: String }) label = '';
  @property({ type: String }) placeholder = 'Where would you like to go?';

  @query('t1-menu') private _menu: any;
  @query('t1-input') private _inputEl: any;

  search: (term: string) => void = async (term: string) => {
    if (this._state.properties.value === null) {
      const data = await this._propertyService.getProperties();
      this._state.setProperties(data);
    }
    this._state.setResults(findProperty(this._state.properties.value!, term));
  };

  onSelect: (property: TransformedProperty) => void = () => {};

  private readonly _propertyService = new PropertyService();
  private _state: SearchPropertyState = createSearchPropertyState();
  private _debounceTimer = 0;
  private _skeletonTimer = 0;
  private _userQuery = '';

  connectedCallback() {
    super.connectedCallback();
    this.watchSignal(this._state.query);
    this.watchSignal(this._state.properties);
    this.watchSignal(this._state.results);
    this.watchSignal(this._state.popupVisible);
    this.watchSignal(this._state.selectedProperty);
    this.watchSignal(this._state.showSkeleton);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this._debounceTimer);
    clearTimeout(this._skeletonTimer);
  }

  private handleInput = (event: Event) => {
    const value = (event.target as HTMLInputElement & { value: string }).value ?? '';
    this._userQuery = value;

    clearTimeout(this._debounceTimer);

    if (value.length < 2) {
      clearTimeout(this._skeletonTimer);
      this._state.clearResults();
      return;
    }

    this._debounceTimer = window.setTimeout(() => {
      this._state.setQuery(value);
      this.search(value);
    }, 500);
  };

  private handleFocus = () => {
    if (this._state.selectedProperty.value && this._inputEl) {
      this._inputEl.value = this._userQuery;
    }
    if (this._state.results.value.length > 0) {
      this._state.showPopup();
    }
  };

  private handleMenuSelect = (event: CustomEvent) => {
    const id = Number((event.detail as { item: { value: string } }).item.value);
    const property = this._state.properties.value?.find((item) => item.id === id);
    if (property) {
      this._state.setSelectedProperty(property);
      this.onSelect(property);
      if (this._inputEl) {
        this._inputEl.value = property.fullAddress;
      }
      clearTimeout(this._skeletonTimer);
      this._state.setShowSkeleton(true);
      this._skeletonTimer = window.setTimeout(() => {
        this._state.setShowSkeleton(false);
      }, 2000);
    }
    this._state.hidePopup();
  };

  private handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      clearTimeout(this._skeletonTimer);
      this._state.clearResults();
      this._inputEl?.focus();
      return;
    }

    const results = this._state.results.value;
    if (results.length === 0) {
      return;
    }

    const menu = this._menu;
    if (!menu) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const items: HTMLElement[] = menu.getAllItems();
      if (items.length === 0) {
        return;
      }
      const current = menu.getCurrentItem() ?? items[0];
      menu.setCurrentItem(current);
      current.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const items: HTMLElement[] = menu.getAllItems();
      if (items.length === 0) {
        return;
      }
      const last = items[items.length - 1];
      menu.setCurrentItem(last);
      last.focus();
    }
  };

  render() {
    const popupVisible = this._state.popupVisible.value;
    const selectedProperty = this._state.selectedProperty.value;
    const showSkeleton = this._state.showSkeleton.value;

    return html`
      <div class="autocomplete" @keydown=${this.handleKeydown}>
        <t1-input
          label=${this.label}
          placeholder=${this.placeholder}
          clearable
          @t1-input=${this.handleInput}
          @t1-focus=${this.handleFocus}
        >
          <t1-icon slot="prefix" name="search"></t1-icon>
        </t1-input>
        <t1-popup
          .anchor=${this}
          ?active=${popupVisible}
          placement="bottom-start"
          sync="width"
          flip
          distance="4"
        >
          <t1-menu @t1-select=${this.handleMenuSelect}>
            ${this._state.results.value.map(
              (property) => html`
                <t1-menu-item .value=${String(property.id)}>
                  <t1-icon slot="prefix" name=${getPropertyIcon(property.propertyType)}></t1-icon>
                  ${property.fullAddress}
                </t1-menu-item>
              `,
            )}
          </t1-menu>
        </t1-popup>
      </div>
      ${!popupVisible && showSkeleton
        ? html`<property-card-skeleton></property-card-skeleton>`
        : !popupVisible && selectedProperty
          ? html`<property-card .selectedProperty=${selectedProperty}></property-card>`
          : ''}
    `;
  }
}

export default SearchPropertyWidget;
