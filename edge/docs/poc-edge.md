# POC Edge — analyse de posture sur Raspberry Pi

> **Périmètre :** uniquement ma partie, c'est-à-dire caméra → Raspberry Pi → IA locale → keypoints → données dérivées.
> L'app mobile, le site, le serveur et la base de données relèvent du projet d'équipe ([solution-mvp.md](solution-mvp.md)).
> Installation et code : [poc-raspberry.md](poc-raspberry.md).

---

## 1. Question du POC

> **Un Raspberry Pi 4 peut-il transformer localement une image de caméra en données de posture fiables, effacer l'image juste après, et ne transmettre que des chiffres ?**

Le POC doit montrer que :

1. la webcam fonctionne de façon stable avec le Pi ;
2. MoveNet Lightning est assez rapide sur le Pi ;
3. les points utiles (oreille, épaule, hanche) sont détectés de façon stable de profil ;
4. les points peu fiables sont écartés grâce à leur score de confiance ;
5. aucune image n'est stockée ni transmise.

---

## 2. Schéma

```text
            Webcam USB (de profil)
                    │
                    ▼
┌───────────────────────────────────────────┐
│          RASPBERRY PI 4 (edge)            │
│                                           │
│  OpenCV      capture une image (en RAM)   │
│     ↓                                     │
│  MoveNet     17 keypoints + confiance     │
│     ↓                                     │
│  ── image effacée ──                      │
│     ↓                                     │
│  NumPy       angles tête / buste          │
│     ↓                                     │
│  Règles      GOOD / FORWARD_HEAD / ...    │
│     ↓                                     │
│  Filtre      confirme dans le temps       │
│     ↓                                     │
│  Événement                                │
└────────────────────┬──────────────────────┘
                     │ HTTPS / JSON, chiffres seulement
                     ▼
              Serveur (équipe)
```

**La frontière à valider :** les pixels restent sur le Pi, seules les données dérivées (keypoints, angles, événements) peuvent en sortir.

---

## 3. Pourquoi l'IA tourne sur le Raspberry (RGPD)

| | IA sur le serveur | **IA sur le Raspberry (choix retenu)** |
|---|---|---|
| Ce qui passe sur le réseau | images / vidéo | des chiffres |
| Ce qui est stocké | des images | rien : l'image vit quelques ms en RAM |
| En cas de fuite du serveur | des photos de personnes | des angles liés à un pseudonyme |
| Réseau coupé | plus d'analyse | l'analyse continue |
| Bande passante | forte | quasi nulle |

Le RGPD demande de ne collecter que le nécessaire (**minimisation**, art. 5) et de protéger les données **dès la conception** (art. 25).

**Nuance :** le traitement local réduit fortement l'exposition, mais il ne rend pas les données anonymes. Des keypoints ou des angles liés à une session restent des **données personnelles pseudonymisées**. Il faut donc limiter ce qui est envoyé et prévoir une durée de conservation.

---

## 4. Choix techniques

| Choix | Pourquoi | Alternative |
|---|---|---|
| **Raspberry Pi 4** | assez puissant pour un petit modèle, peu cher, faible consommation, posé au poste | Pi Zero : trop lent ; PC dédié : trop cher |
| **Webcam USB** | marche directement avec OpenCV ; même code sur PC et sur Pi ; câble long, facile à placer | Arducam CSI : code différent (`picamera2`), nappe courte. Plan B seulement. |
| **Caméra de profil** | seule vue qui montre la tête avancer et le dos se pencher | vue de face : ne voit pas ces postures |
| **OpenCV** | gère l'image : capture, redimensionnement, BGR → RGB, affichage debug (squelette, angles). **Ce n'est pas l'IA.** | — |
| **MoveNet Lightning** | modèle pré-entraîné léger (quelques Mo), conçu pour les petits appareils, format TFLite / LiteRT, 17 points suffisants de profil | **MediaPipe Pose** (33 points, plus lourd) : comparé par benchmark ; Thunder, OpenPose, YOLO-Pose : trop lourds pour le Pi |
| **NumPy** | géométrie : keypoints → angles | — |

> MoveNet est le **candidat principal**, à valider face à MediaPipe : taux de détection, stabilité, latence, ressources et facilité d'installation.

> **L'IA ne décide pas qu'une posture est mauvaise.** Elle donne la position des points du corps. C'est notre logique (angles, règles, filtre temporel) qui décide.

---

## 5. L'algorithme

**L'IA voit, l'algorithme juge.** MoveNet trouve où sont l'oreille, l'épaule et la hanche. L'algorithme, écrit par nous, décide si la posture est mauvaise, et ne conclut que si elle dure.

```text
MoveNet → points du corps
   ↓
personne détectée ?  non → NO_PERSON (prochaine capture dans 30 s)
   ↓ oui
confiance OK ?  non → capture ignorée (UNKNOWN)
   ↓ oui
angles tête / buste
   ↓
comparés à la référence de la personne → GOOD ou BAD
   ↓
BAD la plupart du temps pendant 2 min ? → événement envoyé
```

### 5.1 Keypoints → angles

On garde le **côté le mieux vu**, c'est-à-dire celui dont l'oreille, l'épaule et la hanche ont la meilleure confiance.

| Mesure | Calcul | Lecture |
|---|---|---|
| Angle tête | droite épaule → oreille par rapport à l'horizontale | 90° = tête droite ; plus l'angle baisse, plus la tête avance |
| Angle buste | droite hanche → épaule par rapport à la verticale | 0° = droit ; > 0 penché en avant ; < 0 avachi |
| Mouvement | déplacement médian des points ÷ longueur du buste | proche de 0 = immobile |

### 5.2 Règles

| Posture | Règle de départ |
|---|---|
| `FORWARD_HEAD` | angle tête < référence − 8° |
| `TRUNK_FORWARD` | angle buste > référence + 12° (sans référence : > 20°, méthode RULA) |
| `TRUNK_BACKWARD` | angle buste < référence − 12° |
| `IMMOBILE` | mouvement < 0,02 pendant 50 min |

**Référence :** au début, la personne s'assoit droite 10 s et on garde la **médiane** des angles. Les règles s'adaptent ainsi à chaque morphologie.

### 5.3 La confiance : savoir quand l'IA doute

MoveNet renvoie pour chaque point un **score de 0 à 1**, qui exprime à quel point le modèle est sûr de la position du point.

```text
oreille  → 0,91
épaule   → 0,95
hanche   → 0,22   ← mal détectée : on ne calcule PAS l'angle

si confiance(oreille, épaule ou hanche) < 0,30
    → capture ignorée (UNKNOWN), elle ne compte ni pour ni contre
```

> La confiance porte sur **la position d'un point**, pas sur **la probabilité que la posture soit médicalement mauvaise**.

### 5.4 Quand l'IA se trompe

| Problème | Exemple | Protection |
|---|---|---|
| Occlusion | oreille cachée, hanche derrière l'accoudoir | confiance < 0,30 → UNKNOWN |
| Éclairage | contre-jour, pièce sombre | confiance basse → UNKNOWN ; caméra dos à la fenêtre |
| Point faux mais confiance haute | épaule placée sur le dossier | contrôle de cohérence (longueur du buste, angles plausibles) *(à coder)* |
| Mouvement / jitter | points qui bougent de quelques pixels | **rafale** : médiane de 3 captures rapprochées *(à coder)* |
| Caméra mal placée | trop haute, pas vraiment de profil | consigne de placement + référence personnelle |
| Geste normal | boire, ramasser un stylo | filtre temporel |
| Morphologie | personne naturellement voûtée | référence personnelle |
| Poste vide | pause | NO_PERSON → pas d'analyse (à ne pas confondre avec UNKNOWN : personne présente mais mal vue) |

Le POC doit donc **mesurer la stabilité** des points, pas seulement afficher un squelette.

### 5.5 Filtre temporel

Une mauvaise image ne suffit jamais : la suite `BAD GOOD BAD BAD GOOD` ne doit pas déclencher d'alerte.

```text
fenêtre de 60 s (UNKNOWN exclus)
≥ 70 % de captures BAD pendant ≥ 2 min  → DÉBUT de l'événement
< 40 % pendant l'événement               → FIN de l'événement
```

Comme le seuil d'entrée est plus haut que le seuil de sortie (**hystérésis**), l'événement ne « clignote » pas.

**Cadence adaptative :** 1 capture toutes les 10 s si tout va bien, toutes les 2 s en cas de doute, toutes les 30 s si personne n'est au poste.

Tous les seuils de cette section (0,30, 60 s, 70 %, 40 %, 2 min, angles) sont des **valeurs de départ**, ajustées par les tests.

---

## 6. Répartition Raspberry / serveur

Les deux variantes respectent la règle principale : **l'image ne quitte jamais le Pi**.

| | **A. Tout sur le Pi** (par défaut) | **B. Pi → keypoints, serveur → le reste** |
|---|---|---|
| Le Pi envoie | événements (posture, durée, angles moyens) | keypoints + confiance à chaque capture |
| Pour | très peu de données, fonctionne sans réseau | Pi plus simple, règles modifiables côté serveur, keypoints réanalysables |
| Contre | changer une règle = redéployer le Pi | plus de données personnelles envoyées et stockées, dépend du réseau |

Le minimum à valider est la chaîne **caméra → MoveNet → keypoints fiables → image effacée**. Les deux variantes sont ensuite testées, et le choix final se fait avec l'équipe à partir des mesures.

### Proposition : algorithme sur le Pi, seuils pilotés par le serveur

**Le Pi a la puissance nécessaire** (mesures du 7 octobre 2026, Pi 4 de 2 Go, webcam Logitech C110) :

| Pour 1 image | Temps |
|---|---|
| capture d'une image fraîche | ~55 ms |
| MoveNet Lightning int8 | ~21 ms |
| angles, règles, filtre | < 1 ms |
| **total** | **~80 ms** |

Soit environ **4 % d'un cœur** à la cadence la plus rapide (1 image / 2 s), et moins de 1 % à 1 image / 10 s, pour ~100 Mo de mémoire. Le Pi a monté à 76 °C seulement quand l'IA tournait en continu (démo en direct), sans dissipateur.

**Proposition :** l'algorithme tourne sur le Pi (variante A), mais ses **seuils** (angles, 70 %, 40 %, 2 min…) sont **envoyés par le serveur** et réglables depuis le site admin. Le Pi garde les derniers seuils reçus si le serveur est injoignable.

- On garde les avantages de A : seuls les événements sortent (pas de keypoints, données liées au corps), la détection continue sans réseau, la charge serveur reste faible même avec plusieurs postes.
- On récupère le principal avantage de B : ajuster les règles sans redéployer le Pi.
- Le réglage des seuils pendant le POC se fait avec les exemples étiquetés enregistrés **localement** (volontaires d'accord), sans envoi au serveur.

**À confirmer par les tests :** vitesse réelle de l'IA (T1), tenue sur 8 h (endurance), détection de profil (T3), justesse (T5). **Points d'attention :** prévoir un dissipateur ; le Pi n'a pas d'horloge interne, donc il faut garder les événements en attente tant que l'heure n'est pas synchronisée (NTP).

**Ce qui ne sort jamais :** image, frame, pixels, vidéo.
**Ce qui peut sortir :** keypoints, confiance, angles, classe de posture, événement, horodatage.

```json
{ "device": "pi-poste-01", "type": "FORWARD_HEAD",
  "start": "2026-10-07T14:02:10Z", "duration_s": 210,
  "head_angle_avg": 43.1, "confidence_avg": 0.71 }
```

---

## 7. Plan de validation

Développer sur **PC** pour visualiser vite, et valider **tout de suite sur le Pi** les risques bloquants (caméra, runtime IA, vitesse).

| # | Étape | Mesure | Validé si |
|---|---|---|---|
| 1 | Webcam + OpenCV | échecs de capture sur 1 h | 0 échec |
| 2 | MoveNet sur le Pi | temps d'inférence (moyenne, médiane, p95), CPU, RAM, température | < 150 ms par image |
| 3 | Détection de profil | 3 personnes × 3 éclairages × 2 distances | oreille, épaule, hanche ≥ 0,30 sur ≥ 90 % des images |
| 4 | Stabilité | personne immobile 60 s | écart-type des angles < 3° |
| 5 | MoveNet vs MediaPipe | même scène, mêmes mesures | tableau comparatif → choix justifié |
| 6 | Règles + filtre | postures jouées par 5 personnes | F1 ≥ 0,80 par posture ; < 1 fausse alerte / h |
| 7 | Endurance + vie privée | 8 h de fonctionnement | pas de throttling ; **0 image** écrite ni transmise |

Les échecs sont aussi notés : ils alimentent la partie « difficultés et solutions » du rapport (plan B : MediaPipe, autre placement, seuils ajustés).

**Le POC est validé** quand la chaîne caméra → Pi → MoveNet → keypoints fiables → image effacée → données dérivées est démontrée, avec des mesures réelles : latence, stabilité, ressources, confiance et taux de détection.
