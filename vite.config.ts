import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import vitePrerender from "vite-plugin-prerender";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    // Static prerender (option A). Only runs at production build time.
    // Keeps tracking/checkout untouched — only emits a server-rendered HTML
    // shell so Googlebot sees real markup for the most important routes.
    mode === "production" &&
      vitePrerender({
        staticDir: path.join(__dirname, "dist"),
        routes: ["/", "/bouquets", "/es", "/es/bouquets"],
        renderer: new vitePrerender.PuppeteerRenderer({
          renderAfterTime: 2000,
          headless: true,
        }),
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
  },
}));
