import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
    // Le front appelle /api sur sa propre origine ; Vite relaie au serveur.
    proxy: { '/api': process.env.API_URL ?? 'http://localhost:3000' },
  },
});
