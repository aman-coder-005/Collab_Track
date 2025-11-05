import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Your existing tailwind plugin

// https://vitejs.dev/config/
export default defineConfig({
  // Your plugins
  plugins: [tailwindcss(), react()],
  
  // --- ADD THIS 'server' BLOCK ---
  server: {
    proxy: {
      // This says "any request that starts with /api...
      '/api': {
        target: 'http://localhost:5000', //...send it to our backend server
        changeOrigin: true, // Recommended for proxying
      },
    }
  }
})