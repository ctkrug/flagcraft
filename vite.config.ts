import { defineConfig } from "vitest/config";

export default defineConfig({
  base: "./",
  build: {
    outDir: "site",
  },
  test: {
    environment: "jsdom",
  },
});
