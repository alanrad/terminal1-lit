import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './index';

type T1InputEl = HTMLElement & {
  updateComplete: Promise<boolean>;
  type: string;
  name: string;
  value: string;
  defaultValue: string;
  size: string;
  filled: boolean;
  pill: boolean;
  label: string;
  helpText: string;
  clearable: boolean;
  disabled: boolean;
  placeholder: string;
  readonly: boolean;
  passwordToggle: boolean;
  passwordVisible: boolean;
  noSpinButtons: boolean;
  form: string;
  required: boolean;
  pattern: string | undefined;
  minlength: number | undefined;
  maxlength: number | undefined;
  min: number | string | undefined;
  max: number | string | undefined;
  step: number | 'any' | undefined;
  inputAutocapitalize: string | undefined;
  inputAutocorrect: string | undefined;
  autocomplete: string | undefined;
  inputAutofocus: boolean | undefined;
  enterkeyhint: string | undefined;
  spellcheck: boolean;
  inputmode: string | undefined;
  valueAsDate: Date | null;
  valueAsNumber: number;
  focus(options?: FocusOptions): void;
  blur(): void;
  checkValidity(): boolean;
  reportValidity(): boolean;
  setCustomValidity(msg: string): void;
};

let el: T1InputEl;

beforeEach(() => {
  el = document.createElement('t1-input') as T1InputEl;
  document.body.appendChild(el);
});

afterEach(() => {
  el.remove();
});

describe('t1-input', () => {
  it('default properties', async () => {
    await el.updateComplete;
    expect(el.type).toBe('text');
    expect(el.name).toBe('');
    expect(el.value).toBe('');
    expect(el.defaultValue).toBe('');
    expect(el.size).toBe('medium');
    expect(el.filled).toBe(false);
    expect(el.pill).toBe(false);
    expect(el.label).toBe('');
    expect(el.helpText).toBe('');
    expect(el.clearable).toBe(false);
    expect(el.disabled).toBe(false);
    expect(el.placeholder).toBe('');
    expect(el.readonly).toBe(false);
    expect(el.passwordToggle).toBe(false);
    expect(el.passwordVisible).toBe(false);
    expect(el.noSpinButtons).toBe(false);
    expect(el.required).toBe(false);
    expect(el.pattern).toBeUndefined();
    expect(el.minlength).toBeUndefined();
    expect(el.maxlength).toBeUndefined();
    expect(el.spellcheck).toBe(true);
  });

  it('disabled attribute', async () => {
    el.disabled = true;
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector<HTMLInputElement>('.input__control')!;
    expect(input.disabled).toBe(true);
  });

  it('placeholder attribute', async () => {
    el.placeholder = 'Enter text';
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector<HTMLInputElement>('.input__control')!;
    expect(input.placeholder).toBe('Enter text');
  });

  it('required attribute', async () => {
    el.required = true;
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector<HTMLInputElement>('.input__control')!;
    expect(input.required).toBe(true);
  });

  it('type attribute', async () => {
    el.type = 'email';
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector<HTMLInputElement>('.input__control')!;
    expect(input.type).toBe('email');
  });

  it('size attribute', async () => {
    el.size = 'large';
    await el.updateComplete;
    const base = el.shadowRoot!.querySelector('[part="base"]')!;
    expect(base.classList.contains('input--large')).toBe(true);
  });

  it('filled variant', async () => {
    el.filled = true;
    await el.updateComplete;
    const base = el.shadowRoot!.querySelector('[part="base"]')!;
    expect(base.classList.contains('input--filled')).toBe(true);
  });

  it('pill modifier', async () => {
    el.pill = true;
    await el.updateComplete;
    const base = el.shadowRoot!.querySelector('[part="base"]')!;
    expect(base.classList.contains('input--pill')).toBe(true);
  });

  it('label attribute shows label', async () => {
    el.label = 'My Label';
    await el.updateComplete;
    const formControl = el.shadowRoot!.querySelector('[part="form-control"]')!;
    expect(formControl.classList.contains('form-control--has-label')).toBe(true);
    const label = el.shadowRoot!.querySelector('.form-control__label')!;
    expect(label.textContent!.trim()).toBe('My Label');
  });

  it('help text attribute shows help text', async () => {
    el.helpText = 'Some help';
    await el.updateComplete;
    const formControl = el.shadowRoot!.querySelector('[part="form-control"]')!;
    expect(formControl.classList.contains('form-control--has-help-text')).toBe(true);
  });

  it('clearable shows clear button when has value', async () => {
    el.clearable = true;
    el.value = 'hello';
    await el.updateComplete;
    const clearBtn = el.shadowRoot!.querySelector('[part="clear-button"]');
    expect(clearBtn).not.toBeNull();
  });

  it('clearable hides clear button when value is empty', async () => {
    el.clearable = true;
    el.value = '';
    await el.updateComplete;
    const clearBtn = el.shadowRoot!.querySelector('[part="clear-button"]');
    expect(clearBtn).toBeNull();
  });

  it('password-toggle shows toggle button', async () => {
    el.type = 'password';
    el.passwordToggle = true;
    await el.updateComplete;
    const toggleBtn = el.shadowRoot!.querySelector('[part="password-toggle-button"]');
    expect(toggleBtn).not.toBeNull();
  });

  it('t1-focus event fires on focus', async () => {
    await el.updateComplete;
    let fired = false;
    el.addEventListener('t1-focus', () => { fired = true; });
    const input = el.shadowRoot!.querySelector<HTMLInputElement>('.input__control')!;
    input.dispatchEvent(new FocusEvent('focus', { bubbles: false }));
    expect(fired).toBe(true);
  });

  it('t1-blur event fires on blur', async () => {
    await el.updateComplete;
    let fired = false;
    el.addEventListener('t1-blur', () => { fired = true; });
    const input = el.shadowRoot!.querySelector<HTMLInputElement>('.input__control')!;
    input.dispatchEvent(new FocusEvent('blur', { bubbles: false }));
    expect(fired).toBe(true);
  });

  it('t1-input event fires on input', async () => {
    await el.updateComplete;
    let fired = false;
    el.addEventListener('t1-input', () => { fired = true; });
    const input = el.shadowRoot!.querySelector<HTMLInputElement>('.input__control')!;
    input.value = 'test';
    input.dispatchEvent(new InputEvent('input', { bubbles: true }));
    expect(fired).toBe(true);
  });

  it('t1-change event fires on change', async () => {
    await el.updateComplete;
    let fired = false;
    el.addEventListener('t1-change', () => { fired = true; });
    const input = el.shadowRoot!.querySelector<HTMLInputElement>('.input__control')!;
    input.value = 'changed';
    input.dispatchEvent(new Event('change', { bubbles: true }));
    expect(fired).toBe(true);
  });

  it('t1-clear event fires on clear button click', async () => {
    el.clearable = true;
    el.value = 'hello';
    await el.updateComplete;

    let fired = false;
    el.addEventListener('t1-clear', () => { fired = true; });
    const clearBtn = el.shadowRoot!.querySelector<HTMLButtonElement>('[part="clear-button"]')!;
    clearBtn.click();
    expect(fired).toBe(true);
    expect(el.value).toBe('');
  });

  it('focus() method focuses the input', async () => {
    await el.updateComplete;
    let focused = false;
    const input = el.shadowRoot!.querySelector<HTMLInputElement>('.input__control')!;
    input.addEventListener('focus', () => { focused = true; });
    el.focus();
    expect(focused).toBe(true);
  });

  it('disabled prevents clear button', async () => {
    el.clearable = true;
    el.disabled = true;
    el.value = 'hello';
    await el.updateComplete;
    const clearBtn = el.shadowRoot!.querySelector('[part="clear-button"]');
    expect(clearBtn).toBeNull();
  });
});
