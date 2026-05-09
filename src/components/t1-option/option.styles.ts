import { css } from 'lit';

export default css`
  :host {
    display: block;
    user-select: none;
    -webkit-user-select: none;
  }

  :host(:focus) {
    outline: none;
  }

  .option {
    position: relative;
    display: flex;
    align-items: center;
    font-family: var(--t1-font-sans);
    font-size: var(--t1-font-size-medium);
    font-weight: var(--t1-font-weight-normal);
    line-height: var(--t1-line-height-normal);
    letter-spacing: var(--t1-letter-spacing-normal);
    color: var(--t1-color-neutral-700);
    padding: var(--t1-spacing-x-small) var(--t1-spacing-medium) var(--t1-spacing-x-small) var(--t1-spacing-x-small);
    transition: var(--t1-transition-fast) fill;
    cursor: pointer;
  }

  .option--hover:not(.option--current):not(.option--disabled) {
    background-color: var(--t1-color-neutral-100);
    color: var(--t1-color-neutral-1000);
  }

  .option--current,
  .option--current.option--disabled {
    background-color: var(--t1-color-primary-600);
    color: var(--t1-color-neutral-0);
    opacity: 1;
  }

  .option--disabled {
    outline: none;
    opacity: 0.5;
    cursor: not-allowed;
  }

  .option__label {
    flex: 1 1 auto;
    display: inline-block;
    line-height: var(--t1-line-height-dense);
  }

  .option .option__check {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    visibility: hidden;
    padding-inline-end: var(--t1-spacing-2x-small);
    width: 1.25em;
  }

  .option--selected .option__check {
    visibility: visible;
  }

  .option__prefix,
  .option__suffix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .option__prefix::slotted(*) {
    margin-inline-end: var(--t1-spacing-x-small);
  }

  .option__suffix::slotted(*) {
    margin-inline-start: var(--t1-spacing-x-small);
  }
`;
