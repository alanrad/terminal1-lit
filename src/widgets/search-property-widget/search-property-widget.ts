import { LitElement, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { SignalMixin } from '@state/lit-signal';
import { effect } from '@state/signal';
import createSearchPropertyState, { type SearchPropertyState } from './search-property.state';
import { baseStyles } from '@styles/base';
import styles from './search-property-widget.styles';
import '@components/t1-input/index';
import '@components/t1-icon/index';
import '@components/t1-popup/index';
import '@components/t1-menu/index';
import '@components/t1-menu-item/index';
import '@components/t1-spinner/index';
import PropertyService from '@services/property.service';
import type { TransformedProperty } from '@services/property.service';
import { findProperty } from './utils';

@customElement('search-property-widget')
class SearchPropertyWidget extends SignalMixin(LitElement) {
	static styles = [baseStyles, styles];

	@property({ type: Number }) debounce = 1000;

	@query('t1-menu') private _menu: any;
	@query('t1-input') private _inputEl: any;

	search: (term: string) => void = async (term: string) => {
		if (this._state.properties.value === null) {
			this._state.setLoading(true);
			try {
				const data = await this._propertyService.getProperties();
				this._state.setProperties(data);
			} finally {
				this._state.setLoading(false);
			}
		}
		this._state.setResults(findProperty(this._state.properties.value!, term));
	};

	onSelect: (property: TransformedProperty) => void = (property) => {
		console.log(property);
	};

	private readonly _propertyService = new PropertyService();
	private _state: SearchPropertyState = createSearchPropertyState();
	private _debounceTimer = 0;
	private _disposeResultsEffect = () => {};

	connectedCallback() {
		super.connectedCallback();
		this.watchSignal(this._state.query);
		this.watchSignal(this._state.properties);
		this.watchSignal(this._state.results);
		this.watchSignal(this._state.loading);
		this.watchSignal(this._state.popupVisible);
		this._disposeResultsEffect = effect(() => {
			console.log(this._state.results.value);
		});
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		clearTimeout(this._debounceTimer);
		this._disposeResultsEffect();
	}

	private handleInput = (event: Event) => {
		const value = (event.target as HTMLInputElement & { value: string }).value ?? '';

		clearTimeout(this._debounceTimer);

		if (value.length < 2) {
			this._state.clearResults();
			return;
		}

		this._debounceTimer = window.setTimeout(() => {
			this._state.setQuery(value);
			this.search(value);
		}, this.debounce);
	};

	private handleFocus = () => {
		if (this._state.results.value.length > 0) {
			this._state.showPopup();
		}
	};

	private handleMenuSelect = (event: CustomEvent) => {
		const id = Number((event.detail as { item: { value: string } }).item.value);
		const property = this._state.properties.value?.find((item) => item.id === id);
		if (property) {
			this.onSelect(property);
		}
		this._state.hidePopup();
	};

	private handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
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
		const loading = this._state.loading.value;

		return html`
			<div class='autocomplete' @keydown=${this.handleKeydown}>
				<t1-input
					placeholder='Where would you like to go?'
					clearable
					@t1-input=${this.handleInput}
					@t1-focus=${this.handleFocus}
				>
					<t1-icon slot='prefix' name='search'></t1-icon>
					${loading ? html`<t1-spinner slot='suffix'></t1-spinner>` : ''}
				</t1-input>
				<t1-popup
					.anchor=${this}
					?active=${popupVisible}
					placement='bottom-start'
					sync='width'
					flip
					distance='4'
				>
					<t1-menu @t1-select=${this.handleMenuSelect}>
						${this._state.results.value.map(
							(property) => html`
								<t1-menu-item .value=${String(property.id)}>${property.name}</t1-menu-item>
							`,
						)}
					</t1-menu>
				</t1-popup>
			</div>
		`;
	}
}

export default SearchPropertyWidget;
