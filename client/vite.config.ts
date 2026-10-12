import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // `@/…` désigne src/ (voir aussi paths dans tsconfig.app.json).
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    // Écoute hors du conteneur Docker, toujours sur le même port interne
    // (le port du poste est CLIENT_PORT dans .env.dev).
    host: true,
    port: 5173,
    strictPort: true,
    // Rechargement à chaud : Docker Desktop (Windows, macOS) ne signale pas
    // toujours les modifications faites hors du conteneur, on scrute donc.
    watch: { usePolling: process.env.VITE_WATCH_POLLING === 'true' },
    // Avec VITE_API_URL=/api, le front appelle sa propre origine et Vite
    // relaie au serveur (adresse dans le réseau Docker, voir compose.dev.yaml).
    proxy: { '/api': process.env.API_PROXY_TARGET ?? 'http://localhost:3000' },
  },
});
