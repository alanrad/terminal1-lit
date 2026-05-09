import '../t1-icon/index';
import '../t1-popup/index';
import '../t1-tag/index';
import '../t1-option/index';
import T1Select from './select.component';

if (!customElements.get('t1-select')) {
  customElements.define('t1-select', T1Select);
}

export default T1Select;
