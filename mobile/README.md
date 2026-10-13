# mobile — points de posture en direct (test de faisabilité)

Afficher la **vidéo de la caméra en direct** avec les **points mesurés** (oreille, épaule, hanche du
côté filmé, reliés par la nuque et le tronc) dessinés par-dessus, parmi les 17 points de MoveNet,
colorés selon la posture, **dans Expo Go uniquement** (pas de development build).

Rien n'est enregistré, rien n'est envoyé : aucune photo, aucune capture, aucune base de données.
Les images servent à l'affichage et au calcul, puis sont jetées. Seuls téléchargements : les
librairies TensorFlow.js (CDN jsDelivr) et le modèle MoveNet (tfhub.dev → Kaggle), au premier
chargement de la page.

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

⚠️ `npx expo start --tunnel` **ne fonctionne pas** sur cette machine : le tunnel ngrok d'Expo
échoue (`failed to start tunnel — session closed`), y compris hors bac à sable. On passe donc par
**cloudflared**, qui ne demande aucun compte.

Deux terminaux. D'abord le tunnel :

```bash
# terminal 1 — tunnel HTTPS vers le dev server
cloudflared tunnel --url http://localhost:8081 --no-autoupdate
# -> note l'URL affichée : https://xxx-yyy-zzz.trycloudflare.com
```

Puis le dev server, en lui passant cette URL pour qu'elle soit **pré-remplie dans l'app** (aucune
URL à taper sur le téléphone) :

```bash
# terminal 2
cd mobile
npm install
EXPO_PUBLIC_PAGE_URL=https://xxx-yyy-zzz.trycloudflare.com/pose.html npx expo start
```

Puis **scanner le QR code affiché par le terminal** avec l'app **Expo Go** sur l'iPhone
(appareil photo iOS → le QR ouvre Expo Go). Il n'y a pas de scan de QR dans l'app elle-même.
L'iPhone et le PC doivent être sur le même Wi-Fi : l'app se charge par le réseau local, et
seule **la page** passe par le tunnel HTTPS.

Dans l'app, le bandeau doit être **vert** (`https` détecté) → touche
**« Lancer la vidéo avec les points »**.

Si tu oublies `EXPO_PUBLIC_PAGE_URL`, l'app retombe sur l'adresse LAN en `http://` et la page
affichera « Contexte NON sécurisé » : c'est attendu, `getUserMedia` exige du https.

`cloudflared` n'est pas installé en standard. Binaire unique, sans compte :

```bash
curl -L -o ~/.local/bin/cloudflared \
  https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
chmod +x ~/.local/bin/cloudflared
```

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

```bash
npm test             # 56 tests (angles, seuils, score, statistiques, test des postures), sans téléphone
npm run typecheck    # TypeScript : l'app, puis les scripts et tests (scripts/tsconfig.json)
npx expo lint        # lint
npm run build:page   # compile la page d'analyse : src/page/*.ts -> public/pose.js et src/pageInline.ts
npm run check:page   # échoue si public/pose.js ou src/pageInline.ts ne sont pas à jour
```

**Tout est en TypeScript.** La page d'analyse chargée par la WebView (`src/page/pose.ts` et
`posture.ts`) est compilée par **esbuild** en un seul fichier `public/pose.js`, que le téléphone
charge tel quel. **Après toute modification de `src/page/`, lancer `npm run build:page`** : sinon
la WebView garde l'ancienne version. `public/pose.js` et `src/pageInline.ts` sont **générés** : ne
pas les éditer à la main (ils sont marqués comme tels dans `.gitattributes`).

## Les deux modes de l'app

| Bouton | Ce qu'il fait | Attendu |
| --- | --- | --- |
| **Lancer la vidéo avec les points** | charge `public/pose.html` depuis le dev server | marche si l'URL est en `https` (donc avec `--tunnel`) |
| **Essayer en HTML embarqué** | page injectée via `source={{ html }}` | **va probablement échouer** : `getUserMedia` reste bloqué quand la page vient de `loadHTMLString` ([react-native-webview #2004](https://github.com/react-native-webview/react-native-webview/issues/2004)). Gardé pour le constater. |

Le lien **« Ouvrir la même page dans Safari »** sert au diagnostic : si ça marche dans Safari mais
pas dans l'app, le problème vient de la WebView d'Expo Go, pas du modèle.

### Si cloudflared ne passe pas non plus

Servir `public/` tout seul derrière un autre tunnel, puis passer l'URL via
`EXPO_PUBLIC_PAGE_URL` (ou la coller dans le champ de l'app) :

```bash
cd mobile/public && npx --yes serve -l 8099 .      # terminal 1
ngrok http 8099                                    # terminal 2 (compte ngrok requis)
```

## Mesures et code couleur

Téléphone **posé de profil**, écran vers soi (caméra frontale). Tous les seuils sont dans un seul
objet `CONFIG`, en haut de [`src/page/posture.ts`](src/page/posture.ts), chaque ligne avec sa source.

| Mesure | Définition | Vert | Orange | Rouge |
| --- | --- | --- | --- | --- |
| **Cou** | angle entre l'horizontale de l'épaule et la droite épaule → oreille (*plus grand = mieux*) | > 50° | 45–50° | < 45° |
| **Tronc** | angle de la droite épaule → hanche par rapport à la verticale (*plus petit = mieux*) | < 10° | 10–20° | > 20° |

**Gris** = non mesurable (point absent ou confiance < 0,3). Le statut est **aussi écrit en texte**
avec l'angle en degrés : la couleur n'est jamais le seul signal.

Sur les bornes, la zone verte est **stricte** : 50° pile → orange, 10° pile → orange. C'est une
convention, testée dans [`scripts/posture.test.ts`](scripts/posture.test.ts).

### Score (0–100)

Chaque angle reçoit une **note continue** (`noteMesure` dans `src/page/posture.ts`) : 100 en zone verte,
de 100 à 60 en zone orange, de 60 à 0 en zone rouge jusqu'à un angle « zéro » (cou 30°, tronc 40°,
**valeurs provisoires**). Le score instantané est la moyenne des notes du cou et du tronc.

Le **score du jour, de la semaine ou du mois** est la **moyenne dans le temps** de ce score : chaque
mesure compte pour la durée écoulée depuis la précédente (au plus 1 s). Les mesures sont cumulées
par heure sur le téléphone (AsyncStorage) : scores, angles moyens, temps par catégorie. Aucune
image. « Données de démo » et « Effacer l'historique », en bas de l'accueil, servent aux tests.

Le côté mesuré (gauche/droite) est choisi automatiquement : meilleure confiance moyenne sur
oreille + épaule + hanche.

### Test des postures (validation des seuils)

Accès : lien « Test des postures » en bas de l'accueil. Objectif : vérifier, avec **3 volontaires**,
que les couleurs de l'app correspondent aux postures réellement prises, et ajuster les seuils.

1. Téléphone de profil, à hauteur d'épaule, à environ 1,5 m, **même placement pour tous**.
2. Pour chaque participant (code P01…P05, jamais le nom, accord coché dans l'app) : 4 postures
   guidées, 5 s de préparation puis **30 s d'enregistrement** chacune.

| Posture | Détection attendue |
| --- | --- |
| Bien droit | cou et tronc en vert |
| Tête en avant | cou en orange ou rouge |
| Penché en avant | tronc en orange ou rouge, incliné vers l'avant |
| Avachi en arrière | tronc en orange ou rouge, incliné vers l'arrière |

3. L'app affiche l'angle moyen par posture (moyenne des participants, chacun pèse autant) et la
   part des mesures correctement détectées.
4. Export CSV (`;`, virgule décimale, s'ouvre dans Excel) : **résumé** (une ligne par participant
   et par posture, plus la moyenne) ou **toutes les mesures** (environ 4 par seconde).

Seuls des codes et des angles sont gardés, sur le téléphone, à part de l'historique des sessions.

 — à lire avant de citer ces chiffres

- **Cou** : approximation de l'angle craniovertébral. La littérature ne donne **pas de seuil validé**
  (44 à 55° selon les auteurs, 50° le plus courant). MoveNet ne donne **pas C7** : on prend l'épaule
  à la place, donc les valeurs ne sont **pas comparables** à celles des études. Le seuil vert est
  passé de 53° à **50°** après le test du 13/10/2026 (voir plus bas).
- **Tronc** : limite rouge à 20° appuyée sur **ISO 11226** et **RULA** ; limite verte à 10° choisie à
  la main. Les deux sont confirmées par le test du 13/10/2026.
- **Angles « zéro » de la note** (cou 30°, tronc 40°) : choix de calcul, sans source.

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

## Structure

```
src/app/_layout.tsx          racine Expo Router : police Inter, pile d'écrans
src/app/(onglets)/           Accueil, Session, Résultats, Conseils (maquette Figma)
src/app/session-en-cours.tsx session : caméra en continu + mesures, Pause / Terminer
src/app/test-camera.tsx      ce test de faisabilité (lien « Test caméra » en bas de l'accueil)
src/camera/                  URL de la page, message de session, enregistrement des mesures
src/app/exercice/[id].tsx    fiche d'un exercice (pourquoi, étapes)
src/donnees/                 statistiques (jour/semaine/mois), exercices, stockage sur le téléphone
src/theme.ts                 couleurs, polices, rayons et marges de la maquette
src/composants/              composants partagés (cadre d'écran, icônes)
src/page/posture.ts          angles, seuils, score, sens du tronc (partagé page ↔ app ↔ tests)
src/page/pose.ts             caméra, MoveNet, dessin du canvas, envoi des mesures à l'app
src/page/messages.ts         forme des messages page -> app (types partagés)
public/pose.html             la page servie par le dev server
public/pose.js               GÉNÉRÉ (npm run build:page) — src/page/ compilé pour Safari
src/pageInline.ts            GÉNÉRÉ — page inlinée pour le mode « HTML embarqué »
scripts/build-page.ts        compilation de la page (esbuild)
scripts/*.test.ts            tests (node --test, TypeScript exécuté directement par Node)
```

Le test garde ses deux modes internes (accueil du test et WebView) avec un `useState` ; le reste de
l'app passe par Expo Router.
