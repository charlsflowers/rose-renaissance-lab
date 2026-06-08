import { createRoot } from "react-dom/client";
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
createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
