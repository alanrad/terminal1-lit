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

  .card-image {
    width: 100%;
    min-height: 180px;
    background: linear-gradient(
      150deg,
      var(--t1-color-danger-700, hsl(0 73.7% 41.8%)),
      var(--t1-color-danger-400, hsl(0 90.6% 70.8%))
    );
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--t1-spacing-small, 0.75rem);
    padding: var(--t1-spacing-medium, 1rem);
  }

  .card-image__icon {
    font-size: 3.5rem;
    color: var(--t1-color-neutral-0, #fff);
    opacity: 0.9;
  }

  .card-image__tag {
    --t1-tag-background-color: rgb(255 255 255 / 20%);
    --t1-tag-color: var(--t1-color-neutral-0, #fff);
    --t1-tag-border-color: rgb(255 255 255 / 30%);
    text-transform: capitalize;
    font-size: var(--t1-font-size-x-small, 0.75rem);
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

  .card-content__name {
    margin: 0;
    font-size: var(--t1-font-size-large, 1.25rem);
    font-weight: var(--t1-font-weight-semibold, 600);
    color: var(--t1-color-neutral-900, #0f172a);
    line-height: 1.3;
  }

  .card-content__city {
    font-size: var(--t1-font-size-small, 0.875rem);
    color: var(--t1-color-neutral-500, #64748b);
  }

  .card-content__facilities {
    list-style: none;
    margin: var(--t1-spacing-x-small, 0.5rem) 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .card-content__facility {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: var(--t1-font-size-small, 0.875rem);
    color: var(--t1-color-neutral-700, #334155);
  }

  .card-content__facility t1-icon {
    font-size: 0.9rem;
    color: var(--t1-color-success-600, #16a34a);
    flex-shrink: 0;
  }

  .card-content__more {
    margin: 0.25rem 0 0;
    font-size: var(--t1-font-size-small, 0.875rem);
    color: var(--t1-color-danger-600, hsl(0 72.2% 50.6%));
    cursor: pointer;
  }

  .card-content__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: var(--t1-spacing-small, 0.75rem);
    border-top: 1px solid var(--t1-color-neutral-200, #e2e8f0);
    margin-top: auto;
  }

  .card-content__price {
    display: flex;
    flex-direction: column;
  }

  .card-content__price-label {
    font-size: var(--t1-font-size-x-small, 0.75rem);
    color: var(--t1-color-neutral-500, #64748b);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .card-content__price-amount {
    font-size: var(--t1-font-size-large, 1.25rem);
    font-weight: var(--t1-font-weight-bold, 700);
    color: var(--t1-color-neutral-900, #0f172a);
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

    .card-image {
      min-height: 160px;
    }
  }
`;

export default styles;
