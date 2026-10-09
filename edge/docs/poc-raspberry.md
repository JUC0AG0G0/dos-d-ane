# POC Raspberry Pi — caméra + OpenCV + IA + analyse de posture

> Plan pour démarrer les tests **directement sur le Raspberry Pi**, avec la webcam USB.
> Objectif : prouver que la chaîne **caméra → MoveNet → angles → règles → résultat** fonctionne sur le matériel final, et mesurer ses performances.
> Référence de la solution : [solution-mvp.md](solution-mvp.md). Les tests T1 à T7 y sont définis au §8.
> Explication simple de l'algorithme (axes, angles, seuils, entraînement éventuel) : [algo-posture.md](algo-posture.md).

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
| 4 | Calculer les angles, en ignorant les points peu fiables (confidence) | §5.3 | étape 3 (T3) |
| 5 | Détecter les postures (règles + calibration) | §5.3 | étapes 4 et 5 (T5) |
| 6 | Ajouter le filtrage dans le temps et la cadence adaptative | §5.5 | étapes 5 et 6 (T5, T7) |

La confidence n'arrive pas à la fin : dès la brique 4, une capture dont l'oreille, l'épaule ou la hanche est mal détectée est ignorée (UNKNOWN) avant même les règles.

---

## 2. Matériel

| Élément | Détail |
|---|---|
| Raspberry Pi 4 | 4 Go de RAM conseillés |
| Carte microSD | 32 Go, classe A1 ou mieux |
| Alimentation officielle | 5 V / 3 A (USB-C). Une alimentation trop faible fait ralentir le Pi. |
| Dissipateur ou boîtier ventilé | le Pi va tourner longtemps |
| **Webcam USB** | une webcam **UVC** (pilote standard `uvcvideo`), 640×480 suffit. Retenue : **Logitech C110**. ⚠️ Éviter les très vieux modèles à pilote `gspca_*` : la LifeCam VX-1000 figeait le Pi (§3.5). |
| Pied ou pince pour la webcam | pour la placer **de profil** |
| Accès au Pi | soit écran HDMI + clavier, soit un PC sur le même réseau (SSH / VNC) |
| Lecteur de carte SD | pour préparer la carte depuis le PC |
| *(optionnel)* câble **micro-HDMI** → HDMI | le Pi 4 n'a pas de port HDMI classique |

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

### 3.1 Système : premier démarrage

**Réseau.** Le PC et le Pi doivent être sur le même réseau. Le Wi-Fi **« UHA 4.0 »** fonctionne : simple mot de passe (WPA2), le nom `dosdane-pi.local` est trouvé et les appareils se voient entre eux. Plan B : le partage de connexion d'un téléphone.

**a) Préparer la carte microSD (sur le PC)**

⚠️ **Ne pas utiliser l'Imager d'Ubuntu** (`apt install rpi-imager`, version 1.8.5) : il est trop ancien pour le Raspberry Pi OS actuel (Debian 13 « Trixie »), qui reçoit ses réglages par *cloud-init*. Les réglages (utilisateur, Wi-Fi, SSH) sont ignorés et le Pi démarre sur l'assistant « Welcome », impossible à remplir sans clavier.

1. Télécharger et lancer l'**Imager 2** officiel :

   ```bash
   sudo apt install -y libfuse2t64 libopengl0 libxcb-cursor0   # bibliothèques nécessaires
   cd ~/Téléchargements
   wget https://downloads.raspberrypi.com/imager/imager_latest_amd64.AppImage
   chmod +x imager_latest_amd64.AppImage
   sudo ./imager_latest_amd64.AppImage      # sudo : nécessaire pour écrire sur la carte
   ```

2. Choisir : appareil **Raspberry Pi 4**, système **Raspberry Pi OS (64-bit)** *avec bureau* (utile pour la fenêtre de debug), stockage = la carte SD (*Internal SD card reader*, ~30 Go ; **jamais** le disque du PC). Une carte déjà utilisée est simplement effacée par l'Imager, pas besoin de la formater avant.
3. Remplir chaque page de **Personnalisation** :

   | Page | Valeur |
   |---|---|
   | Nom d'hôte | `dosdane-pi` |
   | Localisation | `Europe/Paris`, clavier `fr` |
   | Utilisateur | nom en minuscules + mot de passe (≥ 10 caractères, à noter) |
   | Wi-Fi | SSID `UHA 4.0`, mot de passe, pays `FR` |
   | Accès à distance | **activer SSH**, authentification par mot de passe |
   | Raspberry Pi Connect | désactivé |

4. Vérifier le **résumé** (les 5 réglages doivent y apparaître), écrire la carte, attendre « Terminé ».

**b) Brancher (dans cet ordre)**

```text
   [USB-C] [µHDMI0] [µHDMI1] [jack]      ← côté alimentation / écran
          RASPBERRY PI 4
   [USB2] [USB2] [USB3 bleus] [RJ45]     ← côté USB / Ethernet
   microSD : en dessous, côté opposé aux USB
```

1. Carte microSD (contacts vers la carte).
2. Webcam sur un port USB **bleu**.
3. *(Optionnel)* écran sur **µHDMI0** (le plus proche de l'USB-C) et clavier.
4. **Alimentation en dernier** : le Pi n'a pas de bouton, il démarre dès qu'il est branché.

Voyants : 🔴 rouge fixe = alimentation correcte (s'il clignote, l'alimentation est trop faible) ; 🟢 vert qui clignote = le Pi lit la carte. Une fois démarré, le vert reste éteint la plupart du temps : c'est normal. Le premier démarrage prend 1 à 3 minutes (le Pi applique les réglages et redémarre une fois). Avec un écran : on doit arriver **directement sur le bureau**, sans assistant « Welcome ».

**c) Se connecter en SSH (depuis le PC)**

```bash
ssh <utilisateur>@dosdane-pi.local      # répondre « yes », puis le mot de passe
```

Connecté quand l'invite devient `<utilisateur>@dosdane-pi:~ $` : les commandes tapées s'exécutent alors **sur le Pi**.

Pour ne plus taper le mot de passe et avoir un raccourci `ssh pi` (utile pour VS Code), sur le PC :

```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_pi -N ""
ssh-copy-id -i ~/.ssh/id_ed25519_pi.pub <utilisateur>@dosdane-pi.local
cat >> ~/.ssh/config << 'EOF'

Host pi
    HostName dosdane-pi.local
    User <utilisateur>
    IdentityFile ~/.ssh/id_ed25519_pi
EOF
```

Si `dosdane-pi.local` est introuvable : scanner le réseau (`sudo apt install nmap`, puis `sudo nmap -sn 10.6.0.0/16 | grep -B2 -i raspberry`), ou regarder l'icône Wi-Fi du bureau avec un écran branché au Pi.

**d) Première configuration (sur le Pi)**

```bash
sudo apt update && sudo apt full-upgrade -y
timedatectl              # « System clock synchronized: yes »
python3 --version        # noter la version (pour le compte rendu)
vcgencmd measure_temp    # < 60 °C au repos

lsusb                    # la webcam doit apparaître
sudo apt install -y v4l-utils
v4l2-ctl --list-devices  # la webcam doit apparaître avec /dev/video0

sudo raspi-config        # Interface Options → VNC → Yes → Finish (pour voir le bureau depuis le PC)
```

Si la webcam apparaît sous `/dev/video0`, la partie matérielle est prête. Les autres `/dev/video1x` / `/dev/video2x` sont les circuits vidéo internes du Pi.

**Vérifier le pilote de la webcam** : `readlink -f /sys/class/video4linux/video0/device/driver` doit se terminer par **`uvcvideo`**. Sinon (`gspca_…`), changer de webcam.

**Voir le flux de la webcam** (rien n'est enregistré), sur le bureau du Pi (écran HDMI, plus fluide que VNC) :

```bash
ffplay -f v4l2 -input_format mjpeg -video_size 640x480 /dev/video0     # q pour fermer
```

Depuis le PC, la même commande peut ouvrir la fenêtre sur l'écran du Pi en la préfixant par `XDG_RUNTIME_DIR=/run/user/1000 WAYLAND_DISPLAY=wayland-0 SDL_VIDEODRIVER=wayland`.

**Garder les journaux après un redémarrage** (Raspberry Pi OS les efface par défaut, ce qui empêche de comprendre un plantage) :

```bash
sudo mkdir -p /etc/systemd/journald.conf.d
echo -e "[Journal]\nStorage=persistent" | sudo tee /etc/systemd/journald.conf.d/50-persistent.conf
sudo systemctl restart systemd-journald && sudo journalctl --flush
journalctl -b -1 -n 50      # après un redémarrage : la fin du démarrage précédent
```

### 3.2 Travailler confortablement depuis le PC

| Besoin | Comment |
|---|---|
| Coder | **VS Code + extension « Remote - SSH »** → `F1` → *Remote-SSH: Connect to Host* → `pi`. Une nouvelle fenêtre s'ouvre (`SSH: pi` en bas à gauche) : on code et on lance directement sur le Pi. |
| Voir la **fenêtre de debug** (image + squelette) | sur le PC : `sudo apt install tigervnc-viewer`, `mkdir -p ~/.config/tigervnc`, puis `vncviewer dosdane-pi.local`. Au premier lancement, accepter le certificat (`CN=dosdane-pi`, créé par le Pi). |
| Envoyer un fichier au Pi | `scp fichier pi:~/dos-d-ane/edge/` |
| Récupérer les résultats | `scp pi:~/dos-d-ane/edge/resultats/*.csv .` |
| Le nom `dosdane-pi.local` ne répond plus | sur le Wi-Fi de l'école, le nom `.local` fonctionne par moments seulement : passer par l'IP, `ssh -o HostName=<ip> pi` (IP lue sur l'icône Wi-Fi du bureau du Pi, ou avec `hostname -I` sur le Pi). L'IP peut changer après un redémarrage. |
| Éteindre | `sudo shutdown -h now`, puis débrancher quand le voyant vert ne clignote plus |

⚠️ Ne jamais débrancher le Pi sans l'éteindre proprement : la carte SD peut être abîmée et il faudrait tout réinstaller.

**Où modifier le code ?** Le dépôt existe en trois copies : le Pi, GitHub et le PC. Le code du POC se modifie, se lance et se commite **sur le Pi** (VS Code `SSH: pi`), puis se pousse sur GitHub. Sur le PC, un `git pull` suffit pour rester à jour. Si on modifie quelque chose sur le PC (la doc par exemple), on fait l'inverse : commit et push sur le PC, puis `git pull` sur le Pi.

### 3.3 Dépôt Git et environnement Python

Le code du POC est dans le dépôt de l'équipe, dossier **`edge/`**, branche **`feat/edge-poc`** (créée depuis `develop`).

**a) Cloner le dépôt sur le Pi et pouvoir pousser**

```bash
# sur le Pi : clé SSH dédiée à GitHub
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_github -N "" -C "dosdane-pi"
printf "\nHost github.com\n    User git\n    IdentityFile ~/.ssh/id_ed25519_github\n    IdentitiesOnly yes\n" >> ~/.ssh/config
cat ~/.ssh/id_ed25519_github.pub     # à coller dans GitHub → Settings → SSH and GPG keys → New SSH key

git clone -b feat/edge-poc git@github.com:JUC0AG0G0/dos-d-ane.git ~/dos-d-ane
cd ~/dos-d-ane
git config user.name "<nom>" && git config user.email "<email>"
ssh -T git@github.com                # « Hi <compte>! You've successfully authenticated »
```

⚠️ **Ne pas installer mise sur le Pi.** Le `mise.toml` du dépôt sert aux PC de développement du serveur (Node 26, Python 3.11, hooks) : sur le Pi, ce serait lourd et inutile. On utilise le Python du système dans un environnement virtuel.

**b) Environnement Python**

Un **environnement virtuel** (`.venv`) garde les bibliothèques du projet séparées du Python du système. Raspberry Pi OS refuse d'ailleurs `pip install` hors d'un environnement virtuel (`externally-managed-environment`).

```bash
cd ~/dos-d-ane/edge
python3 -m venv .venv
source .venv/bin/activate            # l'invite commence par (.venv)
pip install --upgrade pip
pip install -r requirements.txt
python -c "import cv2, numpy; from ai_edge_litert.interpreter import Interpreter; print('OK', cv2.__version__)"
```

- `requirements.txt` fige les versions : `numpy==2.5.3`, `opencv-python==5.0.0.93`, `ai-edge-litert==2.3.0` (le moteur d'exécution TensorFlow Lite, appelé LiteRT).
- `.venv/` n'est jamais commité : on le recrée avec `pip install -r requirements.txt`.
- `edge/.gitignore` exclut aussi le modèle (`models/*.tflite`) et les mesures (`resultats/`, données personnelles des volontaires).

**Choix retenus**

| Question | Choix | Raison |
|---|---|---|
| Python 3.13 (Pi) ou 3.11 (`mise.toml`) ? | **3.13**, le Python du Pi | c'est la machine cible ; `ai-edge-litert` existe en 3.13 pour ARM 64 bits ; aucun code Python dans `develop` n'impose 3.11. Le code reste compatible 3.11+. |
| `requirements.txt` ou `pyproject.toml` ? | **`requirements.txt`** pour le POC | simple pour des scripts ; passage à `pyproject.toml` quand le POC deviendra un vrai service |

### 3.4 Modèle MoveNet

Les modèles viennent de **Kaggle Models** (*google / movenet*, format TFLite). Les anciens liens `tfhub.dev/...` renvoient une erreur 404. Le téléchargement direct fonctionne sans compte :

```bash
cd ~/dos-d-ane/edge/models
for v in int8 float16; do
  mkdir -p tmp_$v
  curl -sL -o tmp_$v/a.tar.gz "https://www.kaggle.com/api/v1/models/google/movenet/tfLite/singlepose-lightning-tflite-$v/1/download"
  tar -xzf tmp_$v/a.tar.gz -C tmp_$v
  mv tmp_$v/4.tflite movenet_lightning_$v.tflite   # l'archive contient un fichier nommé 4.tflite
  rm -rf tmp_$v
done
chmod 644 *.tflite
```

| Fichier | Taille | SHA-256 (début) |
|---|---|---|
| `movenet_lightning_int8.tflite` | 2,9 Mo | `cd7cc22f…` |
| `movenet_lightning_float16.tflite` | 4,8 Mo | `0fac2226…` |

Les deux attendent une image **192×192×3 en `uint8`** et renvoient **17 points × (y, x, score)**. On commence avec **int8**, le plus rapide.

### 3.5 Compte rendu de l'installation (7 octobre 2026)

**Configuration obtenue**

| Élément | Valeur |
|---|---|
| Système | Raspberry Pi OS 64 bits, Debian 13 « Trixie », noyau 6.18 (aarch64) |
| Python | 3.13.5 |
| Nom / accès | `dosdane-pi.local`, SSH par clé (raccourci `ssh pi`), VNC |
| Réseau | Wi-Fi « UHA 4.0 » |
| Mémoire vive | **2 Go** (et non 4 Go comme conseillé au §2) |
| Webcam | **Logitech C110** (pilote `uvcvideo`) → `/dev/video0`, YUYV ou MJPEG jusqu'à 640×480 (MJPEG jusqu'à 1024×768). Remplace la LifeCam VX-1000. |
| Température | 46 à 56 °C au repos ; 57 à 59 °C avec le flux vidéo en direct ; 60,8 °C juste après le premier essai de MoveNet. Pas de dissipateur. |
| Journaux | conservés après redémarrage (§3.1 d) |
| Mises à jour | aucune en attente (image déjà récente) |
| Dépôt | `~/dos-d-ane`, branche `feat/edge-poc`, push par clé SSH GitHub |
| Python du POC | `edge/.venv` : NumPy 2.5.3, OpenCV 5.0.0, ai-edge-litert 2.3.0, installés sans erreur |
| Modèles | MoveNet Lightning int8 et float16 chargés sans erreur |
| Premier essai de vitesse | **int8 ≈ 21 ms**, float16 ≈ 36 ms par image (4 threads, 10 passages sur une image noire) : très en dessous des 150 ms visés. **Ce n'est pas encore le test T1** (100 mesures, image réelle, 1/2/4 threads, température). |

**Points de blocage et solutions**

| Problème | Cause | Solution |
|---|---|---|
| La carte SD n'était pas détectée par le PC | carte mal insérée | la réinsérer à fond |
| La carte contenait déjà un système utilisé (identifiants inconnus) | carte récupérée d'une autre utilisation | la réécrire entièrement avec l'Imager |
| Après une 1ʳᵉ écriture, le Pi affichait l'assistant « Welcome » et restait introuvable sur le réseau | Imager 1.8.5 d'Ubuntu trop ancien : réglages non appliqués par Trixie (cloud-init) | Imager 2 téléchargé sur raspberrypi.com (§3.1 a) |
| L'Imager 2 ne démarrait pas (`libOpenGL.so.0`, plugin Qt `xcb`) | bibliothèques manquantes sur le PC | `sudo apt install libopengl0 libxcb-cursor0`, lancement avec `sudo` |
| VNC redemande d'accepter le certificat à chaque connexion | TigerVNC n'arrive pas à le mémoriser | sans conséquence : vérifier que c'est bien `CN=dosdane-pi` et cliquer « Oui » |
| Le Pi **redémarrait tout seul** environ 1 min 20 après le lancement du flux de la webcam (2 fois) | la LifeCam VX-1000 utilise un vieux pilote (`gspca_sonixj`) qui **figeait le système** ; le chien de garde (*watchdog*, 1 min) redémarrait alors le Pi. Alimentation (5,1 V / 3 A, `throttled=0x0`), température (57 °C) et charge (0,2) écartées grâce aux journaux conservés et à un relevé toutes les 10 s. | webcam remplacée par une **Logitech C110** (pilote `uvcvideo`) : flux plus fluide, aucun blocage |
| Le code de capture analysait des images vieilles d'environ 5 s (vu au T2 : temps de capture médian de 2 ms, trop rapide pour être vrai) | la webcam garde 4 images en réserve | réserve réduite à 1 image (§5.1) : temps de capture médian de 55 ms, images fraîches |
| L'aperçu de la webcam était saccadé dans VNC | VNC renvoie toute la vidéo par le Wi-Fi | regarder sur un écran HDMI branché au Pi ; les scripts du POC n'affichent rien et ne sont pas concernés |
| Dans `live.py`, le côté vu (gauche / droite) et les verdicts clignotaient | à chaque image, le côté le mieux vu était recalculé ; de profil, MoveNet devine le côté caché avec une confiance parfois aussi haute | côté **bloqué** (`CoteStable`) : il ne change que si l'autre côté est nettement meilleur 5 images d'affilée. Mesuré ensuite : un seul côté sur 331 images |
| `UNKNOWN` fréquents alors que la personne était bien de profil (20 % des images) | seuil de confiance de 0,30 trop strict : oreille et épaule souvent vues entre 0,20 et 0,30 | seuil abaissé à **0,20** : 99 % d'images exploitables sur le même enregistrement, angles inchangés (tête 62° en moyenne pour les images récupérées comme pour les autres) |
| `ssh pi` échouait par moments (« Could not resolve hostname ») | le Wi-Fi de l'école ne transmet pas toujours les noms `.local` | passer par l'IP du Pi (§3.2) |
| Les docs étaient sur la branche `docs`, absente de `develop` | branches créées séparément depuis `main` | branche `feat/edge-poc` créée depuis `develop`, docs copiées dans `edge/docs/` |
| Le lien de téléchargement Kaggle semblait renvoyer une 404 | Kaggle répond 404 aux requêtes de type `HEAD` (`curl -I`) | télécharger normalement avec `curl -L` (§3.4) |

**Durée réelle :** environ 2 h 30 de la carte SD au bureau visible par VNC (dont une bonne partie due au problème de l'Imager), puis environ 1 h pour le dépôt, l'environnement Python et le modèle, puis environ 30 min pour diagnostiquer les redémarrages dus à la webcam. **L'étape 0 est terminée.**

---

## 4. Organisation du code du POC

```text
~/dos-d-ane/edge/
├── docs/                 ← cette documentation
├── requirements.txt      ← dépendances Python (versions figées)
├── .gitignore            ← exclut models/*.tflite et resultats/
├── .venv/                ← environnement Python (non commité)
├── models/               ← movenet_lightning_int8.tflite, movenet_lightning_float16.tflite (non commités)
├── README.md             ← installer, lancer, rôle de chaque fichier
├── posture_lib.py        ← LE CŒUR, commun à tous : caméra, MoveNet, angles, règles (puis filtre, score, profil)
├── poc.py                ← la vraie session (§5.5) : cadence adaptative, filtre, événements   (à écrire)
├── live.py               ← outil de debug : fenêtre en direct (puis enregistrement d'exemples étiquetés)
├── tests_poc/            ← outils de mesure, pas utilisés en session
│   ├── t2_camera.py         test caméra
│   ├── t1_vitesse.py        test vitesse de l'IA        (à écrire)
│   └── evaluer.py           scores T5                    (à écrire)
└── resultats/            ← CSV de mesures (jamais d'images, non commités)
```

Tous les scripts **importent** `posture_lib.py` au lieu de recopier le code : une correction profite à tous. Les tests se lancent depuis `edge/` avec `python -m tests_poc.t2_camera`.

Le code est directement dans le dépôt (`edge/`) : il est versionné dès le début. Une fois le POC validé, il sera réorganisé en paquet Python (`pyproject.toml`) pour devenir le service du Pi.

---

## 5. Les briques techniques

### 5.1 Lire la caméra (OpenCV)

```python
import cv2

cam = cv2.VideoCapture(0, cv2.CAP_V4L2)   # 0 = première webcam USB
cam.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cam.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
cam.set(cv2.CAP_PROP_BUFFERSIZE, 1)       # une seule image en réserve

def capturer(cam):
    cam.grab()                            # jette l'image en réserve, prise lors de la capture précédente
    ok, image = cam.read()                # attend une image fraîche
    return image if ok else None
```

L'image n'existe **qu'en mémoire** : on ne l'écrit jamais sur le disque.

⚠️ **Piège des images périmées.** Par défaut, la webcam garde **4 images en réserve**. Après plusieurs secondes sans lecture, ces 4 images sont anciennes, et les lire est instantané. La première version de ce code (3 `grab()` puis `read()`) analysait donc la 4ᵉ image en réserve, **vieille d'environ 5 s**. Mesuré sur le Pi : les 4 premières lectures prennent 0 ms (images en réserve), la 5ᵉ environ 50 ms (image fraîche). Avec une réserve de 1, il suffit de jeter une image. Ce code est celui de `ouvrir_camera()` et `capturer()` dans `posture_lib.py`.

### 5.2 Trouver les points du corps (MoveNet)

MoveNet attend une image **carrée de 192×192** et renvoie **17 points** `(y, x, score)` entre 0 et 1.

```python
import numpy as np
from ai_edge_litert.interpreter import Interpreter

modele = Interpreter(model_path="models/movenet_lightning_int8.tflite", num_threads=4)
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

### 5.3 Des points aux angles, puis aux postures

Le code est dans `posture_lib.py` (il n'est pas recopié ici, pour ne pas avoir deux versions qui divergent). Le **fonctionnement** (contrôles, angles, règles et sources des seuils, calibration, filtre dans le temps, cadence adaptative) est expliqué **une seule fois**, dans [algo-posture.md](algo-posture.md), « Les règles en une page ».

| Étape | Code dans `posture_lib.py` |
|---|---|
| choisir le côté vu (gauche / droite) et le bloquer | `CoteStable` |
| reprendre un seul point mal vu depuis ≤ 2 s | `Completeur` |
| vérifier que la personne est de profil | `ecart_epaules()`, `ECART_EPAULES_MAX` |
| ignorer les points peu sûrs | `CONF_MIN` |
| calculer tête, tronc et oreille–épaule–hanche | `angles()` |
| appliquer les règles (avec ou sans calibration) | `postures()` |
| filtre dans le temps, cadence, score, mouvement | à écrire (`poc.py`) |

**Mode rapide pour les tests** : prévoir une fenêtre de 10 s, une durée minimale de 10 s et une immobilité de 1 min, pour ne pas attendre des minutes.

### 5.4 Ce qui est enregistré pendant le POC

Uniquement des **CSV de chiffres** dans `resultats/` : heure, côté, confiances, angles, mouvement, classe, label (pour les exemples étiquetés), coordonnées des 17 points. **Jamais d'image** : ni `cv2.imwrite`, ni enregistrement vidéo.

### 5.5 Déroulé d'une vraie session (`poc.py`)

En vraie session, **il n'y a pas de flux vidéo continu** : le Pi prend une image de temps en temps, l'analyse, puis l'efface. Le flux continu de `live.py` ne sert qu'aux tests et aux réglages.

```text
Démarrer (depuis l'app)
   │
   ▼
Calibration : 10 s assis droit → posture de référence
   │
   ▼
┌─────────────── boucle, jusqu'à « Terminer » ───────────────┐
│ 1. prendre UNE image                          (~55 ms)     │
│ 2. MoveNet → 17 points                        (~21 ms)     │
│ 3. effacer l'image (elle n'a existé qu'en mémoire)         │
│ 4. points → angles tête et tronc → posture de cette image  │
│ 5. ajouter cette posture à l'historique des 60 dernières s │
│ 6. si mauvaise ≥ 70 % pendant 2 min → ÉVÉNEMENT (alerte)   │
│ 7. envoyer l'état à l'app (angles, posture, score)         │
│ 8. attendre avant l'image suivante :                       │
│      tout va bien          → 10 s                          │
│      posture « en doute »  →  2 s                          │
│      personne absente      → 30 s                          │
└────────────────────────────────────────────────────────────┘
```

Il n'y a **pas de fenêtre ni d'écran** sur le Pi : il tourne « à l'aveugle ».

**Exemple sur quelques minutes**

| Heure | Posture de l'image | Ce qui se passe |
|---|---|---|
| 14:00:00 | bonne | image suivante dans 10 s |
| 14:00:10 | bonne | 10 s |
| 14:00:20 | tête en avant | « en doute » → on accélère à **2 s** |
| 14:00:22 | tête en avant | 2 s |
| 14:00:24 | bonne | (la personne a bougé) |
| … (une image toutes les 2 s) | surtout tête en avant | plus de 70 % de mauvaises images… |
| **14:02:20** | tête en avant | **depuis 2 min → « Tête en avant détectée »** envoyé à l'app |
| … | | |
| 14:05:40 | bonne | moins de 40 % de mauvaises → **fin de l'événement** (durée 3 min 20 s) |
| ~14:06:40 | bonne | plus aucune image mauvaise depuis 60 s → retour à 10 s |

Au total : **6 images par minute** quand tout va bien, 30 en cas de doute, soit **moins de 1 seconde de calcul par minute**. Le Pi reste froid et aucune image n'est gardée.

L'écran « session en cours » de l'app n'est donc pas une vidéo : la silhouette y est mise à jour **à chaque image** (toutes les 2 à 10 s) avec les deux angles reçus.

---

## 6. Plan de test, étape par étape

### Étape 0 — Préparer · *½ journée*

- Installer le Pi (§3) et récupérer le modèle (§3.4).
- **Livrable :** Pi accessible en SSH, webcam visible sous `/dev/video0`, `import` qui fonctionne, modèle présent.

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

- Script `live.py` ✅ : fenêtre de debug avec l'image (floutée par défaut, nette ou fond noir avec `f` / `p`), le squelette, les angles, les règles et la cause des `UNKNOWN`.
- **3 personnes × 3 éclairages** (lumière du jour, plafonnier, contre-jour léger) × 2 distances.
- Compter la part de captures où l'oreille, l'épaule et la hanche ont une confiance ≥ 0,2 (`CONF_MIN`, abaissé de 0,3 après la mesure du 8 octobre, §3.5).
- Mesurer la **stabilité** : personne immobile 60 s, écart-type de `tete` et de `tronc`.
- **Réussi si :** ≥ 90 % de captures exploitables, et écart-type < 3°.
- **Si échec :** déplacer la caméra (§2), améliorer l'éclairage, essayer MediaPipe.
- **Mesure complémentaire à tester :** l'angle **oreille–épaule–hanche** (angle au niveau de l'épaule, entre la droite vers l'oreille et la droite vers la hanche ; voir [algo-posture.md](algo-posture.md) §4). Le relever en même temps que `tete` et `tronc`, et comparer :
  - sa **stabilité** (écart-type, personne immobile) ;
  - sa **sensibilité à l'inclinaison de la caméra** : refaire la mesure avec la caméra penchée d'environ 5°, ce qui ne devrait pas le changer, contrairement à `tete` et `tronc` ;
  - s'il **distingue mieux** la tête en avant et le dos en « C ».

  S'il est plus fiable, il pourra compléter ou remplacer l'angle `tete` dans les règles (étape 5).

### Étape 4 — Enregistrer des exemples étiquetés · *1 journée*

- Dans `live.py`, une touche du clavier fixe le **label en cours**. Chaque capture est écrite dans un CSV avec ce label :

| Touche | Label |
|---|---|
| `0` | GOOD (bonne posture) |
| `1` | FORWARD_HEAD (tête en avant) |
| `2` | TRUNK_FORWARD (dos penché en avant) |
| `3` | TRUNK_BACKWARD (avachi en arrière) |
| `4` | C_SHAPE (dos en « C », pour tester si on peut le détecter) |
| `9` | arrêter l'enregistrement |
| `q` | quitter |

- Protocole par personne : 10 s droit (référence), puis chaque posture tenue 30 s, dans un ordre mélangé. On ajoute des gestes normaux (boire, attraper un objet) étiquetés GOOD.
- Au moins **5 personnes** volontaires et d'accord, si possible de morphologies variées.
- **Livrable :** `resultats/live_<date>.csv` (chiffres seulement : label, angles, confiances, 17 points ; jamais d'image). ✅ Enregistrement déjà codé dans `live.py`.
- **Volontaires :** consentement écrit, un code par personne (`P01`…), CSV laissés sur le Pi, hors de Git. Ces CSV forment aussi le **dataset** du projet (audit §16).

### Étape 5 — T5 : règles et vérification dans le temps · *1 à 2 jours*

- Script `evaluer.py` : rejoue les règles ([algo-posture.md](algo-posture.md)) sur les exemples étiquetés.
  - **Par capture**, et pour chaque posture : précision, rappel, F1, matrice de confusion.
  - **Distribution des angles** par label (moyenne, écart-type) : c'est ce qui permet d'ajuster les seuils.
  - Comparaison **avec et sans calibration**.
  - **Par événement**, avec le filtre dans le temps en mode rapide (§5.3) : nombre de fausses alertes.
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
| T2 caméra | 08/10/2026 | Logitech C110, 640×480, 1 capture / 5 s, **44 min** (arrêté avant l'heure prévue) | **0 échec / 526 captures** ; capture médiane 52 ms, 95 % sous 66 ms, pire 70 ms (476 ms pour la 1ʳᵉ, démarrage de la webcam) ; 52,1 → 57,4 °C (max 58,4 °C) ; throttled `0x0` | 0 échec | ✅ (sur 44 min) | à refaire sur 1 h complète ; LifeCam VX-1000 écartée avant ce test (figeait le Pi) |
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

1. réorganiser le code de `edge/` en paquet Python (`pyproject.toml`, service qui démarre avec le Pi) ;
2. ajouter l'envoi des événements au serveur NestJS (HTTPS) ;
3. démarrer et arrêter l'analyse depuis l'app mobile (session) ;
4. faire le test T6 complet (capture réseau).
