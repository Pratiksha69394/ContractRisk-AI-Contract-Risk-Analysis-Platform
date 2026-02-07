import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Default API URL - can be overridden via environment variable in .env
// Note: loadEnv is used to properly load .env file variables in config
const env = loadEnv(process.env.NODE_ENV || 'development', path.resolve(__dirname, '.'), '');
const API_URL = env.VITE_API_URL || 'http://localhost:3001';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: API_URL,
                changeOrigin: true,
            },
        },
    },
    build: {
        outDir: 'dist',
    },
});
