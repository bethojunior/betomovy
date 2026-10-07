import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import importMetaEnv from "@import-meta-env/unplugin";
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    importMetaEnv.vite({ example: ".env.example" }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, './src')
    }
  }
});
