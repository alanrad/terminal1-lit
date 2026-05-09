import { LitElement, html, css } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { getTextContent, HasSlotController } from "@utils/slot";
import { LocalizeController } from "@utils/localize";
import { property, query } from "lit/decorators.js";
import { SubmenuController } from "./submenu-controller";
import { watch } from "@utils/watch";
import styles from "./menu-item.styles";
import type { CSSResultGroup } from "lit";

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

export default class T1MenuItem extends LitElement {
	static styles: CSSResultGroup = [componentStyles, styles];

	private cachedTextLabel = "";
	private readonly localize = new LocalizeController(this);

	@query("slot:not([name])") defaultSlot!: HTMLSlotElement;
	@query(".menu-item") menuItem!: HTMLElement;

	/** The type of menu item to render. */
	@property() type: "normal" | "checkbox" = "normal";

	/** Draws the item in a checked state. */
	@property({ type: Boolean, reflect: true }) checked = false;

	/** A unique value to store in the menu item. */
	@property() value = "";

	/** Draws the menu item in a loading state. */
	@property({ type: Boolean, reflect: true }) loading = false;

	/** Draws the menu item in a disabled state. */
	@property({ type: Boolean, reflect: true }) disabled = false;

	private readonly hasSlotController = new HasSlotController(
		this,
		"submenu",
		"prefix",
		"suffix",
	);
	private submenuController: SubmenuController = new SubmenuController(
		this,
		this.hasSlotController,
	);

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener("click", this.handleHostClick);
		this.addEventListener("mouseover", this.handleMouseOver);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener("click", this.handleHostClick);
		this.removeEventListener("mouseover", this.handleMouseOver);
	}

	private handleDefaultSlotChange() {
		const textLabel = this.getTextLabel();

		if (typeof this.cachedTextLabel === "undefined") {
			this.cachedTextLabel = textLabel;
			return;
		}

		if (textLabel !== this.cachedTextLabel) {
			this.cachedTextLabel = textLabel;
			this.dispatchEvent(
				new CustomEvent("slotchange", {
					bubbles: true,
					composed: false,
					cancelable: false,
				}),
			);
		}
	}

	private handleHostClick = (event: MouseEvent) => {
		if (this.disabled) {
			event.preventDefault();
			event.stopImmediatePropagation();
		}
	};

	private handleMouseOver = (event: MouseEvent) => {
		this.focus();
		event.stopPropagation();
	};

	@watch("checked")
	handleCheckedChange() {
		if (this.checked && this.type !== "checkbox") {
			this.checked = false;
			console.error(
				'The checked attribute can only be used on menu items with type="checkbox"',
				this,
			);
			return;
		}

		if (this.type === "checkbox") {
			this.setAttribute("aria-checked", this.checked ? "true" : "false");
		} else {
			this.removeAttribute("aria-checked");
		}
	}

	@watch("disabled")
	handleDisabledChange() {
		this.setAttribute("aria-disabled", this.disabled ? "true" : "false");
	}

	@watch("type")
	handleTypeChange() {
		if (this.type === "checkbox") {
			this.setAttribute("role", "menuitemcheckbox");
			this.setAttribute("aria-checked", this.checked ? "true" : "false");
		} else {
			this.setAttribute("role", "menuitem");
			this.removeAttribute("aria-checked");
		}
	}

	/** Returns a text label based on the contents of the menu item's default slot. */
	getTextLabel() {
		return getTextContent(this.defaultSlot);
	}

	isSubmenu() {
		return this.hasSlotController.test("submenu");
	}

	render() {
		const isRtl = this.localize.dir() === "rtl";
		const isSubmenuExpanded = this.submenuController.isExpanded();

		return html`
			<div
				id="anchor"
				part="base"
				class=${classMap({
					"menu-item": true,
					"menu-item--rtl": isRtl,
					"menu-item--checked": this.checked,
					"menu-item--disabled": this.disabled,
					"menu-item--loading": this.loading,
					"menu-item--has-submenu": this.isSubmenu(),
					"menu-item--submenu-expanded": isSubmenuExpanded,
					"menu-item--has-prefix": this.hasSlotController.test("prefix"),
					"menu-item--has-suffix": this.hasSlotController.test("suffix"),
				})}
				?aria-haspopup="${this.isSubmenu()}"
				?aria-expanded="${isSubmenuExpanded ? true : false}"
			>
				<span part="checked-icon" class="menu-item__check">
					<t1-icon name="check" library="system" aria-hidden="true"></t1-icon>
				</span>

				<slot name="prefix" part="prefix" class="menu-item__prefix"></slot>

				<slot
					part="label"
					class="menu-item__label"
					@slotchange=${this.handleDefaultSlotChange}
				></slot>

				<slot name="suffix" part="suffix" class="menu-item__suffix"></slot>

				<span part="submenu-icon" class="menu-item__chevron">
					<t1-icon
						name=${isRtl ? "chevron-left" : "chevron-right"}
						library="system"
						aria-hidden="true"
					></t1-icon>
				</span>

				${this.submenuController.renderSubmenu()}
				${this.loading
					? html`<t1-spinner
							part="spinner"
							exportparts="base:spinner__base"
						></t1-spinner>`
					: ""}
			</div>
		`;
	}
}
