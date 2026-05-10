import { registerTranslation } from '../src/utils/localize';
import baseTranslation from './en.js';
import type { Translation } from '../src/utils/localize';

const translation: Translation = {
  ...baseTranslation,
  $code: 'en-GB',
  $name: 'English (United Kingdom)',

  selectAColorFromTheScreen: 'Select a colour from the screen',
  toggleColorFormat: 'Toggle colour format',
};

registerTranslation(translation);

export default translation;
