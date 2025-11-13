import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    root: '.', // Root is current directory
    build: {
        rollupOptions: {
            input: './index.html' // Entry point is index.html in root
        }
    },
    server: {
        port: 5173,
        proxy: {
            '/api': 'http://localhost:8000', // Proxy to PHP APIs
            '/images': 'http://localhost:8000', // Proxy to images
            '/styles': 'http://localhost:8000', // Proxy to styles
            '/include': 'http://localhost:8000' // Proxy to PHP includes
        }
    }
})