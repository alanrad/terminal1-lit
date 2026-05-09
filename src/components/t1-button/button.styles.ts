import { css } from 'lit';

export default css`
  :host {
    display: inline-block;
    position: relative;
    width: auto;
    cursor: pointer;
  }

  .button {
    display: inline-flex;
    align-items: stretch;
    justify-content: center;
    width: 100%;
    border-style: solid;
    border-width: var(--t1-input-border-width);
    font-family: var(--t1-input-font-family);
    font-weight: var(--t1-font-weight-semibold);
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    white-space: nowrap;
    vertical-align: middle;
    padding: 0;
    transition:
      var(--t1-transition-x-fast) background-color,
      var(--t1-transition-x-fast) color,
      var(--t1-transition-x-fast) border,
      var(--t1-transition-x-fast) box-shadow;
    cursor: inherit;
  }

  .button::-moz-focus-inner {
    border: 0;
  }

  .button:focus {
    outline: none;
  }

  .button:focus-visible {
    outline: var(--t1-focus-ring);
    outline-offset: var(--t1-focus-ring-offset);
  }

  .button--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .button--disabled * {
    pointer-events: none;
  }

  .button__prefix,
  .button__suffix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    pointer-events: none;
  }

  .button__label {
    display: inline-block;
  }

  .button__label::slotted(t1-icon) {
    vertical-align: -2px;
  }

  /* Default */
  .button--standard.button--default {
    background-color: var(--t1-color-neutral-0);
    border-color: var(--t1-input-border-color);
    color: var(--t1-color-neutral-700);
  }

  .button--standard.button--default:hover:not(.button--disabled) {
    background-color: var(--t1-color-primary-50);
    border-color: var(--t1-color-primary-300);
    color: var(--t1-color-primary-700);
  }

  .button--standard.button--default:active:not(.button--disabled) {
    background-color: var(--t1-color-primary-100);
    border-color: var(--t1-color-primary-400);
    color: var(--t1-color-primary-700);
  }

  /* Primary */
  .button--standard.button--primary {
    background-color: var(--t1-color-primary-600);
    border-color: var(--t1-color-primary-600);
    color: var(--t1-color-neutral-0);
  }

  .button--standard.button--primary:hover:not(.button--disabled) {
    background-color: var(--t1-color-primary-500);
    border-color: var(--t1-color-primary-500);
    color: var(--t1-color-neutral-0);
  }

  .button--standard.button--primary:active:not(.button--disabled) {
    background-color: var(--t1-color-primary-600);
    border-color: var(--t1-color-primary-600);
    color: var(--t1-color-neutral-0);
  }

  /* Success */
  .button--standard.button--success {
    background-color: var(--t1-color-success-600);
    border-color: var(--t1-color-success-600);
    color: var(--t1-color-neutral-0);
  }

  .button--standard.button--success:hover:not(.button--disabled) {
    background-color: var(--t1-color-success-500);
    border-color: var(--t1-color-success-500);
    color: var(--t1-color-neutral-0);
  }

  .button--standard.button--success:active:not(.button--disabled) {
    background-color: var(--t1-color-success-600);
    border-color: var(--t1-color-success-600);
    color: var(--t1-color-neutral-0);
  }

  /* Neutral */
  .button--standard.button--neutral {
    background-color: var(--t1-color-neutral-600);
    border-color: var(--t1-color-neutral-600);
    color: var(--t1-color-neutral-0);
  }

  .button--standard.button--neutral:hover:not(.button--disabled) {
    background-color: var(--t1-color-neutral-500);
    border-color: var(--t1-color-neutral-500);
    color: var(--t1-color-neutral-0);
  }

  .button--standard.button--neutral:active:not(.button--disabled) {
    background-color: var(--t1-color-neutral-600);
    border-color: var(--t1-color-neutral-600);
    color: var(--t1-color-neutral-0);
  }

  /* Warning */
  .button--standard.button--warning {
    background-color: var(--t1-color-warning-600);
    border-color: var(--t1-color-warning-600);
    color: var(--t1-color-neutral-0);
  }

  .button--standard.button--warning:hover:not(.button--disabled) {
    background-color: var(--t1-color-warning-500);
    border-color: var(--t1-color-warning-500);
    color: var(--t1-color-neutral-0);
  }

  .button--standard.button--warning:active:not(.button--disabled) {
    background-color: var(--t1-color-warning-600);
    border-color: var(--t1-color-warning-600);
    color: var(--t1-color-neutral-0);
  }

  /* Danger */
  .button--standard.button--danger {
    background-color: var(--t1-color-danger-600);
    border-color: var(--t1-color-danger-600);
    color: var(--t1-color-neutral-0);
  }

  .button--standard.button--danger:hover:not(.button--disabled) {
    background-color: var(--t1-color-danger-500);
    border-color: var(--t1-color-danger-500);
    color: var(--t1-color-neutral-0);
  }

  .button--standard.button--danger:active:not(.button--disabled) {
    background-color: var(--t1-color-danger-600);
    border-color: var(--t1-color-danger-600);
    color: var(--t1-color-neutral-0);
  }

  /* Outline buttons */
  .button--outline {
    background: none;
    border: solid 1px;
  }

  .button--outline.button--default {
    border-color: var(--t1-input-border-color);
    color: var(--t1-color-neutral-700);
  }

  .button--outline.button--default:hover:not(.button--disabled) {
    border-color: var(--t1-color-primary-600);
    background-color: var(--t1-color-primary-600);
    color: var(--t1-color-neutral-0);
  }

  .button--outline.button--default:active:not(.button--disabled) {
    border-color: var(--t1-color-primary-700);
    background-color: var(--t1-color-primary-700);
    color: var(--t1-color-neutral-0);
  }

  .button--outline.button--primary {
    border-color: var(--t1-color-primary-600);
    color: var(--t1-color-primary-600);
  }

  .button--outline.button--primary:hover:not(.button--disabled) {
    background-color: var(--t1-color-primary-600);
    color: var(--t1-color-neutral-0);
  }

  .button--outline.button--primary:active:not(.button--disabled) {
    border-color: var(--t1-color-primary-700);
    background-color: var(--t1-color-primary-700);
    color: var(--t1-color-neutral-0);
  }

  .button--outline.button--success {
    border-color: var(--t1-color-success-600);
    color: var(--t1-color-success-600);
  }

  .button--outline.button--success:hover:not(.button--disabled) {
    background-color: var(--t1-color-success-600);
    color: var(--t1-color-neutral-0);
  }

  .button--outline.button--success:active:not(.button--disabled) {
    border-color: var(--t1-color-success-700);
    background-color: var(--t1-color-success-700);
    color: var(--t1-color-neutral-0);
  }

  .button--outline.button--neutral {
    border-color: var(--t1-color-neutral-600);
    color: var(--t1-color-neutral-600);
  }

  .button--outline.button--neutral:hover:not(.button--disabled) {
    background-color: var(--t1-color-neutral-600);
    color: var(--t1-color-neutral-0);
  }

  .button--outline.button--neutral:active:not(.button--disabled) {
    border-color: var(--t1-color-neutral-700);
    background-color: var(--t1-color-neutral-700);
    color: var(--t1-color-neutral-0);
  }

  .button--outline.button--warning {
    border-color: var(--t1-color-warning-600);
    color: var(--t1-color-warning-600);
  }

  .button--outline.button--warning:hover:not(.button--disabled) {
    background-color: var(--t1-color-warning-600);
    color: var(--t1-color-neutral-0);
  }

  .button--outline.button--warning:active:not(.button--disabled) {
    border-color: var(--t1-color-warning-700);
    background-color: var(--t1-color-warning-700);
    color: var(--t1-color-neutral-0);
  }

  .button--outline.button--danger {
    border-color: var(--t1-color-danger-600);
    color: var(--t1-color-danger-600);
  }

  .button--outline.button--danger:hover:not(.button--disabled) {
    background-color: var(--t1-color-danger-600);
    color: var(--t1-color-neutral-0);
  }

  .button--outline.button--danger:active:not(.button--disabled) {
    border-color: var(--t1-color-danger-700);
    background-color: var(--t1-color-danger-700);
    color: var(--t1-color-neutral-0);
  }

  /* Text buttons */
  .button--text {
    background-color: transparent;
    border-color: transparent;
    color: var(--t1-color-primary-600);
  }

  .button--text:hover:not(.button--disabled) {
    background-color: transparent;
    border-color: transparent;
    color: var(--t1-color-primary-500);
  }

  .button--text:active:not(.button--disabled) {
    background-color: transparent;
    border-color: transparent;
    color: var(--t1-color-primary-700);
  }

  /* Size modifiers */
  .button--small {
    height: auto;
    min-height: var(--t1-input-height-small);
    font-size: var(--t1-button-font-size-small);
    line-height: calc(var(--t1-input-height-small) - var(--t1-input-border-width) * 2);
    border-radius: var(--t1-input-border-radius-small);
  }

  .button--medium {
    height: auto;
    min-height: var(--t1-input-height-medium);
    font-size: var(--t1-button-font-size-medium);
    line-height: calc(var(--t1-input-height-medium) - var(--t1-input-border-width) * 2);
    border-radius: var(--t1-input-border-radius-medium);
  }

  .button--large {
    height: auto;
    min-height: var(--t1-input-height-large);
    font-size: var(--t1-button-font-size-large);
    line-height: calc(var(--t1-input-height-large) - var(--t1-input-border-width) * 2);
    border-radius: var(--t1-input-border-radius-large);
  }

  /* Pill modifier */
  .button--pill.button--small {
    border-radius: var(--t1-input-height-small);
  }

  .button--pill.button--medium {
    border-radius: var(--t1-input-height-medium);
  }

  .button--pill.button--large {
    border-radius: var(--t1-input-height-large);
  }

  /* Circle modifier */
  .button--circle {
    padding-left: 0;
    padding-right: 0;
  }

  .button--circle.button--small {
    width: var(--t1-input-height-small);
    border-radius: 50%;
  }

  .button--circle.button--medium {
    width: var(--t1-input-height-medium);
    border-radius: 50%;
  }

  .button--circle.button--large {
    width: var(--t1-input-height-large);
    border-radius: 50%;
  }

  .button--circle .button__prefix,
  .button--circle .button__suffix,
  .button--circle .button__caret {
    display: none;
  }

  /* Caret modifier */
  .button--caret .button__suffix {
    display: none;
  }

  .button--caret .button__caret {
    height: auto;
  }

  /* Loading modifier */
  .button--loading {
    position: relative;
    cursor: wait;
  }

  .button--loading .button__prefix,
  .button--loading .button__label,
  .button--loading .button__suffix,
  .button--loading .button__caret {
    visibility: hidden;
  }

  .button--loading t1-spinner {
    --indicator-color: currentColor;
    position: absolute;
    font-size: 1em;
    height: 1em;
    width: 1em;
    top: calc(50% - 0.5em);
    left: calc(50% - 0.5em);
  }

  /* Badges */
  .button ::slotted(t1-badge) {
    position: absolute;
    top: 0;
    right: 0;
    translate: 50% -50%;
    pointer-events: none;
  }

  .button--rtl ::slotted(t1-badge) {
    right: auto;
    left: 0;
    translate: -50% -50%;
  }

  /* Button spacing */
  .button--has-label.button--small .button__label {
    padding: 0 var(--t1-spacing-small);
  }

  .button--has-label.button--medium .button__label {
    padding: 0 var(--t1-spacing-medium);
  }

  .button--has-label.button--large .button__label {
    padding: 0 var(--t1-spacing-large);
  }

  .button--has-prefix.button--small {
    padding-inline-start: var(--t1-spacing-x-small);
  }

  .button--has-prefix.button--small .button__label {
    padding-inline-start: var(--t1-spacing-x-small);
  }

  .button--has-prefix.button--medium {
    padding-inline-start: var(--t1-spacing-small);
  }

  .button--has-prefix.button--medium .button__label {
    padding-inline-start: var(--t1-spacing-small);
  }

  .button--has-prefix.button--large {
    padding-inline-start: var(--t1-spacing-small);
  }

  .button--has-prefix.button--large .button__label {
    padding-inline-start: var(--t1-spacing-small);
  }

  .button--has-suffix.button--small,
  .button--caret.button--small {
    padding-inline-end: var(--t1-spacing-x-small);
  }

  .button--has-suffix.button--small .button__label,
  .button--caret.button--small .button__label {
    padding-inline-end: var(--t1-spacing-x-small);
  }

  .button--has-suffix.button--medium,
  .button--caret.button--medium {
    padding-inline-end: var(--t1-spacing-small);
  }

  .button--has-suffix.button--medium .button__label,
  .button--caret.button--medium .button__label {
    padding-inline-end: var(--t1-spacing-small);
  }

  .button--has-suffix.button--large,
  .button--caret.button--large {
    padding-inline-end: var(--t1-spacing-small);
  }

  .button--has-suffix.button--large .button__label,
  .button--caret.button--large .button__label {
    padding-inline-end: var(--t1-spacing-small);
  }
`;
