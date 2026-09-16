import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
export default defineConfig({
  plugins: [vue()],
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@codemirror') || id.includes('@lezer') || id.includes('/codemirror/')) return 'editor'
          if (id.includes('/node_modules/')) return 'vendor'
        }
      }
    }
  }
})
