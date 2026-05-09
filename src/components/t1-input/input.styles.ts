import { css } from 'lit';

export default css`
  .form-control .form-control__label { display: none; }
  .form-control--has-label .form-control__label { display: block; margin-bottom: 0.25rem; font-size: var(--t1-input-label-font-size-medium); color: var(--t1-input-label-color); }
  .form-control--small.form-control--has-label .form-control__label { font-size: var(--t1-input-label-font-size-small); }
  .form-control--large.form-control--has-label .form-control__label { font-size: var(--t1-input-label-font-size-large); }
  .form-control__help-text { display: none; }
  .form-control--has-help-text .form-control__help-text { display: block; margin-top: 0.25rem; font-size: var(--t1-input-help-text-font-size-medium); color: var(--t1-input-help-text-color); }
  .form-control--small.form-control--has-help-text .form-control__help-text { font-size: var(--t1-input-help-text-font-size-small); }
  .form-control--large.form-control--has-help-text .form-control__help-text { font-size: var(--t1-input-help-text-font-size-large); }

  :host {
    display: block;
  }

  .input {
    flex: 1 1 auto;
    display: inline-flex;
    align-items: stretch;
    justify-content: start;
    position: relative;
    width: 100%;
    font-family: var(--t1-input-font-family);
    font-weight: var(--t1-input-font-weight);
    letter-spacing: var(--t1-input-letter-spacing);
    vertical-align: middle;
    overflow: hidden;
    cursor: text;
    transition:
      var(--t1-transition-fast) color,
      var(--t1-transition-fast) border,
      var(--t1-transition-fast) box-shadow,
      var(--t1-transition-fast) background-color;
  }

  /* Standard inputs */
  .input--standard {
    background-color: var(--t1-input-background-color);
    border: solid var(--t1-input-border-width) var(--t1-input-border-color);
  }

  .input--standard:hover:not(.input--disabled) {
    background-color: var(--t1-input-background-color-hover);
    border-color: var(--t1-input-border-color-hover);
  }

  .input--standard.input--focused:not(.input--disabled) {
    background-color: var(--t1-input-background-color-focus);
    border-color: var(--t1-input-border-color-focus);
    box-shadow: 0 0 0 var(--t1-focus-ring-width) var(--t1-input-focus-ring-color);
  }

  .input--standard.input--focused:not(.input--disabled) .input__control {
    color: var(--t1-input-color-focus);
  }

  .input--standard.input--disabled {
    background-color: var(--t1-input-background-color-disabled);
    border-color: var(--t1-input-border-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
  }

  .input--standard.input--disabled .input__control {
    color: var(--t1-input-color-disabled);
  }

  .input--standard.input--disabled .input__control::placeholder {
    color: var(--t1-input-placeholder-color-disabled);
  }

  /* Filled inputs */
  .input--filled {
    border: none;
    background-color: var(--t1-input-filled-background-color);
    color: var(--t1-input-color);
  }

  .input--filled:hover:not(.input--disabled) {
    background-color: var(--t1-input-filled-background-color-hover);
  }

  .input--filled.input--focused:not(.input--disabled) {
    background-color: var(--t1-input-filled-background-color-focus);
    outline: var(--t1-focus-ring);
    outline-offset: var(--t1-focus-ring-offset);
  }

  .input--filled.input--disabled {
    background-color: var(--t1-input-filled-background-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
  }

  .input__control {
    flex: 1 1 auto;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    min-width: 0;
    height: 100%;
    color: var(--t1-input-color);
    border: none;
    background: inherit;
    box-shadow: none;
    padding: 0;
    margin: 0;
    cursor: inherit;
    -webkit-appearance: none;
  }

  .input__control::-webkit-search-decoration,
  .input__control::-webkit-search-cancel-button,
  .input__control::-webkit-search-results-button,
  .input__control::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }

  .input__control:-webkit-autofill,
  .input__control:-webkit-autofill:hover,
  .input__control:-webkit-autofill:focus,
  .input__control:-webkit-autofill:active {
    box-shadow: 0 0 0 var(--t1-input-height-large) var(--t1-input-background-color-hover) inset !important;
    -webkit-text-fill-color: var(--t1-color-primary-500);
    caret-color: var(--t1-input-color);
  }

  .input--filled .input__control:-webkit-autofill,
  .input--filled .input__control:-webkit-autofill:hover,
  .input--filled .input__control:-webkit-autofill:focus,
  .input--filled .input__control:-webkit-autofill:active {
    box-shadow: 0 0 0 var(--t1-input-height-large) var(--t1-input-filled-background-color) inset !important;
  }

  .input__control::placeholder {
    color: var(--t1-input-placeholder-color);
    user-select: none;
    -webkit-user-select: none;
  }

  .input:hover:not(.input--disabled) .input__control {
    color: var(--t1-input-color-hover);
  }

  .input__control:focus {
    outline: none;
  }

  .input__prefix,
  .input__suffix {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    cursor: default;
  }

  .input__prefix ::slotted(t1-icon),
  .input__suffix ::slotted(t1-icon) {
    color: var(--t1-input-icon-color);
  }

  /*
   * Size modifiers
   */

  .input--small {
    border-radius: var(--t1-input-border-radius-small);
    font-size: var(--t1-input-font-size-small);
    height: var(--t1-input-height-small);
  }

  .input--small .input__control {
    height: calc(var(--t1-input-height-small) - var(--t1-input-border-width) * 2);
    padding: 0 var(--t1-input-spacing-small);
  }

  .input--small .input__clear,
  .input--small .input__password-toggle {
    width: calc(1em + var(--t1-input-spacing-small) * 2);
  }

  .input--small.input--has-prefix .input__prefix {
    padding-inline-start: var(--t1-input-spacing-small);
  }

  .input--small.input--has-suffix .input__suffix {
    padding-inline-end: var(--t1-input-spacing-small);
  }

  .input--medium {
    border-radius: var(--t1-input-border-radius-medium);
    font-size: var(--t1-input-font-size-medium);
    height: var(--t1-input-height-medium);
  }

  .input--medium .input__control {
    height: calc(var(--t1-input-height-medium) - var(--t1-input-border-width) * 2);
    padding: 0 var(--t1-input-spacing-medium);
  }

  .input--medium .input__clear,
  .input--medium .input__password-toggle {
    width: calc(1em + var(--t1-input-spacing-medium) * 2);
  }

  .input--medium.input--has-prefix .input__prefix {
    padding-inline-start: var(--t1-input-spacing-medium);
  }

  .input--medium.input--has-suffix .input__suffix {
    padding-inline-end: var(--t1-input-spacing-medium);
  }

  .input--large {
    border-radius: var(--t1-input-border-radius-large);
    font-size: var(--t1-input-font-size-large);
    height: var(--t1-input-height-large);
  }

  .input--large .input__control {
    height: calc(var(--t1-input-height-large) - var(--t1-input-border-width) * 2);
    padding: 0 var(--t1-input-spacing-large);
  }

  .input--large .input__clear,
  .input--large .input__password-toggle {
    width: calc(1em + var(--t1-input-spacing-large) * 2);
  }

  .input--large.input--has-prefix .input__prefix {
    padding-inline-start: var(--t1-input-spacing-large);
  }

  .input--large.input--has-suffix .input__suffix {
    padding-inline-end: var(--t1-input-spacing-large);
  }

  /*
   * Pill modifier
   */

  .input--pill.input--small {
    border-radius: var(--t1-input-height-small);
  }

  .input--pill.input--medium {
    border-radius: var(--t1-input-height-medium);
  }

  .input--pill.input--large {
    border-radius: var(--t1-input-height-large);
  }

  /*
   * Clearable + Password Toggle
   */

  .input__clear,
  .input__password-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: inherit;
    color: var(--t1-input-icon-color);
    border: none;
    background: none;
    padding: 0;
    transition: var(--t1-transition-fast) color;
    cursor: pointer;
  }

  .input__clear:hover,
  .input__password-toggle:hover {
    color: var(--t1-input-icon-color-hover);
  }

  .input__clear:focus,
  .input__password-toggle:focus {
    outline: none;
  }

  /* Don't show the browser's password toggle in Edge */
  ::-ms-reveal {
    display: none;
  }

  /* Hide the built-in number spinner */
  .input--no-spin-buttons input[type='number']::-webkit-outer-spin-button,
  .input--no-spin-buttons input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    display: none;
  }

  .input--no-spin-buttons input[type='number'] {
    -moz-appearance: textfield;
  }
`;
