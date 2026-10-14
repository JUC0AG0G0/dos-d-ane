BENCHMARK COMPLET : 52 500 IMAGES, TROIS DETECTEURS

Les résultats du pilote restent dans desktop/output/posture-benchmark.
L'exécution exhaustive écrit dans desktop/output/posture-benchmark-full.

Source : SeiyaCM/KandenAiHackathonPosture2, Hugging Face.
Révision figée : 4a2d8a14a3b3fac0835d503db86e83abcfd703ea.
136 shards Parquet, 69 314 831 304 octets annoncés.
Licence MIT annoncée par la fiche du dataset. Toutes les images sont synthétiques.

COMMANDES DEPUIS DESKTOP/ (PYTHON 3.10+ ET TASK)
1. task benchmark:full:install
2. task benchmark:full:download
3. Dans un autre terminal :
   task benchmark:full:serve
4. Dans trois terminaux, un détecteur par processus :
   task benchmark:full:run -- --model=mediapipe
   task benchmark:full:run -- --model=movenet
   task benchmark:full:run -- --model=yolo
5. Dans un autre terminal :
   task benchmark:full:monitor
6. Après la fin des trois détecteurs et du téléchargement :
   task benchmark:full:timing
7. Une fois toutes les mesures terminées :
   task benchmark:full:summarize

Les dépendances Python restent dans desktop/.venv-benchmark/ ; le serveur
prépare les ressources des trois détecteurs avant son lancement.
Utiliser PYTHON=python3 lors de benchmark:full:install si nécessaire.
Les sources de l'archive servent à la traçabilité de l'expérience. Pour relancer
les commandes, utiliser desktop/ dans une copie complète du dépôt et placer les
résultats de l'archive sous desktop/output/posture-benchmark-full/. Les images
originales restent à télécharger avec la tâche prévue.

REPRISE
Le téléchargeur conserve un manifeste atomique après chaque shard et réutilise
les shards terminés. Chaque shard vérifie son SHA-256 annoncé avant extraction.
Les images conservent leurs octets originaux et une empreinte individuelle.
Les fichiers Parquet temporaires vérifiés sont supprimés après extraction.
Trois téléchargements au maximum se déroulent simultanément.
Le runner conserve un fichier par détecteur et shard, puis ignore les fichiers
déjà terminés. Après une interruption, relancer les mêmes commandes.
Ne pas modifier les modèles ou les règles pendant une exécution ou sa reprise.

PROTOCOLE
157 500 paires image-détecteur attendues, une répétition par paire.
Un processus par détecteur : MediaPipe Lite, MoveNet Lightning, YOLOv8n Pose.
Les 15 830 premières sorties MediaPipe ont précédé le passage en parallèle.
Les transformations, modèles et règles de classification sont restés identiques.
Après 22 006 sorties MediaPipe et 5 022 sorties pour chacun des autres modèles,
le chargement/décodage de quatre images en avance réduit l'attente entre images.
La même transformation createImageBitmap est utilisée. Chaque résultat de lot
indique preloadImages (champ absent avant cette optimisation).
run-metadata.json conserve les empreintes du code avant et après cette modification.
Les limitations Chromium en arrière-plan ont ensuite été désactivées pour les
processus de calcul, sans changement des détecteurs ou des règles. Le relevé
run-metadata.json conserve les compteurs à ce changement d'ordonnancement.
Même entrée pour tous : image originale, côté maximal de 640 pixels,
proportions conservées, resizeQuality high dans createImageBitmap.
Les prétraitements internes restent propres à chaque détecteur.
Mode IMAGE, remise à zéro de MoveNet, sans lissage entre photos.
FaceLandmarker commun, exécuté avec chaque détecteur. Règles pose.js inchangées.
model-hashes.json contient les empreintes des trois modèles locaux (corps
MediaPipe, visage, YOLO). MoveNet provient de l'URL versionnée par la bibliothèque :
https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4
Ses poids distants ne figurent pas dans ce relevé d'empreintes locales.
Les charges de téléchargement et d'extraction coexistent avec le calcul parallèle.
Les temps de ce passage ne servent pas à classer les vitesses des modèles.
Un test distinct après achèvement mesure 120 images originales (30 par classe,
graine 20261012), trois répétitions et un seul détecteur actif à la fois.
Ordre fixe MediaPipe, MoveNet, YOLO, sans contrôle thermique ni contrebalancement.
Médiane des trois mesures par image, puis médiane et p95 entre images.
Les sorties de ce test sont également comparées aux sorties exhaustives pour
signaler d'éventuelles différences de catégorie lors de la répétition.
Pas de mesure de la fluidité webcam, des notifications ou de la stabilité vidéo.

DIFFERENCES AVEC LE PILOTE
Le pilote utilisait 120 aperçus JPEG du viewer et trois répétitions.
L'exécution exhaustive utilise les fichiers originaux du Parquet et une seule
répétition afin de mesurer chaque image sans multiplier le temps par trois.
Les mêmes règles géométriques et les mêmes seuils s'appliquent aux deux tests.
Les résultats ne doivent pas être interprétés comme une réplication pixel à pixel
du pilote. La comparaison des trois détecteurs reste appariée dans chaque test.

ANALYSE
01_good contre 02_slouch pour le critère binaire. warning/bad = alerte.
unknown/erreur = abstention, conservée au dénominateur de l'accord global.
Balanced accuracy = (good correctement reconnus / tous les good + alertes
sur slouch / tous les slouch) / 2. Les abstentions ne comptent pas comme succès.
Les classes chin_rest et stretch restent descriptives, sans jugement automatique
de mauvaise posture. Le script publie leur distribution complète.
Les intervalles descriptifs utilisent 2 000 bootstraps par groupes de pose source,
déduits du nom avant _varNNNN, stratifiés par label et appariés entre modèles.
Ces groupes ne sont pas des identifiants de personnes indépendantes.
Le bootstrap ne couvre pas les biais du générateur ou les erreurs des labels.

Avant agrégation, le script exige tous les 136 shards par détecteur, les 52 500
identifiants uniques attendus et la concordance des étiquettes avec les manifestes.
Une exécution partielle ne peut pas produire une synthèse marquée complète.
run-status.json et download-status.json décrivent la progression réelle.
Les résultats antérieurs du pilote ne sont pas remplacés.
