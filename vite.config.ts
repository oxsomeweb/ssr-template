import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// SSR build:
//   vite build              → dist/client/index.html + dist/client/assets/*
//   vite build --ssr        → dist/server/entry-server.js
// api/index.ts reads dist/client/index.html as template and imports the
// SSR bundle to render per-request HTML.
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: { overlay: false },
  },
  build: {
    outDir: "dist/client",
    emptyOutDir: true,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));
