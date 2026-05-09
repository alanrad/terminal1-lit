/**
 * SDK Loader — the single script tag a host page needs.
 *
 * Usage (CDN, eager load all):
 *   <script type="module" src="https://cdn.example.com/widgets/sdk/loader.js"></script>
 *
 * Usage (CDN, lazy — only load what the page uses):
 *   <script type="module">
 *     import { load } from 'https://cdn.example.com/widgets/sdk/loader.js';
 *     load(['counter-widget']);
 *   </script>
 *
 * Usage (auto-detect from data-widgets attribute):
 *   <script type="module"
 *     src="https://cdn.example.com/widgets/sdk/loader.js"
 *     data-widgets="counter-widget,posts-widget">
 *   </script>
 */

const CDN_BASE =
  (globalThis as Record<string, unknown>).__WIDGET_CDN__ as string | undefined ??
  import.meta.url.replace(/\/sdk\/loader\.js.*$/, "");

/** Map of widget tag name → chunk path relative to CDN_BASE. */
const WIDGET_REGISTRY: Record<string, string> = {
  "counter-widget": "/widgets/counter-widget.js",
  "posts-widget": "/widgets/posts-widget.js",
};

const loaded = new Set<string>();

/** Dynamically import one widget chunk. No-op if already loaded. */
async function loadWidget(tagName: string): Promise<void> {
  if (loaded.has(tagName)) return;
  if (customElements.get(tagName)) { loaded.add(tagName); return; }

  const path = WIDGET_REGISTRY[tagName];
  if (!path) { console.warn(`[widgets] Unknown widget: "${tagName}"`); return; }

  loaded.add(tagName);
  await import(/* @vite-ignore */ `${CDN_BASE}${path}`);
}

/** Load one or more widgets by tag name. */
export async function load(tags: string[]): Promise<void> {
  await Promise.all(tags.map(loadWidget));
}

/** Auto-detect widgets already in the DOM (or declared via data-widgets). */
async function autoLoad(): Promise<void> {
  // 1. Explicit list from data-widgets attribute on the loader <script>
  const loaderScript = document.currentScript as HTMLScriptElement | null;
  const explicit = loaderScript?.dataset.widgets?.split(",").map((s) => s.trim()).filter(Boolean);

  if (explicit?.length) {
    await load(explicit);
    return;
  }

  // 2. Scan DOM for unknown custom elements that are registered here
  const tags = new Set(
    [...document.querySelectorAll("*")]
      .map((el) => el.tagName.toLowerCase())
      .filter((tag) => tag.includes("-") && WIDGET_REGISTRY[tag])
  );

  if (tags.size) {
    await load([...tags]);
  }
}

// Auto-load on import
autoLoad().catch(console.error);
