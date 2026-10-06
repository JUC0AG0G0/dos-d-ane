# Contribuer

## Branches

- `main` : version stable, déployée en production. Jamais de push direct.
- `develop` : intégration, déployée en staging. Jamais de push direct.
- `feat/<sujet>`, `fix/<sujet>`, `docs/<sujet>` : une branche par tâche, créée depuis `develop`, fusionnée dans `develop` par pull request.
- Pour une livraison : PR `develop` → `main`, puis tag `vX.Y.Z` sur `main`.

À configurer dans **Settings → Branches** (règles de protection) pour `main` et `develop` : PR obligatoire, au moins une relecture, statut **`ci-ok`** requis.

## Vérifications locales (Husky + Task)

`task doctor` vérifie les versions des outils et l'installation (lancé automatiquement à l'entrée du dossier si mise est activé dans le shell). `task setup` installe les dépendances et active les hooks Git :

| Hook | Commande | Vérifie |
| --- | --- | --- |
| `pre-commit` | `task lint` | lint et formatage du serveur (oxlint, Prettier) |
| `pre-push` | `task check` | lint + compilation du serveur |

La CI lance les mêmes tâches.

Pour l'instant, il n'y a pas de tests unitaires : la « suite de tests » vérifie seulement que le serveur compile (`nest build`). Quand des tests seront ajoutés, créer une tâche `test` dans `Taskfile.yml` et l'ajouter à `check`.

## Conventions

- Code et noms techniques en anglais, documentation et messages utilisateur en français.
- Messages de commit courts et explicites, de préférence au format [Conventional Commits](https://www.conventionalcommits.org/fr/) (`feat(server): ...`, `fix(server): ...`).
- Toute nouvelle variable d'environnement est ajoutée aux fichiers `.env*.example`, à sa vérification au démarrage et à [deploiement.md](deploiement.md).
- Toute nouvelle route de l'API est documentée avec les décorateurs Swagger.
- Tout choix technique important est justifié dans la documentation, avec des sources.
