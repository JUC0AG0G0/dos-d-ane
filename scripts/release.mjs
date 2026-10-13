#!/usr/bin/env node
// Versions et images des apps, pour les workflows GitHub (voir deployReadME.md).
// Les apps sont décrites dans .github/apps.json. Une image est étiquetée
// tree-<empreinte git du dossier de l'app> : même contenu, même image.
//   node scripts/release.mjs changed <base>  apps modifiées depuis <base> (CI des PR)
//   node scripts/release.mjs builds          images à construire sur develop (préprod)
//   node scripts/release.mjs pr              plan de versions d'une PR vers main
//   node scripts/release.mjs merge           versions à publier après le merge sur main
// Sans dépendance : Node 20+, git et docker (connecté à ghcr.io pour builds/pr/merge).
import { execFileSync } from 'node:child_process';
import { appendFileSync, readFileSync } from 'node:fs';

const config = JSON.parse(readFileSync('.github/apps.json', 'utf8'));
const apps = Object.entries(config.apps).map(([name, app]) => ({ name, ...app }));
const env = process.env;

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const gitOr = (fallback, ...args) => {
  try {
    return git(...args);
  } catch {
    return fallback;
  }
};

function output(key, value) {
  const line = `${key}=${typeof value === 'string' ? value : JSON.stringify(value)}\n`;
  if (env.GITHUB_OUTPUT) appendFileSync(env.GITHUB_OUTPUT, line);
  else process.stdout.write(line);
}
function summary(markdown) {
  if (env.GITHUB_STEP_SUMMARY) appendFileSync(env.GITHUB_STEP_SUMMARY, `${markdown}\n`);
  else console.log(markdown);
}
function fail(message) {
  console.error(`::error::${message.replace(/\n/g, '%0A')}`);
  summary(`### ❌ ${message}`);
  process.exit(1);
}

const imageRef = (image, tag) => `${config.registry}-${image}:${tag}`;
const treeOf = (app, ref = 'HEAD') => gitOr(null, 'rev-parse', `${ref}:${app.path}`);

function imageExists(ref) {
  try {
    execFileSync('docker', ['buildx', 'imagetools', 'inspect', ref], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// --- Versions -------------------------------------------------------------

const BUMPS = ['major', 'minor', 'patch'];
const FIRST_VERSION = '1.0.0';

function lastRelease(app) {
  const pattern = new RegExp(`^${app.name}-v(\\d+)\\.(\\d+)\\.(\\d+)$`);
  const tag = gitOr('', 'tag', '--list', `${app.name}-v*`, '--sort=-v:refname')
    .split('\n')
    .find((t) => pattern.test(t));
  return tag ? { tag, version: tag.slice(app.name.length + 2) } : null;
}

function bump(version, kind) {
  const [major, minor, patch] = version.split('.').map(Number);
  if (kind === 'major') return `${major + 1}.0.0`;
  if (kind === 'minor') return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

/** Apps dont le dossier a changé depuis leur dernière version publiée. */
function releasePlan(body) {
  const chosen = parseChoices(body);
  return apps
    .map((app) => {
      const last = lastRelease(app);
      const tree = treeOf(app);
      if (!tree || (last && treeOf(app, last.tag) === tree)) return null;
      const kind = chosen[app.name] ?? 'patch';
      return {
        app: app.name,
        tree,
        kind: last ? kind : 'first',
        previous: last?.version ?? null,
        previousTag: last?.tag ?? null,
        version: last ? bump(last.version, kind) : FIRST_VERSION,
      };
    })
    .filter(Boolean);
}

// --- Section « Versions » de la description de la PR ----------------------

const START = '<!-- release:start -->';
const END = '<!-- release:end -->';
const LABELS = {
  major: 'major : changement incompatible',
  minor: 'minor : nouvelle fonctionnalité',
  patch: 'patch : correctif',
};

function parseChoices(body = '') {
  const choices = {};
  const re = /- \[([ xX])\][^\n]*<!-- ([\w-]+):(major|minor|patch) -->/g;
  for (const [, mark, app, kind] of body.matchAll(re)) {
    if (mark === ' ') continue;
    // Plusieurs cases cochées : la plus forte l'emporte.
    if (!choices[app] || BUMPS.indexOf(kind) < BUMPS.indexOf(choices[app])) choices[app] = kind;
  }
  return choices;
}

function releaseSection(plan) {
  const lines = [START, '## Versions publiées au merge', ''];
  if (!plan.length) {
    lines.push('Aucune app modifiée depuis sa dernière version : rien ne sera publié, la prod sera seulement redéployée.');
  } else {
    lines.push(
      'Laisse une seule case cochée par app modifiée (`patch` si aucune). La CI met cette section à jour.',
    );
    for (const r of plan) {
      lines.push('');
      if (r.kind === 'first') {
        lines.push(`**${r.app}** : première version → **${r.version}**`);
        continue;
      }
      lines.push(`**${r.app}** : ${r.previous} → **${r.version}**`);
      for (const kind of BUMPS) {
        lines.push(`- [${kind === r.kind ? 'x' : ' '}] ${LABELS[kind]} <!-- ${r.app}:${kind} -->`);
      }
    }
  }
  lines.push(END);
  return lines.join('\n');
}

function withSection(body, section) {
  const start = body.indexOf(START);
  const end = body.indexOf(END);
  if (start !== -1 && end > start) {
    return body.slice(0, start) + section + body.slice(end + END.length);
  }
  return `${body.trimEnd()}${body.trim() ? '\n\n' : ''}${section}\n`;
}

// --- API GitHub -------------------------------------------------------------

async function api(path, options = {}) {
  const response = await fetch(`${env.GITHUB_API_URL ?? 'https://api.github.com'}${path}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...options.headers,
    },
  });
  if (!response.ok) throw new Error(`${options.method ?? 'GET'} ${path} : ${response.status} ${await response.text()}`);
  return response.json();
}
const repo = env.GITHUB_REPOSITORY;

/** Attend la fin de la préprod (workflow preprod.yml) de ce commit. */
async function preprodConclusion(sha) {
  for (let attempt = 0; attempt < 120; attempt++) {
    const { workflow_runs: runs } = await api(
      `/repos/${repo}/actions/workflows/preprod.yml/runs?head_sha=${sha}&event=push&per_page=1`,
    );
    const run = runs[0];
    if (!run) return { conclusion: 'missing' };
    if (run.status === 'completed') return run;
    if (attempt === 0) console.log(`Préprod en cours (${run.html_url}), attente…`);
    await new Promise((r) => setTimeout(r, 20_000));
  }
  return { conclusion: 'timeout' };
}

function missingImages(plan) {
  return plan.flatMap((r) =>
    Object.keys(config.apps[r.app].images)
      .map((image) => imageRef(image, `tree-${r.tree}`))
      .filter((ref) => !imageExists(ref)),
  );
}

function planTable(plan) {
  if (!plan.length) return 'Aucune app à publier.';
  return [
    '| App | Version | Type |',
    '|---|---|---|',
    ...plan.map((r) => `| ${r.app} | ${r.previous ?? '–'} → **${r.version}** | ${r.kind} |`),
  ].join('\n');
}

// --- Commandes -------------------------------------------------------------

const [command, arg] = process.argv.slice(2);

if (command === 'changed') {
  // Apps touchées par une PR, et ce qu'il faut vérifier en plus.
  const files = git('diff', '--name-only', `${arg}...HEAD`).split('\n').filter(Boolean);
  const touched = (app) => files.some((f) => f.startsWith(`${app.path}/`));
  const changed = apps.filter(touched).map((a) => a.name);
  const dockerFiles = /^(compose[^/]*\.yaml|\.env\.prod\.example|[^/]+\/(Dockerfile|\.dockerignore|nginx\.conf))$/;
  const docker = apps
    .filter((a) => files.some((f) => f.startsWith(`${a.path}/`) && dockerFiles.test(f)))
    .flatMap((a) =>
      Object.entries(a.images).map(([image, target]) => ({ app: a.name, image, target, context: a.path })),
    );
  output('apps', changed);
  output('docker', docker);
  output('compose', String(files.some((f) => /^(compose[^/]*\.yaml|\.env\.prod\.example)$/.test(f))));
  output(
    'api_docs',
    String(files.some((f) => /^server\/(src\/.*\.(controller|dto)\.ts|src\/(api-docs|openapi)\.ts|openapi\.json|ROUTES\.md)$/.test(f))),
  );
  summary(`Apps modifiées : ${changed.join(', ') || 'aucune'}`);
} else if (command === 'builds') {
  // Images absentes de la registry pour le contenu actuel de chaque app.
  const builds = [];
  const tags = {};
  for (const app of apps) {
    const tree = treeOf(app);
    tags[`${app.name.toUpperCase()}_TAG`] = `tree-${tree}`;
    for (const [image, target] of Object.entries(app.images)) {
      const ref = imageRef(image, `tree-${tree}`);
      if (!imageExists(ref)) builds.push({ app: app.name, image, target, context: app.path, ref });
    }
  }
  const before = env.BEFORE_SHA;
  const composeChanged =
    !before || /^0+$/.test(before) || !gitOr('', 'cat-file', '-t', before)
      ? true
      : git('diff', '--name-only', before, 'HEAD')
          .split('\n')
          .some((f) => /^(compose[^/]*\.yaml|\.env\.prod\.example|scripts\/deploy\.sh)$/.test(f));
  output('builds', builds);
  output('tags', tags);
  output('smoke', String(builds.length > 0 || composeChanged));
  summary(
    builds.length
      ? `Images à construire :\n${builds.map((b) => `- \`${b.ref}\``).join('\n')}`
      : 'Toutes les images existent déjà sur la registry.',
  );
} else if (command === 'pr') {
  const event = JSON.parse(readFileSync(env.GITHUB_EVENT_PATH, 'utf8'));
  const number = event.pull_request.number;
  // Description relue en direct : elle a pu changer depuis le déclenchement.
  const pr = await api(`/repos/${repo}/pulls/${number}`);
  const plan = releasePlan(pr.body ?? '');
  const body = withSection(pr.body ?? '', releaseSection(plan));
  if (body !== (pr.body ?? '')) {
    await api(`/repos/${repo}/pulls/${number}`, { method: 'PATCH', body: JSON.stringify({ body }) });
  }
  summary(`## Versions publiées au merge\n\n${planTable(plan)}`);

  const run = await preprodConclusion(pr.head.sha);
  if (run.conclusion === 'missing') {
    fail(`Pas de préprod pour ${pr.head.sha.slice(0, 7)} : une PR vers main doit partir de develop.`);
  }
  if (run.conclusion !== 'success') {
    fail(`La préprod de ce commit n'est pas verte (${run.conclusion}) : ${run.html_url ?? ''}`);
  }
  const missing = missingImages(plan);
  if (missing.length) fail(`Images absentes de la registry :\n${missing.join('\n')}`);
  summary('✓ Préprod verte et images prêtes.');
} else if (command === 'merge') {
  const sha = env.GITHUB_SHA;
  // Le lien commit -> PR peut mettre quelques secondes à apparaître.
  let pr;
  for (let attempt = 0; attempt < 6 && !pr; attempt++) {
    if (attempt) await new Promise((r) => setTimeout(r, 10_000));
    const pulls = await api(`/repos/${repo}/commits/${sha}/pulls`);
    pr = pulls.find((p) => p.base.ref === 'main' && p.merged_at);
  }
  if (!pr) console.log('::warning::PR du merge introuvable : versions patch par défaut.');
  const plan = releasePlan(pr?.body ?? '');
  const missing = missingImages(plan);
  if (missing.length) fail(`Images absentes de la registry :\n${missing.join('\n')}`);
  output('releases', plan);
  summary(`## Versions publiées\n\n${pr ? `PR #${pr.number}\n\n` : ''}${planTable(plan)}`);
} else {
  console.error('Usage : node scripts/release.mjs changed <base> | builds | pr | merge');
  process.exit(2);
}
