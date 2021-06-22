import reactRefresh from "@vitejs/plugin-react-refresh";
import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  resolve: {
    alias: {
      chalk: path.join(__dirname, "chalk.js"),
    },
  },
});
