import T1Popup from './popup.component';
export * from './popup.component';
export default T1Popup;

customElements.define('t1-popup', T1Popup);

declare global {
  interface HTMLElementTagNameMap {
    't1-popup': T1Popup;
  }
}
