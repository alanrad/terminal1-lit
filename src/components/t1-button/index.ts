import '@components/t1-icon';
import '@components/t1-spinner';
import T1Button from './button.component';
export * from './button.component';
export default T1Button;

customElements.define('t1-button', T1Button);

declare global {
  interface HTMLElementTagNameMap {
    't1-button': T1Button;
  }
}
