import T1Badge from './badge.component';
export * from './badge.component';
export default T1Badge;

customElements.define('t1-badge', T1Badge);

declare global {
  interface HTMLElementTagNameMap {
    't1-badge': T1Badge;
  }
}
