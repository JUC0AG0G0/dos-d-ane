# Dos d'âne

<img src="./images/dos d&apos;âne.jpeg" alt="Mascotte : un âne au dos voûté" width="240">

Système d'aide à la posture pour le travail sédentaire, POC du Master UHA 4.0 (2026).

> Dos d'âne donne des conseils généraux de posture et d'exercices. **Il ne remplace pas l'avis d'un professionnel de santé.**

## Installation

1. Installer [mise](https://mise.jdx.dev) : `brew install mise` (macOS) ou `curl https://mise.run | sh` (Linux, WSL).
2. L'activer dans ton shell, puis ouvrir un nouveau terminal :
   - zsh : `echo 'eval "$(mise activate zsh)"' >> ~/.zshrc`
   - bash : `echo 'eval "$(mise activate bash)"' >> ~/.bashrc`
3. Cloner le dépôt et autoriser sa config (une seule fois) :
   ```bash
   git clone https://github.com/JUC0AG0G0/dos-d-ane.git
   cd dos-d-ane
   mise trust
   ```

Ensuite, à chaque entrée dans le dossier, mise installe Node 26, Python 3.11 et Task, lance `task setup` (dépendances, hooks Git, `.env.development`) puis vérifie l'environnement :

```
✓ dos-d-ane : environnement OK
```

S'il manque quelque chose, chaque problème est listé avec la commande qui le règle. `task doctor` affiche le rapport complet.

## Commandes

`task` liste toutes les commandes.

| Commande | Rôle |
| --- | --- |
| `task dev` | serveur + PostgreSQL dans Docker, rechargement à chaud (http://localhost:3000/api/docs) |
| `task start` | serveur sans Docker |
| `task lint` / `task format` | vérifie / corrige le style |
| `task check` | lint + compilation (lancé avant chaque push ; `task lint` avant chaque commit) |
| `task up ENV=staging` | stack avec l'image publiée (`development`, `staging`, `production`) |
| `task down` / `task logs` / `task ps` | arrêter, logs, état |

## Environnements et déploiement

`development` (local), `staging` (branche `develop`), `production` (branche `main`), chacun configuré par un fichier `.env.<env>` créé à partir de son `.env.<env>.example` et jamais commité.

La CI vérifie lint et compilation à chaque PR. Sur `develop` et `main`, le CD publie l'image `ghcr.io/juc0ag0g0/dos-d-ane-server` et la déploie en SSH. Secrets à créer dans **Settings → Environments** (`staging` et `production`) :

| Secret | Valeur |
| --- | --- |
| `POSTGRES_PASSWORD` | `openssl rand -hex 32` |
| `DEPLOY_HOST` | IP du serveur (absent = pas de déploiement) |
| `DEPLOY_USER` | compte SSH |
| `DEPLOY_SSH_KEY` | clé privée `ssh-keygen -t ed25519` |
| `DEPLOY_KNOWN_HOSTS` | `ssh-keyscan <DEPLOY_HOST>` |

`main` et `develop` ne reçoivent que des pull requests ; une branche par tâche, créée depuis `develop`.
