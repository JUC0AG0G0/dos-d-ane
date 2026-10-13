import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  worker: { format: 'es', rolldownOptions: { output: { codeSplitting: false } } },
  resolve: { alias: { '@mediapipe/pose': fileURLToPath(new URL('./src/mediapipe-legacy-shim.js', import.meta.url)) } },
  base: './',
  build: { target: 'chrome130' },
  server: { host: '127.0.0.1', port: 5173, strictPort: true, headers: {
    'Cross-Origin-Opener-Policy':'same-origin', 'Cross-Origin-Embedder-Policy':'require-corp'
  } }
});
