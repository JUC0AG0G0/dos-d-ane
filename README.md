# Dos d'âne

<img src="./images/dos d&apos;âne.jpeg" alt="Mascotte : un âne au dos voûté" width="240">

Système d'aide à la posture pour le travail sédentaire, réalisé en POC dans le cadre du fil rouge du Master UHA 4.0 (2026).

> Dos d'âne donne des conseils généraux de posture et d'exercices. **Il ne remplace pas l'avis d'un professionnel de santé.**

## Contenu du dépôt

| Dossier | Rôle | Technologie |
| --- | --- | --- |
| [`apps/backend`](apps/backend) | API (Swagger sur `/api/docs`) | NestJS (TypeScript) |
| [`apps/web`](apps/web) | site web | React + Vite |
| [`apps/mobile`](apps/mobile) | application mobile | React Native + Expo |
| [`apps/sensors`](apps/sensors) | acquisition des capteurs sur Raspberry Pi | Python (sans Docker) |
| [`docs`](docs) | documentation technique | |

## Démarrage rapide

Prérequis : [mise](https://mise.jdx.dev/getting-started.html) et Docker avec le plugin compose. mise installe Node, Python et [Task](https://taskfile.dev) aux bonnes versions ; toutes les commandes du projet sont dans `Taskfile.yml`.

```bash
mise install                   # Node 24, Python 3.11 et task
task setup                     # dépendances de toutes les apps + hooks Git (Husky)
cp .env.development.example .env.development
task dev                       # API http://localhost:3000/api/docs, web http://localhost:5173
```

`task` liste toutes les commandes. Les hooks Git vérifient automatiquement le lint avant chaque commit (`task lint`) et le lint + la compilation avant chaque push (`task check`).

## Documentation

- [Architecture](docs/architecture.md)
- [Déploiement, environnements et secrets](docs/deploiement.md)
- [Maintenance](docs/maintenance.md)
- [Contribuer](docs/contribuer.md)
