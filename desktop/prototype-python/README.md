# Dos d'âne

La nouvelle application **React + Electron** se trouve dans le [dossier desktop parent](../README.md). Ce dossier `desktop/prototype-python/` conserve l’application Python précédente, ses tests et ses outils Windows.

Petite application PC qui affiche le flux de la webcam, les points du squelette et des repères indicatifs sur la posture au bureau. Elle utilise [MediaPipe Pose Landmarker](https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker/python), [Face Landmarker](https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker/python) et [Hand Landmarker](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker/python). Les images sont analysées sur l'appareil et l'application ne sauvegarde ni vidéo ni photo. Selon les [conditions de MediaPipe](https://developers.google.com/edge/mediapipe/legal/tos), la bibliothèque peut contacter Google et transmettre des métriques techniques, sans envoyer les images de la caméra.

## Lancer sous Windows

1. Installer [Python 3.10](https://www.python.org/downloads/) et autoriser l'accès à la caméra dans les paramètres Windows.
2. Dans PowerShell, depuis ce dossier, lancer `powershell -ExecutionPolicy Bypass -File .\installer.ps1`. Cette étape installe les dépendances et télécharge les trois modèles officiels MediaPipe : [squelette Lite](https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task), [visage](https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task) et [mains](https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task). Leurs empreintes SHA-256 sont vérifiées avant leur installation ; les fichiers valides sont réutilisés aux prochains lancements de l'installateur.
3. Double-cliquer sur **Lancer Dos d'Ane.cmd** ou lancer `powershell -ExecutionPolicy Bypass -File .\demarrer.ps1`.

Pour obtenir un exécutable Windows autonome après l'installation, lancer `powershell -ExecutionPolicy Bypass -File .\construire-exe.ps1`. Le résultat se trouve dans `dist\DosdAne.exe` et inclut les trois modèles. La création demande un téléchargement supplémentaire de PyInstaller. `dist\DosdAne.exe --self-test` permet de vérifier les modèles et les bibliothèques sans démarrer la caméra (code de sortie 0 si tout fonctionne).

Sélectionner l'index de caméra (0 en général), puis la vue **Face** (par défaut) ou **Profil**. Placer la webcam à hauteur du buste, assez loin pour voir la tête, les épaules et les hanches. La vue et la qualité peuvent être changées pendant l'analyse : **Fluide** réduit le travail du processeur, **Détaillée** conserve plus de pixels. L'option **Numéros** affiche les indices des articulations sur l'image.

Le squelette utilise les **33 points** estimés par MediaPipe lorsqu'ils sont visibles. Le suivi détaillé du visage et des mains est activé par défaut et peut être désactivé dans l'interface pour réduire le travail du processeur. Les modèles spécialisés suivent **478 points du visage** et **21 points par main** : le rendu dessine les contours utiles du visage et les articulations des doigts. Les mesures de posture restent calculées à partir du squelette.

**Points détaillés** affiche aussi les repères des contours du visage. Les articulations du corps ont un cercle plus visible. **Données sur l'image**, activé par défaut, ajoute des étiquettes aux épaules, coudes et poignets : les épaules affichent leur visibilité, leur position X/Y et leur angle bras/buste quand il est mesurable. Les losanges bleus sont les centres **calculés** des épaules et du bassin ; ils ne représentent pas de nouvelles articulations détectées. Les pointillés indiquent l'axe du buste et la référence horizontale des épaules.

L'onglet **Données des points** suit 14 repères nommés, avec les épaules en premier : coordonnées, visibilité et angles disponibles. X et Y sont des pourcentages de l'image, depuis le coin supérieur gauche ; G/D désignent les côtés de la personne selon le détecteur. Sélectionner une ligne pour lire son numéro et son état. Les points absents, hors cadre ou peu fiables sont signalés ; les angles nécessitant ces points sont masqués. L'onglet **Posture** conserve les mesures globales et les conseils de cadrage.

En **Face**, l'application mesure le niveau des épaules et du bassin, le centrage et l'inclinaison de la tête, ainsi que l'axe du buste. En **Profil**, elle mesure l'écart oreille/épaule et l'inclinaison du buste ; les angles du coude, de la hanche et du genou sont affichés à titre descriptif lorsqu'ils sont visibles. Les mesures ignorent les points trop incertains.

Les seuils sont des heuristiques sur une image 2D : l'angle de la caméra, la lumière, les vêtements et les points masqués changent les résultats. Ce retour ne constitue pas un diagnostic médical ou ergonomique.

## Développement

`app.py` gère la caméra et l'interface Tkinter, `tracking.py` les trois détecteurs et `overlay.py` le dessin des contours. `posture.py` contient les mesures globales et `point_data.py` décrit chaque articulation avec ses coordonnées et ses angles 2D. Ces calculs sont séparés pour pouvoir les vérifier sans webcam. Les modèles dans `models/` sont exclus de Git et téléchargés par `installer.ps1`.

Depuis `desktop/prototype-python/`, après l'installation :

```powershell
.\.venv310\Scripts\python.exe -m unittest discover -s tests -v
```

L'environnement Python, les modèles et les exécutables générés restent dans ce dossier ; aucune commande ne nécessite de fichier desktop à la racine du dépôt.
