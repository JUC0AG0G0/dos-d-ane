/*
 * Compile la page d'analyse servie à la WebView : src/page/pose.ts (+ posture.ts
 * et TensorFlow.js) -> public/pose.js, un seul fichier JavaScript pour Safari.
 * Le téléphone ne compile rien : il charge ce fichier tel quel.
 *
 *   npm run build:page            # régénère public/pose.js
 *   npm run build:page -- --check # échoue s'il n'est pas à jour (CI)
 */
import { build, type Plugin } from 'esbuild';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const racine = join(dirname(fileURLToPath(import.meta.url)), '..');
const chemin = (p: string) => join(racine, p);
const verifier = process.argv.includes('--check');

const ENTETE =
  '// FICHIER GÉNÉRÉ par `npm run build:page` à partir de src/page/ : ne pas éditer à la main.';

// pose-detection importe aussi BlazePose (@mediapipe/pose) et le moteur WebGPU,
// que la page n'utilise pas (MoveNet + WebGL) : remplacés par un module vide.
const MODULES_INUTILES = /^(@mediapipe\/pose|@tensorflow\/tfjs-backend-webgpu)$/;
const moduleVide: Plugin = {
  name: 'module-vide',
  setup(b) {
    b.onResolve({ filter: MODULES_INUTILES }, (args) => ({ path: args.path, namespace: 'vide' }));
    b.onLoad({ filter: /.*/, namespace: 'vide' }, () => ({ contents: 'module.exports = {};' }));
  },
};

const resultat = await build({
  entryPoints: [chemin('src/page/pose.ts')],
  bundle: true,
  format: 'iife',
  // iOS 16.4 minimum (Expo Go 57) : Safari 16 comprend tout le JS moderne.
  target: ['safari16'],
  banner: { js: ENTETE },
  charset: 'utf8',
  minify: true,
  plugins: [moduleVide],
  write: false,
  logLevel: 'warning',
});
const poseJs = resultat.outputFiles[0].text;

const sortie = chemin('public/pose.js');

if (verifier) {
  const actuel = existsSync(sortie) ? readFileSync(sortie, 'utf8') : '';
  if (actuel !== poseJs) {
    console.error('public/pose.js n’est pas à jour : lancer `npm run build:page`.');
    process.exit(1);
  }
  console.log('public/pose.js est à jour.');
} else {
  writeFileSync(sortie, poseJs);
  console.log(`public/pose.js écrit (${(poseJs.length / 1024).toFixed(0)} Ko).`);
}
