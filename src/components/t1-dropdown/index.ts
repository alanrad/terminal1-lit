import '@components/t1-popup/index';
import T1Dropdown from './dropdown.component';
export * from './dropdown.component';
export default T1Dropdown;

customElements.define('t1-dropdown', T1Dropdown);

declare global {
  interface HTMLElementTagNameMap {
    't1-dropdown': T1Dropdown;
  }
}
