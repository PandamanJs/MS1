import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  define: {
    'import.meta.env.VITE_DATABASE_URL': JSON.stringify(process.env.DATABASE_URL),
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['buffer']
  },
  server: {
    host: "0.0.0.0",
    port: 5000,
    strictPort: true,
    allowedHosts: ["localhost", ".replit.dev", ".replit.co", "*.replit.dev", "*.worf.replit.dev", "9b335b80-cc03-48a8-a731-aae8d4c760ff-00-irbmh4ybbywj.worf.replit.dev"],
    hmr: {
      port: 443,
      clientPort: 443,
      protocol: 'wss',
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 5000,
    strictPort: true,
  },
});
