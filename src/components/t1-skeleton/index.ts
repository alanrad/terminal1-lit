import T1Skeleton from './skeleton.component';
export * from './skeleton.component';
export default T1Skeleton;

if (!customElements.get('t1-skeleton')) {
  customElements.define('t1-skeleton', T1Skeleton);
}

declare global {
  interface HTMLElementTagNameMap {
    't1-skeleton': T1Skeleton;
  }
}
