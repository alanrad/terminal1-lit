import '../t1-icon';
import T1Option from './option.component';

if (!customElements.get('t1-option')) {
  customElements.define('t1-option', T1Option);
}

export default T1Option;
