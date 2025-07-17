import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr"; // 추가
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    svgr(), // 추가
  ],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(path.dirname(new URL(import.meta.url).pathname), "src"),
      },
    ],
  },
});