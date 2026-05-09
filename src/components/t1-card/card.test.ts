import { describe, it, expect, afterEach } from 'vitest';
import './index';

type T1CardEl = HTMLElement & {
  updateComplete: Promise<boolean>;
};

function createElement(innerHTML = ''): T1CardEl {
  const el = document.createElement('t1-card') as unknown as T1CardEl;
  el.innerHTML = innerHTML;
  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  document.body.querySelectorAll('t1-card').forEach(el => el.remove());
});

describe('t1-card', () => {
  describe('when provided no parameters', () => {
    it('renders body content', async () => {
      const el = createElement('Just card content.');
      await el.updateComplete;

      expect(el.textContent).toContain('Just card content.');
    });

    it('base part contains only the card class when no slots filled', async () => {
      const el = createElement('Content only');
      await el.updateComplete;

      const card = el.shadowRoot!.querySelector('.card')!;
      expect(card.classList.contains('card')).toBe(true);
      expect(card.classList.contains('card--has-header')).toBe(false);
      expect(card.classList.contains('card--has-footer')).toBe(false);
      expect(card.classList.contains('card--has-image')).toBe(false);
    });
  });

  describe('header slot', () => {
    it('applies card--has-header class when header slot is filled', async () => {
      const el = createElement('<div slot="header">Header</div>Body content');
      await el.updateComplete;

      const card = el.shadowRoot!.querySelector('.card')!;
      expect(card.classList.contains('card--has-header')).toBe(true);
    });

    it('accepts header content in the shadow root slot', async () => {
      const el = createElement('<div slot="header">Header Title</div>Body content');
      await el.updateComplete;

      const slot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name=header]')!;
      const assigned = slot.assignedNodes({ flatten: true });
      expect(assigned.length).toBe(1);
    });

    it('renders the header text content', () => {
      const el = createElement('<div slot="header">My Header</div>Body');
      const header = el.querySelector<HTMLElement>('div[slot=header]')!;
      expect(header.textContent).toBe('My Header');
    });
  });

  describe('footer slot', () => {
    it('applies card--has-footer class when footer slot is filled', async () => {
      const el = createElement('Body<div slot="footer">Footer</div>');
      await el.updateComplete;

      const card = el.shadowRoot!.querySelector('.card')!;
      expect(card.classList.contains('card--has-footer')).toBe(true);
    });

    it('accepts footer content in the shadow root slot', async () => {
      const el = createElement('Body<div slot="footer">Footer</div>');
      await el.updateComplete;

      const slot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name=footer]')!;
      const assigned = slot.assignedNodes({ flatten: true });
      expect(assigned.length).toBe(1);
    });

    it('renders the footer text content', () => {
      const el = createElement('<div slot="footer">My Footer</div>Body');
      const footer = el.querySelector<HTMLElement>('div[slot=footer]')!;
      expect(footer.textContent).toBe('My Footer');
    });
  });

  describe('image slot', () => {
    const src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    it('applies card--has-image class when image slot is filled', async () => {
      const el = createElement(`<img slot="image" src="${src}" alt="test" />Body`);
      await el.updateComplete;

      const card = el.shadowRoot!.querySelector('.card')!;
      expect(card.classList.contains('card--has-image')).toBe(true);
    });

    it('accepts image content in the shadow root slot', async () => {
      const el = createElement(`<img slot="image" src="${src}" alt="test" />Body`);
      await el.updateComplete;

      const slot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name=image]')!;
      const assigned = slot.assignedNodes({ flatten: true });
      expect(assigned.length).toBe(1);
    });
  });

  describe('combined slots', () => {
    it('applies all modifier classes when all slots are filled', async () => {
      const src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      const el = createElement(
        `<img slot="image" src="${src}" alt="" /><div slot="header">H</div>Body<div slot="footer">F</div>`
      );
      await el.updateComplete;

      const card = el.shadowRoot!.querySelector('.card')!;
      expect(card.classList.contains('card--has-image')).toBe(true);
      expect(card.classList.contains('card--has-header')).toBe(true);
      expect(card.classList.contains('card--has-footer')).toBe(true);
    });
  });
});
