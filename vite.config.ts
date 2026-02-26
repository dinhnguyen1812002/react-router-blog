import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],

  define: {
    global: "globalThis",
  },

  ssr: {
    noExternal: [
      "@uiw/react-markdown-preview",
      "@uiw/react-md-editor",
    ],
  },

  build: {
    target: 'es2020',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Disable manual chunking to avoid circular dependency issues
        manualChunks: undefined,
        // Use a simpler naming strategy
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
    },
  },

  optimizeDeps: {
    // Force pre-bundling of problematic dependencies
    include: [
      'react',
      'react-dom',
      'react-router',
      'zustand',
      '@tanstack/react-query',
      'axios',
      'clsx',
      'tailwind-merge',
      'lucide-react',
      'boring-avatars',
      'sonner',
      'use-sync-external-store/shim'
    ]
  },
  server: {
    hmr: {
      overlay: false
    }
  }
});
