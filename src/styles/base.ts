import { css } from 'lit';

/** Shared base styles injected into every widget's Shadow DOM. */
export const baseStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
    font-family: var(--t1-font-sans);
    font-size: var(--t1-font-size-small);
    color: var(--t1-color-neutral-900);
    line-height: 1.5;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  /* Visually hide but keep accessible */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;
