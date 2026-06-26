import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
  },
  build: {
    rollupOptions: {
      output: {
        // Split heavy libs into their own chunks so the marketing routes
        // (home / collection / product) don't ship Sanity Studio's ~4MB.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("/sanity/") || id.includes("@sanity/")) return "sanity-studio";
          if (id.includes("react-dom") || id.match(/[\\/]react[\\/]/)) return "react-vendor";
          if (id.includes("@tanstack/react-query")) return "react-query";
          if (id.includes("lucide-react")) return "icons";
          if (id.includes("@radix-ui")) return "radix";
        },
      },
    },
  },
}));
