import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ensure the base path is correct for GitHub Pages deployment
  base: '/p018/', 
  // Set a different port for local dev
  server: {
    port: 5173
  }
})