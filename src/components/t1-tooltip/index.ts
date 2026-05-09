import '../t1-popup/index';
import T1Tooltip from './tooltip.component';
export * from './tooltip.component';
export default T1Tooltip;

if (!customElements.get('t1-tooltip')) {
  customElements.define('t1-tooltip', T1Tooltip);
}

declare global {
  interface HTMLElementTagNameMap {
    't1-tooltip': T1Tooltip;
  }
}
