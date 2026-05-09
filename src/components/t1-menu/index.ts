import T1Menu from './menu.component';
export * from './menu.component';
export default T1Menu;

customElements.define('t1-menu', T1Menu);

declare global {
  interface HTMLElementTagNameMap {
    't1-menu': T1Menu;
  }
}
