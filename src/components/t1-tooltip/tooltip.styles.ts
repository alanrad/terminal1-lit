import { css } from 'lit';

export default css`
  :host {
    --max-width: 20rem;
    --hide-delay: 0ms;
    --show-delay: 150ms;

    display: contents;
  }

  .tooltip::part(popup) {
    z-index: var(--t1-z-index-tooltip, 900);
  }

  .tooltip[placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .tooltip[placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  .tooltip[placement^='left']::part(popup) {
    transform-origin: right;
  }

  .tooltip[placement^='right']::part(popup) {
    transform-origin: left;
  }

  .tooltip__body {
    display: block;
    width: max-content;
    max-width: var(--max-width);
    border-radius: var(--t1-border-radius-small);
    background-color: var(--t1-color-neutral-800);
    font-family: var(--t1-font-sans);
    font-size: var(--t1-font-size-small);
    font-weight: var(--t1-font-weight-normal);
    line-height: var(--t1-line-height-dense);
    color: var(--t1-color-neutral-0);
    padding: var(--t1-spacing-2x-small) var(--t1-spacing-x-small);
    pointer-events: none;
    user-select: none;
    -webkit-user-select: none;
  }

  .tooltip::part(arrow) {
    background: var(--t1-color-neutral-800);
  }
`;
