# Dos d'âne

<img src="./images/dos d&apos;âne.jpeg" alt="Mascotte : un âne au dos voûté" width="240">

Système d'aide à la posture pour le travail sédentaire, réalisé en POC dans le cadre du fil rouge du Master UHA 4.0 (2026).

> Dos d'âne donne des conseils généraux de posture et d'exercices. **Il ne remplace pas l'avis d'un professionnel de santé.**

| Dossier / fichier | Rôle |
| --- | --- |
| [`server/`](server) | API NestJS (TypeScript), Swagger sur `/api/docs` |
| `Taskfile.yml` | toutes les commandes du projet (`task`) |
| `mise.toml` | versions de Node, Python et Task + vérification à l'entrée du dossier |
| `scripts/doctor.sh` | vérification de l'environnement (`task doctor`) |
| `compose.yaml`, `compose.dev.yaml` | stack Docker (serveur + PostgreSQL) |

## 1. Ce qu'il faut sur ta machine

Seulement trois choses à installer soi-même :

| Outil | Pourquoi | Installation |
| --- | --- | --- |
| **Git** | cloner le dépôt | déjà présent sur macOS/Linux |
| **mise** | installe Node, npm, Python et Task aux bonnes versions | macOS : `brew install mise` · Linux : `curl https://mise.run \| sh` |
| **Docker** avec le plugin compose | lancer le serveur et la base | [Docker Desktop](https://www.docker.com/products/docker-desktop/) (macOS/Windows) ou Docker Engine (Linux) |

Tout le reste est installé par mise, aux versions fixées dans `mise.toml` :

| Outil | Version |
| --- | --- |
| Node | 26 (avec npm 11) |
| Python | 3.11 |
| Task | 3 |

Sous Windows, utiliser WSL 2 (Ubuntu) et suivre les instructions Linux.

## 2. Activer mise une fois pour toutes

Ajouter la ligne correspondant à ton shell à la fin de son fichier de configuration, puis ouvrir un nouveau terminal :

| Shell | Fichier | Ligne à ajouter |
| --- | --- | --- |
| zsh (macOS par défaut) | `~/.zshrc` | `eval "$(mise activate zsh)"` |
| bash | `~/.bashrc` | `eval "$(mise activate bash)"` |
| fish | `~/.config/fish/config.fish` | `mise activate fish \| source` |

Par exemple pour zsh :

```bash
echo 'eval "$(mise activate zsh)"' >> ~/.zshrc
exec zsh
```

Dès lors, **chaque fois que tu entres dans le dossier du projet** (`cd`, ou un nouveau terminal ouvert dedans) :

1. mise met Node, npm, Python et Task aux versions du projet (et revient aux tiennes quand tu sors du dossier) ;
2. mise lance `scripts/doctor.sh`, qui vérifie l'environnement et affiche le résultat.

## 3. Première installation du projet

```bash
git clone https://github.com/JUC0AG0G0/dos-d-ane.git
cd dos-d-ane
mise trust                     # autorise mise.toml (une seule fois)
mise install                   # Node 26, Python 3.11, Task 3
task setup                     # dépendances du serveur + hooks Git (Husky)
cp .env.development.example .env.development
```

Puis sortir et revenir dans le dossier (ou ouvrir un nouveau terminal) : la vérification doit afficher que tout est OK.

## 4. Ce que la vérification affiche

**Tout est OK** :

```
✓ dos-d-ane : environnement OK
```

**Il manque quelque chose** : chaque problème est listé avec la commande qui le règle.

```
  ✗ node 22.22.0 au lieu de 26 : lancer `mise install` et activer mise dans le shell
  ✗ npm 10.9.4 trop ancien (11 minimum, fourni avec Node 26)
  ! .env.development absent : cp .env.development.example .env.development
✗ dos-d-ane : 2 erreur(s), 1 avertissement(s) (détails : task doctor)
```

- `✗` erreur : un outil manque ou n'a pas la bonne version, le projet ne fonctionnera pas.
- `!` avertissement : une étape d'installation n'a pas été faite (dépendances, hooks Git, `.env`).

`task doctor` affiche à tout moment le rapport complet, avec chaque point vérifié :

```
Outils
  ✓ node 26.10.0
  ✓ python 3.11.15
  ✓ task 3.54.0
  ✓ npm 11.19.1
  ✓ docker compose 5.3.1
Projet
  ✓ dépendances du serveur installées
  ✓ hooks Git (Husky) actifs
  ✓ .env.development présent
✓ dos-d-ane : environnement OK
```

Si rien ne s'affiche en entrant dans le dossier, mise n'est pas activé dans ton shell (étape 2) ou `mise.toml` n'a pas été autorisé (`mise trust`).

## 5. Commandes

`task` sans argument liste toutes les commandes.

| Commande | Rôle |
| --- | --- |
| `task doctor` | vérifie l'environnement |
| `task setup` | installe les dépendances et active les hooks Git |
| `task dev` | lance le serveur et PostgreSQL dans Docker, avec rechargement à chaud (http://localhost:3000/api/docs) |
| `task start` | lance le serveur sans Docker (lit `server/.env`, modèle `server/.env.example`) |
| `task lint` / `task format` | vérifie / corrige le style du code |
| `task build` | vérifie que le serveur compile |
| `task check` | lint + compilation |
| `task up ENV=staging` | lance la stack avec l'image publiée (`ENV` = `development`, `staging` ou `production`) |
| `task down`, `task logs`, `task ps` | arrêter, suivre les logs, voir l'état (avec `ENV=…`) |

Les hooks Git lancent automatiquement `task lint` avant chaque commit et `task check` avant chaque push. Il n'y a pas encore de tests unitaires : la vérification se limite à la compilation.

## 6. Environnements et déploiement

| Environnement | Branche | Fichier de config |
| --- | --- | --- |
| `development` | toute branche | `.env.development` (copie de `.env.development.example`) |
| `staging` | `develop` | `.env.staging` |
| `production` | `main` | `.env.production` |

Les fichiers `.env.*` réels ne sont jamais commités ; seuls les `.env.*.example` le sont.

**CI** (`.github/workflows/ci.yml`) : lint, compilation et build de l'image à chaque PR et push sur `main` et `develop`. Le check `ci-ok` peut être rendu obligatoire dans les règles de protection de branche.

**CD** (`.github/workflows/cd.yml`) : sur `develop` et `main`, publie l'image `ghcr.io/juc0ag0g0/dos-d-ane-server` puis la déploie en SSH. À configurer dans **Settings → Environments**, pour `staging` et pour `production` :

| Secret | Valeur |
| --- | --- |
| `POSTGRES_PASSWORD` | mot de passe de la base (`openssl rand -hex 32`) |
| `DEPLOY_HOST` | IP ou nom du serveur ; **absent = image publiée sans déploiement** |
| `DEPLOY_USER` | compte SSH sur le serveur |
| `DEPLOY_SSH_KEY` | clé privée d'une paire `ssh-keygen -t ed25519` (la publique va dans `authorized_keys` du serveur) |
| `DEPLOY_KNOWN_HOSTS` | sortie de `ssh-keyscan <DEPLOY_HOST>` |

Variables facultatives (non secrètes) : `SERVER_PORT`, `CORS_ORIGINS`, `SWAGGER_ENABLED`, `PUBLIC_URL`, `DEPLOY_PATH`. `GITHUB_TOKEN` est fourni par GitHub.

## Branches

`main` (production) et `develop` (staging) ne reçoivent que des pull requests. Une branche par tâche, créée depuis `develop`.
