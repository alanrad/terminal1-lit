import T1Avatar from './avatar.component';
export * from './avatar.component';
export default T1Avatar;

customElements.define('t1-avatar', T1Avatar);

declare global {
  interface HTMLElementTagNameMap {
    't1-avatar': T1Avatar;
  }
}
