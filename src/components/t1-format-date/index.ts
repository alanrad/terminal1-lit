import T1FormatDate from './format-date.component';
export * from './format-date.component';
export default T1FormatDate;

if (!customElements.get('t1-format-date')) {
  customElements.define('t1-format-date', T1FormatDate);
}

declare global {
  interface HTMLElementTagNameMap {
    't1-format-date': T1FormatDate;
  }
}
