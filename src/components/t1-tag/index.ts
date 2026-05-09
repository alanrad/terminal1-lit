import '../t1-icon-button/index';
import T1Tag from './tag.component';

if (!customElements.get('t1-tag')) {
  customElements.define('t1-tag', T1Tag);
}

export default T1Tag;
