import { LitElement, html, css } from 'lit';
import { query } from 'lit/decorators.js';
import styles from './menu.styles';
import type { CSSResultGroup } from 'lit';
import type T1MenuItem from '@components/t1-menu-item/menu-item.component';

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

export interface MenuSelectEventDetail {
  item: T1MenuItem;
}

export default class T1Menu extends LitElement {
  static styles: CSSResultGroup = [componentStyles, styles];

  @query('slot') defaultSlot!: HTMLSlotElement;

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'menu');
  }

  private handleClick(event: MouseEvent) {
    const menuItemTypes = ['menuitem', 'menuitemcheckbox'];

    const composedPath = event.composedPath();
    const target = composedPath.find((el: EventTarget) =>
      menuItemTypes.includes((el as Element)?.getAttribute?.('role') ?? ''),
    );

    if (!target) return;

    const closestMenu = composedPath.find(
      (el: EventTarget) => (el as Element)?.getAttribute?.('role') === 'menu',
    );
    const clickHasSubmenu = closestMenu !== this;

    if (clickHasSubmenu) return;

    const item = target as T1MenuItem;

    if (item.type === 'checkbox') {
      item.checked = !item.checked;
    }

    this.dispatchEvent(
      new CustomEvent('t1-select', { bubbles: true, composed: true, detail: { item } }),
    );
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      const item = this.getCurrentItem();
      event.preventDefault();
      event.stopPropagation();
      item?.click();
    } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      const items = this.getAllItems();
      const activeItem = this.getCurrentItem();
      let index = activeItem ? items.indexOf(activeItem) : 0;

      if (items.length > 0) {
        event.preventDefault();
        event.stopPropagation();

        if (event.key === 'ArrowDown') {
          index++;
        } else if (event.key === 'ArrowUp') {
          index--;
        } else if (event.key === 'Home') {
          index = 0;
        } else if (event.key === 'End') {
          index = items.length - 1;
        }

        if (index < 0) {
          index = items.length - 1;
        }
        if (index > items.length - 1) {
          index = 0;
        }

        this.setCurrentItem(items[index]);
        items[index].focus();
      }
    }
  }

  private handleMouseDown(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (this.isMenuItem(target)) {
      this.setCurrentItem(target as T1MenuItem);
    }
  }

  private handleSlotChange() {
    const items = this.getAllItems();

    if (items.length > 0) {
      this.setCurrentItem(items[0]);
    }
  }

  private isMenuItem(item: HTMLElement) {
    return (
      item.tagName.toLowerCase() === 't1-menu-item' ||
      ['menuitem', 'menuitemcheckbox', 'menuitemradio'].includes(item.getAttribute('role') ?? '')
    );
  }

  /** @internal Gets all slotted menu items, ignoring dividers, headers, and other elements. */
  getAllItems() {
    return [...this.defaultSlot.assignedElements({ flatten: true })].filter((el: Element) => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.inert || !this.isMenuItem(htmlEl)) {
        return false;
      }
      return true;
    }) as T1MenuItem[];
  }

  /**
   * @internal Gets the current menu item.
   */
  getCurrentItem() {
    return this.getAllItems().find((i) => i.getAttribute('tabindex') === '0');
  }

  /**
   * @internal Sets the current menu item.
   */
  setCurrentItem(item: T1MenuItem) {
    const items = this.getAllItems();

    items.forEach((i) => {
      i.setAttribute('tabindex', i === item ? '0' : '-1');
    });
  }

  render() {
    return html`
      <slot
        @slotchange=${this.handleSlotChange}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleMouseDown}
      ></slot>
    `;
  }
}
