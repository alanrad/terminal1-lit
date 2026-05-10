import { registerTranslation } from '../src/utils/localize';
import baseTranslation from './de.js';
import type { Translation } from '../src/utils/localize';

const translation: Translation = {
  ...baseTranslation,
  $code: 'de-CH',
  $name: 'Deutsch (Schweiz)',

  close: 'Schliessen',
  resize: 'Grösse ändern',
};

registerTranslation(translation);

export default translation;
