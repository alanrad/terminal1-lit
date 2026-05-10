import '@components/t1-icon';
import '@components/t1-popup';
import '@components/t1-spinner';
import T1MenuItem from './menu-item.component';
export * from './menu-item.component';
export default T1MenuItem;

customElements.define('t1-menu-item', T1MenuItem);

declare global {
  interface HTMLElementTagNameMap {
    't1-menu-item': T1MenuItem;
  }
}
