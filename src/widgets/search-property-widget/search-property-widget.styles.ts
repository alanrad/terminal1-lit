import { css } from 'lit';

const styles = css`
  :host {
    display: block;
    width: 100%;
  }

  .autocomplete {
    position: relative;
  }

  t1-menu {
    border-radius: var(--w-border-radius-m, 8px);
    overflow: hidden;
  }
`;

export default styles;
