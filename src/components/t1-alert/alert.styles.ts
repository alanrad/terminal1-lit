import { css } from 'lit';

export default css`
  :host {
    display: contents;
    margin: 0;
  }

  .alert {
    position: relative;
    display: flex;
    align-items: stretch;
    background-color: var(--t1-color-neutral-0);
    border: solid 1px var(--t1-color-neutral-200);
    border-top-width: 3px;
    border-radius: var(--t1-border-radius-medium);
    font-family: var(--t1-font-sans);
    font-size: var(--t1-font-size-small);
    font-weight: var(--t1-font-weight-normal);
    line-height: 1.6;
    color: var(--t1-color-neutral-700);
    margin: inherit;
    overflow: hidden;
  }

  .alert:not(.alert--has-icon) .alert__icon,
  .alert:not(.alert--closable) .alert__close-button {
    display: none;
  }

  .alert__icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    font-size: var(--t1-font-size-large);
    padding-inline-start: var(--t1-spacing-large);
  }

  .alert--primary { border-top-color: var(--t1-color-primary-600); }
  .alert--primary .alert__icon { color: var(--t1-color-primary-600); }

  .alert--success { border-top-color: var(--t1-color-success-600); }
  .alert--success .alert__icon { color: var(--t1-color-success-600); }

  .alert--neutral { border-top-color: var(--t1-color-neutral-600); }
  .alert--neutral .alert__icon { color: var(--t1-color-neutral-600); }

  .alert--warning { border-top-color: var(--t1-color-warning-600); }
  .alert--warning .alert__icon { color: var(--t1-color-warning-600); }

  .alert--danger { border-top-color: var(--t1-color-danger-600); }
  .alert--danger .alert__icon { color: var(--t1-color-danger-600); }

  .alert__message {
    flex: 1 1 auto;
    display: block;
    padding: var(--t1-spacing-large);
    overflow: hidden;
  }

  .alert__close-button {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--t1-color-neutral-500);
    font-size: var(--t1-font-size-medium);
    padding: 0 var(--t1-spacing-medium);
    align-self: center;
    border-radius: var(--t1-border-radius-small);
    transition: color 150ms ease;
  }

  .alert__close-button:hover {
    color: var(--t1-color-neutral-800);
  }

  .alert__close-button:focus-visible {
    outline: var(--t1-focus-ring);
    outline-offset: 2px;
  }
`;
