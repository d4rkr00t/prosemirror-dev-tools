import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ["@compiled/react/jsx-dev-runtime"],
  },
  plugins: [
    react({
      babel: {
        plugins: ["@compiled/babel-plugin"],
      },
    }),
  ],
  resolve: {
    alias: {
      chalk: path.join(__dirname, "example", "chalk.js"),
    },
  },
});
