/*
 * Construit la page d'analyse servie à la WebView, à partir des sources
 * TypeScript de src/page/ :
 *
 *   1. src/page/pose.ts (+ posture.ts) -> public/pose.js, un seul fichier
 *      JavaScript pour Safari (esbuild) : le téléphone ne compile rien.
 *   2. public/pose.html avec ce script inclus en clair -> src/pageInline.ts,
 *      pour le mode « HTML embarqué » du test caméra (source={{ html }}).
 *
 *   npm run build:page            # régénère les deux fichiers
 *   npm run build:page -- --check # échoue s'ils ne sont pas à jour (CI)
 *
 * Les deux fichiers produits sont GÉNÉRÉS : ne pas les éditer à la main.
 */
import { build } from 'esbuild';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const racine = join(dirname(fileURLToPath(import.meta.url)), '..');
const chemin = (p: string) => join(racine, p);
const verifier = process.argv.includes('--check');

const ENTETE =
  '// FICHIER GÉNÉRÉ par `npm run build:page` à partir de src/page/ : ne pas éditer à la main.\n';

// 1. Page : TypeScript -> un seul fichier JavaScript lisible.
const resultat = await build({
  entryPoints: [chemin('src/page/pose.ts')],
  bundle: true,
  format: 'iife',
  // iOS 16.4 minimum (Expo Go 57) : Safari 16 comprend tout le JS moderne.
  target: ['safari16'],
  banner: { js: ENTETE.trimEnd() },
  charset: 'utf8',
  write: false,
  logLevel: 'warning',
});
const poseJs = resultat.outputFiles[0].text;

// 2. Page inlinée : le <script src="./pose.js"> local remplacé par son code.
const balise = '<script src="./pose.js"></script>';
const html = readFileSync(chemin('public/pose.html'), 'utf8');
if (!html.includes(balise)) {
  throw new Error(`Balise introuvable dans public/pose.html : ${balise}`);
}
// </script> dans le code casserait le parseur HTML : on le neutralise.
const code = poseJs.replace(/<\/script>/gi, '<\\/script>');
const pageInline = `${ENTETE}// Source : public/pose.html + src/page/pose.ts + src/page/posture.ts
export const PAGE_INLINE = ${JSON.stringify(html.replace(balise, `<script>\n${code}</script>`))};
`;

const sorties: [string, string][] = [
  ['public/pose.js', poseJs],
  ['src/pageInline.ts', pageInline],
];

if (verifier) {
  const perimes = sorties.filter(([p, contenu]) => {
    try {
      return readFileSync(chemin(p), 'utf8') !== contenu;
    } catch {
      return true;
    }
  });
  if (perimes.length) {
    console.error(
      `Pas à jour : ${perimes.map(([p]) => p).join(', ')}. Lancer \`npm run build:page\`.`,
    );
    process.exit(1);
  }
  console.log('public/pose.js et src/pageInline.ts sont à jour.');
} else {
  for (const [p, contenu] of sorties) writeFileSync(chemin(p), contenu);
  console.log(
    `public/pose.js (${(poseJs.length / 1024).toFixed(1)} Ko) et src/pageInline.ts écrits.`,
  );
}
