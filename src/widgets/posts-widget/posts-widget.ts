import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { baseStyles } from "@styles/base";
import { postService, type Post } from "@services/example.service";

/**
 * <posts-widget> — demonstrates async data loading + lazy rendering.
 * Fetches posts from a configurable API and renders them in a styled list.
 *
 * Attributes:
 *   limit   – max number of posts to show (default 5)
 *
 * CSS parts:
 *   container, list, item, title, body, error
 */
@customElement("posts-widget")
export class PostsWidget extends LitElement {
	static styles = [
		baseStyles,
		css`
			:host {
				display: block;
				max-width: 600px;
				border: 1px solid var(--t1-color-neutral-300);
				border-radius: var(--t1-border-radius-large);
				background: var(--t1-color-neutral-0);
				box-shadow: var(--t1-shadow-small);
				overflow: hidden;
			}

			[part="container"] {
				padding: var(--t1-spacing-medium);
			}

			[part="list"] {
				list-style: none;
				margin: 0;
				padding: 0;
				display: flex;
				flex-direction: column;
				gap: var(--t1-spacing-small);
			}

			[part="item"] {
				padding: var(--t1-spacing-small);
				border-radius: var(--t1-border-radius-medium);
				background: var(--t1-color-neutral-50);
				border-left: 3px solid var(--t1-color-primary-600);
			}

			[part="title"] {
				font-weight: var(--t1-font-weight-semibold);
				font-size: var(--t1-font-size-medium);
				margin: 0 0 var(--t1-spacing-2x-small);
				text-transform: capitalize;
			}

			[part="body"] {
				color: var(--t1-color-neutral-500);
				font-size: var(--t1-font-size-x-small);
				margin: 0;
			}

			[part="error"] {
				color: var(--t1-color-danger-600);
				padding: var(--t1-spacing-medium);
				text-align: center;
			}

			.loading {
				display: flex;
				justify-content: center;
				padding: var(--t1-spacing-2x-large);
			}
		`,
	];

	@property({ type: Number }) limit = 5;

	@state() private _posts: Post[] = [];
	@state() private _error: string | null = null;

	connectedCallback() {
		super.connectedCallback();
		this._load();
	}

	private async _load() {
		this._error = null;
		try {
			const all = await postService.fetchPosts();
			this._posts = all.slice(0, this.limit);
		} catch (err) {
			this._error = err instanceof Error ? err.message : String(err);
		}
	}

	render() {
		if (this._error) {
			return html`<p part="error">${this._error}</p>`;
		}
		return html`
			<div part="container">
				<ul part="list">
					${this._posts.map(
						(p) => html`
							<li part="item">
								<p part="title">${p.title}</p>
								<p part="body">${p.body}</p>
							</li>
						`,
					)}
				</ul>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"posts-widget": PostsWidget;
	}
}
