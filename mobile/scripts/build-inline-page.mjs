/*
 * Fabrique src/pageInline.ts à partir de public/pose.html : les deux <script
 * src="./…"> locaux sont remplacés par leur code en clair, pour que la page
 * tienne dans une seule chaîne de caractères.
 *
 * Utile uniquement au mode « HTML embarqué » (source={{ html }}) de l'app.
 * Les <script> du CDN restent des URL : ils sont téléchargés par le téléphone.
 *
 *   node scripts/build-inline-page.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const racine = join(dirname(fileURLToPath(import.meta.url)), '..');
const lire = (p) => readFileSync(join(racine, p), 'utf8');

let html = lire('public/pose.html');

for (const fichier of ['posture.js', 'pose.js']) {
  const balise = `<script src="./${fichier}"></script>`;
  if (!html.includes(balise)) {
    throw new Error(`Balise introuvable dans public/pose.html : ${balise}`);
  }
  // </script> dans le code JS casserait le parseur HTML : on le neutralise.
  const code = lire(`public/${fichier}`).replace(/<\/script>/gi, '<\\/script>');
  html = html.replace(balise, `<script>\n${code}\n</script>`);
}

const sortie = `// FICHIER GÉNÉRÉ — ne pas éditer à la main.
// Source : public/pose.html + public/posture.js + public/pose.js
// Régénérer avec : npm run build:page
export const PAGE_INLINE = ${JSON.stringify(html)};
`;

mkdirSync(join(racine, 'src'), { recursive: true });
writeFileSync(join(racine, 'src/pageInline.ts'), sortie);
console.log(`src/pageInline.ts écrit (${(html.length / 1024).toFixed(1)} Ko de HTML).`);
