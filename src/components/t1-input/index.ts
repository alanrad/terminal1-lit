import T1Input from './input.component';
export * from './input.component';
export default T1Input;

customElements.define('t1-input', T1Input);

declare global {
  interface HTMLElementTagNameMap {
    't1-input': T1Input;
  }
}
