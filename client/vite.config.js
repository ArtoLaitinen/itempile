import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default () => {
  return defineConfig({
    plugins: [react()],
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/test/setup.js",
    },
    esbuild: {
      loader: "jsx",
      include: /(src)\/.*\.jsx?$/,
      exclude: [],
    },
  });
};
