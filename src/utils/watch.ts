import type { LitElement } from 'lit';

type WatchOptions = { waitUntilFirstUpdate?: boolean };

type LitLike = LitElement & {
  update(changed: Map<PropertyKey, unknown>): void;
  hasUpdated: boolean;
};

export function watch(propName: string | string[], options: WatchOptions = {}) {
  return function (proto: LitElement, decoratedFnName: string): void {
    const { update } = proto as LitLike;

    (proto as LitLike).update = function (
      this: LitLike,
      changedProperties: Map<PropertyKey, unknown>
    ) {
      update.call(this, changedProperties);
      const props = Array.isArray(propName) ? propName : [propName];
      if (props.some(p => changedProperties.has(p))) {
        if (!options.waitUntilFirstUpdate || this.hasUpdated) {
          (this as unknown as Record<string, () => void>)[decoratedFnName].call(this);
        }
      }
    };
  };
}
