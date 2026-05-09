import T1Icon from './icon.component';
export * from './icon.component';
export * from './icon.library';
export default T1Icon;

customElements.define('t1-icon', T1Icon);

declare global {
  interface HTMLElementTagNameMap {
    't1-icon': T1Icon;
  }
}
