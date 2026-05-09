# Production-Grade Widget System — Complete Guide

## Project Structure

```
widget/
├── src/
│   ├── components/          # Shared primitives (reused across widgets)
│   │   ├── t1-icon.ts
│   │   └── t1-input.ts
│   ├── services/            # API layer
│   │   ├── api.service.ts   # Abstract base class
│   │   └── example.service.ts
│   ├── sdk/
│   │   └── loader.ts        # CDN entry point / lazy loader
│   ├── state/
│   │   ├── signal.ts        # signal() / computed() / effect()
│   │   └── lit-signal.ts    # SignalMixin — bridges signals → Lit updates
│   ├── styles/
│   │   ├── tokens.css       # CSS custom property design tokens
│   │   └── base.ts          # Shared Lit css`` base styles
│   ├── utils/
│   │   ├── dom.ts           # Shadow DOM helpers
│   │   └── fetch.ts         # Typed fetch wrapper + HttpError
│   └── widgets/
│       ├── counter-widget/  # Signal-driven stateful widget
│       │   ├── counter.state.ts
│       │   ├── counter-widget.ts
│       │   └── index.ts
│       └── search-property-widget/    # Async data loading widget
│           ├── search-property-widget.ts
│           └── index.ts
├── tests/unit/              # Vitest unit tests
├── public/index.html        # Dev sandbox (all widgets side by side)
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Step 1 — Project Initialization

Install the runtime and all dev dependencies:

```bash
npm init -y
npm install lit @lit/reactive-element
npm install -D vite vite-plugin-dts typescript vitest @vitest/ui jsdom
```

**Why this stack:**

- **Lit** — the lightest path to standards-based web components with reactive properties and Shadow DOM, no virtual DOM overhead.
- **Vite** — near-instant dev server and optimised ES module builds; multi-entry lib mode emits one chunk per widget with automatic shared-code splitting.
- **Vitest** — shares the same Vite config so transforms (decorators, path aliases) work identically in tests and builds.

---

## Step 2 — Vite Build Strategy — Self-Contained CDN Bundles

`vite.config.ts` uses **multi-entry lib mode**. Lit is never externalized — each widget chunk is fully standalone so any host page can load it from a CDN without installing anything:

```ts
build: {
  lib: {
    entry: {
      "sdk/loader":            "src/sdk/loader.ts",
      "widgets/counter-widget": "src/widgets/counter-widget/index.ts",
      // ...auto-discovered by discoverWidgets()
    },
    formats: ["es"],
  },
  rollupOptions: {
    // No externals — Lit is bundled into each widget chunk
    output: {
      chunkFileNames: "chunks/[name]-[hash].js",
    },
  },
}
```

The `discoverWidgets()` helper scans `src/widgets/` at build time and returns one entry per `index.ts` it finds. **Adding a new widget only requires creating `src/widgets/my-widget/index.ts`** — no manual entry registration needed.

Path aliases (`@widgets`, `@components`, `@state`, `@services`, `@utils`, `@styles`) are declared once in `vite.config.ts` and mirrored in `tsconfig.json` under `compilerOptions.paths` so TypeScript resolves them identically.

---

## Step 3 — Signal State Management

Three primitives, zero dependencies:

```ts
import { signal, computed, effect } from "@state/signal.js";

const count   = signal(0);                         // mutable reactive value
const doubled = computed(() => count.value * 2);   // derived, read-only
const dispose = effect(() => console.log(count.value)); // side-effect on change

count.value = 5;   // logs 10, triggers all subscribers
count.subscribe(v => ...); // external subscribe — returns a disposer fn
```

**`Signal<T>`** — holds a value. Reading `.value` inside a tracked context (effect or computed) registers the caller as a subscriber. Writing `.value` notifies all subscribers only when the value actually changes (`Object.is` equality check).

**`Computed<T>`** — a read-only signal derived from other signals. Re-evaluates lazily when any upstream signal changes. Implements the same `Subscribable<T>` interface as `Signal` so it can be passed anywhere a signal is expected.

**`effect(fn)`** — runs `fn` immediately and again whenever any signal read inside `fn` changes. Returns a disposer.

**`SignalMixin(LitElement)`** wires signals into Lit's update lifecycle so renders stay declarative:

```ts
class CounterWidget extends SignalMixin(LitElement) {
	connectedCallback() {
		super.connectedCallback();
		this._state = createCounterState();
		this.watchSignal(this._state.count); // → requestUpdate() on change
		this.watchSignal(this._state.isNegative);
	}
}
```

`watchSignal` accepts both `Signal` and `Computed` via the shared `Subscribable<T>` interface. All subscriptions are automatically cleaned up in `disconnectedCallback`.

---

## Step 4 — Widget Anatomy — Separation of Concerns

Each widget folder has three responsibilities cleanly separated:

| File                | Responsibility                                                                                                 |
| ------------------- | -------------------------------------------------------------------------------------------------------------- |
| `counter.state.ts`  | Pure state — signals, derived values, named actions. No DOM, no Lit. Fully testable in Node without a browser. |
| `counter-widget.ts` | Rendering — Lit `html\`\`` template, wires state → view, fires custom events, declares CSS.                    |
| `index.ts`          | Public barrel export — the only file Vite and external consumers import.                                       |

**State factory pattern** — `createCounterState(initial)` returns a plain object of signals and action functions rather than a class. This makes state trivially unit-testable and allows multiple independent instances of the same widget on one page:

```ts
export function createCounterState(initial = 0) {
	const count = signal(initial);
	const isNegative = computed(() => count.value < 0);
	return {
		count,
		isNegative,
		increment: () => {
			count.value += 1;
		},
		decrement: () => {
			count.value -= 1;
		},
		reset: () => {
			count.value = initial;
		},
	};
}
```

---

## Step 5 — Shared Components

`w-button` and `w-spinner` are registered custom elements that any widget can use in its template without re-implementing common UI patterns.

**`w-button`** exposes:

- `variant` attribute: `primary | secondary | ghost`
- `size` attribute: `sm | md | lg`
- `disabled` boolean attribute
- `::part(button)` for host-page CSS overrides
- `w-click` custom event (bubbles, composed)

**`w-spinner`** exposes:

- `label` attribute for accessible text
- `--w-spinner-size` CSS custom property for sizing

Host pages can style internals without piercing Shadow DOM:

```css
counter-widget::part(value) {
	font-size: 3rem;
}
```

---

## Step 6 — Services and API Layer

`ApiService` is an abstract base class that handles cross-cutting concerns — base URL, auth headers, and request timeouts — so concrete services only describe domain endpoints:

```ts
class PostService extends ApiService {
	constructor(config?: WidgetConfig) {
		super({ baseUrl: "https://api.example.com", ...config });
	}

	fetchPosts(): Promise<Post[]> {
		return this.fetch("/posts"); // inherits auth header, timeout
	}

	fetchPost(id: number): Promise<Post> {
		return this.fetch(`/posts/${id}`);
	}
}

export const postService = new PostService(); // singleton — widgets share one instance
```

Widgets that need a different API configuration can construct their own service instance rather than using the singleton.

`apiFetch` in `src/utils/fetch.ts` throws a typed `HttpError` on non-2xx responses and supports an optional `timeoutMs` via `AbortController`, keeping error handling uniform across all services.

---

## Step 7 — Styling — Shadow DOM Best Practices

**Design tokens** are CSS custom properties declared on `:host` in `tokens.css`. Because custom properties inherit through the Shadow DOM boundary, host pages can override any token by targeting the widget's tag name:

```css
/* host page — overrides without touching widget internals */
counter-widget {
	--w-color-primary: #7c3aed;
	--w-font-family: "Inter", sans-serif;
}
```

The full token set covers color, typography, spacing (4-pt grid), border radius, shadows, and motion — all prefixed `--w-` to avoid collisions with host-page variables.

**`baseStyles`** is a shared Lit `css` tagged-template object imported into every widget's `static styles` array. It sets `box-sizing`, `display: block`, the font stack from tokens, and a `.sr-only` utility class. No global stylesheet is needed.

**Three theming layers in order of specificity:**

1. Default token values on `:host` — out-of-the-box appearance.
2. Host-page `--w-*` overrides — brand-level theming without touching widget code.
3. `::part()` overrides — surgical per-element overrides when tokens aren't granular enough.

---

## Step 8 — SDK Loader — Three Usage Modes

The loader is the only script tag a host page needs. It maps widget tag names to their CDN chunk paths and imports them on demand.

**Mode 1 — Eager, load all widgets automatically:**

```html
<script
	type="module"
	src="https://cdn.example.com/widgets/sdk/loader.js"
></script>
```

The loader scans the DOM for any element whose tag name appears in the registry and imports the matching chunk.

**Mode 2 — Explicit lazy list via `data-widgets`:**

```html
<script
	type="module"
	src="https://cdn.example.com/widgets/sdk/loader.js"
	data-widgets="counter-widget,search-property-widget"
></script>
```

Only the listed widgets are fetched. Use this when you know exactly which widgets a page needs and want to avoid any extra scanning.

**Mode 3 — Programmatic, for dynamic pages:**

```html
<script type="module">
	import { load } from "https://cdn.example.com/widgets/sdk/loader.js";

	// Load one widget when the user opens a panel
	document.querySelector("#open-panel").addEventListener("click", () => {
		load(["counter-widget"]).then(() => {
			document.querySelector("#panel").innerHTML =
				"<counter-widget></counter-widget>";
		});
	});
</script>
```

`load()` is idempotent — calling it multiple times for the same tag name is safe. The loader checks both its internal `loaded` set and `customElements.get()` before importing.

The CDN base URL is inferred from `import.meta.url` automatically, so the loader works regardless of which CDN or version path it is served from.

---

## Step 9 — Testing

Tests are co-located under `tests/unit/` and run with Vitest in a jsdom environment (configured in `vite.config.ts`).

```bash
npm test              # single run, CI mode
npm run test:watch    # watch mode for development
npm run test:coverage # V8 coverage → coverage/ (lcov + html)
npm run test:ui       # Vitest browser UI at localhost:51204
```

**State tests** (`counter.state.test.ts`) run in plain Node — no browser APIs needed because state is framework-free:

```ts
it("resets to initial value", () => {
	const s = createCounterState(3);
	s.increment();
	s.increment();
	s.reset();
	expect(s.count.value).toBe(3);
});
```

**Utility tests** (`fetch.test.ts`) use `vi.stubGlobal("fetch", vi.fn())` to mock the global fetch without any network calls:

```ts
mockFetch.mockResolvedValue(
	new Response(JSON.stringify({ ok: true }), { status: 200 }),
);
const result = await apiFetch("/test");
expect(result).toEqual({ ok: true });
```

**Signal tests** (`signal.test.ts`) verify reactivity contracts — subscription notification, disposer behaviour, equality short-circuit, and computed derivation.

For widget rendering tests (Shadow DOM assertions), add `@open-wc/testing` helpers which are already installed. They wrap the Vitest environment with `fixture()` and `expect(el).shadowDom.to.equal(...)` matchers.

---

## Step 10 — Scripts Reference

| Command                 | Purpose                                                       |
| ----------------------- | ------------------------------------------------------------- |
| `npm run dev`           | Vite dev server on :3000 with HMR, serves `public/index.html` |
| `npm run build`         | Type-check (`tsc --noEmit`) then production build → `dist/`   |
| `npm run build:watch`   | Rebuild on every file save (useful for linked local testing)  |
| `npm run preview`       | Serve `dist/` locally to verify the production build          |
| `npm test`              | Vitest single run (used in CI)                                |
| `npm run test:watch`    | Vitest in watch mode                                          |
| `npm run test:ui`       | Vitest browser UI                                             |
| `npm run test:coverage` | Coverage report under `coverage/`                             |
| `npm run type-check`    | TypeScript type-check only, no emit                           |
| `npm run release`       | Build + `npm publish --access public`                         |

---

## Step 11 — Publishing to CDN

After running `npm run build`, the `dist/` folder is self-contained:

```
dist/
├── sdk/loader.js               ← single script tag entry point
├── widgets/counter-widget.js   ← fully self-contained widget chunk
├── widgets/search-property-widget.js
└── chunks/decorate-[hash].js   ← shared Lit internals (loaded once)
```

**Publish to npm:**

```bash
npm run release   # runs: tsc --noEmit && vite build && npm publish --access public
```

**Use from jsDelivr (auto-serves any npm package):**

```html
<script
	type="module"
	src="https://cdn.jsdelivr.net/npm/@myorg/widgets@0.1.0/dist/sdk/loader.js"
	data-widgets="counter-widget"
></script>
```

**Use from unpkg:**

```html
<script
	type="module"
	src="https://unpkg.com/@myorg/widgets@0.1.0/dist/sdk/loader.js"
	data-widgets="search-property-widget"
></script>
```

**Semver and cache control** — CDNs serve versioned URLs with long cache TTLs. Always publish a new version rather than mutating existing dist files. Use exact version pins in production and a `@latest` alias only for rapid prototyping.

---

## Step 12 — Adding a New Widget (Checklist)

Follow these steps every time you add a widget to the library:

**1. Create the folder and files:**

```bash
mkdir src/widgets/my-widget
touch src/widgets/my-widget/my-widget.ts
touch src/widgets/my-widget/my-widget.state.ts   # if it has non-trivial state
touch src/widgets/my-widget/index.ts
```

**2. Implement the state (if needed):**

```ts
// my-widget.state.ts
import { signal, computed } from "@state/signal.js";

export function createMyWidgetState() {
	const value = signal("");
	const isEmpty = computed(() => value.value.trim() === "");
	return {
		value,
		isEmpty,
		clear: () => {
			value.value = "";
		},
	};
}
```

**3. Implement the widget:**

```ts
// my-widget.ts
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { SignalMixin } from "@state/lit-signal.js";
import { baseStyles } from "@styles/base.js";

@customElement("my-widget")
export class MyWidget extends SignalMixin(LitElement) {
	static styles = [
		baseStyles,
		css`
			:host {
				display: block;
			}
		`,
	];

	connectedCallback() {
		super.connectedCallback();
		// this._state = createMyWidgetState();
		// this.watchSignal(this._state.value);
	}

	render() {
		return html`<slot></slot>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"my-widget": MyWidget;
	}
}
```

**4. Export from the index barrel:**

```ts
// index.ts
export { MyWidget } from "./my-widget.js";
```

**5. Register in the SDK loader** (`src/sdk/loader.ts`):

```ts
const WIDGET_REGISTRY: Record<string, string> = {
	"counter-widget": "/widgets/counter-widget.js",
	"posts-widget": "/widgets/posts-widget.js",
	"my-widget": "/widgets/my-widget.js", // ← add this line
};
```

**6. Add to the public API** (`src/index.ts`):

```ts
export { MyWidget } from "./widgets/my-widget/index.js";
```

**7. Write unit tests:**

```bash
touch tests/unit/my-widget.state.test.ts
```

**8. Add to the dev sandbox** (`public/index.html`):

```html
<script type="module" src="../src/widgets/my-widget/index.ts"></script>
<!-- ... -->
<section>
	<h2>My Widget</h2>
	<my-widget></my-widget>
</section>
```

**9. Verify:**

```bash
npm run type-check   # no errors
npm test             # all tests pass
npm run build        # dist/ emits widgets/my-widget.js automatically
```

Vite's `discoverWidgets()` picks up the new entry automatically — no manual config change required.
