import { createRoot, hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App, { preloadForPath } from "./App.tsx";
import "./index.css";
import { initMetaPixel } from "@/lib/metaPixel";
import { isProductionDomain } from "@/lib/isProductionDomain";

// Initialize Meta Pixel only on production domains.
// Cookie banner can later revoke it if the user opts out of marketing.
if (isProductionDomain()) {
  initMetaPixel();
}

// Auto-recover from stale chunks after a deploy: if a lazy-loaded chunk fails to
// load (the cached app references a JS file the new build removed), reload once
// to fetch the fresh assets instead of leaving a blank screen.
window.addEventListener("vite:preloadError", () => {
  const now = Date.now();
  const last = Number(sessionStorage.getItem("cf_chunk_reload") || 0);
  if (now - last > 10000) {
    sessionStorage.setItem("cf_chunk_reload", String(now));
    window.location.reload();
  }
});

// LanguageProvider is mounted inside BrowserRouter (in App.tsx) because it
// reads the URL via useLocation to keep language in sync with the path.
//
// When the page was prerendered at build time (scripts/prerender.mjs writes
// `<div id="root" data-prerendered="true">…</div>` into the static HTML),
// we must hydrate instead of re-rendering — otherwise React throws away the
// server markup and the static SEO content disappears for crawlers.
const rootEl = document.getElementById("root")!;
const tree = (
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
if (rootEl.dataset.prerendered === "true") {
  // The route components are code-split (preloadableLazy). If we hydrate before
  // the current route's chunk is loaded, its <Suspense> fallback (spinner)
  // renders on the client's first pass and does NOT match the prerendered HTML →
  // React #418/#423, and React discards the server markup and re-renders the
  // whole root (spinner flash + worse LCP). So preload the current route's
  // module first, THEN hydrate → clean, flash-free hydration. A 3s cap + catch
  // guarantee we hydrate even if a chunk is slow or fails (degrades to the old
  // behavior, never blocks first paint).
  const cap = new Promise<void>((resolve) => setTimeout(resolve, 3000));
  Promise.race([preloadForPath(window.location.pathname).catch(() => {}), cap])
    .finally(() => hydrateRoot(rootEl, tree));
} else {
  createRoot(rootEl).render(tree);
}
