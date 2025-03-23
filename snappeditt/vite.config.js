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
      proxy: {
        "/api": {
          target: import.meta.env.VITE_API_URL,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
      historyApiFallback: true,
    },
    build: {
      outDir: "../snappeditt/dist", // Match Express static path
      emptyOutDir: true,
      sourcemap: false, // Disable sourcemaps to avoid errors
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: mode === "production", // Remove console logs
        },
      },
      rollupOptions: {
        external: ["@dotlottie/player-component"],
        output: {
          assetFileNames: "assets/[name]-[hash][extname]",
          entryFileNames: "assets/[name]-[hash].js",
        },
      },
    },
    headers: {
      "Content-Security-Policy": "script-src 'self' https://www.paypal.com;",
    },
    css: {
      devSourcemap: false,
      postcss: {
        plugins: [require("cssnano")],
      },
    },
    esbuild: {
      legalComments: "none",
    },
  };
});
