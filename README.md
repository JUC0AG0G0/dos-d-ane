# Dos d'âne

<img src="./images/dos d&apos;âne.jpeg" alt="Mascotte : un âne au dos voûté" width="240">

Aide à la posture pour le travail sédentaire, POC du Master UHA 4.0 (2026).

> Conseils généraux de posture et d'exercices. **Ne remplace pas l'avis d'un professionnel de santé.**

## Installation

1. Installer [mise](https://mise.jdx.dev) et l'activer dans le shell (exemple pour zsh) :
   ```bash
   brew install mise    # ou : curl https://mise.run | sh
   echo 'eval "$(mise activate zsh)"' >> ~/.zshrc
   eval "$(mise activate bash)"
   ```
Verification de si mise est bien installer :
```bash
   mise doctor 
   ```
Si bien installer activated yes

2. Dans un nouveau terminal :
   ```bash
   git clone https://github.com/JUC0AG0G0/dos-d-ane.git
   cd dos-d-ane
   mise trust
   ```

C'est tout : en entrant dans le dossier, mise installe les outils, prépare le projet (dépendances, hooks Git, `.env.dev`) et affiche `✓ dos-d-ane : environnement OK`, ou ce qui manque.

## Commandes

| Commande | Rôle |
| --- | --- |
| `task dev` | lance serveur, base et pgAdmin dans Docker, puis affiche leurs URL |
| `task logs` / `task down` | suit les logs / arrête tout |
| `task check` | lint + compilation (aussi lancé avant chaque commit et push) |
| `task db:migrate` | applique les changements de `server/prisma/schema.prisma` |
| `task` | liste toutes les commandes |

Si un port est déjà pris, `task dev` propose d'en prendre un libre au hasard.

La configuration est dans `.env.dev`, créé à partir de `.env.dev.example`.

## Branches

`main` et `develop` ne reçoivent que des pull requests ; une branche par tâche, créée depuis `develop`.
