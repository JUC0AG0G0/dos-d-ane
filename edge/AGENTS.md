# Consignes pour les agents : dossier `edge/`

Partie **edge** du projet Dos d'âne (POC Fil Rouge Master UHA 4.0, 2026) : un Raspberry Pi 4 regarde une personne assise **de profil** avec une webcam, détecte les points du corps (MoveNet), calcule des angles et détecte les mauvaises postures. Le reste du dépôt (`server/` NestJS, mise, Taskfile) ne concerne pas ce dossier.

Documentation de référence : `docs/poc-raspberry.md` (plan, installation, briques §5, tests §6, fiche de résultats §7), `docs/algo-posture.md` (**référence de l'algorithme** : contrôles, angles, seuils et leurs sources, filtre, score) et `docs/Audit_technique_final_Fil_Rouge_Master_UHA_4_0_v3.md` (architecture complète : RGPD, rôle du Pi et du serveur, messages §7.2) ; `docs/liaison-serveur.md` donne le contrat exact avec le serveur (connexion WebSocket, codes de fermeture, messages). `docs/solution-mvp.md` résume la solution. Chaque sujet n'est décrit qu'**une fois** : ailleurs, mettre un lien plutôt que recopier. Lire la section concernée avant de modifier le code correspondant.

## Règles à ne jamais enfreindre

- **Aucune image ne quitte le Pi ni n'est écrite sur le disque** : pas de `cv2.imwrite`, pas d'enregistrement vidéo, pas d'envoi de pixels. Seuls des chiffres (points, angles, postures, événements) peuvent être écrits dans `resultats/`.
- **Rien dans `resultats/` ni dans `models/*.tflite` n'est commité** (données personnelles des volontaires ; modèles téléchargés). Ne pas modifier `edge/.gitignore` pour les inclure.
- **Les points du corps ne partent pas au serveur** : en session réelle, seuls l'état en direct (2 angles, posture, score), les événements et des résumés par période sont envoyés (audit §7.2, `docs/poc-raspberry.md` §5.5).

## Organisation

| Fichier | Rôle |
|---|---|
| `posture/` | **le cœur, commun à tous** (paquet) : `camera`, `movenet`, `points` (côté, point complété, présence), `angles`, `regles` (`SEUILS`, `postures()`), `filtre` (`Bocal`, `TempsAssis`), `score` (`Resume`), `mesures` (CSV), `chemins`, `pi` |
| `poc.py` | la vraie session (§5.5) : bocaux, cadence adaptative, événements (sans fenêtre) |
| `live.py` | outil de debug avec fenêtre (pas utilisé en session) |
| `outils/` | outils de mesure sur le Pi : `t2_camera.py`, `t4_modeles.py`, `enregistrer.py` (volontaires), `evaluer.py` (F1), `confiance.py` (images ignorées) ; puis `t1_vitesse.py` |
| `tests/` | tests unitaires de l'algorithme (pytest), sans webcam ni modèle : `aide.personne()` fabrique des points avec les angles voulus |

- Toute logique réutilisable va dans `posture/`, dans le module de son étape ; les scripts l'**importent** (`from posture.regles import postures`), ils ne recopient pas de code.
- Seuls `posture/camera.py` et `posture/movenet.py` importent OpenCV et LiteRT : les autres modules ne dépendent que de NumPy, pour que les tests tournent sur un PC sans webcam.
- Les outils de mesure se lancent depuis `edge/` : `python -m outils.t2_camera --court`.
- **Tests unitaires** : `python -m pytest` depuis `edge/` (après `pip install -e ".[dev]"`, ou `task test:edge` depuis la racine avec mise ; la CI les lance à chaque PR). Les lancer après toute modification de `posture/`, et ajouter un test pour chaque nouvelle règle ou bug corrigé.
- Règles d'alerte, seuils fixes `SEUILS` vérifiés sur 4 volontaires (T5) : tête en avant (tête < 50°), dos penché (tronc > 20°), cou penché (nez > 42° sous l'oreille, 2 personnes), allongé dans la chaise (tronc < −30°). Tête en avant et cou penché donnent une seule alerte, « Tête en avant ou baissée » (`poc.py`, `REGROUPEMENT`). Les autres seuils (écart des épaules 0,35, 70 %, 40 %, 1 min…) sont des **valeurs de départ** à ajuster par les tests ; tous seront à terme envoyés par le serveur.

## Conventions de code

- Python **3.13**, comme le Pi (`requires-python` dans `pyproject.toml`, `python = "3.13"` dans le `mise.toml` du dépôt, utilisé par la CI).
- Noms, commentaires et messages **en français**, comme le code existant. Commentaires courts, seulement pour le « pourquoi ».
- Dépendances figées (`==`) dans `pyproject.toml` : le cœur (NumPy) dans `dependencies`, la webcam et MoveNet dans l'option `pi`, pytest dans `dev`. En ajouter une seulement si nécessaire, dans la bonne option, et figer sa version. Sur le Pi : `pip install -e ".[pi,dev]"`.
- Points MoveNet : tableau `(17, 3)` = `(x, y, confiance)` en pixels ; un point est fiable si confiance ≥ `CONF_MIN` (0,2, abaissé de 0,3 après mesure). Image ou côté douteux → `None` / UNKNOWN, jamais une valeur inventée ; seule exception, `Completeur` reprend la dernière position fiable d'**un seul** point mal vu depuis ≤ 2,5 s.
- Angles : tête ≈ 90° = droite, plus petit = tête en avant ; tronc 0° = droit, > 0 = penché en avant, < 0 = avachi en arrière. Valables **uniquement de profil**.

## Pièges connus

- **Capture** : la webcam garde des images en réserve ; toujours passer par `ouvrir_camera()` (réserve de 1) et `capturer()` (jette l'image en réserve), sinon on analyse une image vieille de plusieurs secondes.
- **Une seule application à la fois sur la webcam** : ne pas lancer `live.py` pendant un test (`outils/`) ni l'inverse.
- **Chauffe** : l'IA en continu monte le Pi (sans dissipateur) à ~76 °C en 5 min ; limiter la cadence (`live.py` : 5 images/s). Au-delà de 80 °C le Pi ralentit et fausse les mesures.
- **Webcam** : utiliser une webcam UVC (pilote `uvcvideo`, actuellement Logitech C110). Les vieux modèles à pilote `gspca_*` ont figé le Pi.
- **Ne pas installer mise sur le Pi** : utiliser le Python du système avec `edge/.venv`.

## Git

- Branche de travail : `feat/edge-poc`. Messages de commit courts, en français, **sans mention d'IA ni ligne `Co-Authored-By`**.
- Le code se modifie, se teste et se commite de préférence **sur le Pi** (`~/dos-d-ane`), qui pousse par SSH. Le PC pousse en HTTPS.
- Après un changement de comportement, mettre à jour la doc concernée (`docs/poc-raspberry.md` : §4, §5, compte rendu §3.5, fiche §7).
