import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Expose to network
    watch: {
      usePolling: true,
      interval: 1000,
      binaryInterval: 3000,
      ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/.next/**']
    }
  }
})
