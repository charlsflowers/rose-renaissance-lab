import { createRoot, hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { initMetaPixel } from "@/lib/metaPixel";
import { isProductionDomain } from "@/lib/isProductionDomain";

// Initialize Meta Pixel only on production domains.
// Cookie banner can later revoke it if the user opts out of marketing.
if (isProductionDomain()) {
  initMetaPixel();
}

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
  hydrateRoot(rootEl, tree);
} else {
  createRoot(rootEl).render(tree);
}
