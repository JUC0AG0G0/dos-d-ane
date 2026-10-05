# Contribuer

## Branches

- `main` : version stable, déployée en production. Jamais de push direct.
- `develop` : intégration, déployée en staging. Jamais de push direct.
- `feat/<sujet>`, `fix/<sujet>`, `docs/<sujet>` : une branche par tâche, créée depuis `develop`, fusionnée dans `develop` par pull request.
- Pour une livraison : PR `develop` → `main`, puis tag `vX.Y.Z` sur `main`.

À configurer dans **Settings → Branches** (règles de protection) pour `main` et `develop` : PR obligatoire, au moins une relecture, statut **`ci-ok`** requis.

## Vérifications locales (Husky + mise)

`mise run setup` installe les dépendances et active les hooks Git :

| Hook | Commande | Vérifie |
| --- | --- | --- |
| `pre-commit` | `mise run lint` | lint de toutes les apps (oxlint, Prettier, ruff) |
| `pre-push` | `mise run check` | lint + compilation de toutes les apps |

La CI lance les mêmes tâches. On peut aussi lancer une seule app : `mise run lint:backend`, `mise run build:web`… (`mise tasks` pour la liste).

Pour l'instant, il n'y a pas de tests unitaires : la « suite de tests » vérifie seulement que tout compile (`nest build`, `vite build`, `tsc` pour le mobile, `compileall` pour Python). Quand des tests seront ajoutés, créer une tâche `test:<app>` dans `mise.toml` et l'ajouter à `check`.

## Conventions

- Code et noms techniques en anglais, documentation et messages utilisateur en français.
- Messages de commit courts et explicites, de préférence au format [Conventional Commits](https://www.conventionalcommits.org/fr/) (`feat(backend): ...`, `fix(web): ...`).
- Toute nouvelle variable d'environnement est ajoutée aux fichiers `.env*.example`, à sa vérification au démarrage et à [deploiement.md](deploiement.md).
- Toute nouvelle route de l'API est documentée avec les décorateurs Swagger.
- Tout choix technique important est justifié dans la documentation, avec des sources.
