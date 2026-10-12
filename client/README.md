# Client web de Dos d'âne

Interface web de Dos d'âne : connexion, inscription, accueil et paramètres du compte. Elle parle à l'API NestJS de `server/`.

> L'application donne des conseils généraux. **Elle ne remplace pas l'avis d'un professionnel de santé** : l'avertissement doit rester visible sur toutes les pages.

## Technologies

| Outil | Rôle |
| --- | --- |
| [React 19](https://react.dev) + TypeScript | interface |
| [Vite](https://vite.dev) | serveur de dev (rechargement à chaud) et compilation |
| [React Router](https://reactrouter.com) | routes et pages |
| [Tailwind CSS 4](https://tailwindcss.com) | styles, par classes (`bg-primary`, `p-4`…) |
| [shadcn/ui](https://ui.shadcn.com) | composants (boutons, champs, barre latérale…) copiés dans `src/components/ui/`, basés sur [Radix](https://www.radix-ui.com) |
| [lucide-react](https://lucide.dev/icons) | icônes |
| [zustand](https://zustand.docs.pmnd.rs) | état global (session de l'utilisateur) |
| ESLint + Prettier | lint et formatage |

## Développer

Tout tourne dans Docker, depuis la racine du dépôt :

```bash
task dev        # lance client, serveur, base et pgAdmin, puis affiche les URL
task logs       # suit les logs (Ctrl+C pour quitter)
task down       # arrête tout
```

Le client est sur http://localhost:5173 (port `CLIENT_PORT` de `.env.dev`). Chaque modification de `client/src` met la page à jour sans recharger.

Avant de committer (Husky le fait aussi) :

```bash
task lint       # ESLint + Prettier (serveur et client)
task format     # corrige le formatage
task build      # vérifie que tout compile
```

**Ajouter une dépendance** : `npm install <paquet> --prefix client` depuis la racine, puis relancer `task dev` (le conteneur réinstalle les dépendances au démarrage).

Pour créer un compte de test : http://localhost:5173/register.

## Arborescence

```
client/
├── index.html            page HTML de départ (titre, favicon)
├── public/               fichiers servis tels quels (favicon.svg)
├── src/
│   ├── main.tsx          point d'entrée : monte <App /> et charge le CSS
│   ├── App.tsx           toutes les routes de l'application
│   ├── pages/            un composant par route
│   ├── components/       composants réutilisables
│   │   ├── layouts/      cadres de page
│   │   └── ui/           composants shadcn/ui
│   ├── features/         une fonctionnalité par dossier
│   ├── services/         appels à l'API
│   ├── store/            état global
│   ├── config/           variables d'environnement et navigation
│   ├── hooks/            hooks génériques
│   ├── types/            types partagés
│   ├── utils/            fonctions génériques
│   └── styles/           thème (couleurs) et styles globaux
├── components.json       configuration de shadcn/ui
├── vite.config.ts        Vite : alias @/, relais /api, scrutation des fichiers
├── Dockerfile            image de production (compilation puis nginx)
└── nginx.conf            nginx : sert le front et relaie /api au serveur
```

Les imports passent par l'alias `@/`, qui désigne `src/` : `import { Button } from '@/components/ui/button'`.

### `pages/`

Une page par route, déclarée dans `App.tsx`. Une page assemble des composants et des fonctionnalités, sans logique propre.

| Fichier | Route | Accès |
| --- | --- | --- |
| `LoginPage.tsx` | `/login` | non connecté |
| `RegisterPage.tsx` | `/register` | non connecté |
| `HomePage.tsx` | `/` | connecté |
| `SettingsPage.tsx` | `/settings/account`, `/settings/devices`, `/settings/privacy` | connecté |
| `StatusPage.tsx` | `/status` | tout le monde |
| `NotFoundPage.tsx` | toute autre adresse | tout le monde |

### `components/`

Composants réutilisables, sans appel à l'API ni logique métier.

- `layouts/` : le cadre autour des pages, choisi dans `App.tsx`.
  - `AuthLayout` : connexion et inscription (panneau vert à gauche, formulaire à droite).
  - `AppLayout` : pages connectées (barre latérale, fil d'Ariane, contenu en pleine largeur).
  - `PublicLayout` : pages publiques (en-tête simple et avertissement en pied de page).
- `ui/` : composants [shadcn/ui](https://ui.shadcn.com/docs/components). Ils sont copiés dans le projet, on peut donc les modifier (par exemple, `alert.tsx` a deux variantes en plus : `success` et `warning`).
- `AppSidebar.tsx`, `PasswordInput.tsx`, `MedicalDisclaimer.tsx`… : composants propres à l'application.

### `features/`

Une fonctionnalité par dossier : ses composants, ses hooks et sa logique. Le reste de l'application n'importe que son `index.ts`.

| Dossier | Contenu |
| --- | --- |
| `auth/` | formulaires de connexion et d'inscription, `useLogin`, `useRegister`, `useLogout`, et `RequireAuth` qui protège les pages connectées |
| `settings/` | onglets des paramètres : compte, appareils connectés (renommer, déconnecter), confidentialité |
| `health/` | état du serveur et de la base (page `/status`) |

### `services/`

Tous les appels à l'API passent par ici, jamais de `fetch` ailleurs.

- `routes.ts` : la liste de toutes les routes de l'API utilisées par le client.
- `http.ts` : le client HTTP commun. Il ajoute le jeton de session, lit le JSON, transforme les erreurs en `ApiError` (avec le message du serveur) et vide la session si le serveur répond 401.
- `auth.service.ts`, `devices.service.ts`, `health.service.ts` : un service par module du serveur, avec une fonction par route.

```ts
import { authService } from '@/services';
const sessions = await authService.sessions();
```

### `store/`

État partagé entre plusieurs pages, avec zustand. Un fichier par domaine.

- `auth.store.ts` : la session (jeton, utilisateur, identifiant de l'appareil), gardée dans le `localStorage` du navigateur. L'identifiant de l'appareil est conservé après la déconnexion pour que le serveur reconnaisse l'appareil à la connexion suivante.

```tsx
const user = useAuthStore((state) => state.user);    // dans un composant
useAuthStore.getState().signOut();                     // hors composant
```

Un état qui ne sert qu'à une fonctionnalité reste dans son dossier `features/`, avec `useState`.

### `config/`

- `env.ts` : le **seul** fichier qui lit les variables d'environnement. Le reste de l'application importe `env`.
- `navigation.ts` : les sections et les entrées de la barre latérale, et les sous-pages affichées dans le fil d'Ariane.

### `types/`, `utils/`, `hooks/`

- `types/` : types partagés, dont les réponses de l'API (`User`, `Session`…), à garder alignés sur les DTO de `server/src`.
- `utils/` : fonctions génériques. `cn()` combine des classes Tailwind, `format.ts` formate les dates en français.
- `hooks/` : hooks génériques (`use-mobile.ts`, utilisé par la barre latérale). Les hooks d'une fonctionnalité restent dans `features/`.

### `styles/global.css`

Le thème de l'application. Les couleurs sont des variables CSS, avec les mêmes noms que les variables du Figma (`--primary`, `--border`, `--destructive`…). Elles deviennent des classes Tailwind (`bg-primary`, `text-muted-foreground`, `border-border`…). Changer une couleur ici la change partout. La page d'accueil affiche chaque couleur avec sa valeur et son rôle.

## Comment une page appelle l'API

```
Page → feature (hook) → service → http.ts → /api/... → relais Vite ou nginx → serveur NestJS
```

Le front appelle toujours `/api/...` sur sa propre adresse. En dev, Vite relaie ces requêtes au serveur ; en production (`task up`), c'est nginx. Le navigateur reste sur la même origine : pas de CORS à gérer.

## Recettes

**Ajouter une page**

1. Créer `src/pages/MaPage.tsx`.
2. Ajouter la route dans `App.tsx`, sous `RequireAuth` si elle demande d'être connecté.
3. Si elle doit apparaître dans la barre latérale, l'ajouter dans `config/navigation.ts`.

**Appeler une nouvelle route de l'API**

1. Ajouter la route dans `services/routes.ts`.
2. Ajouter les types de la requête et de la réponse dans `types/`.
3. Ajouter la fonction dans le service du domaine (ou créer `mon-domaine.service.ts` et l'exporter dans `services/index.ts`).

**Ajouter un composant shadcn/ui**, depuis `client/` sur ton poste :

```bash
npx shadcn@latest add select
```

Le composant arrive dans `src/components/ui/` avec les bons imports (voir `components.json`). Lancer ensuite `task format`.

**Ajouter une couleur** : la déclarer dans `:root` et dans `@theme inline` de `styles/global.css`, puis l'ajouter à la liste de `pages/HomePage.tsx`.

## Variables d'environnement

Elles sont dans `.env.dev`, à la racine du dépôt (modèle : `.env.dev.example`).

| Variable | Rôle |
| --- | --- |
| `CLIENT_PORT` | port du client sur ton poste (5173 par défaut) |
| `VITE_API_URL` | adresse de l'API. `/api` (défaut) passe par le relais. Une URL complète (`http://localhost:3000/api`) appelle le serveur en direct et demande d'ajouter l'origine du client à `CORS_ORIGINS`. |

Seules les variables qui commencent par `VITE_` arrivent dans le navigateur. Elles sont visibles par tout le monde : jamais de secret dedans.

## Production

`task up` construit l'image du `Dockerfile` : le client est compilé (`npm run build`), puis servi par nginx, qui relaie aussi `/api` au serveur (`nginx.conf`). `VITE_API_URL` est figée au moment de la compilation.
