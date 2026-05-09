import T1Alert from './alert.component';
export * from './alert.component';
export default T1Alert;

if (!customElements.get('t1-alert')) {
  customElements.define('t1-alert', T1Alert);
}

declare global {
  interface HTMLElementTagNameMap {
    't1-alert': T1Alert;
  }
}
