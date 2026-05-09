import T1Spinner from './spinner.component';
export * from './spinner.component';
export default T1Spinner;

customElements.define('t1-spinner', T1Spinner);

declare global {
  interface HTMLElementTagNameMap {
    't1-spinner': T1Spinner;
  }
}
