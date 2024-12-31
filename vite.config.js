import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(dirname(fileURLToPath(import.meta.url)), "./src"),
    },
  },
  base: "/automate-my-syriatel-bills/",
});
