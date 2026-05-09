import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { SignalMixin } from "@state/lit-signal";
import {
	createSearchPropertyState,
	type SearchPropertyState,
} from "./search-property.state";
import { baseStyles } from "@styles/base";
import "@components/t1-input/index";
import "@components/t1-icon/index";
import PropertyService from "@services/property.service";
import { findProperty } from "./utils";

@customElement("search-property-widget")
class SearchPropertyWidget extends SignalMixin(LitElement) {
	static styles = [
		baseStyles,
		css`
			:host {
				display: block;
				max-width: 480px;
			}
		`,
	];

	@property({ type: Number }) debounce = 1000;

	search: (term: string) => void = async (term: string) => {
		if (this._state.properties.value === null) {
			const data = await this._propertyService.getProperties();
			this._state.setProperties(data);
		}
		this._state.setResults(findProperty(this._state.properties.value!, term));
	};

	private readonly _propertyService = new PropertyService();
	private _state: SearchPropertyState = createSearchPropertyState();
	private _debounceTimer = 0;

	connectedCallback() {
		super.connectedCallback();
		this.watchSignal(this._state.query);
		this.watchSignal(this._state.properties);
		this.watchSignal(this._state.results);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		clearTimeout(this._debounceTimer);
	}

	private handleInput(event: Event) {
		const value =
			(event.target as HTMLInputElement & { value: string }).value ?? "";

		clearTimeout(this._debounceTimer);

		if (value.length < 2) {
			this._state.clearResults();
			return;
		}

		this._debounceTimer = window.setTimeout(() => {
			this._state.setQuery(value);
			this.search(value);
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

export default SearchPropertyWidget;
