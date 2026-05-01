import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

// LanguageProvider is mounted inside BrowserRouter (in App.tsx) because it
// reads the URL via useLocation to keep language in sync with the path.
createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
