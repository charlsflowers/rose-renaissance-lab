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
    // No precargar los chunks de Sanity en el index.html: el Studio (editor) solo se necesita en
    // /studio y el cliente solo en el blog. Se cargan bajo demanda, no en la home del cliente.
    modulePreload: {
      resolveDependencies: (_filename, deps) =>
        deps.filter((d) => !d.includes("sanity-studio") && !d.includes("sanity-client")),
    },
    rollupOptions: {
      output: {
        // Split heavy libs into their own chunks so the marketing routes
        // (home / collection / product) don't ship Sanity Studio's ~4MB.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          // Cliente ligero de Sanity (lo usa el blog para leer posts/imágenes) — se deja en el
          // chunk por defecto para que NO arrastre el editor pesado.
          if (id.includes("@sanity/client") || id.includes("@sanity/image-url")) return "sanity-client";
          // Sanity Studio (editor de blog) — SOLO se usa en /studio. Aislado para que no pese
          // ~1,8 MB en cada página de la web del cliente.
          if (id.match(/[\\/]node_modules[\\/]sanity[\\/]/) || id.includes("@sanity/")) return "sanity-studio";
          if (id.includes("react-dom") || id.match(/[\\/]react[\\/]/)) return "react-vendor";
          if (id.includes("@tanstack/react-query")) return "react-query";
          if (id.includes("lucide-react")) return "icons";
          if (id.includes("@radix-ui")) return "radix";
        },
      },
    },
  },
}));
