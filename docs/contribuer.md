# Contribuer

## Branches

- `main` : version stable, déployée en production. Jamais de push direct.
- `develop` : intégration, déployée en staging. Jamais de push direct.
- `feat/<sujet>`, `fix/<sujet>`, `docs/<sujet>` : une branche par tâche, créée depuis `develop`, fusionnée dans `develop` par pull request.
- Pour une livraison : PR `develop` → `main`, puis tag `vX.Y.Z` sur `main`.

À configurer dans **Settings → Branches** (règles de protection) pour `main` et `develop` : PR obligatoire, au moins une relecture, statut **`ci-ok`** requis.

## Avant d'ouvrir une PR

```bash
make test                  # ou les commandes de l'application modifiée
```

| Application | Lint | Tests |
| --- | --- | --- |
| backend | `npm run lint && npm run format:check` | `npm test && npm run test:e2e` |
| web | `npm run lint` | `npm test` |
| mobile | `npm run lint && npm run typecheck` | `npm test` |
| sensors | `ruff check . && ruff format --check .` | `pytest` |

## Conventions

- Code et noms techniques en anglais, documentation et messages utilisateur en français.
- Messages de commit courts et explicites, de préférence au format [Conventional Commits](https://www.conventionalcommits.org/fr/) (`feat(backend): ...`, `fix(sensors): ...`).
- Toute nouvelle variable d'environnement est ajoutée aux fichiers `.env*.example`, à sa validation (backend `env.validation.ts`, capteurs `config.py`) et à [deploiement.md](deploiement.md).
- Tout choix technique important est justifié dans la documentation, avec des sources.
