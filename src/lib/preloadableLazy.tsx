import { createElement, type ComponentType } from "react";

/**
 * Like React.lazy, but the returned component renders SYNCHRONOUSLY once its
 * module has been preloaded (via `.preload()`), instead of always suspending on
 * first render.
 *
 * Why this exists: the site ships prerendered HTML (scripts/prerender.mjs) and
 * hydrates it. With plain React.lazy, the route chunk isn't loaded at hydration
 * time, so the <Suspense> fallback (a spinner) renders on the client's first
 * pass — which does NOT match the prerendered content → React #418/#423, and
 * React throws away the server markup and re-renders the whole root (spinner
 * flash + worse LCP). Preloading the current route's module BEFORE hydrateRoot
 * (see main.tsx) means `Comp` is already set here, so the first client render
 * matches the server HTML and hydration is clean.
 *
 * Graceful degradation: if a route is NOT preloaded, this behaves exactly like
 * React.lazy (throws the load promise → Suspense fallback → then renders). So a
 * missed preload just falls back to today's behavior; it never breaks a route.
 */
type Loader = () => Promise<{ default: ComponentType<unknown> }>;

export interface Preloadable {
  (props: Record<string, unknown>): React.ReactElement;
  preload: () => Promise<void>;
}

export function preloadableLazy(factory: Loader): Preloadable {
  let Comp: ComponentType<unknown> | null = null;
  let promise: Promise<void> | null = null;
  const load = (): Promise<void> => {
    if (!promise) promise = factory().then((m) => { Comp = m.default; });
    return promise;
  };
  const C = ((props: Record<string, unknown>) => {
    if (!Comp) throw load(); // suspend until the chunk is loaded (same as React.lazy)
    return createElement(Comp, props);
  }) as Preloadable;
  C.preload = load;
  return C;
}
