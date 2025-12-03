import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Bind to all network interfaces (was 'true')
    port: 5173,
    strictPort: true,
    allowedHosts: [
      'chat.progenicslabs.com',
      'localhost',
      '127.0.0.1',
      '.progenicslabs.com' // Allow all subdomains
    ],
    cors: true,
    proxy: {
      // Optional: Proxy API requests to avoid CORS issues in development
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      // Proxy Ollama requests to avoid CORS issues
      '/ollama': {
        target: 'http://localhost:11434',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/ollama/, ''),
      }
    },
    watch: {
      usePolling: true,
      interval: 1000,
      binaryInterval: 3000,
      ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/.next/**']
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
  }
})

