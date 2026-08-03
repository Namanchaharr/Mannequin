import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],

  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/vitest.setup.js",
  },
});