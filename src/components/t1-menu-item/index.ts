import '@components/t1-icon/index';
import '@components/t1-popup/index';
import '@components/t1-spinner/index';
import T1MenuItem from './menu-item.component';
export * from './menu-item.component';
export default T1MenuItem;

customElements.define('t1-menu-item', T1MenuItem);

declare global {
  interface HTMLElementTagNameMap {
    't1-menu-item': T1MenuItem;
  }
}
