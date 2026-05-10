import '../t1-icon';
import '../t1-popup';
import '../t1-tag';
import '../t1-option';
import T1Select from './select.component';

if (!customElements.get('t1-select')) {
  customElements.define('t1-select', T1Select);
}

export default T1Select;
