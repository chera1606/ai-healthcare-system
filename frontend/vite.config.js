import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../ai-healthcare-system-build/frontend"
  },
  server: {
    proxy: {
      "/api": "http://localhost:5000"
    }
  }
});
