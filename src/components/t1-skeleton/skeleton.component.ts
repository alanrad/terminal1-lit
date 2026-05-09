import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { property } from 'lit/decorators.js';
import styles from './skeleton.styles';
import type { CSSResultGroup } from 'lit';

const componentStyles = css`
  :host { box-sizing: border-box; }
  :host *, :host *::before, :host *::after { box-sizing: inherit; }
  [hidden] { display: none !important; }
`;

export default class T1Skeleton extends LitElement {
  static styles: CSSResultGroup = [componentStyles, styles];

  /** Determines which effect the skeleton will use. */
  @property() effect: 'pulse' | 'sheen' | 'none' = 'none';

  render() {
    return html`
      <div
        part="base"
        class=${classMap({
          skeleton: true,
          'skeleton--pulse': this.effect === 'pulse',
          'skeleton--sheen': this.effect === 'sheen',
        })}
      >
        <div part="indicator" class="skeleton__indicator"></div>
      </div>
    `;
  }
}
