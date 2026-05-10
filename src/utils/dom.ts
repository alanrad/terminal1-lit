/** Return the Shadow root for an element, asserting it exists. */
export function getShadowRoot(el: Element): ShadowRoot {
  const root = el.shadowRoot;
  if (!root) throw new Error(`${el.tagName} has no shadow root`);
  return root;
}

/** Dispatch a custom event that bubbles and crosses Shadow DOM boundaries. */
export function emit<T = unknown>(el: Element, name: string, detail?: T): void {
  el.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
}

/** Query a shadow-root descendant and throw if not found. */
export function shadowQuery<T extends Element>(root: Element | ShadowRoot, selector: string): T {
  const el = (root instanceof Element ? (root.shadowRoot ?? root) : root).querySelector<T>(
    selector,
  );
  if (!el) throw new Error(`Element not found: ${selector}`);
  return el;
}
