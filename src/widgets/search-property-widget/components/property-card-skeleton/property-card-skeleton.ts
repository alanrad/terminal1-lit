import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import styles from './property-card-skeleton.styles';
import type { CSSResultGroup } from 'lit';
import '@components/t1-card';
import '@components/t1-skeleton';

const componentStyles = css`
  :host {
    box-sizing: border-box;
  }
  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }
`;

@customElement('property-card-skeleton')
export default class PropertyCardSkeleton extends LitElement {
  static styles: CSSResultGroup = [componentStyles, styles];

  render() {
    return html`
      <t1-card>
        <t1-skeleton slot="image" effect="sheen" class="skeleton-image"></t1-skeleton>
        <div class="card-content">
          <div class="card-content__main">
            <t1-skeleton effect="sheen" class="skeleton-name"></t1-skeleton>
            <t1-skeleton effect="sheen" class="skeleton-city"></t1-skeleton>
            <t1-skeleton effect="sheen" class="skeleton-rating"></t1-skeleton>
            <div class="skeleton-facilities">
              <t1-skeleton effect="sheen" class="skeleton-facility"></t1-skeleton>
              <t1-skeleton effect="sheen" class="skeleton-facility"></t1-skeleton>
              <t1-skeleton effect="sheen" class="skeleton-facility"></t1-skeleton>
            </div>
          </div>
          <div class="skeleton-footer">
            <t1-skeleton effect="sheen" class="skeleton-price"></t1-skeleton>
            <t1-skeleton effect="sheen" class="skeleton-button"></t1-skeleton>
          </div>
        </div>
      </t1-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'property-card-skeleton': PropertyCardSkeleton;
  }
}
