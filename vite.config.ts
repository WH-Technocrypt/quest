import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // naikkan limit warning
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"], // pisahkan React
          vendors: ["@walletconnect/utils", "@coinbase/wallet-sdk"], // contoh vendor besar
        },
      },
    },
  },
}));
