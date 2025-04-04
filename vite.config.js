import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.', // Projenin kökü burası
  build: {
    rollupOptions: {
      input: resolve(__dirname, 'index.html'), // Doğrudan kök dizindeki index.html
    },
    outDir: 'dist'
  }
})
