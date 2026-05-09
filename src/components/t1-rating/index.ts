import T1Rating from './rating.component';
export * from './rating.component';
export default T1Rating;

customElements.define('t1-rating', T1Rating);

declare global {
  interface HTMLElementTagNameMap {
    't1-rating': T1Rating;
  }
}
