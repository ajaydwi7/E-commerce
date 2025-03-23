import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({ command, mode }) => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "@images": fileURLToPath(
          new URL("./src/assets/images", import.meta.url)
        ), // Alias for Gallery
      },
    },

    server: {
      host: "0.0.0.0",
      port: process.env.PORT || 5173, // Use available port, default to 5173
      strictPort: false, // Allows using another available port if 5174 is occupied
      // proxy: {
      //   "/api": {
      //     target: "http://localhost:3000", // Backend server
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/api/, ""),
      //   },
      // },
      historyApiFallback: true,
    },
    build: {
      sourcemap: false, // Disable sourcemaps to avoid errors
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true, // Remove console logs
        },
      },
      rollupOptions: {
        external: ["@dotlottie/player-component"],
      },
    },
  };
});
