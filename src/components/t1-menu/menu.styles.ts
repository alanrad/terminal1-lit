import { css } from 'lit';

export default css`
  :host {
    display: block;
    position: relative;
    background: var(--t1-panel-background-color);
    border: solid var(--t1-panel-border-width) var(--t1-panel-border-color);
    border-radius: var(--t1-border-radius-medium);
    padding: var(--t1-spacing-x-small) 0;
    overflow: auto;
    overscroll-behavior: none;
  }
`;
