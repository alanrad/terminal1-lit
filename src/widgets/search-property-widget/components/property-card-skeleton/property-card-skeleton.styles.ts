import { css } from 'lit';

const styles = css`
  :host {
    display: block;
    margin-top: var(--t1-spacing-medium, 1rem);
  }

  t1-card {
    display: block;
    width: 100%;
  }

  t1-card::part(base) {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    width: 100%;
  }

  t1-card::part(image) {
    width: 200px;
    min-width: 200px;
    flex-shrink: 0;
    border-radius: 0;
    border-top-left-radius: calc(var(--t1-border-radius-medium, 0.25rem) - 1px);
    border-bottom-left-radius: calc(var(--t1-border-radius-medium, 0.25rem) - 1px);
    margin: 0;
    overflow: hidden;
  }

  t1-card::part(body) {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .skeleton-image {
    width: 100%;
    min-height: 180px;
    --border-radius: 0;
  }

  .card-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: var(--t1-spacing-small, 0.75rem);
  }

  .card-content__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--t1-spacing-x-small, 0.5rem);
  }

  .skeleton-name {
    width: 60%;
    height: 1.5rem;
    border-radius: var(--t1-border-radius-medium, 0.25rem);
    margin-bottom: 0.25rem;
  }

  .skeleton-city {
    width: 35%;
    height: 1rem;
    border-radius: var(--t1-border-radius-medium, 0.25rem);
  }

  .skeleton-rating {
    width: 45%;
    height: 1rem;
    border-radius: var(--t1-border-radius-medium, 0.25rem);
    margin-top: 0.25rem;
  }

  .skeleton-facilities {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    margin-top: var(--t1-spacing-x-small, 0.5rem);
  }

  .skeleton-facility {
    height: 0.9rem;
    border-radius: var(--t1-border-radius-medium, 0.25rem);
  }

  .skeleton-facility:nth-child(1) {
    width: 70%;
  }

  .skeleton-facility:nth-child(2) {
    width: 60%;
  }

  .skeleton-facility:nth-child(3) {
    width: 50%;
  }

  .skeleton-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: var(--t1-spacing-small, 0.75rem);
    border-top: 1px solid var(--t1-color-neutral-200, #e2e8f0);
    margin-top: auto;
  }

  .skeleton-price {
    width: 120px;
    height: 1.5rem;
    border-radius: var(--t1-border-radius-medium, 0.25rem);
  }

  .skeleton-button {
    width: 100px;
    height: 2.5rem;
    border-radius: var(--t1-input-height-medium, 2.5rem);
  }

  @media (max-width: 640px) {
    t1-card::part(base) {
      flex-direction: column;
    }

    t1-card::part(image) {
      width: 100%;
      min-width: unset;
      border-radius: 0;
      border-top-left-radius: calc(var(--t1-border-radius-medium, 0.25rem) - 1px);
      border-top-right-radius: calc(var(--t1-border-radius-medium, 0.25rem) - 1px);
      border-bottom-left-radius: 0;
    }

    .skeleton-image {
      min-height: 160px;
    }
  }
`;

export default styles;
