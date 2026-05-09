import { css } from 'lit';

export default css`
  :host {
    display: inline-block;
  }

  .tag {
    display: flex;
    align-items: center;
    border: solid 1px;
    line-height: 1;
    white-space: nowrap;
    user-select: none;
    -webkit-user-select: none;
    cursor: default;
  }

  .tag__remove::part(base) {
    color: inherit;
    padding: 0;
  }

  /* Variants */
  .tag--primary {
    background-color: var(--t1-color-primary-50);
    border-color: var(--t1-color-primary-200);
    color: var(--t1-color-primary-800);
  }
  .tag--success {
    background-color: var(--t1-color-success-50);
    border-color: var(--t1-color-success-200);
    color: var(--t1-color-success-800);
  }
  .tag--neutral {
    background-color: var(--t1-color-neutral-50);
    border-color: var(--t1-color-neutral-200);
    color: var(--t1-color-neutral-800);
  }
  .tag--warning {
    background-color: var(--t1-color-warning-50);
    border-color: var(--t1-color-warning-200);
    color: var(--t1-color-warning-800);
  }
  .tag--danger {
    background-color: var(--t1-color-danger-50);
    border-color: var(--t1-color-danger-200);
    color: var(--t1-color-danger-800);
  }
  .tag--text {
    background-color: transparent;
    border-color: transparent;
    color: var(--t1-color-neutral-800);
  }

  /* Sizes */
  .tag--small {
    font-size: var(--t1-button-font-size-small);
    height: calc(var(--t1-input-height-small) * 0.8);
    border-radius: var(--t1-input-border-radius-small);
    padding: 0 var(--t1-spacing-x-small);
    gap: var(--t1-spacing-2x-small);
  }
  .tag--medium {
    font-size: var(--t1-button-font-size-medium);
    height: calc(var(--t1-input-height-medium) * 0.8);
    border-radius: var(--t1-input-border-radius-medium);
    padding: 0 var(--t1-spacing-small);
    gap: var(--t1-spacing-2x-small);
  }
  .tag--large {
    font-size: var(--t1-button-font-size-large);
    height: calc(var(--t1-input-height-large) * 0.8);
    border-radius: var(--t1-input-border-radius-large);
    padding: 0 var(--t1-spacing-medium);
    gap: var(--t1-spacing-x-small);
  }

  /* Pill */
  .tag--pill {
    border-radius: var(--t1-border-radius-pill);
  }
`;
