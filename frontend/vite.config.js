import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import path from 'path';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  base: './',
  resolve: {
    alias: {
      // Add an alias for the public directory
      '@public': path.resolve(__dirname, './public')
    }
  },
  // Configure how different types of modules are loaded
  assetsInclude: ['**/*.csv'],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  },
  server: {
    port: 3001,
    open: true,
    host: true,
    strictPort: true,
    cors: true
  },
  publicDir: 'public',
  assetsInclude: ['**/*.csv']
})
