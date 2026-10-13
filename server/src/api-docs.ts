/**
 * Écrit server/openapi.json et server/ROUTES.md depuis les contrôleurs et les
 * DTO, sans base ni Docker : Nest démarre en mode « preview », qui lit les
 * décorateurs sans créer les services (aucune connexion).
 *   task api:docs            # régénère les fichiers
 *   task api:docs -- --check # échoue s'ils ne sont pas à jour (CI)
 *   node dist/api-docs.js --out=<dossier>   # écrit ailleurs (release)
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { NestFactory } from '@nestjs/core';
import type { OpenAPIObject } from '@nestjs/swagger';

// Valeurs factices pour passer la validation de la configuration : rien ne
// s'y connecte en mode preview.
process.env.DATABASE_URL ??= 'postgresql://preview@localhost/preview';
process.env.JWT_SECRET ??= 'preview'.repeat(8);
process.env.APP_VERSION ??= 'dev';

const { AppModule } = await import('./app.module.js');
const { createOpenApiDocument } = await import('./openapi.js');

const app = await NestFactory.create(AppModule, {
  preview: true,
  logger: false,
});
app.setGlobalPrefix('api');
const document = createOpenApiDocument(app);
await app.close();

const METHODS = ['get', 'post', 'put', 'patch', 'delete'] as const;
type Operation = NonNullable<OpenAPIObject['paths'][string]['get']> & {
  'x-public'?: boolean;
  'x-roles'?: string[];
};

function access(op: Operation): string {
  if (op['x-public']) return 'public';
  if (op['x-roles']?.length) return op['x-roles'].join(', ');
  return 'connecté';
}

function cell(text: string | undefined): string {
  return (text ?? '').replace(/\|/g, '\\|').replace(/\s*\n\s*/g, ' ');
}

function routesMarkdown(doc: OpenAPIObject): string {
  const byTag = new Map<string, string[]>();
  for (const [path, item] of Object.entries(doc.paths)) {
    for (const method of METHODS) {
      const op = item[method] as Operation | undefined;
      if (!op) continue;
      const tag = op.tags?.[0] ?? 'autres';
      const rows = byTag.get(tag) ?? [];
      rows.push(
        `| ${method.toUpperCase()} | \`${path}\` | ${access(op)} | ${cell(op.summary ?? op.description)} |`,
      );
      byTag.set(tag, rows);
    }
  }
  const sections = [...byTag.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(
      ([tag, rows]) =>
        `## ${tag}\n\n| Méthode | Route | Accès | Description |\n|---|---|---|---|\n${rows.join('\n')}\n`,
    );
  return [
    '# Routes de l’API',
    '',
    '<!-- Fichier généré par `task api:docs` depuis les contrôleurs : ne pas modifier à la main. -->',
    '',
    'Accès : `public` sans connexion, `connecté` avec un token (`Authorization: Bearer …`), sinon le rôle requis.',
    'Détail des corps et des réponses : `openapi.json` (importable dans Postman, Bruno ou Swagger Editor) ou `/api/docs` en dev.',
    '',
    ...sections,
  ].join('\n');
}

const out = process.argv.find((a) => a.startsWith('--out='))?.slice(6);
const root = out ?? join(import.meta.dirname, '..');
const files = {
  'openapi.json': `${JSON.stringify(document, null, 2)}\n`,
  'ROUTES.md': routesMarkdown(document),
};

const check = process.argv.includes('--check');
const stale = Object.entries(files).filter(([name, content]) => {
  const path = join(root, name);
  return !existsSync(path) || readFileSync(path, 'utf8') !== content;
});
if (check) {
  if (stale.length) {
    console.error(
      `Pas à jour : ${stale.map(([n]) => `server/${n}`).join(', ')}. Lancer \`task api:docs\` et commiter.`,
    );
    process.exit(1);
  }
  console.log('✓ openapi.json et ROUTES.md à jour');
} else {
  for (const [name, content] of stale) writeFileSync(join(root, name), content);
  console.log(
    stale.length
      ? `✓ Mis à jour : ${stale.map(([n]) => `server/${n}`).join(', ')}`
      : '✓ openapi.json et ROUTES.md déjà à jour',
  );
}
