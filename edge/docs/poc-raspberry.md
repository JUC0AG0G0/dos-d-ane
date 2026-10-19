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

**Donner accès au Pi à un membre de l'équipe**

Il faut être sur le **même réseau que le Pi** (Wi-Fi de l'école) : depuis chez soi, le Pi n'est pas joignable. Tout le monde utilise le compte `uha40` du Pi, **chacun avec sa propre clé SSH** : on peut ainsi retirer l'accès d'une personne sans toucher aux autres. Ne pas partager le mot de passe de `uha40`, qui donne tous les droits (`sudo`).

1. **Le nouveau membre**, sur son PC, crée une clé et envoie le fichier **`.pub`** (la partie publique, sans risque) au responsable du Pi. Il garde l'autre fichier pour lui.
   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_pi -N ""
   ```
2. **Le responsable du Pi** ajoute cette clé sur le Pi :
   ```bash
   ssh pi 'cat >> ~/.ssh/authorized_keys' < id_ed25519_pi_<prenom>.pub
   ```
3. **Le nouveau membre** ajoute le raccourci dans `~/.ssh/config` sur son PC, puis teste avec `ssh pi` (répondre « yes » la première fois) :
   ```text
   Host pi
       HostName dosdane-pi.local
       User uha40
       IdentityFile ~/.ssh/id_ed25519_pi
   ```

Retirer un accès : supprimer la ligne de la personne dans `~/.ssh/authorized_keys` sur le Pi (chaque ligne finit par le nom de son PC).

| Piège | Que faire |
|---|---|
| **Les commits faits sur le Pi portent le nom du responsable du Pi** : le git du Pi est configuré à son nom et pousse avec sa clé GitHub | coder et commiter **sur son propre PC** (les tests tournent sans webcam, [README](../README.md)), puis `git pull` sur le Pi pour lancer. Si un commit sur le Pi est indispensable : `git commit --author="Prénom Nom <email>"` |
| **Une seule personne à la fois sur la webcam** : si deux programmes l'ouvrent, l'un échoue | vérifier avant de lancer : `ssh pi 'pgrep -af "[p]oc[.]py\|[l]ive[.]py"'` (rien ne s'affiche = libre), et prévenir l'équipe |
| Le nom `dosdane-pi.local` ne répond pas | passer par l'IP, comme ci-dessus : `ssh -o HostName=<ip> pi` |

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

⚠️ **Ne pas installer mise sur le Pi.** Le `mise.toml` du dépôt sert aux PC de développement du serveur (Node 26, Python, hooks ; la CI l'utilise aussi pour les tests d'`edge/`) : sur le Pi, ce serait lourd et inutile. On utilise le Python du système dans un environnement virtuel.

**b) Environnement Python**

Un **environnement virtuel** (`.venv`) garde les bibliothèques du projet séparées du Python du système. Raspberry Pi OS refuse d'ailleurs `pip install` hors d'un environnement virtuel (`externally-managed-environment`).

```bash
cd ~/dos-d-ane/edge
python3 -m venv .venv
source .venv/bin/activate            # l'invite commence par (.venv)
pip install --upgrade pip
pip install -e ".[pi,dev]"     # webcam + MoveNet + tests (pyproject.toml)
python -c "import cv2, numpy; from ai_edge_litert.interpreter import Interpreter; print('OK', cv2.__version__)"
```

- `pyproject.toml` fige les versions : `numpy==2.5.3` (le cœur de l'algorithme), option `pi` : `opencv-python==5.0.0.93` et `ai-edge-litert==2.3.0` (le moteur d'exécution TensorFlow Lite, appelé LiteRT), option `dev` : `pytest==9.1.1`. Sur un PC sans webcam, `pip install -e ".[dev]"` suffit pour les tests.
- `.venv/` n'est jamais commité : on le recrée avec `pip install -e ".[pi,dev]"`.
- `edge/.gitignore` exclut aussi le modèle (`models/*.tflite`) et les mesures (`resultats/`, données personnelles des volontaires).

**Choix retenus**

| Question | Choix | Raison |
|---|---|---|
| Python 3.13 (Pi) ou 3.11 (`mise.toml`) ? | **3.13**, le Python du Pi | c'est la machine cible ; `ai-edge-litert` existe en 3.13 pour ARM 64 bits. `mise.toml` est passé de 3.11 à 3.13 (13/10) : la CI teste avec la même version que le Pi. |
| `requirements.txt` ou `pyproject.toml` ? | **`pyproject.toml`** (depuis le 13/10) | un seul fichier pour les dépendances, les options (`pi`, `dev`) et la config de pytest ; c'était `requirements.txt` au début du POC |

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
# Thunder int8 (modèle utilisé par défaut depuis le 12/10, voir §7) : même méthode
mkdir -p tmp_t
curl -sL -o tmp_t/a.tar.gz "https://www.kaggle.com/api/v1/models/google/movenet/tfLite/singlepose-thunder-tflite-int8/1/download"
tar -xzf tmp_t/a.tar.gz -C tmp_t && mv tmp_t/4.tflite movenet_thunder_int8.tflite && rm -rf tmp_t
```

| Fichier | Taille | SHA-256 (début) | Image attendue |
|---|---|---|---|
| `movenet_lightning_int8.tflite` | 2,9 Mo | `cd7cc22f…` | 192×192 |
| `movenet_lightning_float16.tflite` | 4,8 Mo | `0fac2226…` | 192×192 |
| **`movenet_thunder_int8.tflite`** | 7,1 Mo | `b72fed22…` | 256×256 |

Tous attendent une image carrée en `uint8` et renvoient **17 points × (y, x, score)**. On a commencé avec Lightning int8, le plus rapide ; le T4 du 12/10 a fait passer à **Thunder int8**, nettement plus stable (§7).

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
| Les points et les angles « tremblaient » sans que la personne bouge (tête de 51° à 97° en 30 s) | MoveNet Lightning place mal l'épaule et la hanche de profil (9 à 13 px de tremblement) ; l'angle de la tête se mesure sur un segment court (oreille–épaule ≈ 70 px), donc quelques pixels font plusieurs degrés. Une autre personne dans le cadre aggravait le problème (MoveNet ne suit qu'une personne et peut mélanger les deux) | test T4 (`outils/t4_modeles.py`) : **Thunder** divise le tremblement de la tête par 1,7 (2,9° au lieu de 4,9°) pour 70 ms par image ; garder le cadre sans autre personne |
| Au 1ᵉʳ essai calibré, « tête en avant » s'allumait sur 67 % des images en bonne posture | calibration faite « au garde-à-vous » (référence tête 77,5°, alors que la tête est vers 65–72° en travaillant) | consigne : calibrer assis **comme d'habitude**. Au 2ᵉ essai, 0 % de fausses alertes, mais référence trop basse : la calibration de 10 s reste fragile → remplacée par la **médiane sur 2 min de travail normal** (`DUREE_CALIBRATION`) |
| Avec un dossier incliné, « appuyé au dossier » et « avachi » se confondent | les 3 points (oreille, épaule, hanche) ne voient pas la courbure du dos. Mesuré le 12/10 : 7° d'écart de tronc seulement (−11° contre −18°), hanche immobile (332 contre 333 px), longueur du tronc −7 % mais trop variable | « avachi » redéfini comme « tronc nettement plus en arrière que la posture habituelle » (calibration faite dans la posture habituelle) ; limite écrite dans `algo-posture.md` §8 |
| `ssh pi` échouait par moments (« Could not resolve hostname ») | le Wi-Fi de l'école ne transmet pas toujours les noms `.local` | passer par l'IP du Pi (§3.2) |
| Les docs étaient sur la branche `docs`, absente de `develop` | branches créées séparément depuis `main` | branche `feat/edge-poc` créée depuis `develop`, docs copiées dans `edge/docs/` |
| Le lien de téléchargement Kaggle semblait renvoyer une 404 | Kaggle répond 404 aux requêtes de type `HEAD` (`curl -I`) | télécharger normalement avec `curl -L` (§3.4) |

**Durée réelle :** environ 2 h 30 de la carte SD au bureau visible par VNC (dont une bonne partie due au problème de l'Imager), puis environ 1 h pour le dépôt, l'environnement Python et le modèle, puis environ 30 min pour diagnostiquer les redémarrages dus à la webcam. **L'étape 0 est terminée.**

---

## 4. Organisation du code du POC

```text
~/dos-d-ane/edge/
├── docs/                 ← cette documentation
├── pyproject.toml        ← dépendances (versions figées, options pi et dev), config de pytest
├── .gitignore            ← exclut models/*.tflite et resultats/
├── .venv/                ← environnement Python (non commité)
├── models/               ← movenet_thunder_int8.tflite (par défaut), movenet_lightning_*.tflite (non commités)
├── README.md             ← installer, lancer, rôle de chaque fichier
├── posture/              ← LE CŒUR, commun à tous (paquet Python)
│   ├── camera.py            ouvrir la webcam, capturer une image fraîche
│   ├── movenet.py           image → 17 points
│   ├── points.py            côté vu, point complété, personne présente
│   ├── angles.py            points → angles tête, tronc, cou ; contrôle « de profil »
│   ├── regles.py            angles → postures (seuils fixes)
│   ├── filtre.py            bocal (fenêtre glissante → alertes), temps assis
│   ├── score.py             résumé de 5 min, score
│   ├── mesures.py           une ligne de CSV par image
│   ├── chemins.py, pi.py    dossiers ; température du Pi
├── poc.py                ← la vraie session (§5.5) : cadence adaptative, filtre, événements
├── live.py               ← outil de debug : fenêtre en direct, enregistrement d'exemples étiquetés
├── outils/               ← outils de mesure sur le Pi, pas utilisés en session
│   ├── t2_camera.py         test caméra
│   ├── t4_modeles.py        Lightning contre Thunder sur les mêmes images : stabilité et vitesse
│   ├── t1_vitesse.py        test vitesse de l'IA        (à écrire)
│   ├── enregistrer.py       enregistrement guidé d'un volontaire (étape 4)
│   ├── evaluer.py           scores T5 : F1 par posture
│   └── confiance.py         images ignorées et seuil de confiance
├── tests/                ← tests unitaires de l'algorithme (pytest), sans webcam ni modèle
└── resultats/            ← CSV de mesures (jamais d'images, non commités)
```

Tous les scripts **importent** le paquet `posture` au lieu de recopier le code : une correction profite à tous. Depuis `edge/` : les outils de mesure se lancent avec `python -m outils.t2_camera`, les tests unitaires avec `python -m pytest`.

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

⚠️ **Piège des images périmées.** Par défaut, la webcam garde **4 images en réserve**. Après plusieurs secondes sans lecture, ces 4 images sont anciennes, et les lire est instantané. La première version de ce code (3 `grab()` puis `read()`) analysait donc la 4ᵉ image en réserve, **vieille d'environ 5 s**. Mesuré sur le Pi : les 4 premières lectures prennent 0 ms (images en réserve), la 5ᵉ environ 50 ms (image fraîche). Avec une réserve de 1, il suffit de jeter une image. Ce code est celui de `ouvrir_camera()` et `capturer()` dans `posture/camera.py`.

### 5.2 Trouver les points du corps (MoveNet)

MoveNet attend une image **carrée** (192×192 pour Lightning, 256×256 pour Thunder ; `posture.movenet.MoveNet` lit la taille dans le modèle) et renvoie **17 points** `(y, x, score)` entre 0 et 1.

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

Le code est dans le paquet `posture/` (il n'est pas recopié ici, pour ne pas avoir deux versions qui divergent). Le **fonctionnement** (contrôles, angles, règles et sources des seuils, calibration, filtre dans le temps, cadence adaptative) est expliqué **une seule fois**, dans [algo-posture.md](algo-posture.md), « Les règles en une page ».

| Étape | Code dans `posture/` |
|---|---|
| choisir le côté vu (gauche / droite) et le bloquer | `points.py` : `CoteStable` |
| reprendre un seul point mal vu depuis ≤ 2,5 s | `points.py` : `Completeur` |
| vérifier que la personne est de profil | `angles.py` : `ecart_epaules()`, `ECART_EPAULES_MAX` |
| ignorer les points peu sûrs | `points.py` : `CONF_MIN` |
| calculer tête, tronc et oreille–épaule–hanche | `angles.py` : `angles()` |
| calculer le cou (oreille → nez) et appliquer les règles (tête < 50°, tronc > 20°, cou > 42°, tronc < −30°, seuils fixes) | `angles.py` : `angle_cou()` ; `regles.py` : `postures()`, `SEUILS` |
| filtre dans le temps (bocal), temps assis, absence | `filtre.py` : `Bocal`, `TempsAssis` ; `points.py` : `Presence` ; boucle et cadence dans `poc.py` |
| score de 0 à 100 (% du temps en bonne posture) et résumé de 5 min | `score.py` : `Resume` ; résumé écrit par `poc.py` |

**Mode rapide pour les tests** (`python poc.py --rapide`) : fenêtre de 10 s, confirmation de 10 s, anti-rafale de 1 min, « Levez-vous » après 1 min (pause de 15 s), pour ne pas attendre des minutes.

**Tests unitaires** (`python -m pytest` depuis `edge/`, sur le PC ou le Pi, après `pip install -e ".[dev]"` ; `task test:edge` depuis la racine avec mise ; job `edge` de la CI à chaque PR) : 84 tests dans `tests/` vérifient chaque règle d'[algo-posture.md](algo-posture.md) avec des points synthétiques, sans webcam ni modèle : angles et sens du regard, images ignorées, côté stable, point complété, seuils, bocal (70 % pendant 2 min, fin sous 40 %, regroupement, changement de nom, anti-rafale, fenêtre vide), temps assis, score. À relancer après chaque modification de `posture/`.

### 5.4 Ce qui est enregistré pendant le POC

Uniquement des **CSV de chiffres** dans `resultats/` : heure, côté, confiances, angles, mouvement, classe, label (pour les exemples étiquetés), coordonnées des 17 points. **Jamais d'image** : ni `cv2.imwrite`, ni enregistrement vidéo.

### 5.5 Déroulé d'une vraie session (`poc.py`)

En vraie session, **il n'y a pas de flux vidéo continu** : le Pi prend une image de temps en temps, l'analyse, puis l'efface. Le flux continu de `live.py` ne sert qu'aux tests et aux réglages.

```text
Démarrer (depuis l'app)
   │
   ▼
┌─────────────── boucle, jusqu'à « Terminer » ───────────────┐
│ 1. prendre UNE image                          (~55 ms)     │
│ 2. MoveNet Thunder → 17 points                (~70 ms)     │
│ 3. effacer l'image (elle n'a existé qu'en mémoire)         │
│ 4. points → angles tête, tronc, cou → posture de l'image   │
│ 5. ajouter cette posture au bocal (60 dernières s)         │
│ 6. si mauvaise ≥ 70 % pendant 1 min → ÉVÉNEMENT (alerte)   │
│ 7. envoyer l'état à l'app (angles, posture, score)         │
│ 8. attendre avant l'image suivante :                       │
│      tout va bien          → 10 s                          │
│      ≥ 20 % de mauvaises   →  2 s                          │
│      image ignorée         →  2 s                          │
│      personne absente      → 30 s                          │
└────────────────────────────────────────────────────────────┘
```

Il n'y a **pas de fenêtre ni d'écran** sur le Pi : il tourne « à l'aveugle ».

**Exemple sur quelques minutes**

| Heure | Posture de l'image | Ce qui se passe |
|---|---|---|
| 14:00:00 | bonne | image suivante dans 10 s |
| 14:00:10 | bonne | 10 s |
| 14:00:20 | tête en avant | 1 image mauvaise sur 6 (17 %) : peut-être un geste bref → 10 s |
| 14:00:30 | tête en avant | 2 sur 6 (33 %) : « en doute » → on accélère à **2 s** |
| 14:00:32 | tête en avant | 2 s |
| 14:00:34 | bonne | (la personne a bougé) |
| … (une image toutes les 2 s) | surtout tête en avant | plus de 70 % de mauvaises images… |
| **~14:01:30** | tête en avant | **depuis 1 min → « Tête en avant détectée »** envoyé à l'app |
| … | | |
| 14:05:40 | bonne | moins de 40 % de mauvaises → **fin de l'événement** (durée 4 min 10 s) |
| ~14:06:20 | bonne | moins de 20 % d'images mauvaises sur 60 s → retour à 10 s |

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

- Script `outils/enregistrer.py` ✅ : **enregistrement guidé**, sans rien taper. L'opérateur lance `python -m outils.enregistrer P02` et lit les consignes à voix haute (pendant « tête en avant », le volontaire ne voit pas l'écran). Le script enchaîne (≈ 5 min 45) :

| Étape | Durée | Consigne | Étiquette |
|---|---|---|---|
| 1 | 2 min | installé comme d'habitude, au fond de la chaise, travailler normalement | CALIBRATION |
| 2, 4, 6, 8 | 30 s | tête en avant / buste penché / allongé dans la chaise (« avachi » jusqu'à P04) / regarder son téléphone (depuis le 12/10 après-midi), **ordre tiré au hasard** | FORWARD_HEAD, TRUNK_FORWARD, TRUNK_BACKWARD, NECK_FLEXION |
| 3, 5 | 15 s | revenir à la posture normale | GOOD |
| 7 | 30 s | revenir à la normale, puis boire une gorgée | GOOD |

- Chaque étape est annoncée 5 s avant (« Dans 5 s : … »), et ses 5 premières secondes sont étiquetées TRANSITION (la personne bouge) : elles ne comptent pas.
- Au moins **5 personnes** volontaires et d'accord, si possible de morphologies variées, chacune à son poste.
- **Livrable :** `resultats/P02_<date>.csv` (chiffres seulement : étiquette, angles, référence, confiances, 17 points ; jamais d'image).
- Pour un essai libre, `live.py` garde l'enregistrement au clavier (`0` bonne posture, `1` tête en avant, `2` dos penché, `3` allongé, `4` dos en « C », `5` cou penché, `9` arrêter).
- **Volontaires :** consentement écrit, un code par personne (`P01`…), CSV laissés sur le Pi, hors de Git. Ces CSV forment aussi le **dataset** du projet (audit §16).

### Étape 5 — T5 : règles et vérification dans le temps · *1 à 2 jours*

- Script `outils/evaluer.py` ✅ : `python -m outils.evaluer` rejoue la règle ([algo-posture.md](algo-posture.md)) sur tous les `resultats/P??_*.csv`.
  - **Distribution des angles** par label (moyenne, écart-type).
  - **Tête en avant ou dos penché** contre la bonne posture : précision, rappel, F1 avec les **seuils actuels**, au total et **par volontaire**, avec les **meilleurs seuils** (optimiste) et en **mettant un volontaire de côté** (seuils choisis sur les autres, testés sur lui).
  - **Cause annoncée** : part des images où l'alerte nomme la bonne posture (tête en avant ou dos penché).
  - **Allongé** : précision, rappel, F1 et part de fausses alertes en bonne posture.
  - (Plus tard, avec `poc.py`) **par événement**, avec le filtre dans le temps : nombre de fausses alertes.
- **Réussi si :** F1 ≥ 0,80 pour chaque alerte, et < 1 fausse alerte par heure.
- **Si échec :** ajuster les seuils à partir des distributions ; si une posture reste mauvaise, la retirer du MVP et l'expliquer.

### Étape 6 — Chaîne complète et T7 : cadence adaptative · *1 jour*

- Script `poc.py` : boucle avec la cadence adaptative (sans calibration : seuils fixes) → règles → filtre → affichage des événements, plus un CSV des mesures et des événements.
- Le comparer à une cadence fixe de 2 s : même délai de détection ? Combien de captures en moins ?
- **Assis trop longtemps** : le vérifier en mode rapide (1 min devant la caméra → « Levez-vous » ; 15 s hors champ → fin).
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
| T1 vitesse | 12/10/2026 (partiel, pendant le T4) | Thunder int8 et Lightning int8, 4 threads, image réelle, 121 images | Thunder : médiane **70 ms**, 95 % sous 87 ms ; Lightning : 27 ms, 95 % sous 61 ms ; 52 → 59 °C, `0x0` | < 150 ms | ✅ | T1 complet (1/2/4 threads, 100 mesures) à faire |
| T4 modèle | 12/10/2026 | 1 pers. immobile 1 min, de profil, les 2 modèles sur les **mêmes** images | écart-type par image — tête : Lightning **4,9°**, Thunder **2,9°** ; tronc : 3,9° / 2,3° ; épaule : 5–6 px / 3–4 px ; confiance hanche : 0,34 / 0,62 ; exploitables : 98 % / 100 % | le plus stable | ✅ **Thunder** | MediaPipe pas testé. Les deux modèles ne donnent pas le même angle (tête 54° / 60°) : seuils à régler avec le modèle définitif |
| T3 détection | 12/10/2026 (1 pers., 1 éclairage) | Thunder, salle de cours, d'autres personnes hors cadre | **100 %** exploitables ; tête 2,9°, tronc 2,3° d'écart-type (T4) | ≥ 90 %, < 3° | ✅ pour 1 pers. | 3 pers. × 3 éclairages à faire. Avec Lightning : 89 % et tête à 9° d'écart-type, en partie à cause d'une autre personne dans le cadre (MoveNet ne suit qu'une personne) |
| T5 essai 1 pers. | 12/10/2026 | Thunder, calibration 10 s, chaque posture 30 s étiquetée, 1 049 images | règles calibrées — bonne posture : 0 % de fausse alerte ; tête en avant **31 %** ; dos penché 86 % ; avachi **100 %**. Meilleurs seuils sur ces données : tête < bonne − 8° (92 % / 9 % de fausses), tronc > bonne + 7° (87 % / 4 %), tronc < bonne − 18° (100 % / 0 %) | ≥ 0,80 | ⚠️ | la référence de 10 s varie trop : 77,5° au 1ᵉʳ essai (trop droit → 67 % de fausses alertes), trop basse au 2ᵉ (tête en avant ratée). `tete_tronc` sépare moins bien que `tete` (49 % contre 92 %) |
| T5 tête en avant ou dos penché | 12/10/2026 | **4 personnes** (P01–P04), Thunder, `enregistrer.py` : 2 min de calibration, chaque posture 30 s, ordre au hasard ; 93–99 % d'images exploitables | règle **tête < 50° ou tronc > 20°** (seuils de départ, non réglés sur ces données) : **F1 0,82**, précision 0,97, rappel 0,71 ; par personne 0,90 / 0,97 / 0,67 / 0,68 | ≥ 0,80 | ✅ | règle retenue ; cause annoncée juste 66 % (tête) / 85 % (dos). Rappel faible chez P03 (tête en avant faite calée au dossier : angle de la tête inchangé) et P04 (calibration perturbée, tête en avant tardive). Meilleurs seuils (45°, 10°) : 0,83, pas mieux |
| T5 tête en avant seule | 12/10/2026 | idem | calibrée réf. − 8° : F1 0,58 ; un volontaire mis de côté : 0,67 ; angle oreille–épaule–hanche : 0,73 ; les deux angles : 0,74 | ≥ 0,80 | ❌ | évaluée avec le dos penché (les volontaires avancent tête et buste ensemble) ; cause annoncée d'après le tronc. Calibration écartée : chacun calibre calé au dossier puis se redresse → fausses alertes « dos penché » (précision 0,49–0,57) |
| T5 dos penché seul | 12/10/2026 | idem | un volontaire mis de côté : F1 0,88 ; fixe tronc > 20° : 0,89 (précision 1,00) | ≥ 0,80 | ✅ | |
| T5 avachi | 12/10/2026 | idem | un volontaire mis de côté : F1 0,64 ; fixe tronc < −25° : 0,67 ; **tronc < −30° : précision 0,96, 0,8 % de fausses alertes, rappel 0,35** | ≥ 0,80 | ⚠️ | avachi léger : chevauche « calé au dossier ». Devient **« allongé dans la chaise » (tronc < −30°)**, fiable quand il sonne |
| T5 allongé | 12/10/2026 | 1 pers. (P01), `live.py`, 20 s de bonne posture puis 30 s vraiment allongé | tronc allongé −35° à −47° (contre −12° à −18° calé au dossier) ; une fois installé, **84 %** des images vues sous −30° ; 0 fausse alerte en bonne posture hors transitions ; 76 % d'images exploitables allongé (hanche ou oreille moins bien vues) | ≥ 0,80 | ✅ pour 1 pers. | à refaire sur d'autres volontaires avec la nouvelle consigne d'`enregistrer.py` |
| T5 2ᵉ essai P01 | 12/10/2026 | `enregistrer.py` avec la consigne « allongez-vous » ; 5 enregistrements au total | tête en avant ou dos penché : F1 **0,90** pour P01, **0,84** sur les 5, **0,82 un volontaire mis de côté** ✅ ; cause juste 77 % (tête) / 79 % (dos). Allongé moins loin (tronc −20° à −23°, hanche cachée par le bureau) : 5 % détecté, 0 fausse alerte. Pendant la calibration, tête à 48–51° pendant ~1 min → « tête en avant » sur 31 % du travail normal | ≥ 0,80 | ✅ / ⚠️ | allongé vu seulement si la hanche reste visible. Tête à 45° : 8 % au lieu de 31 % (F1 0,83) ; **gardé à 50°**, à revoir si `poc.py` donne trop de fausses alertes |
| T5 cou penché | 12/10/2026 | 1 pers. (P01), `live.py`, 30 s à regarder son téléphone | nez à **+55°** sous l'oreille (45 à 60), tête 48° ; règle cou > 45° : **85 %** reconnu « cou penché » ; bonne posture des 4 volontaires : 0 à 2 % ; 35 % des têtes en avant du 2ᵉ essai de P01 annoncées « cou penché » | ≥ 0,80 | ⏳ | seuil provisoire : à enregistrer avec des volontaires (`enregistrer.py` le demande désormais) |
| T5 3ᵉ essai P01 (5 postures) | 12/10/2026 | `enregistrer.py` avec téléphone et allongé ; 6 enregistrements au total | cou penché : F1 **0,97** pour P01 (nez +58° contre +28° en bonne posture), 100 % annoncé « cou penché », 1,2 % de fausses alertes ; vers l'avant (tête, dos, cou) : F1 0,92 pour P01, **0,86 sur les 6**, 0,87 un volontaire mis de côté ; cause juste 62 % (tête) / 82 % (dos) / 100 % (cou) ; allongé (tronc −28°) : 51 % ; travail normal : 0 % de fausses alertes | ≥ 0,80 | ✅ (1 pers. pour le cou) | cou penché à confirmer sur d'autres volontaires |
| T5 cou penché, 2ᵉ personne | 12/10/2026 | 1 volontaire, `live.py` : posture normale (en bougeant un peu) puis 30 s à regarder son téléphone | cou +24° en bonne posture, **+51°** téléphone (tête à 56° : « tête en avant » ne l'aurait pas vu) ; cou > 45° : **87 %** reconnu, **0 %** de fausses alertes, 100 % annoncé « cou penché », F1 0,93 | ≥ 0,80 | ✅ | seuil de 45° gardé, vérifié sur 2 personnes |
| `poc.py --rapide` | 12/10/2026 | P01, 3 essais de ~2 min : bonne posture, dos penché, allongé, téléphone, Ctrl+C | alertes dos penché, allongé (hanche visible, tronc −32° à −46°) et « levez-vous » déclenchées puis terminées ; 0 fausse alerte ; Pi 57–59 °C, `0x0`. Corrigé : anti-rafale par cause, changement de nom d'alerte, alertes fermées au Ctrl+C. Téléphone tenu haut (nez +41–53°) : 64 % des images à 45°, pas d'alerte | — | ✅ | seuil du cou abaissé à **42°** (91 %, 0 à 4 % en bonne posture) |
| `poc.py --rapide`, cou à 42° | 12/10/2026 | P01, ~1 min 30 : tête en avant / téléphone, allongé, bonne posture | alertes déclenchées puis terminées, 0 fausse alerte ; mais nom « tête en avant » / « cou penché » qui change d'une image à l'autre (tête 40–48°, cou 38–49° dans les deux cas) ; allongé à −20/−37° : pas d'alerte (autour du seuil) | — | ⚠️ | tête en avant et cou penché regroupés en une alerte « Tête en avant ou baissée », part de chacun dans l'événement (`detail`) |
| Allongé, `poc.py` | 14/10/2026 | P01, 2 sessions de 1 à 2 min : presque droit (calé au dossier, tronc −27°), allongé, redressé | tronc allongé **−34° à −56°**, 100 % des images « allongé » ; alerte **60 s** après le passage à 70 % (~1 min 05 après le début), fin **36 s** après le redressement ; 0 fausse alerte ; hanche vue à 0,37–0,50 ; Pi 46 °C max, `0x0` | — | ✅ pour 1 pers. | calé au dossier, le tronc est déjà à −27/−28°, près du seuil de −30° : à vérifier en travail normal |
| Absence (chaise vide), `poc.py` | 14/10/2026 | P01 assis, puis part ~1 min | ancienne règle : **36 s « ignorée »** (MoveNet voit un corps dans la chaise vide : oreilles et épaules 0,12–0,73), une image fantôme jugée « dos penché », « absent » après **38 s** ; temps assis qui continue | absent < 15 s | ❌ | nouvelle règle `Presence` (6 images sans angles et peu nettes) : rejouée, absent en 12 s, 0 fausse absence sur les sessions du 12–14/10. À revérifier en vrai avec 5 min d'absence |
| Caméra vide, `poc.py` (ancien code) | 14/10/2026 | personne devant la caméra pendant 1 min 30 | **jamais « absent »** : 31 images « ignorée », 13 images avec des angles fantômes absurdes (tête −55°, tronc −77°, tronc de 33–41 px) jugées « dos penché » / « tête en avant » | absent < 15 s | ❌ | contrôle C4 « angles possibles » ajouté : rejoué avec `Presence`, absent dès la 6ᵉ image, plus aucune image jugée |
| Mode service, `poc.py --service --rapide` | 19/10/2026 | Pi relié au serveur de dev du PC (même sous-réseau) ; session créée et lancée par l'API, ~1 min, puis stop, puis SIGTERM ; avant, mode manuel `--rapide` 70 s | analyse lancée dès `session:start`, webcam fermée hors session ; stop traité tout de suite : dernier résumé, bilan, retour en attente ; CSV au nom de la session du serveur ; coupure réseau de ~1 min 15 avant la session : reconnexion seule ; SIGTERM : fin propre ; mode manuel inchangé (alertes, résumés, bilan) ; 52–54 °C, `0x0` | — | ✅ | liaison détaillée : [liaison-serveur.md](liaison-serveur.md) |
| T5 assis trop longtemps | | `poc.py --rapide` | détectée : oui / non | oui | | |
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
