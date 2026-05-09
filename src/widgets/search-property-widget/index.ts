import SearchPropertyWidget from "./search-property-widget";

if (!customElements.get("search-property-widget")) {
	customElements.define("search-property-widget", SearchPropertyWidget);
}

declare global {
	interface HTMLElementTagNameMap {
		"search-property-widget": SearchPropertyWidget;
	}
}
