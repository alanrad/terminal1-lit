import T1FormatNumber from './format-number.component';
export * from './format-number.component';
export default T1FormatNumber;

if (!customElements.get('t1-format-number')) {
  customElements.define('t1-format-number', T1FormatNumber);
}

declare global {
  interface HTMLElementTagNameMap {
    't1-format-number': T1FormatNumber;
  }
}
