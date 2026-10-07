# POC Raspberry Pi — caméra + OpenCV + IA + analyse de posture

> Plan pour démarrer les tests **directement sur le Raspberry Pi**, avec la webcam USB.
> Objectif : prouver que la chaîne **caméra → MoveNet → angles → règles → résultat** fonctionne sur le matériel final, et mesurer ses performances.
> Référence de la solution : [solution-mvp.md](solution-mvp.md). Les tests T1 à T7 y sont définis au §8.

---

## 1. Ce que le POC doit prouver

| # | Question | Test |
|---|---|---|
| 1 | La caméra fonctionne-t-elle avec le Pi ? | T2 |
| 2 | L'IA (MoveNet) tourne-t-elle assez vite sur le Pi ? | T1 |
| 3 | L'IA voit-elle bien une personne assise **de profil** ? | T3 |
| 4 | Les angles distinguent-ils les bonnes et les mauvaises postures ? | T5 |
| 5 | Les règles et le filtrage dans le temps évitent-ils les fausses alertes ? | T5 |
| 6 | La cadence adaptative suffit-elle ? | T7 |
| 7 | Aucune image n'est-elle écrite ni envoyée ? | T6 |

Le POC **ne contient pas** le serveur, l'app mobile ni le site web : il s'arrête quand le Raspberry produit un résultat fiable (« tête en avant depuis 3 min »). Le branchement au serveur vient après.

### Ordre de développement

Le code se construit brique par brique, directement sur le Pi. Chaque brique est vérifiée par un test (§6) avant de passer à la suivante.

| # | Brique | Code | Vérifiée par |
|---|---|---|---|
| 1 | Webcam USB sur le Pi + OpenCV | §5.1 | étape 1 (T2) |
| 2 | Ajouter MoveNet Lightning | §3.4, §5.2 | étape 2 (T1) |
| 3 | Afficher les keypoints (fenêtre de debug) | `live.py` | étape 3 (T3) |
| 4 | Calculer les angles avec NumPy, en ignorant les points peu fiables (confidence) | §5.3 | étape 3 (T3) |
| 5 | Détecter les postures (règles + calibration) | §5.4 | étapes 4 et 5 (T5) |
| 6 | Ajouter le filtrage dans le temps et la cadence adaptative | §5.5, §5.6 | étapes 5 et 6 (T5, T7) |

La confidence n'arrive pas à la fin : dès la brique 4, une capture dont l'oreille, l'épaule ou la hanche est mal détectée est ignorée (UNKNOWN) avant même les règles.

---

## 2. Matériel

| Élément | Détail |
|---|---|
| Raspberry Pi 4 | 4 Go de RAM conseillés |
| Carte microSD | 32 Go, classe A1 ou mieux |
| Alimentation officielle | 5 V / 3 A (USB-C). Une alimentation trop faible fait ralentir le Pi. |
| Dissipateur ou boîtier ventilé | le Pi va tourner longtemps |
| **Webcam USB** | n'importe quelle webcam UVC (720p suffit) |
| Pied ou pince pour la webcam | pour la placer **de profil** |
| Accès au Pi | soit écran HDMI + clavier, soit un PC sur le même réseau (SSH / VNC) |

**Placement de la caméra :**

```text
        vue de dessus

   [écran]
      │
   [bureau]      👤 personne assise
                  │
                  │  1,5 à 3 m
                  │
                 📷 webcam, à hauteur d'épaule,
                    perpendiculaire à la personne
```

Il faut voir dans l'image **l'oreille, l'épaule et la hanche** du côté de la caméra. Éviter le contre-jour (fenêtre derrière la personne).

---

## 3. Installation du Raspberry Pi

### 3.1 Système

1. Avec **Raspberry Pi Imager**, installer **Raspberry Pi OS (64 bits)**.
2. Dans les réglages avancés de l'Imager : nom d'hôte (ex. `dosdane-pi`), utilisateur et mot de passe, Wi-Fi, **activer SSH**.
3. Démarrer le Pi, puis depuis le PC : `ssh <utilisateur>@dosdane-pi.local`
4. Mettre à jour le système et vérifier l'heure (synchronisation NTP active par défaut) :

```bash
sudo apt update && sudo apt full-upgrade -y
timedatectl          # « System clock synchronized: yes »
python3 --version    # noter la version (pour le compte rendu)
```

### 3.2 Travailler confortablement depuis le PC

- **VS Code + extension « Remote - SSH »** : on ouvre le dossier du Pi et on code comme en local.
- Pour voir la **fenêtre de debug** (image + squelette), au choix : un écran branché au Pi, ou **VNC** (`sudo raspi-config` → Interface Options → VNC, puis RealVNC Viewer sur le PC).

### 3.3 Environnement Python

```bash
mkdir -p ~/poc-posture/models ~/poc-posture/resultats
cd ~/poc-posture
python3 -m venv .venv --system-site-packages   # system-site-packages : utile si on teste picamera2 plus tard
source .venv/bin/activate
pip install --upgrade pip
pip install numpy opencv-python ai-edge-litert
```

- `ai-edge-litert` est le moteur d'exécution TensorFlow Lite (LiteRT). **Si l'installation échoue**, c'est le premier résultat du test T1 : le noter, puis essayer `pip install tflite-runtime`.
- Vérifier : `python -c "import cv2, numpy; from ai_edge_litert.interpreter import Interpreter; print(cv2.__version__)"`

### 3.4 Modèle MoveNet

- Télécharger le modèle depuis **Kaggle Models** : *google / movenet* → format **TFLite** → variante **singlepose-lightning** (int8 ou float16). On obtient un fichier `.tflite` de quelques Mo.
- Le placer dans `~/poc-posture/models/movenet_lightning.tflite`.
- Les anciens liens `tfhub.dev/...` renvoient une erreur 404 : passer par Kaggle.

---

## 4. Organisation du code du POC

```text
~/poc-posture/
├── models/movenet_lightning.tflite
├── posture_lib.py        ← fonctions communes : caméra, MoveNet, angles, règles, filtre
├── t2_camera.py          ← test caméra
├── t1_vitesse.py         ← test vitesse de l'IA
├── live.py               ← fenêtre de debug + enregistrement d'exemples étiquetés
├── poc.py                ← chaîne complète : cadence adaptative, règles, événements
├── evaluer.py            ← calcul des scores (T5) à partir des exemples étiquetés
└── resultats/            ← CSV de mesures (jamais d'images)
```

Une fois validé, ce code sera repris dans `apps/sensors` du dépôt.

---

## 5. Les briques techniques

### 5.1 Lire la caméra (OpenCV)

```python
import cv2

cam = cv2.VideoCapture(0)                 # 0 = première webcam USB
cam.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cam.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

def capturer(cam):
    for _ in range(3):                    # vider les images en attente
        cam.grab()                        # pour avoir une image récente
    ok, image = cam.read()
    return image if ok else None
```

L'image n'existe **qu'en mémoire** : on ne l'écrit jamais sur le disque.

### 5.2 Trouver les points du corps (MoveNet)

MoveNet attend une image **carrée de 192×192** et renvoie **17 points** `(y, x, score)` entre 0 et 1.

```python
import numpy as np
from ai_edge_litert.interpreter import Interpreter

modele = Interpreter(model_path="models/movenet_lightning.tflite", num_threads=4)
modele.allocate_tensors()
entree = modele.get_input_details()[0]
sortie = modele.get_output_details()[0]

def points_du_corps(image_bgr):
    h, w = image_bgr.shape[:2]
    cote = max(h, w)                                   # on complète en carré
    carre = np.zeros((cote, cote, 3), dtype=np.uint8)  # pour ne pas déformer
    haut, gauche = (cote - h) // 2, (cote - w) // 2    # la personne
    carre[haut:haut + h, gauche:gauche + w] = image_bgr
    rgb = cv2.cvtColor(carre, cv2.COLOR_BGR2RGB)
    x = cv2.resize(rgb, (192, 192))[np.newaxis].astype(entree["dtype"])
    modele.set_tensor(entree["index"], x)
    modele.invoke()
    res = modele.get_tensor(sortie["index"])[0, 0]     # 17 × (y, x, score)
    pts = np.empty((17, 3), dtype=np.float32)
    pts[:, 0] = res[:, 1] * cote - gauche              # x en pixels
    pts[:, 1] = res[:, 0] * cote - haut                # y en pixels
    pts[:, 2] = res[:, 2]                              # confiance
    return pts
```

Numéros des points utiles :

| Point | Gauche | Droite |
|---|---|---|
| nez | 0 | 0 |
| oreille | 3 | 4 |
| épaule | 5 | 6 |
| hanche | 11 | 12 |

### 5.3 Calculer les angles (NumPy)

De profil, on garde **le côté le mieux vu** : celui dont l'oreille, l'épaule et la hanche ont la meilleure confiance.

```python
import math

COTES = {"gauche": (3, 5, 11), "droite": (4, 6, 12)}   # oreille, épaule, hanche
CONF_MIN = 0.3

def angles(pts):
    cote = max(COTES, key=lambda c: pts[list(COTES[c]), 2].mean())
    o, e, h = COTES[cote]
    if min(pts[o, 2], pts[e, 2], pts[h, 2]) < CONF_MIN:
        return None                                    # capture ignorée (UNKNOWN)
    oreille, epaule, hanche = pts[o, :2], pts[e, :2], pts[h, :2]

    # sens du regard : +1 si la personne regarde vers la droite de l'image
    if pts[0, 2] >= CONF_MIN:
        sens = 1 if pts[0, 0] >= oreille[0] else -1
    else:
        sens = 1 if oreille[0] >= epaule[0] else -1

    # Tête en avant : angle entre l'horizontale à l'épaule et la droite épaule → oreille.
    # 90° = oreille à la verticale de l'épaule ; plus l'angle baisse, plus la tête avance.
    tete = math.degrees(math.atan2(epaule[1] - oreille[1], (oreille[0] - epaule[0]) * sens))

    # Tronc : 0° = droit ; > 0 = penché en avant ; < 0 = penché en arrière (avachi).
    tronc = math.degrees(math.atan2((epaule[0] - hanche[0]) * sens, hanche[1] - epaule[1]))

    longueur_tronc = float(np.linalg.norm(epaule - hanche))
    return {"cote": cote, "tete": tete, "tronc": tronc, "longueur_tronc": longueur_tronc}
```

(L'axe y d'une image va vers le **bas**, d'où les soustractions dans ce sens.)

**Mouvement** (pour l'immobilité) : déplacement médian des points bien détectés entre deux captures, divisé par la longueur du tronc. Cela le rend indépendant de la distance à la caméra.

```python
def mouvement(pts_avant, pts, longueur_tronc):
    ok = (pts_avant[:, 2] >= CONF_MIN) & (pts[:, 2] >= CONF_MIN)
    if ok.sum() < 3 or longueur_tronc <= 0:
        return None
    d = np.linalg.norm(pts[ok, :2] - pts_avant[ok, :2], axis=1)
    return float(np.median(d) / longueur_tronc)
```

### 5.4 Les règles (les 4 postures)

Valeurs **de départ**, à ajuster avec le test T5. Les seuils du tronc s'appuient sur la méthode **RULA** (0–20° / 20–60°).

| Posture | Règle sans calibration | Règle avec calibration (posture de référence) |
|---|---|---|
| Tête en avant | `tete < 50°` | `tete < ref_tete − 8°` |
| Dos penché en avant | `tronc > 20°` | `tronc > ref_tronc + 12°` |
| Avachi, penché en arrière | `tronc < −25°` | `tronc < ref_tronc − 12°` |
| Immobilité prolongée | `mouvement < 0,02` pendant 50 min | idem |

**Calibration** : au début, la personne s'assoit droite pendant 10 s. On prend la **médiane** de `tete` et `tronc` sur ces captures : ce sont `ref_tete` et `ref_tronc`.

### 5.5 Vérification dans le temps (anti fausses alertes)

Pour chaque posture, on garde l'historique des captures des **60 dernières secondes** :

```text
capture ignorée (UNKNOWN)       → ne compte pas
part de captures « mauvaises » ≥ 70 % pendant au moins 2 min  → DÉBUT d'événement
pendant l'événement, part < 40 %                                → FIN d'événement
```

Le seuil d'entrée (70 %) est plus haut que le seuil de sortie (40 %), pour qu'un événement ne clignote pas.

Exemple de résultat :

```text
DÉBUT  FORWARD_HEAD    14:02:10
FIN    FORWARD_HEAD    14:05:40   durée 3 min 30 s   tete moyenne 43°
```

Pour les tests, prévoir un **mode rapide** (fenêtre 10 s, durée minimale 10 s, immobilité 1 min) afin de ne pas attendre des minutes.

### 5.6 Cadence adaptative

| Situation | Délai avant la capture suivante |
|---|---|
| personne détectée, rien d'anormal | 10 s |
| au moins une posture « en doute » (part de mauvaises captures > 30 %) | 2 s |
| aucune personne détectée | 30 s |

### 5.7 Ce qui est enregistré pendant le POC

Uniquement des **CSV de chiffres** dans `resultats/` : heure, côté, confiances, angles, mouvement, classe, label (pour les exemples étiquetés), coordonnées des 17 points. **Jamais d'image** : ni `cv2.imwrite`, ni enregistrement vidéo.

---

## 6. Plan de test, étape par étape

### Étape 0 — Préparer · *½ journée*

- Installer le Pi (§3) et récupérer le modèle (§3.4).
- **Livrable :** Pi accessible en SSH, `import` qui fonctionne, modèle présent.

### Étape 1 — T2 : la caméra · *½ journée*

- Script `t2_camera.py` : capture 1 image toutes les 5 s pendant 1 h, compte les échecs, affiche la résolution obtenue.
- **Réussi si :** 0 échec sur 1 h.
- **Si échec :** autre port USB, autre webcam, puis Arducam CSI avec `picamera2`.

### Étape 2 — T1 : la vitesse de l'IA · *½ journée*

- Script `t1_vitesse.py` : 5 inférences d'échauffement, puis 100 mesurées. Afficher le temps moyen, le temps typique (médiane) et le pire cas courant (95ᵉ centile), la température (`vcgencmd measure_temp`) avant et après.
- Comparer `num_threads` = 1, 2 et 4, et les variantes int8 / float16 du modèle si les deux sont disponibles.
- **Réussi si :** < 150 ms par image.
- **Si échec :** autre variante du modèle, moins de threads concurrents, ou captures plus espacées.

### Étape 3 — T3 : voir la personne de profil · *1 journée*

- Script `live.py` : fenêtre de debug avec l'image, le squelette, les angles et la confiance. Le même affichage sur fond neutre (mode PRIVACY MAX) doit aussi être disponible.
- **3 personnes × 3 éclairages** (lumière du jour, plafonnier, contre-jour léger) × 2 distances.
- Compter la part de captures où l'oreille, l'épaule et la hanche ont une confiance ≥ 0,3.
- Mesurer la **stabilité** : personne immobile 60 s, écart-type de `tete` et de `tronc`.
- **Réussi si :** ≥ 90 % de captures exploitables, et écart-type < 3°.
- **Si échec :** déplacer la caméra (§2), améliorer l'éclairage, essayer MediaPipe.

### Étape 4 — Enregistrer des exemples étiquetés · *1 journée*

- Dans `live.py`, une touche du clavier fixe le **label en cours**. Chaque capture est écrite dans un CSV avec ce label :

| Touche | Label |
|---|---|
| `0` | GOOD (bonne posture) |
| `1` | FORWARD_HEAD (tête en avant) |
| `2` | TRUNK_FORWARD (dos penché en avant) |
| `3` | TRUNK_BACKWARD (avachi en arrière) |
| `9` | pas d'enregistrement |
| `q` | quitter |

- Protocole par personne : 10 s droit (référence), puis chaque posture tenue 30 s, dans un ordre mélangé. On ajoute des gestes normaux (boire, attraper un objet) étiquetés GOOD.
- Au moins **5 personnes** volontaires et d'accord, si possible de morphologies variées.
- **Livrable :** `resultats/exemples_<date>.csv` (chiffres seulement).

### Étape 5 — T5 : règles et vérification dans le temps · *1 à 2 jours*

- Script `evaluer.py` : rejoue les règles du §5.4 sur les exemples étiquetés.
  - **Par capture**, et pour chaque posture : précision, rappel, F1, matrice de confusion.
  - **Distribution des angles** par label (moyenne, écart-type) : c'est ce qui permet d'ajuster les seuils.
  - Comparaison **avec et sans calibration**.
  - **Par événement**, avec le filtre du §5.5 en mode rapide : nombre de fausses alertes.
- **Réussi si :** F1 ≥ 0,80 pour chaque posture, et < 1 fausse alerte par heure.
- **Si échec :** ajuster les seuils à partir des distributions ; si une posture reste mauvaise, la retirer du MVP et l'expliquer.

### Étape 6 — Chaîne complète et T7 : cadence adaptative · *1 jour*

- Script `poc.py` : calibration 10 s → boucle avec la cadence adaptative → règles → filtre → affichage des événements, plus un CSV des mesures et des événements.
- Le comparer à une cadence fixe de 2 s : même délai de détection ? Combien de captures en moins ?
- **Immobilité** : la vérifier en mode rapide (1 min sans bouger → événement).
- **Réussi si :** même détection que la cadence fixe, délai < 1 min, nettement moins de captures.

### Étape 7 — Endurance et vie privée (T1 bis, T6) · *1 journée*

- Faire tourner `poc.py` **8 h**. Relever la température toutes les 10 min, et vérifier la fréquence (`vcgencmd get_throttled` doit rester `0x0`).
- Vérifier qu'**aucun fichier image** n'a été créé : `find ~ -newermt "AAAA-MM-JJ HH:MM" \( -name "*.jpg" -o -name "*.png" -o -name "*.mp4" \)`, avec la date et l'heure de début du test.
- (T6 complet une fois l'envoi au serveur branché : capture du trafic réseau avec `tcpdump`.)

**Durée totale estimée : environ 1 à 2 semaines**, selon la disponibilité du matériel et des volontaires.

---

## 7. Fiche de résultats à remplir

| Test | Date | Conditions | Mesure obtenue | Critère | Réussi ? | Remarques / plan B |
|---|---|---|---|---|---|---|
| T2 caméra | | webcam ___, 640×480 | ___ échecs / 720 captures | 0 échec | | |
| T1 vitesse | | modèle ___, threads ___ | moy ___ ms, p95 ___ ms, temp ___ °C | < 150 ms | | |
| T3 détection | | 3 pers. × 3 éclairages | ___ % exploitables, écart-type ___° | ≥ 90 %, < 3° | | |
| T5 tête en avant | | ___ personnes | F1 ___ | ≥ 0,80 | | |
| T5 dos en avant | | | F1 ___ | ≥ 0,80 | | |
| T5 avachi | | | F1 ___ | ≥ 0,80 | | |
| T5 immobilité | | mode rapide | détectée : oui / non | oui | | |
| T5 fausses alertes | | ___ h de test | ___ / h | < 1 / h | | |
| T7 cadence | | fixe 2 s vs adaptative | ___ captures vs ___, délai ___ s | délai < 1 min | | |
| Endurance | | 8 h | temp max ___ °C, throttled ___ | < 70 °C, `0x0` | | |
| Aucune image | | 8 h | ___ fichiers image | 0 | | |

Chaque ligne alimente le rapport, y compris les échecs : ils constituent la partie « points de blocage et solutions » demandée par le sujet.

---

## 8. Après le POC

Une fois les tests réussis :

1. reprendre le code dans `apps/sensors` du dépôt ;
2. ajouter l'envoi des événements au serveur NestJS (HTTPS) ;
3. démarrer et arrêter l'analyse depuis l'app mobile (session) ;
4. faire le test T6 complet (capture réseau).
