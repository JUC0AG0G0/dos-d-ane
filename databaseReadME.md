# Base de données

PostgreSQL 18 et [Prisma 7](https://www.prisma.io/docs). Le schéma est dans `server/prisma/schema.prisma` et les migrations dans `server/prisma/migrations/`. Toutes les commandes ci-dessous demandent que la stack tourne (`task dev`).

## Commandes

| Commande | Rôle |
| --- | --- |
| `task db:generate -- nom` | crée une migration depuis les changements du schéma, **sans l'appliquer** |
| `task db:migrate` | applique les migrations pas encore appliquées, et seulement celles-là |
| `task db:restore` | annule la dernière migration appliquée |
| `task db:restore -- migration` | revient à cette migration : elle reste appliquée, les suivantes sont annulées |
| `task db:restore -- dump` | remplace la base par le dump le plus récent de `dumps/` |
| `task db:restore -- fichier.sql` | remplace la base par ce dump |
| `task db:dump` | exporte la base dans `dumps/<date>.sql` |
| `task dev:restore` | relance la stack avec les données d'un dump (le plus récent, ou `-- fichier.sql`) |
| `task clean` | arrête la stack et **supprime** toutes les données |

## Modifier le schéma

1. Modifier `server/prisma/schema.prisma`.
2. `task db:generate -- ajoute_telephone` : le fichier `server/prisma/migrations/<date>_ajoute_telephone/migration.sql` est créé. Le relire, et le compléter si besoin (une contrainte `CHECK`, par exemple, que Prisma ne sait pas écrire).
3. `task db:migrate` : la migration est appliquée.
4. Commiter le schéma et la migration ensemble.

Après un `git pull` qui apporte des migrations, `task db:migrate` suffit.

## Revenir en arrière

Prisma ne sait pas annuler une migration. `task db:restore` calcule le SQL d'annulation en comparant la base actuelle aux migrations conservées, puis :

- un dump de la base est fait automatiquement dans `dumps/` avant toute modification ;
- l'annulation et la mise à jour de l'historique Prisma se font dans une seule transaction : en cas d'erreur, la base n'est pas touchée ;
- les données des colonnes et des tables retirées sont perdues (elles restent dans le dump) ;
- les fichiers des migrations annulées **restent** dans `server/prisma/migrations/` : les supprimer, ou les modifier, sinon `task db:migrate` les réappliquera.

Le nom passé en paramètre peut être abrégé s'il reste unique : `task db:restore -- init_entities`.

## En cas de « Drift detected »

Prisma signale une dérive quand la base ne correspond plus aux fichiers de migration, par exemple quand une migration déjà appliquée a été modifiée ou remplacée. En développement, le plus simple est de repartir d'une base vide :

```bash
task clean
task dev
task db:migrate
```

## Conventions du schéma

- Identifiants en UUID v7, générés par PostgreSQL 18 (`uuidv7()`, natif, sans extension).
- Colonnes en camelCase, tables en camelCase au pluriel (`@@map`).
- Dates en `timestamptz(3)`, avec `createdAt`/`updatedAt` dans chaque table qui en a besoin.
- Entités TypeScript dans `server/src/entities/` : elles héritent de `BaseEntity`, `CreatedEntity` ou `TimestampedEntity` pour les champs communs.
- Pas d'image stockée (RGPD) : seulement les keypoints et la taille de l'image.

Les dumps peuvent contenir des données personnelles : ils sont ignorés par Git, ne pas les partager.
