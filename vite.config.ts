import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],

  define: {
    global: "globalThis",
  },

  ssr: {
    external: [
      "@uiw/react-markdown-preview",
      "@uiw/react-md-editor",
      "@tiptap/react",
      "@tiptap/starter-kit",
      "@tiptap/extensions",
      "@tiptap/pm",
      "lowlight",
      "recharts",
      "motion",
      "@lottiefiles/dotlottie-react",
    ],
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-router")) return "router";
            if (id.includes("react")) return "react";
            if (id.includes("radix")) return "radix";
            if (id.includes("tiptap")) return "editor";
            if (id.includes("recharts")) return "charts";
            return "vendor";
          }
        },
      },
    },
  },
});
