import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import styles from './property-card.styles';
import type { CSSResultGroup } from 'lit';
import type { TransformedProperty } from '@services/property.service';
import { getPropertyIcon } from '../../utils';
import '@components/t1-card';
import '@components/t1-button';
import '@components/t1-rating';
import '@components/t1-icon';
import '@components/t1-tag';
import '@components/t1-alert';

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

@customElement('property-card')
export default class PropertyCard extends LitElement {
  static styles: CSSResultGroup = [componentStyles, styles];

  @property({ attribute: false }) selectedProperty: TransformedProperty | null = null;

  @state() private _showAlert = false;

  updated(changedProps: Map<string, unknown>) {
    if (changedProps.has('selectedProperty')) {
      this._showAlert = false;
    }
  }

  private _handleMoreInfo = () => {
    this._showAlert = true;
  };

  render() {
    if (!this.selectedProperty) {
      return html``;
    }

    const p = this.selectedProperty;
    const visibleFacilities = p.facilities.slice(0, 3);
    const extraCount = p.facilities.length - visibleFacilities.length;

    return html`
      <t1-card>
        <div slot="image" class="card-image">
          <t1-icon name=${getPropertyIcon(p.propertyType)} class="card-image__icon"></t1-icon>
          <t1-tag class="card-image__tag">${p.propertyType}</t1-tag>
        </div>
        <div class="card-content">
          <div class="card-content__main">
            <h3 class="card-content__name">${p.name}</h3>
            <span class="card-content__city">${p.city}</span>
            <t1-rating .value=${p.rating} precision="0.5" readonly></t1-rating>
            <ul class="card-content__facilities">
              ${visibleFacilities.map(
                (facility) => html`
                  <li class="card-content__facility">
                    <t1-icon name="check-circle-fill"></t1-icon>
                    ${facility}
                  </li>
                `,
              )}
            </ul>
            ${extraCount > 0
              ? html`<p class="card-content__more">+ ${extraCount} more facilities</p>`
              : ''}
          </div>
          <div class="card-content__footer">
            <div class="card-content__price">
              <span class="card-content__price-label">from</span>
              <span class="card-content__price-amount">
                ${p.price.currency} $${p.price.total.toLocaleString()}
              </span>
            </div>
            <t1-button variant="danger" pill size="medium" @click=${this._handleMoreInfo}
              >More Info</t1-button
            >
          </div>
        </div>
      </t1-card>
      ${this._showAlert
        ? html`
            <t1-alert
              variant="neutral"
              open
              closable
              duration="3000"
              style="margin-top: var(--t1-spacing-medium)"
              @t1-after-hide=${() => {
                this._showAlert = false;
              }}
            >
              <t1-icon slot="icon" name="info-circle"></t1-icon>
              Full property details are not available at this time. Please check back later or
              contact our support team for assistance.
            </t1-alert>
          `
        : ''}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'property-card': PropertyCard;
  }
}
