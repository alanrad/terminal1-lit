// Public API — re-exported for consumers who install via npm rather than CDN
export { CounterWidget } from './widgets/counter-widget';
export { default as T1Icon } from './components/t1-icon';
export { default as T1Input } from './components/t1-input';
export { registerIconLibrary, unregisterIconLibrary } from './components/t1-icon/icon.library';
export { registerTranslation } from './utils/localize';
export { signal, computed, effect } from './state/signal';
export { SignalMixin } from './state/lit-signal';
export type { WidgetConfig } from './services/api.service';
