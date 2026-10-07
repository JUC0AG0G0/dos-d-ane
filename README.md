# Dos d'âne

<img src="./images/dos d&apos;âne.jpeg" alt="Mascotte : un âne au dos voûté" width="240">

Aide à la posture pour le travail sédentaire, POC du Master UHA 4.0 (2026).

> Conseils généraux de posture et d'exercices. **Ne remplace pas l'avis d'un professionnel de santé.**

## À installer à la main

| Outil | Rôle | Installation |
| --- | --- | --- |
| [mise](https://mise.jdx.dev) | installe Node, Python et Task aux versions du projet | voir ci-dessous |
| [Docker](https://docs.docker.com/get-docker/) | fait tourner le serveur, la base et pgAdmin | Docker Desktop (macOS, Windows) ou Docker Engine (Linux) |

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
  API         http://localhost:3000/api/health
  Swagger     http://localhost:3000/api/docs
  pgAdmin     http://localhost:5050
  PostgreSQL  localhost:5432 (base dosdane, utilisateur dosdane)
```

Si un port est déjà pris, `task dev` propose d'en prendre un libre au hasard.

## Commandes

| Commande | Rôle |
| --- | --- |
| `task dev` | lance serveur, base et pgAdmin dans Docker et affiche leurs URL |
| `task logs` | suit les logs |
| `task down` | arrête tout (les données de la base sont conservées) |
| `task check` | lint + compilation (lancé aussi avant chaque commit et push) |
| `task db:migrate` | applique les changements de `server/prisma/schema.prisma` (avec `task dev` lancé) |
| `task` | liste toutes les commandes |

## Configuration

Toute la configuration (ports, base, pgAdmin) est dans `.env.dev`, créé à partir de `.env.dev.example`. Quand le modèle gagne une variable, elle est ajoutée automatiquement à ton `.env.dev`.

Le serveur tourne toujours dans Docker, comme en production.

## Branches

`main` et `develop` ne reçoivent que des pull requests. Une branche par tâche, créée depuis `develop`.
