BENCHMARK DES TROIS DETECTEURS - DOS D'ANE

Résultats : desktop/output/posture-benchmark/ (depuis la racine du dépôt)

Réexécution (depuis desktop/, Python 3.10+ et Task disponibles) :
  task test:benchmark
  task benchmark:download
  task benchmark:serve
Dans un second terminal, depuis desktop/ :
  task benchmark:run
Après la fin des mesures :
  task benchmark:summarize

Les tâches sont dans desktop/Taskfile.yml. PYTHON=python3 permet de choisir
un autre interpréteur, par exemple task benchmark:download PYTHON=python3.
Le serveur prépare les ressources des trois détecteurs avant son lancement.
Les sources de l'archive servent à la traçabilité de l'expérience. Pour relancer
les commandes, utiliser desktop/ dans une copie complète du dépôt et placer les
données et résultats de l'archive sous desktop/output/posture-benchmark/.

Les données restent dans desktop/output/posture-benchmark/dataset, hors des fichiers
publics de l'application livrée. Le serveur benchmark ne sert que manifest.json
et les fichiers d'images dont le nom respecte le format attendu.

PROTOCOLЕ
120 images synthétiques, 30 par classe. Quatre fenêtres fixes de 100 lignes aux
indices 2000, 17000, 32000 et 47000. Mélange avec random.Random(20261012), puis les
30 premières images par classe. Aucune sélection selon les résultats.
Ce lot de convenance n'est pas représentatif des 52 500 images du dataset.

Chaque modèle reçoit la même image redimensionnée à 640 pixels maximum.
Il applique ensuite ses propres prétraitements internes. PoseLandmarker et
FaceLandmarker utilisent IMAGE. MoveNet remet le suivi à zéro et désactive le
lissage. Cela évite une contamination entre images indépendantes.
Le visage est commun aux trois chaînes. Les règles de posture et les seuils
de confiance restent ceux du projet. Les seuils ne sont pas calibrés entre
modèles : une confiance 0,5 n'a pas nécessairement la même signification.

Trois répétitions par image. Temps hors chargement initial, préchauffage,
téléchargement, décodage JPEG, resize commun et affichage. Inclut les
prétraitements propres à chaque modèle et le visage. Les mesures sont arrondies
à la milliseconde par l'application. Médiane par image, puis médiane et p95.
Ordre fixe MediaPipe, MoveNet, YOLO : le test ne contrebalance pas la charge
et les effets thermiques. Le renderer Electron exécute les modèles, alors que
l'application utilise un Worker : ces temps ne sont pas une mesure de sa
latence complète, ni de ses images par seconde à la webcam.

MESURES
Test binaire uniquement sur 01_good et 02_slouch (30 + 30).
good -> absence d'alerte sur les dimensions mesurées, parfois partielles.
warning ou bad -> alerte. unknown ou erreur -> abstention.
Accord global = corrects / 60, abstentions incluses au dénominateur.
Sensibilité = alertes sur slouch / 30. Fausses alertes = alertes sur good / 30.
L'accord conditionnel exclut les abstentions, mais ne doit jamais être présenté
seul (MoveNet atteint 100 % sur seulement 8 réponses dans ce lot).
Wilson 95 % est indicatif, sous hypothèse d'indépendance. Les images générées
depuis des poses de base peuvent être corrélées. Les intervalles ne couvrent
ni ce biais, ni le bruit des labels, ni le biais de sélection.

03_chin_rest et 04_stretch restent des catégories descriptives et ne sont pas
automatiquement assimilées à de mauvaises postures. Consulter summary.json
pour leurs distributions. Le programme peut afficher une alerte pendant un
étirement normal. Le test ne mesure pas sa durée ni le déclenchement réel
d'une notification après 30 secondes.

LIMITES IMPORTANTES
Inspection des exemples : anatomies parfois déformées, plusieurs personnes
sans cible annotée, discordances possibles entre image et label. Ne pas utiliser
ce lot comme référence clinique ou comme preuve de précision sur des personnes.
Absence de points de référence : aucune erreur de localisation PCK/OKS calculable.
Absence de labels par région : aucune précision spécifique cervicale validée.
Les modèles n'estiment pas directement les vertèbres cervicales.
La 3D de MediaPipe est une estimation monoculaire. L'ablation sans cette 3D est
conservée dans raw-results.json et summary-2d.json. Elle ne change pas l'accord
binaire de cette exécution (70 %, 13,3 %, 85 %).
YOLO a le meilleur accord observé sur le lot, MoveNet la latence la plus faible.
Il faut une validation réelle avec des personnes séparées entre réglage et test
avant de choisir définitivement un détecteur ou d'annoncer une précision.

DONNEES ET SOURCES
https://huggingface.co/datasets/SeiyaCM/KandenAiHackathonPosture2
Auteur : SeiyaCM. Licence MIT annoncée par la fiche. Images synthétiques
Stable Diffusion v1.5 + ControlNet Depth. Date d'accès : 12 octobre 2026.
https://universe.roboflow.com/ikornproject/sitting-posture-rofqf
Alternative réelle avec points Good/Bad. Téléchargement bloqué ici (HTTP 403).
https://zenodo.org/records/14230872
MultiPosture : coordonnées uniquement, donc inutilisable pour comparer
les détecteurs à partir de photos.

FICHIERS
raw-results.json : sorties, points, détails régionaux, répétitions, environnement.
summary.json : mesures agrégées. summary-2d.json : ablation 2D.
results.csv : une ligne par image et modèle.
dataset/manifest.json : noms, labels, prompts, sélection et SHA-256 des images.
sha256-code-models.json : empreintes des modèles locaux et du code de calcul.
La version MoveNet distante est celle référencée par pose-detection 2.1.3.
Ses poids distants ne sont pas archivés et hashés dans cette expérience.

Les résultats n'entraînent pas de changement du modèle par défaut de l'app.
