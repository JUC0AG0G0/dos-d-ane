# Consignes pour les agents : dossier `edge/`

Partie **edge** du projet Dos d'âne (POC Fil Rouge Master UHA 4.0, 2026) : un Raspberry Pi 4 regarde une personne assise **de profil** avec une webcam, détecte les points du corps (MoveNet), calcule des angles et détecte les mauvaises postures. Le reste du dépôt (`server/` NestJS, mise, Taskfile) ne concerne pas ce dossier.

Documentation de référence : `docs/poc-raspberry.md` (plan, installation, briques §5, tests §6, fiche de résultats §7), `docs/poc-edge.md` (choix techniques, RGPD, répartition Pi / serveur) et `docs/algo-posture.md` (explication de l'algorithme : axes, angles, seuils). Lire la section concernée avant de modifier le code correspondant.

## Règles à ne jamais enfreindre

- **Aucune image ne quitte le Pi ni n'est écrite sur le disque** : pas de `cv2.imwrite`, pas d'enregistrement vidéo, pas d'envoi de pixels. Seuls des chiffres (points, angles, postures, événements) peuvent être écrits dans `resultats/`.
- **Rien dans `resultats/` ni dans `models/*.tflite` n'est commité** (données personnelles des volontaires ; modèles téléchargés). Ne pas modifier `edge/.gitignore` pour les inclure.
- **Les points du corps ne partent pas au serveur** : en session réelle, seuls l'état en direct (2 angles, posture, score), les événements et des résumés par période sont envoyés (`docs/poc-edge.md` §6, `docs/poc-raspberry.md` §5.8).

## Organisation

| Fichier | Rôle |
|---|---|
| `posture_lib.py` | **le cœur, commun à tous** : `ouvrir_camera()`, `capturer()`, `MoveNet`, `angles()`, `postures()`, `temperature_pi()` |
| `poc.py` | la vraie session (à écrire, §5.8) |
| `live.py` | outil de debug avec fenêtre (pas utilisé en session) |
| `tests_poc/` | outils de mesure : `t2_camera.py` (puis `t1_vitesse.py`, `evaluer.py`) |

- Toute logique réutilisable va dans `posture_lib.py` ; les scripts l'**importent**, ils ne recopient pas de code.
- Les tests se lancent depuis `edge/` : `python -m tests_poc.t2_camera --court`.
- Les seuils (50°, 20°, −25°, 70 %, 40 %, 2 min…) sont des **valeurs de départ** à ajuster par les tests ; ils seront à terme envoyés par le serveur.

## Conventions de code

- Python **compatible 3.11+** (le Pi tourne en 3.13, `mise.toml` du dépôt indique 3.11).
- Noms, commentaires et messages **en français**, comme le code existant. Commentaires courts, seulement pour le « pourquoi ».
- Dépendances figées dans `requirements.txt` ; en ajouter une seulement si nécessaire, et figer sa version.
- Points MoveNet : tableau `(17, 3)` = `(x, y, confiance)` en pixels ; un point est fiable si confiance ≥ `CONF_MIN` (0,3). Image ou côté douteux → `None` / UNKNOWN, jamais une valeur inventée.
- Angles : tête ≈ 90° = droite, plus petit = tête en avant ; tronc 0° = droit, > 0 = penché en avant, < 0 = avachi en arrière. Valables **uniquement de profil**.

## Pièges connus

- **Capture** : la webcam garde des images en réserve ; toujours passer par `ouvrir_camera()` (réserve de 1) et `capturer()` (jette l'image en réserve), sinon on analyse une image vieille de plusieurs secondes.
- **Une seule application à la fois sur la webcam** : ne pas lancer `live.py` pendant un test (`tests_poc/`) ni l'inverse.
- **Chauffe** : l'IA en continu monte le Pi (sans dissipateur) à ~76 °C en 5 min ; limiter la cadence (`live.py` : 5 images/s). Au-delà de 80 °C le Pi ralentit et fausse les mesures.
- **Webcam** : utiliser une webcam UVC (pilote `uvcvideo`, actuellement Logitech C110). Les vieux modèles à pilote `gspca_*` ont figé le Pi.
- **Ne pas installer mise sur le Pi** : utiliser le Python du système avec `edge/.venv`.

## Git

- Branche de travail : `feat/edge-poc`. Messages de commit courts, en français, **sans mention d'IA ni ligne `Co-Authored-By`**.
- Le code se modifie, se teste et se commite de préférence **sur le Pi** (`~/dos-d-ane`), qui pousse par SSH. Le PC pousse en HTTPS.
- Après un changement de comportement, mettre à jour la doc concernée (`docs/poc-raspberry.md` : §4, §5, compte rendu §3.5, fiche §7).
