import '@components/t1-icon';
import T1IconButton from './icon-button.component';
export * from './icon-button.component';
export default T1IconButton;

customElements.define('t1-icon-button', T1IconButton);

declare global {
  interface HTMLElementTagNameMap {
    't1-icon-button': T1IconButton;
  }
}
