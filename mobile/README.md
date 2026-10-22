# mobile — points de posture en direct (test de faisabilité)

Afficher la **vidéo de la caméra en direct** avec les **points mesurés** (oreille, épaule, hanche du
côté filmé, reliés par la nuque et le tronc) dessinés par-dessus, parmi les 17 points de MoveNet,
colorés selon la posture, **dans Expo Go uniquement** (pas de development build).

Aucune image n'est enregistrée ni envoyée : les images servent à l'affichage et au calcul, puis
sont jetées. TensorFlow.js est inclus dans la page (dépendances npm, compilées par esbuild) ; seul
le modèle MoveNet est téléchargé (tfhub.dev → Kaggle), au premier chargement de la page.

## Résultat du test (8 octobre 2026)

**C'est faisable.** Testé sur iPhone, Expo Go 57.0.9 : `getUserMedia` fonctionne dans la WebView
d'Expo Go sur iOS, l'image de la caméra s'affiche et les points MoveNet suivent le corps.

Points de blocage rencontrés en chemin, à noter dans le rapport :

1. **`npx expo start --tunnel` ne marche pas** (tunnel ngrok d'Expo en échec) → remplacé par
   cloudflared.
2. **`getUserMedia` exige du HTTPS** → l'adresse LAN en `http://` ne suffit jamais, le tunnel
   n'est pas optionnel.
3. **Expo Go 57 refuse d'ouvrir un projet si les comptes CLI et app ne correspondent pas**
   (« You're signed in to Expo Go as X but not signed in to Expo CLI »). Ce n'est pas un
   avertissement, c'est un refus. Il faut `npx expo login` avec le **même** compte que l'app, ou
   se déconnecter des deux côtés.
4. **Expo Go sur iOS n'a pas de scanner de QR** et pas de champ « Enter URL manually » (ça, c'est
   une fonction des development builds) : on ouvre le projet en tapant l'URL `exp://…` dans
   **Safari**.
5. **MoveNet tremble** d'une image à l'autre → lissage par moyenne mobile sur 3 images.

## Pourquoi une WebView

Dans Expo Go, `expo-camera` affiche l'aperçu mais **ne donne pas les images au JavaScript**. Tout
se passe donc dans une `WebView` : `getUserMedia` → `<video>` → MoveNet (TensorFlow.js, backend
WebGL) → `<canvas>` par-dessus.

**Le point dur : `getUserMedia` exige un contexte sécurisé (`https://` ou `localhost`).** L'adresse
LAN du dev server est en `http://192.168.x.x:8081`, ce qui ne suffit pas. D'où le `--tunnel`
ci-dessous, qui sert la page en `https://…exp.direct`.

## Lancer

Une seule commande, à la racine du dépôt :

```bash
task mobile:start            # ajouter `-- --clear` pour vider le cache de Metro
```

Elle installe les dépendances, compile la page caméra, ouvre le tunnel https **cloudflared** (la
caméra l'exige), puis lance Expo avec l'adresse de la page caméra déjà renseignée. `Ctrl+C` ferme
Expo et le tunnel.

⚠️ `npx expo start --tunnel` **ne fonctionne pas** sur cette machine (tunnel ngrok d'Expo en
échec, `failed to start tunnel — session closed`) : d'où cloudflared, qui ne demande aucun compte.

Puis **scanner le QR code affiché** avec l'appareil photo de l'iPhone (il ouvre Expo Go), ou taper
l'adresse `exp://…` affichée dans Safari. L'iPhone et le PC doivent être sur le même Wi-Fi : l'app
se charge par le réseau local, et seule **la page caméra** passe par le tunnel.

`cloudflared` est installé par **mise** comme Node et Task (`mise.toml`) : rien à faire à la main,
`task mobile:start` le télécharge au premier lancement (binaire unique, sans compte, toutes plateformes).

Note : charger **toute l'app** par le tunnel ne marche pas — le manifeste Expo renvoie alors un
`launchAsset` en `https://…trycloudflare.com:8081`, port qui n'existe pas côté tunnel.

## Versions

| Élément | Version | Pourquoi |
| --- | --- | --- |
| Expo SDK | **57** | Expo Go de l'App Store est en **57.0.9** (2026‑09‑02) et ne gère qu'un seul SDK. |
| `react-native-webview` | **13.16.1** | Version embarquée dans Expo Go 57 (`bundledNativeModules.json`). |
| TensorFlow.js | **4.22.0** (figée) | Versions figées : un mélange de versions entre `tfjs-core` et `tfjs-converter` casse le chargement du modèle. |
| `@tensorflow-models/pose-detection` | **2.1.3** | MoveNet SinglePose **Lightning** (le plus rapide). |

⚠️ Ne pas passer le projet à un SDK plus récent : l'Expo Go de l'App Store refusera de l'ouvrir.
iOS 16.4 minimum (contrainte d'Expo Go).

## Commandes

Depuis la racine du dépôt (`task --list` pour tout voir) :

```bash
task mobile:start    # installe, compile la page, ouvre le tunnel caméra et lance Expo
task mobile:build    # compile la page d'analyse : src/features/analysis/*.ts -> public/pose.js
task mobile:test     # tests (angles, seuils, messages, statistiques, test des postures), sans téléphone
task mobile:check    # typecheck + lint + tests + page à jour (lancé par la CI)
```

Ou dans `mobile/` : `npm test`, `npm run typecheck`, `npx expo lint`, `npm run build:page`,
`npm run check:page`.

**Tout est en TypeScript.** La page d'analyse chargée par la WebView (`src/features/analysis/pose.ts`,
`posture.ts` et TensorFlow.js) est compilée par **esbuild** en un seul fichier `public/pose.js`, que
le téléphone charge tel quel. **Après toute modification de `src/features/analysis/`, lancer
`task mobile:build`** : sinon la WebView garde l'ancienne version. `public/pose.js` est **généré** :
ne pas l'éditer à la main.

## Compte et serveur

L'app commence par **Connexion / Inscription** (mêmes routes et mêmes règles que le site web). Par
défaut, elle appelle le serveur de l'équipe `http://dos-dane.julescorneille.fr/api`, joignable
**seulement depuis le Wi-Fi de l'école**. Pour un serveur lancé sur son PC avec `task dev` :

```bash
EXPO_PUBLIC_API_URL=http://<IP du PC>:3000/api npx expo start
```

## Caméra

L'écran de session charge `public/pose.html` dans une WebView ; l'URL doit être en `https`
(tunnel). Une page embarquée dans l'app (`source={{ html }}`) ne marche pas : `getUserMedia` y
reste bloqué ([react-native-webview #2004](https://github.com/react-native-webview/react-native-webview/issues/2004)).

### Si cloudflared ne passe pas non plus

Servir `public/` tout seul derrière un autre tunnel, puis passer l'URL via
`EXPO_PUBLIC_PAGE_URL` :

```bash
cd mobile/public && npx --yes serve -l 8099 .      # terminal 1
ngrok http 8099                                    # terminal 2 (compte ngrok requis)
```

## Mesures et code couleur

Téléphone **posé de profil**, écran vers soi (caméra frontale). Tous les seuils sont dans un seul
objet `CONFIG`, en haut de [`src/features/analysis/posture.ts`](src/features/analysis/posture.ts), chaque ligne avec sa source.

| Mesure | Définition | Vert | Orange | Rouge |
| --- | --- | --- | --- | --- |
| **Cou** | angle entre l'horizontale de l'épaule et la droite épaule → oreille (*plus grand = mieux*) | 50–95° | 45–50° ou 95–105° | < 45° ou > 105° |
| **Tronc** | angle de la droite épaule → hanche par rapport à la verticale (*plus petit = mieux*) | < 10° | 10–20° | > 20° |

**Gris** = non mesurable (point absent ou confiance < 0,3). À l'écran, chaque angle est **aussi
écrit en degrés** (« Cou 42° ») et la carte de statut donne un message : la couleur n'est jamais le
seul signal.

Sur les bornes, la zone verte est **stricte** : 50° pile → orange, 10° pile → orange. C'est une
convention, testée dans [`tests/posture.test.ts`](tests/posture.test.ts).

### Message affiché et résultats

Pendant la session, la carte de statut suit le **pire des deux angles** :

| Couleur | Message |
| --- | --- |
| Vert | Bonne posture |
| Orange | Changez légèrement de position |
| Rouge | Veuillez vous asseoir correctement |

En dessous, le conseil nomme l'angle en cause (tête en avant ou en arrière, buste penché, dos
avachi), le cou d'abord à égalité. L'app ne calcule **pas de score** : elle dit seulement si la
posture est bonne.

L'accueil et l'écran Résultats montrent la **part du temps en bonne posture** (cou et tronc verts)
sur le jour, la semaine ou le mois : chaque mesure compte pour la durée écoulée depuis la précédente
(au plus 1 s). Les mesures sont cumulées par heure sur le téléphone (AsyncStorage) : angles moyens,
temps en vert, orange et rouge. Aucune image.

Le côté mesuré (gauche/droite) est choisi automatiquement : meilleure confiance moyenne sur
oreille + épaule + hanche.

### Validation des seuils (test des postures du 13/10/2026)

Les seuils ont été vérifiés avec **3 volontaires**, grâce à un écran de test retiré de l'app depuis
(il reste dans l'historique Git). Téléphone de profil, à hauteur d'épaule, à environ 1,5 m, **même
placement pour tous**. Chaque participant (code P01…, jamais de nom, accord recueilli) a tenu 4
postures pendant 30 s ; seuls des angles étaient enregistrés. La tête en arrière, détectée depuis,
n'a pas encore été testée.

| Posture | Détection attendue |
| --- | --- |
| Bien droit | cou et tronc en vert |
| Tête en avant | cou en orange ou rouge, sous 90° |
| Penché en avant | tronc en orange ou rouge, incliné vers l'avant |
| Avachi en arrière | tronc en orange ou rouge, incliné vers l'arrière |

#### Limites des seuils — à lire avant de citer ces chiffres

- **Cou** : approximation de l'angle craniovertébral. La littérature ne donne **pas de seuil validé**
  (44 à 55° selon les auteurs, 50° le plus courant). MoveNet ne donne **pas C7** : on prend l'épaule
  à la place, donc les valeurs ne sont **pas comparables** à celles des études. Le seuil vert est
  passé de 53° à **50°** après le test du 13/10/2026 (voir plus bas).
- **Tête en arrière** : l'angle du cou a un sens, grâce au nez (côté du regard). Au-delà de 90°,
  l'oreille est derrière l'épaule. Le vert s'arrête à **95°**, l'orange à **105°**, puis rouge :
  valeurs **provisoires**, à valider par un nouveau test avec des volontaires. Sans nez fiable,
  le sens est inconnu et la tête en arrière n'est pas détectée. Lever seulement le menton bouge
  peu l'oreille : ce mouvement reste mal détecté.
- **Tronc** : limite rouge à 20° appuyée sur **ISO 11226** et **RULA** ; limite verte à 10° choisie à
  la main. Les deux sont confirmées par le test du 13/10/2026.

### Résultats du test du 13/10/2026 (3 participants, 1 378 mesures)

| Seuil vert du cou | Bien droit | Tête en avant | Penché | Avachi | Global |
| --- | --- | --- | --- | --- | --- |
| 53° (avant) | 84 % | 91 % | 99 % | 98 % | 92,9 % |
| **50° (retenu)** | **92 %** | 89 % | 99 % | 98 % | **94,5 %** |
| 48° | 97 % | 86 % | 99 % | 98 % | 94,9 % |

- Cou « bien droit » : 95 % des mesures au-dessus de 50,1° (médiane 74,6°) ; « tête en avant » :
  médiane 32,1°, 78 % sous 45°.
- Tronc « bien droit » : 90 % sous 7,9° ; « penché » et « avachi » : 90 % au-dessus de 18,6°.
- 54 mesures (4 %) avaient basculé un instant sur le côté caché (angles absurdes) : d'où le
  **verrouillage du côté** (`coteMarge`, `coteImagesPourChanger` dans `CONFIG`).
- Penché (25°) et avachi (29°) donnaient le même angle de tronc : d'où le **sens du tronc**
  (`sensTronc`) : la personne regarde du côté où le nez dépasse l'oreille, le buste est penché en
  avant si l'épaule est devant la hanche dans ce sens, avachi sinon.
- Limite : 3 participants seulement ; le sens du tronc et le verrouillage restent à vérifier par
  un nouveau test.

### Téléphone qui bouge ou qui penche

Les angles sont mesurés par rapport aux bords de l'image : un téléphone penché de 5° fausse le
tronc d'autant. L'app lit donc l'accéléromètre (`expo-sensors`, 10 fois par seconde) :

- **inclinaison corrigée** : les points sont tournés de l'inclinaison du téléphone avant la mesure
  (`redresser`, `CONFIG.correctionInclinaison`) ;
- **téléphone qui bouge** (secousse, ou plus de 15°/s) ou **trop penché** (plus de 25°) : message à
  l'écran, et ces mesures ne comptent pas dans les résultats (`src/features/sessions/telephone.ts`) ;
- **couleurs stables** : une couleur ne change que si l'angle dépasse le seuil de plus de 2°
  (`classerStable`, `CONFIG.margeNiveau`).

À vérifier sur iPhone, pendant une session (pastilles « Cou » et « Tronc ») : immobile, pencher
doucement le téléphone ne doit presque pas changer les angles. S'ils changent deux fois plus, mettre
`correctionInclinaison` à 1.

## Structure

Même organisation que le site web (`client/src`), avec les mêmes règles :

- **`src/app/` ne contient que les routes** (comme `pages/` du site) : chaque fichier affiche l'écran
  d'une fonctionnalité en quelques lignes ;
- **une fonctionnalité = un dossier de `src/features/`**, rangé en `components/`, `hooks/`,
  `services/` (`<nom>.service.ts`), `types/` (`<nom>.types.ts`) ; la logique sans React (calculs,
  testée par Node) est à sa racine, comme le `utils.ts` du site ;
- **son `index.ts` est son API publique** : une autre fonctionnalité ou une route n'importe que
  `@/features/<nom>`, jamais un fichier à l'intérieur ; dans la fonctionnalité, imports relatifs ;
- **ce qui sert partout** est dans `components/` (dont `layouts/`), `hooks/`, `services/`, `store/`
  (session de l'utilisateur), `types/`, `styles/`, `config/` et `utils/`.

```
src/app/                         routes Expo Router : quelques lignes chacune
  _layout.tsx                    racine : police Inter, écrans réservés aux connectés
  (onglets)/_layout.tsx          barre d'onglets : Accueil, Session, Résultats, Conseils
src/features/
  home/                          accueil : temps en bonne posture du jour, conseil du jour
  sessions/                      session d'analyse : caméra (WebView), état du téléphone, message de
                                 posture, enregistrement des mesures
  analysis/                      page d'analyse exécutée dans la WebView (-> public/pose.js)
    pose.ts                      caméra, MoveNet, dessin du canvas, envoi des mesures à l'app
    posture.ts                   angles, seuils, couleurs, sens du tronc (partagé page ↔ app ↔ tests)
    cadrage.ts                   capture recadrée au format 3/4
    messages.ts                  forme et lecture des messages page -> app
  history/                       résultats : historique sur le téléphone, statistiques
  advice/                        conseils et fiches d'exercices selon les postures détectées
  auth/                          connexion, inscription, déconnexion (API /auth)
src/components/                  composants partagés (cartes, formulaire, icônes, anneau de %)
  layouts/                       cadres d'écran (Ecran, CadreAuth)
src/hooks/                       hooks partagés (chargement des données d'un écran)
src/services/http.ts             appels à l'API (jeton, erreurs, 401 -> déconnexion)
src/store/auth.store.tsx         session de l'utilisateur (jeton dans expo-secure-store)
src/types/user.ts                utilisateur renvoyé par l'API
src/styles/theme.ts              couleurs, polices, rayons et marges de la maquette
src/config/env.ts                adresse de l'API (EXPO_PUBLIC_API_URL) et du site
src/utils/                       petites fonctions partagées (format de durée…)
public/pose.html                 la page servie par le dev server
public/pose.js                   GÉNÉRÉ (task mobile:build) — features/analysis + TensorFlow.js
scripts/demarrer.ts              lancement en une commande (tunnel cloudflared + Expo)
scripts/build-page.ts            compilation de la page (esbuild)
tests/*.test.ts                  tests (node --test, TypeScript exécuté directement par Node)
```

Les fichiers testés par Node (`posture.ts`, `statistiques.ts`, `telephone.ts`…) n'importent que des
**types** des autres fichiers : Node exécute le TypeScript sans bundler et ne trouve pas un import
sans extension.

Les données de chaque compte (historique) sont gardées sur le téléphone, séparées par
utilisateur. Le serveur a maintenant des routes de sessions d'analyse (`/analysis-sessions`,
`/captures`), pas encore utilisées par l'app.
