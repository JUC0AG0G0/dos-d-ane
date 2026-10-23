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
task client:lint     # ESLint + Prettier
task client:format   # corrige le formatage
task client:build    # vérifie que le client compile
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
│   ├── features/         une fonctionnalité par dossier (composants, hooks, services, types)
│   ├── services/         client HTTP commun
│   ├── store/            état global
│   ├── config/           variables d'environnement et navigation
│   ├── hooks/            hooks génériques
│   ├── types/            types partagés entre fonctionnalités
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
| `AdminPage.tsx` | `/admin` (utilisateurs et rôles) | admin |
| `StatusPage.tsx` | `/status` (serveur, base, environnement, version) | tout le monde |
| `LegalNoticePage.tsx`, `PrivacyPolicyPage.tsx`, `TermsPage.tsx` | `/legal/notice`, `/legal/privacy`, `/legal/terms` (mentions légales, confidentialité, conditions d'utilisation et avertissement médical) | tout le monde |
| `NotFoundPage.tsx` | toute autre adresse | tout le monde |

### `components/`

Composants réutilisables, sans appel à l'API ni logique métier.

- `layouts/` : le cadre autour des pages, choisi dans `App.tsx`.
  - `AuthLayout` : connexion et inscription (panneau vert à gauche, formulaire à droite).
  - `AppLayout` : pages connectées (barre latérale, fil d'Ariane, contenu en pleine largeur).
  - `CenteredLayout` : pages statut et 404 (logo, carte centrée, avertissement santé).
  - `LegalLayout` : pages légales (en-tête avec les liens légaux, texte en colonne, bandeau « document provisoire »).
- `ui/` : composants [shadcn/ui](https://ui.shadcn.com/docs/components). Ils sont copiés dans le projet, on peut donc les modifier (par exemple, `alert.tsx` a deux variantes en plus : `success` et `warning`).
- `AppSidebar.tsx`, `PasswordInput.tsx`, `MedicalDisclaimer.tsx`… : composants propres à l'application.

### `features/`

Une fonctionnalité par dossier, avec tout ce qui la concerne. Le reste de l'application n'importe que son `index.ts`.

```
features/auth/
├── components/   LoginForm, RegisterForm, RequireAuth
├── hooks/        useLogin, useRegister, useLogout, useCurrentUser
├── services/     auth.routes.ts (routes de l'API) et auth.service.ts (une fonction par route)
├── types/        auth.types.ts (corps et réponses de l'API)
└── index.ts      ce que la fonctionnalité expose
```

| Dossier | Contenu |
| --- | --- |
| `auth/` | formulaires de connexion et d'inscription, `useLogin`, `useRegister`, `useLogout`, et `RequireAuth` qui protège les pages connectées |
| `settings/` | onglets des paramètres : compte, appareils connectés (sessions, renommer, déconnecter), confidentialité |
| `admin/` | page Administration (admins seulement, lien dans la barre latérale) : liste des utilisateurs, changement de rôle d'un ou plusieurs comptes avec confirmation |
| `health/` | état du serveur et de la base (carte de la page `/status`) |
| `legal/` | textes légaux et `LegalLinks`, les liens affichés en pied de page, dans la barre latérale et à l'inscription. Les informations manquantes sont marquées `<ToComplete>` (surlignées à l'écran) ; la date de mise à jour est dans `legal.config.ts` |

### `services/`

Seulement les services généraux de l'application. Les services d'une fonctionnalité sont dans `features/<nom>/services/`.

- `http.ts` : le client HTTP commun, seul endroit qui appelle `fetch`. Il préfixe l'adresse de l'API (`env.apiUrl`), ajoute le jeton de session, lit le JSON, transforme les erreurs en `ApiError` (avec le message du serveur) et vide la session si le serveur répond 401.

```ts
// features/settings/services/settings.service.ts
import { http } from '@/services';
import { SETTINGS_ROUTES } from './settings.routes';

export const settingsService = {
  sessions: () => http.get<Session[]>(SETTINGS_ROUTES.sessions),
};
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

- `types/` : types utilisés par plusieurs fonctionnalités (`User` dans `user.ts`). Les types propres à une fonctionnalité sont dans `features/<nom>/types/`. Ils restent alignés sur les DTO de `server/src`.
- `utils/` : fonctions génériques. `cn()` combine des classes Tailwind, `format.ts` formate les dates en français.
- `hooks/` : hooks génériques (`use-mobile.ts`, utilisé par la barre latérale). Les hooks d'une fonctionnalité restent dans `features/`.

### `styles/global.css`

Le thème de l'application. Les couleurs sont des variables CSS, avec les mêmes noms que les variables du Figma (`--primary`, `--border`, `--destructive`…). Elles deviennent des classes Tailwind (`bg-primary`, `text-muted-foreground`, `border-border`…). Changer une couleur ici la change partout. La page d'accueil affiche chaque couleur avec sa valeur et son rôle.

## Comment une page appelle l'API

```
Page → feature (composant, hook) → service de la feature → services/http.ts → /api/... → relais Vite ou nginx → serveur NestJS
```

Le front appelle toujours `/api/...` sur sa propre adresse. En dev, Vite relaie ces requêtes au serveur ; en production (`task up`), c'est nginx. Le navigateur reste sur la même origine : pas de CORS à gérer.

## Recettes

**Ajouter une page**

1. Créer `src/pages/MaPage.tsx`.
2. Ajouter la route dans `App.tsx`, sous `RequireAuth` si elle demande d'être connecté.
3. Si elle doit apparaître dans la barre latérale, l'ajouter dans `config/navigation.ts`.

**Appeler une nouvelle route de l'API**

1. Ajouter la route dans `features/<nom>/services/<nom>.routes.ts`.
2. Ajouter les types de la requête et de la réponse dans `features/<nom>/types/`.
3. Ajouter la fonction dans `features/<nom>/services/<nom>.service.ts`, puis l'appeler depuis un hook de la fonctionnalité.

**Créer une fonctionnalité** : un dossier `features/<nom>/` avec les sous-dossiers utiles (`components/`, `hooks/`, `services/`, `types/`) et un `index.ts` qui exporte ce que les pages utilisent.

**Ajouter un composant shadcn/ui**, depuis `client/` sur ton poste :

```bash
npx shadcn@latest add select
```

Le composant arrive dans `src/components/ui/` avec les bons imports (voir `components.json`). Lancer ensuite `task client:format`.

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
