import {
  arrow,
  autoUpdate,
  computePosition,
  flip,
  offset,
  platform,
  shift,
  size,
} from '@floating-ui/dom';
import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { LocalizeController } from '@utils/localize';
import { offsetParent } from 'composed-offset-position';
import { property, query } from 'lit/decorators.js';
import styles from './popup.styles';
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

export interface VirtualElement {
  getBoundingClientRect: () => DOMRect;
  contextElement?: Element;
}

function isVirtualElement(e: unknown): e is VirtualElement {
  return (
    e !== null &&
    typeof e === 'object' &&
    'getBoundingClientRect' in e &&
    ('contextElement' in e ? (e as VirtualElement).contextElement instanceof Element : true)
  );
}

export default class T1Popup extends LitElement {
  static styles: CSSResultGroup = [componentStyles, styles];

  private anchorEl: Element | VirtualElement | null = null;
  private cleanup: ReturnType<typeof autoUpdate> | undefined;
  private readonly localize = new LocalizeController(this);

  /** A reference to the internal popup container. */
  @query('.popup') popup!: HTMLElement;
  @query('.popup__arrow') private arrowEl!: HTMLElement;

  /**
   * The element the popup will be anchored to.
   */
  @property() anchor!: Element | string | VirtualElement;

  /**
   * Activates the positioning logic and shows the popup.
   */
  @property({ type: Boolean, reflect: true }) active = false;

  /**
   * The preferred placement of the popup.
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
    | 'left-end' = 'top';

  /**
   * Determines how the popup is positioned.
   */
  @property({ reflect: true }) strategy: 'absolute' | 'fixed' = 'absolute';

  /** The distance in pixels from which to offset the panel away from its anchor. */
  @property({ type: Number }) distance = 0;

  /** The distance in pixels from which to offset the panel along its anchor. */
  @property({ type: Number }) skidding = 0;

  /** Attaches an arrow to the popup. */
  @property({ type: Boolean }) arrow = false;

  /** The placement of the arrow. */
  @property({ attribute: 'arrow-placement' }) arrowPlacement:
    | 'start'
    | 'end'
    | 'center'
    | 'anchor' = 'anchor';

  /** The amount of padding between the arrow and the edges of the popup. */
  @property({ attribute: 'arrow-padding', type: Number }) arrowPadding = 10;

  /** When set, placement of the popup will flip to the opposite site to keep it in view. */
  @property({ type: Boolean }) flip = false;

  @property({
    attribute: 'flip-fallback-placements',
    converter: {
      fromAttribute: (value: string) => {
        return value
          .split(' ')
          .map((p) => p.trim())
          .filter((p) => p !== '');
      },
      toAttribute: (value: []) => {
        return value.join(' ');
      },
    },
  })
  flipFallbackPlacements: string | string[] = '';

  @property({ attribute: 'flip-fallback-strategy' }) flipFallbackStrategy: 'best-fit' | 'initial' =
    'best-fit';

  @property({ type: Object }) flipBoundary!: Element | Element[];

  @property({ attribute: 'flip-padding', type: Number }) flipPadding = 0;

  /** Moves the popup along the axis to keep it in view when clipped. */
  @property({ type: Boolean }) shift = false;

  @property({ type: Object }) shiftBoundary!: Element | Element[];

  @property({ attribute: 'shift-padding', type: Number }) shiftPadding = 0;

  @property({ attribute: 'auto-size' }) autoSize!: 'horizontal' | 'vertical' | 'both';

  @property() sync!: 'width' | 'height' | 'both';

  @property({ type: Object }) autoSizeBoundary!: Element | Element[];

  @property({ attribute: 'auto-size-padding', type: Number }) autoSizePadding = 0;

  @property({ attribute: 'hover-bridge', type: Boolean }) hoverBridge = false;

  async connectedCallback() {
    super.connectedCallback();
    await this.updateComplete;
    this.start();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.stop();
  }

  async updated(changedProps: Map<string, unknown>) {
    super.updated(changedProps);

    if (changedProps.has('active')) {
      if (this.active) {
        this.start();
      } else {
        this.stop();
      }
    }

    if (changedProps.has('anchor')) {
      this.handleAnchorChange();
    }

    if (this.active) {
      await this.updateComplete;
      this.reposition();
    }
  }

  private async handleAnchorChange() {
    await this.stop();

    if (this.anchor && typeof this.anchor === 'string') {
      const root = this.getRootNode() as Document | ShadowRoot;
      this.anchorEl = root.getElementById(this.anchor);
    } else if (this.anchor instanceof Element || isVirtualElement(this.anchor)) {
      this.anchorEl = this.anchor;
    } else {
      this.anchorEl = this.querySelector<HTMLElement>('[slot="anchor"]');
    }

    if (this.anchorEl instanceof HTMLSlotElement) {
      this.anchorEl = this.anchorEl.assignedElements({ flatten: true })[0] as HTMLElement;
    }

    if (this.anchorEl && this.active) {
      this.start();
    }
  }

  private start() {
    if (!this.anchorEl || !this.active) {
      return;
    }

    this.cleanup = autoUpdate(this.anchorEl, this.popup, () => {
      this.reposition();
    });
  }

  private async stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.cleanup) {
        this.cleanup();
        this.cleanup = undefined;
        this.removeAttribute('data-current-placement');
        this.style.removeProperty('--auto-size-available-width');
        this.style.removeProperty('--auto-size-available-height');
        requestAnimationFrame(() => resolve());
      } else {
        resolve();
      }
    });
  }

  /** Forces the popup to recalculate and reposition itself. */
  reposition() {
    if (!this.active || !this.anchorEl) {
      return;
    }

    const middleware = [offset({ mainAxis: this.distance, crossAxis: this.skidding })];

    if (this.sync) {
      middleware.push(
        size({
          apply: ({ rects }: { rects: { reference: { width: number; height: number } } }) => {
            const syncWidth = this.sync === 'width' || this.sync === 'both';
            const syncHeight = this.sync === 'height' || this.sync === 'both';
            this.popup.style.width = syncWidth ? `${rects.reference.width}px` : '';
            this.popup.style.height = syncHeight ? `${rects.reference.height}px` : '';
          },
        }),
      );
    } else {
      this.popup.style.width = '';
      this.popup.style.height = '';
    }

    if (this.flip) {
      middleware.push(
        flip({
          boundary: this.flipBoundary,
          fallbackPlacements: this.flipFallbackPlacements as import('@floating-ui/dom').Placement[],
          fallbackStrategy:
            this.flipFallbackStrategy === 'best-fit' ? 'bestFit' : 'initialPlacement',
          padding: this.flipPadding,
        }),
      );
    }

    if (this.shift) {
      middleware.push(
        shift({
          boundary: this.shiftBoundary,
          padding: this.shiftPadding,
        }),
      );
    }

    if (this.autoSize) {
      middleware.push(
        size({
          boundary: this.autoSizeBoundary,
          padding: this.autoSizePadding,
          apply: ({
            availableWidth,
            availableHeight,
          }: {
            availableWidth: number;
            availableHeight: number;
          }) => {
            if (this.autoSize === 'vertical' || this.autoSize === 'both') {
              this.style.setProperty('--auto-size-available-height', `${availableHeight}px`);
            } else {
              this.style.removeProperty('--auto-size-available-height');
            }

            if (this.autoSize === 'horizontal' || this.autoSize === 'both') {
              this.style.setProperty('--auto-size-available-width', `${availableWidth}px`);
            } else {
              this.style.removeProperty('--auto-size-available-width');
            }
          },
        }),
      );
    } else {
      this.style.removeProperty('--auto-size-available-width');
      this.style.removeProperty('--auto-size-available-height');
    }

    if (this.arrow) {
      middleware.push(
        arrow({
          element: this.arrowEl,
          padding: this.arrowPadding,
        }),
      );
    }

    const getOffsetParent =
      this.strategy === 'absolute'
        ? (element: Element) => platform.getOffsetParent(element, offsetParent)
        : platform.getOffsetParent;

    computePosition(this.anchorEl, this.popup, {
      placement: this.placement,
      middleware,
      strategy: this.strategy,
      platform: {
        ...platform,
        getOffsetParent,
      },
    }).then(
      ({
        x,
        y,
        middlewareData,
        placement,
      }: {
        x: number;
        y: number;
        middlewareData: Record<string, { x?: number; y?: number }>;
        placement: string;
      }) => {
        const isRtl = this.localize.dir() === 'rtl';
        const placementBase = placement.split('-')[0] as 'top' | 'right' | 'bottom' | 'left';
        const staticSide = { top: 'bottom', right: 'left', bottom: 'top', left: 'right' }[
          placementBase
        ]!;

        this.setAttribute('data-current-placement', placement);

        Object.assign(this.popup.style, {
          left: `${x}px`,
          top: `${y}px`,
        });

        if (this.arrow) {
          const arrowX = middlewareData.arrow!.x;
          const arrowY = middlewareData.arrow!.y;
          let top = '';
          let right = '';
          let bottom = '';
          let left = '';

          if (this.arrowPlacement === 'start') {
            const value =
              typeof arrowX === 'number'
                ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))`
                : '';
            top =
              typeof arrowY === 'number'
                ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))`
                : '';
            right = isRtl ? value : '';
            left = isRtl ? '' : value;
          } else if (this.arrowPlacement === 'end') {
            const value =
              typeof arrowX === 'number'
                ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))`
                : '';
            right = isRtl ? '' : value;
            left = isRtl ? value : '';
            bottom =
              typeof arrowY === 'number'
                ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))`
                : '';
          } else if (this.arrowPlacement === 'center') {
            left = typeof arrowX === 'number' ? `calc(50% - var(--arrow-size-diagonal))` : '';
            top = typeof arrowY === 'number' ? `calc(50% - var(--arrow-size-diagonal))` : '';
          } else {
            left = typeof arrowX === 'number' ? `${arrowX}px` : '';
            top = typeof arrowY === 'number' ? `${arrowY}px` : '';
          }

          Object.assign(this.arrowEl.style, {
            top,
            right,
            bottom,
            left,
            [staticSide]: 'calc(var(--arrow-size-diagonal) * -1)',
          });
        }
      },
    );

    requestAnimationFrame(() => this.updateHoverBridge());

    this.dispatchEvent(new CustomEvent('t1-reposition', { bubbles: true, composed: true }));
  }

  private updateHoverBridge = () => {
    if (this.hoverBridge && this.anchorEl) {
      const anchorRect = (this.anchorEl as Element).getBoundingClientRect();
      const popupRect = this.popup.getBoundingClientRect();
      const isVertical = this.placement.includes('top') || this.placement.includes('bottom');
      let topLeftX = 0;
      let topLeftY = 0;
      let topRightX = 0;
      let topRightY = 0;
      let bottomLeftX = 0;
      let bottomLeftY = 0;
      let bottomRightX = 0;
      let bottomRightY = 0;

      if (isVertical) {
        if (anchorRect.top < popupRect.top) {
          topLeftX = anchorRect.left;
          topLeftY = anchorRect.bottom;
          topRightX = anchorRect.right;
          topRightY = anchorRect.bottom;
          bottomLeftX = popupRect.left;
          bottomLeftY = popupRect.top;
          bottomRightX = popupRect.right;
          bottomRightY = popupRect.top;
        } else {
          topLeftX = popupRect.left;
          topLeftY = popupRect.bottom;
          topRightX = popupRect.right;
          topRightY = popupRect.bottom;
          bottomLeftX = anchorRect.left;
          bottomLeftY = anchorRect.top;
          bottomRightX = anchorRect.right;
          bottomRightY = anchorRect.top;
        }
      } else {
        if (anchorRect.left < popupRect.left) {
          topLeftX = anchorRect.right;
          topLeftY = anchorRect.top;
          topRightX = popupRect.left;
          topRightY = popupRect.top;
          bottomLeftX = anchorRect.right;
          bottomLeftY = anchorRect.bottom;
          bottomRightX = popupRect.left;
          bottomRightY = popupRect.bottom;
        } else {
          topLeftX = popupRect.right;
          topLeftY = popupRect.top;
          topRightX = anchorRect.left;
          topRightY = anchorRect.top;
          bottomLeftX = popupRect.right;
          bottomLeftY = popupRect.bottom;
          bottomRightX = anchorRect.left;
          bottomRightY = anchorRect.bottom;
        }
      }

      this.style.setProperty('--hover-bridge-top-left-x', `${topLeftX}px`);
      this.style.setProperty('--hover-bridge-top-left-y', `${topLeftY}px`);
      this.style.setProperty('--hover-bridge-top-right-x', `${topRightX}px`);
      this.style.setProperty('--hover-bridge-top-right-y', `${topRightY}px`);
      this.style.setProperty('--hover-bridge-bottom-left-x', `${bottomLeftX}px`);
      this.style.setProperty('--hover-bridge-bottom-left-y', `${bottomLeftY}px`);
      this.style.setProperty('--hover-bridge-bottom-right-x', `${bottomRightX}px`);
      this.style.setProperty('--hover-bridge-bottom-right-y', `${bottomRightY}px`);
    }
  };

  render() {
    return html`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${classMap({
          'popup-hover-bridge': true,
          'popup-hover-bridge--visible': this.hoverBridge && this.active,
        })}
      ></span>

      <div
        part="popup"
        class=${classMap({
          popup: true,
          'popup--active': this.active,
          'popup--fixed': this.strategy === 'fixed',
          'popup--has-arrow': this.arrow,
        })}
      >
        <slot></slot>
        ${this.arrow ? html`<div part="arrow" class="popup__arrow" role="presentation"></div>` : ''}
      </div>
    `;
  }
}
