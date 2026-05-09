import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { property, query } from 'lit/decorators.js';
import { watch } from '@utils/watch';
import styles from './dropdown.styles';
import type { CSSResultGroup } from 'lit';
import type T1Popup from '@components/t1-popup/popup.component';
import type T1Menu from '@components/t1-menu/menu.component';

const componentStyles = css`
  :host { box-sizing: border-box; }
  :host *, :host *::before, :host *::after { box-sizing: inherit; }
  [hidden] { display: none !important; }
`;

export default class T1Dropdown extends LitElement {
  static styles: CSSResultGroup = [componentStyles, styles];

  @query('.dropdown') popup!: T1Popup;
  @query('.dropdown__trigger') trigger!: HTMLSlotElement;
  @query('.dropdown__panel') panel!: HTMLSlotElement;

  private closeWatcher: { destroy(): void; onclose: (() => void) | null } | null = null;

  /**
   * Indicates whether or not the dropdown is open.
   */
  @property({ type: Boolean, reflect: true }) open = false;

  /**
   * The preferred placement of the dropdown panel.
   */
  @property({ reflect: true }) placement:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'left'
    | 'left-start'
    | 'left-end' = 'bottom-start';

  /** Disables the dropdown so the panel will not open. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * By default, the dropdown is closed when an item is selected.
   */
  @property({ attribute: 'stay-open-on-select', type: Boolean, reflect: true }) stayOpenOnSelect = false;

  /**
   * The dropdown will close when the user interacts outside of this element.
   */
  @property({ attribute: false }) containingElement?: HTMLElement;

  /** The distance in pixels from which to offset the panel away from its trigger. */
  @property({ type: Number }) distance = 0;

  /** The distance in pixels from which to offset the panel along its trigger. */
  @property({ type: Number }) skidding = 0;

  /**
   * Enable this option to prevent the panel from being clipped when the component is placed inside a container with
   * overflow: auto|scroll.
   */
  @property({ type: Boolean }) hoist = false;

  /** Syncs the popup width or height to that of the trigger element. */
  @property({ reflect: true }) sync: 'width' | 'height' | 'both' | undefined = undefined;

  connectedCallback() {
    super.connectedCallback();

    if (!this.containingElement) {
      this.containingElement = this;
    }
  }

  firstUpdated() {
    this.panel.hidden = !this.open;

    if (this.open) {
      this.addOpenListeners();
      this.popup.active = true;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeOpenListeners();
    this.hide();
  }

  focusOnTrigger() {
    const trigger = this.trigger.assignedElements({ flatten: true })[0] as HTMLElement | undefined;
    if (typeof trigger?.focus === 'function') {
      trigger.focus();
    }
  }

  getMenu() {
    return this.panel.assignedElements({ flatten: true }).find(el => el.tagName.toLowerCase() === 't1-menu') as
      | T1Menu
      | undefined;
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (this.open && event.key === 'Escape') {
      event.stopPropagation();
      this.hide();
      this.focusOnTrigger();
    }
  };

  private handleDocumentKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.open && !this.closeWatcher) {
      event.stopPropagation();
      this.focusOnTrigger();
      this.hide();
      return;
    }

    if (event.key === 'Tab') {
      if (this.open && document.activeElement?.tagName.toLowerCase() === 't1-menu-item') {
        event.preventDefault();
        this.hide();
        this.focusOnTrigger();
        return;
      }

      setTimeout(() => {
        const activeElement = document.activeElement;

        if (!this.containingElement || !this.containingElement.contains(activeElement)) {
          this.hide();
        }
      });
    }
  };

  private handleDocumentMouseDown = (event: MouseEvent) => {
    const path = event.composedPath();
    if (this.containingElement && !path.includes(this.containingElement)) {
      this.hide();
    }
  };

  private handlePanelSelect = (event: Event) => {
    const target = event.target as HTMLElement;

    if (!this.stayOpenOnSelect && target.tagName.toLowerCase() === 't1-menu') {
      this.hide();
      this.focusOnTrigger();
    }
  };

  handleTriggerClick() {
    if (this.open) {
      this.hide();
    } else {
      this.show();
      this.focusOnTrigger();
    }
  }

  async handleTriggerKeyDown(event: KeyboardEvent) {
    if ([' ', 'Enter'].includes(event.key)) {
      event.preventDefault();
      this.handleTriggerClick();
      return;
    }

    const menu = this.getMenu();

    if (menu) {
      const menuItems = menu.getAllItems();
      const firstMenuItem = menuItems[0];
      const lastMenuItem = menuItems[menuItems.length - 1];

      if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();

        if (!this.open) {
          this.show();
          await this.updateComplete;
        }

        if (menuItems.length > 0) {
          this.updateComplete.then(() => {
            if (event.key === 'ArrowDown' || event.key === 'Home') {
              menu.setCurrentItem(firstMenuItem);
              firstMenuItem.focus();
            }

            if (event.key === 'ArrowUp' || event.key === 'End') {
              menu.setCurrentItem(lastMenuItem);
              lastMenuItem.focus();
            }
          });
        }
      }
    }
  }

  handleTriggerKeyUp(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.preventDefault();
    }
  }

  handleTriggerSlotChange() {
    this.updateAccessibleTrigger();
  }

  updateAccessibleTrigger() {
    const assignedElements = this.trigger.assignedElements({ flatten: true }) as HTMLElement[];

    // Find the first focusable element
    const accessibleTrigger = assignedElements.find(el => {
      if (el.tabIndex >= 0) return true;
      const focusable = el.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      return !!focusable;
    });

    if (accessibleTrigger) {
      // Try to find the inner button for t1-button/t1-icon-button
      let target: HTMLElement | null = null;
      const tagName = accessibleTrigger.tagName.toLowerCase();
      if (tagName === 't1-button' || tagName === 't1-icon-button') {
        target = (accessibleTrigger as HTMLElement & { button?: HTMLElement }).button ?? accessibleTrigger;
      } else {
        target = accessibleTrigger;
      }

      if (target) {
        target.setAttribute('aria-haspopup', 'true');
        target.setAttribute('aria-expanded', this.open ? 'true' : 'false');
      }
    }
  }

  /** Shows the dropdown panel. */
  show() {
    if (this.open) {
      return;
    }

    this.open = true;
  }

  /** Hides the dropdown panel. */
  hide() {
    if (!this.open) {
      return;
    }

    this.open = false;
  }

  /**
   * Instructs the dropdown menu to reposition.
   */
  reposition() {
    this.popup.reposition();
  }

  addOpenListeners() {
    this.panel.addEventListener('t1-select', this.handlePanelSelect);
    if ('CloseWatcher' in window) {
      this.closeWatcher?.destroy();
      this.closeWatcher = new (window as unknown as { CloseWatcher: new () => { destroy(): void; onclose: (() => void) | null } }).CloseWatcher();
      this.closeWatcher!.onclose = () => {
        this.hide();
        this.focusOnTrigger();
      };
    } else {
      this.panel.addEventListener('keydown', this.handleKeyDown);
    }
    document.addEventListener('keydown', this.handleDocumentKeyDown);
    document.addEventListener('mousedown', this.handleDocumentMouseDown);
  }

  removeOpenListeners() {
    if (this.panel) {
      this.panel.removeEventListener('t1-select', this.handlePanelSelect);
      this.panel.removeEventListener('keydown', this.handleKeyDown);
    }
    document.removeEventListener('keydown', this.handleDocumentKeyDown);
    document.removeEventListener('mousedown', this.handleDocumentMouseDown);
    this.closeWatcher?.destroy();
  }

  @watch('open', { waitUntilFirstUpdate: true })
  handleOpenChange() {
    if (this.disabled) {
      this.open = false;
      return;
    }

    this.updateAccessibleTrigger();

    if (this.open) {
      this.dispatchEvent(new CustomEvent('t1-show', { bubbles: true, composed: true }));
      this.addOpenListeners();

      this.panel.hidden = false;
      this.popup.active = true;

      this.updateComplete.then(() => {
        this.dispatchEvent(new CustomEvent('t1-after-show', { bubbles: true, composed: true }));
      });
    } else {
      this.dispatchEvent(new CustomEvent('t1-hide', { bubbles: true, composed: true }));
      this.removeOpenListeners();

      this.panel.hidden = true;
      this.popup.active = false;

      this.updateComplete.then(() => {
        this.dispatchEvent(new CustomEvent('t1-after-hide', { bubbles: true, composed: true }));
      });
    }
  }

  render() {
    return html`
      <t1-popup
        part="base"
        exportparts="popup:base__popup"
        id="dropdown"
        placement=${this.placement}
        distance=${this.distance}
        skidding=${this.skidding}
        strategy=${this.hoist ? 'fixed' : 'absolute'}
        flip
        shift
        auto-size="vertical"
        auto-size-padding="10"
        sync=${ifDefined(this.sync ? this.sync : undefined)}
        class=${classMap({
          dropdown: true,
          'dropdown--open': this.open
        })}
      >
        <slot
          name="trigger"
          slot="anchor"
          part="trigger"
          class="dropdown__trigger"
          @click=${this.handleTriggerClick}
          @keydown=${this.handleTriggerKeyDown}
          @keyup=${this.handleTriggerKeyUp}
          @slotchange=${this.handleTriggerSlotChange}
        ></slot>

        <div aria-hidden=${this.open ? 'false' : 'true'} aria-labelledby="dropdown">
          <slot part="panel" class="dropdown__panel"></slot>
        </div>
      </t1-popup>
    `;
  }
}
