import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  .select {
    display: inline-flex;
    width: 100%;
    position: relative;
    vertical-align: middle;
  }

  .select::part(popup) {
    z-index: var(--t1-z-index-dropdown);
  }

  /* Combobox trigger */
  .select__combobox {
    flex: 1;
    display: flex;
    width: 100%;
    min-width: 0;
    position: relative;
    align-items: center;
    justify-content: start;
    font-family: var(--t1-input-font-family);
    font-weight: var(--t1-input-font-weight);
    letter-spacing: var(--t1-letter-spacing-normal);
    background-color: var(--t1-input-background-color);
    border: solid var(--t1-input-border-width) var(--t1-input-border-color);
    color: var(--t1-input-color);
    cursor: pointer;
    overflow: hidden;
    transition:
      var(--t1-transition-fast) color,
      var(--t1-transition-fast) border,
      var(--t1-transition-fast) box-shadow,
      var(--t1-transition-fast) background-color;
  }

  .select:not(.select--disabled) .select__combobox:hover {
    background-color: var(--t1-input-background-color-hover);
    border-color: var(--t1-input-border-color-hover);
    color: var(--t1-input-color-hover);
  }

  .select--open .select__combobox,
  .select__combobox:focus-within {
    background-color: var(--t1-input-background-color-focus);
    border-color: var(--t1-input-border-color-focus);
    box-shadow: 0 0 0 var(--t1-focus-ring-width, 3px) var(--t1-input-focus-ring-color);
    outline: none;
  }

  /* Display input */
  .select__display-input {
    position: relative;
    width: 100%;
    font: inherit;
    border: none;
    background: none;
    color: var(--t1-input-color);
    cursor: inherit;
    overflow: hidden;
    padding: 0;
    margin: 0;
    -webkit-appearance: none;
    caret-color: transparent;
  }

  .select__display-input::placeholder {
    color: var(--t1-input-placeholder-color);
  }

  .select__display-input:focus {
    outline: none;
  }

  /* Hidden value input for form submission */
  .select__value-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    opacity: 0;
    z-index: -1;
  }

  /* Tags container for multiple mode */
  .select__tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--t1-spacing-2x-small);
  }

  /* Prefix / suffix / expand icon */
  .select__prefix,
  .select__suffix,
  .select__expand-icon,
  .select__clear-button {
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    color: var(--t1-input-icon-color, var(--t1-color-neutral-500));
  }

  .select__clear-button {
    cursor: pointer;
    color: var(--t1-input-icon-color, var(--t1-color-neutral-500));
  }

  .select__clear-button:hover {
    color: var(--t1-input-icon-color-hover, var(--t1-color-neutral-700));
  }

  /* Size modifiers */
  .select--small .select__combobox {
    border-radius: var(--t1-input-border-radius-small);
    font-size: var(--t1-input-font-size-small);
    min-height: var(--t1-input-height-small);
    padding: 0 var(--t1-input-spacing-small, var(--t1-spacing-small));
    gap: var(--t1-spacing-x-small);
  }

  .select--medium .select__combobox {
    border-radius: var(--t1-input-border-radius-medium);
    font-size: var(--t1-input-font-size-medium);
    min-height: var(--t1-input-height-medium);
    padding: 0 var(--t1-input-spacing-medium, var(--t1-spacing-medium));
    gap: var(--t1-spacing-small);
  }

  .select--large .select__combobox {
    border-radius: var(--t1-input-border-radius-large);
    font-size: var(--t1-input-font-size-large);
    min-height: var(--t1-input-height-large);
    padding: 0 var(--t1-input-spacing-large, var(--t1-spacing-large));
    gap: var(--t1-spacing-medium);
  }

  /* Pill modifier */
  .select--pill.select--small .select__combobox {
    border-radius: var(--t1-border-radius-pill);
  }
  .select--pill.select--medium .select__combobox {
    border-radius: var(--t1-border-radius-pill);
  }
  .select--pill.select--large .select__combobox {
    border-radius: var(--t1-border-radius-pill);
  }

  /* Disabled */
  .select--disabled .select__combobox {
    background-color: var(--t1-input-background-color-disabled);
    border-color: var(--t1-input-border-color-disabled);
    color: var(--t1-input-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* Listbox */
  .select__listbox {
    display: block;
    position: relative;
    font-family: var(--t1-font-sans);
    font-size: var(--t1-font-size-medium);
    font-weight: var(--t1-font-weight-normal);
    background-color: var(--t1-panel-background-color, var(--t1-color-neutral-0));
    border: solid var(--t1-panel-border-width, 1px)
      var(--t1-panel-border-color, var(--t1-color-neutral-200));
    border-radius: var(--t1-border-radius-medium);
    padding-block: var(--t1-spacing-x-small);
    overflow-y: auto;
    overscroll-behavior: none;
    box-shadow: var(--t1-shadow-large);
    min-width: var(--auto-size-available-width);
    max-height: var(--auto-size-available-height, 300px);
  }

  /* Label */
  .select__label {
    display: block;
    margin-bottom: var(--t1-spacing-3x-small);
    font-size: var(--t1-input-font-size-medium);
    font-weight: var(--t1-font-weight-semibold);
    color: var(--t1-input-label-color, var(--t1-color-neutral-700));
  }

  /* Help text */
  .select__help-text {
    display: block;
    margin-top: var(--t1-spacing-3x-small);
    font-size: var(--t1-font-size-small);
    color: var(--t1-input-help-text-color, var(--t1-color-neutral-500));
  }

  /* Expand icon rotation */
  .select__expand-icon {
    transition: var(--t1-transition-medium) rotate ease;
  }

  .select--open .select__expand-icon {
    rotate: -180deg;
  }

  /* Placeholder visible state */
  .select--placeholder-visible .select__display-input {
    color: var(--t1-input-placeholder-color);
  }
`;
