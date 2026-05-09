import T1Card from './card.component';
export * from './card.component';
export default T1Card;

customElements.define('t1-card', T1Card);

declare global {
  interface HTMLElementTagNameMap {
    't1-card': T1Card;
  }
}
