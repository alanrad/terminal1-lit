import { LitElement, html, css } from 'lit';
import styles from './spinner.styles';
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

export default class T1Spinner extends LitElement {
  static styles: CSSResultGroup = [componentStyles, styles];

  render() {
    return html`
      <svg part="base" class="spinner" role="progressbar" aria-label="Loading">
        <circle class="spinner__track"></circle>
        <circle class="spinner__indicator"></circle>
      </svg>
    `;
  }
}
