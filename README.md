# Dos d'âne

<img src="./images/dos d&apos;âne.jpeg" alt="Mascotte : un âne au dos voûté" width="240">

Aide à la posture pour le travail sédentaire, POC du Master UHA 4.0 (2026).

> Conseils généraux de posture et d'exercices. **Ne remplace pas l'avis d'un professionnel de santé.**

## À installer à la main

| Outil | Rôle | Installation |
| --- | --- | --- |
| [mise](https://mise.jdx.dev) | installe Node, Python et Task aux versions du projet | voir ci-dessous |
| [Docker](https://docs.docker.com/get-docker/) | fait tourner le client web, le serveur, la base et pgAdmin | Docker Desktop (macOS, Windows) ou Docker Engine (Linux) |

Tout le reste (Node, npm, Python, Task, dépendances, hooks Git) est installé automatiquement.

### Installer et activer mise

**macOS (Homebrew)**

```bash
brew install mise
echo 'eval "$(mise activate zsh)"' >> ~/.zshrc
```

**Linux / WSL** (mise s'installe dans `~/.local/bin`, d'où le chemin complet)

```bash
curl https://mise.run | sh
echo 'eval "$(~/.local/bin/mise activate zsh)"' >> ~/.zshrc     # shell zsh
echo 'eval "$(~/.local/bin/mise activate bash)"' >> ~/.bashrc   # shell bash
```

Ouvrir ensuite **un nouveau terminal** et vérifier : `mise doctor` doit afficher `activated: yes`.

## Premier lancement

```bash
git clone https://github.com/JUC0AG0G0/dos-d-ane.git
cd dos-d-ane
mise trust               # autorise la config du projet (une seule fois)
cd .. && cd dos-d-ane    # ressortir et revenir déclenche l'installation
```

La première fois, mise installe les outils (environ une minute) puis prépare le projet. À la fin :

```
✓ dos-d-ane : environnement OK
```

Sinon, chaque problème est listé avec la commande qui le règle (`task doctor` pour le détail). Docker lancé, il ne reste plus qu'à démarrer :

```bash
task dev
```

```
✓ Stack de dev lancée
  Client web  http://localhost:5173
  API         http://localhost:3000/api/health
  Swagger     http://localhost:3000/api/docs
  pgAdmin     http://localhost:5050
  PostgreSQL  localhost:5432 (base dosdane, utilisateur dosdane)
```

Si un port est déjà pris, `task dev` propose d'en prendre un libre au hasard.

Le rechargement à chaud est toujours actif : chaque modification de `client/src` met la page à jour, chaque modification de `server/src` recompile et relance l'API (`task logs` pour suivre).

## Commandes

| Commande | Rôle |
| --- | --- |
| `task dev` | lance client web, serveur, base et pgAdmin dans Docker et affiche leurs URL |
| `task dev:restore` | relance la stack avec uniquement les données du dernier dump (ou `-- fichier.sql`) |
| `task logs` | suit les logs |
| `task down` | arrête tout ; les données sont gardées pour le prochain `task dev` |
| `task clean` | arrête tout et **supprime** les données (demande confirmation) |
| `task check` | lint + compilation (lancé aussi avant chaque commit et push) |
| `task db:generate` | crée une migration depuis `server/prisma/schema.prisma`, sans l'appliquer |
| `task db:migrate` | applique les migrations pas encore appliquées |
| `task db:dump` | exporte la base dans `dumps/<date>.sql` (ignoré par Git, à ne pas partager) |
| `task db:restore` | annule la dernière migration, revient à une migration ou charge un dump |
| `task` | liste toutes les commandes |

`task up` construit les images comme en production : le client y est servi par nginx, qui relaie `/api` au serveur.

Les commandes de la base sont détaillées dans [databaseReadME.md](databaseReadME.md).

## Client web

React + Vite dans `client/src`, importé via `@/` (= `src/`) :

| Dossier | Contenu |
| --- | --- |
| `pages/` | un composant par route, déclarée dans `App.tsx` |
| `components/` | composants d'interface réutilisables, sans logique métier |
| `features/` | un dossier par fonctionnalité (appels API, hooks, composants) ; le reste de l'app n'importe que son `index.ts` |
| `utils/` | fonctions génériques (`apiFetch` pour appeler l'API) |
| `types/` | types partagés, dont les réponses de l'API |

Le front appelle toujours `/api/...` sur sa propre origine : Vite (dev) ou nginx (`task up`) relaie au serveur, sans CORS.

## Configuration

Seul `.env.dev.example` est versionné. Ton `.env.dev` (ports dont `CLIENT_PORT`, base, pgAdmin) est créé à partir de lui et tenu à jour automatiquement : à l'entrée dans le dossier, après chaque `git pull` et à chaque `task dev`, les variables nouvelles du modèle y sont ajoutées sans toucher à tes valeurs.

Le client et le serveur tournent toujours dans Docker, comme en production.

## Branches

`main` et `develop` ne reçoivent que des pull requests. Une branche par tâche, créée depuis `develop`.
