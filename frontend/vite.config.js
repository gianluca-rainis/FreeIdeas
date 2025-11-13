import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        proxy: {
            '/api': 'http://localhost:8000', // Proxy to PHP APIs
            '/images': 'http://localhost:8000', // Proxy to images
            '/styles': 'http://localhost:8000' // Proxy to styles
        }
    },
    build: {
        outDir: '../dist',
        rollupOptions: {
            input: {
            main: './index.html'
            }
        }
    }
})