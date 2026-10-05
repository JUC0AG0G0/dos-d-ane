# Dos d'âne

<img src="./images/dos d&apos;âne.jpeg" alt="Mascotte : un âne au dos voûté" width="240">

Système d'aide à la posture pour le travail sédentaire, réalisé en POC dans le cadre du fil rouge du Master UHA 4.0 (2026).

> Dos d'âne donne des conseils généraux de posture et d'exercices. **Il ne remplace pas l'avis d'un professionnel de santé.**

## Contenu du dépôt

| Dossier | Rôle | Technologie |
| --- | --- | --- |
| [`apps/backend`](apps/backend) | API | NestJS (TypeScript) |
| [`apps/web`](apps/web) | site web | React + Vite |
| [`apps/mobile`](apps/mobile) | application mobile | React Native + Expo |
| [`apps/sensors`](apps/sensors) | acquisition des capteurs sur Raspberry Pi | Python (sans Docker) |
| [`docs`](docs) | documentation technique | |

## Démarrage rapide

Prérequis : Docker avec le plugin compose, Node 24, Python 3.11+.

```bash
cp .env.development.example .env.development
make dev        # API http://localhost:3000/api/health, web http://localhost:5173
make test       # tous les tests, hors Docker
```

Pour lancer la stack comme en production : `make up ENV=staging` (voir [docs/deploiement.md](docs/deploiement.md)).

## Documentation

- [Architecture](docs/architecture.md)
- [Déploiement et environnements](docs/deploiement.md)
- [Maintenance](docs/maintenance.md)
- [Ajouter un capteur](docs/capteurs.md)
- [Contribuer](docs/contribuer.md)
