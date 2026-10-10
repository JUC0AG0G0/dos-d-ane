/// <reference types="vite/client" />

// Variables d'environnement du client, lues uniquement dans config/env.ts.
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
