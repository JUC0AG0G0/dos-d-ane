# Dos d’âne — application PC React + Electron

Cette version ouvre une petite fenêtre dans le coin inférieur droit de Windows. **Démarrer** active la webcam. La vue verticale montre l’aperçu caméra, le squelette coloré et l’état **Bonne / Moyenne / À corriger** pour la tête, la nuque et les épaules. Les degrés servent uniquement aux calculs internes. **Comparer les 3** analyse la même image figée avec MediaPipe, MoveNet et YOLO Pose ; les résultats et le temps réel d’analyse apparaissent séparément, en excluant le chargement initial du modèle. Une notification Windows est envoyée si une posture jugée mauvaise dure au moins 30 secondes, puis au plus une fois par minute.

## Lancer et installer

Depuis la racine du dépôt, avec Node.js 22.12 ou plus récent et [Task](https://taskfile.dev/) :

```powershell
task install:desktop
task dev:desktop
```

Pour créer l’installateur Windows :

```powershell
task dist:desktop
```

Le fichier à ouvrir se trouve dans `desktop/release/` et s’appelle `Dos d'âne Setup 0.4.0.exe`. Le premier lancement de la compilation télécharge les modèles nécessaires et vérifie leurs empreintes SHA-256. Le modèle MoveNet est téléchargé par TensorFlow.js lors de sa première utilisation ; une connexion Internet est nécessaire à ce moment-là. Les vidéos de la webcam sont analysées dans l’application. Elle n’enregistre ni images ni vidéos et n’envoie pas le flux caméra à un serveur.

Le desktop reste optionnel : `task setup` et `task check` conservent leur périmètre web. Les tâches desktop sont définies dans [Taskfile.yml](Taskfile.yml), avec des raccourcis à la racine. Depuis `desktop/`, les mêmes commandes sont disponibles sans suffixe, par exemple `task dev` ou `task build`. Sans Task, utilisez `npm ci`, puis les scripts npm correspondants.

| Depuis la racine | Depuis `desktop/`, sans Task | Résultat |
| --- | --- | --- |
| `task install:desktop` | `npm ci` | Dépendances du desktop |
| `task dev:desktop` | `npm run dev` | Interface et Electron en développement |
| `task build:desktop` | `npm run build` | Interface compilée dans `desktop/dist/` |
| `task test:desktop` | `npm test` | Tests JavaScript de l'application et des maquettes |
| `task check:desktop` | `npm run check` | Tests JavaScript puis compilation |
| `task smoke:desktop` | `npm run smoke` | Lancement Electron sans webcam |
| `task smoke:desktop:models` | `npm run smoke:models` | Chargement des trois détecteurs |
| `task dist:desktop` | `npm run dist:win` | Installateur Windows dans `desktop/release/` |

`task -d desktop test:benchmark` vérifie séparément les métriques du benchmark avec Python 3.10+. `task -d desktop dev:web` lance seulement l'interface dans un navigateur. Les sorties des smoke tests de développement sont enregistrées dans `desktop/output/smoke/`.

## Organisation

Tout le travail propre à l'application PC reste dans `desktop/` :

- `src/` : interface React, détection et calcul de posture ; les modules spécialisés sont regroupés par responsabilité.
- `electron/` : fenêtre et barre des tâches, protocole local, échanges avec l'interface et smoke tests ; `main.cjs` assemble ces modules.
- `scripts/` et `tests/` : préparation des ressources, benchmarks et tests.
- `public/` et `assets/` : modèles, animation et icône ; les modèles téléchargés sont ignorés par Git.
- [prototype-python/](prototype-python/README.md) : ancien prototype Python, scripts Windows et tests.
- [maquette/](maquette/README.md) et [presentation/](presentation/README.md) : prototypes d'interface et supports de présentation.
- `output/`, `dist/` et `release/` : résultats générés, compilation et installateurs, ignorés par Git.

Le [benchmark pilote](benchmark-README.txt) et le [benchmark complet](full-benchmark-README.txt) disposent de tâches locales et conservent données, résultats et archives dans `desktop/output/`. Les scripts retrouvent ces dossiers depuis leur propre emplacement, quel que soit le répertoire courant.

La fenêtre compacte montre l’aperçu de la tête, la mascotte, le statut et l’action principale. La vue dépliée donne accès à la pause, à l’arrêt et aux trois modèles. En pause ou à l’arrêt, la piste webcam est fermée. Les calculs tournent dans un Worker séparé de l’interface, avec une seule image en cours, une résolution adaptée et une cadence ajustée au temps d’analyse. Le modèle sélectionné suit le corps ; un suivi FaceLandmarker commun affine l’orientation du visage à une cadence adaptative (minimum 70 ms) pour limiter le coût.

## Base de l’évaluation

La croix masque la fenêtre sans arrêter la session : la webcam, l’analyse et les notifications continuent. Cliquez sur l’icône Dos d’âne près de l’horloge pour la rouvrir ; son menu propose « Quitter et arrêter la caméra ». Le chevron bascule entre les vues compacte et détaillée.

Le petit âne est une véritable animation Rive locale : les mouvements de tête et de nuque sont pilotés séparément. Les boutons Face et Profil permettent de lire les inclinaisons latérales, la rotation du visage, la tête baissée ou relevée et son avancée par rapport aux épaules. La mascotte lit chaque nouvelle mesure sans attendre le rafraîchissement des textes, avec un filtre visuel court de 35 ms. Il représente ces signaux de manière simplifiée, sans inventer la forme d’un dos hors champ. Son animation se suspend lorsque la fenêtre est masquée pour économiser les ressources. Les sources et le contrat de contrôle se trouvent dans [mascot-rive/README.md](mascot-rive/README.md).

Les bras de la mascotte suivent les épaules, les coudes et les poignets visibles. Un HandLandmarker commun aux trois modèles suit jusqu’à deux mains (21 points chacune) et pilote les dix doigts indépendamment : main ouverte, poing, V ou majeur levé. La vue Face est la plus lisible pour les mains ; le hochement de tête est aussi visible de face. Gardez épaules, coudes, poignets et doigts dans le cadre. Une main ne s’affiche sur la mascotte que si son bras peut être associé de manière fiable ; les points des mains restent visibles dans l’aperçu caméra.

Le suivi des mains tourne dans le même Worker, toutes les 90 à 120 ms selon les performances, sans file d’images supplémentaire. Le modèle est livré localement et vérifié par SHA-256. Les doigts hors cadre ou périmés disparaissent au lieu de rester figés. La fermeture des doigts est estimée par leur géométrie, sans filtrage des gestes. L’animation reste stylisée, sans reconstruction anatomique complète.

Les modèles estiment les articulations et les points du visage. Le classement de posture est ensuite calculé par l’application : orientation du visage, niveau des épaules, relation oreilles–épaules, axe de la nuque et inclinaison du buste. MediaPipe fournit aussi une estimation du corps en 3D, lorsque ses points sont suffisamment fiables. La nuque est estimée à partir de la position de la tête par rapport aux épaules ; le squelette ne contient pas chaque vertèbre cervicale.

Les principes d’alignement sont cohérents avec les [repères de posture neutre de l’OSHA](https://www.osha.gov/etools/computer-workstations/positions) et sa [grille d’évaluation tête–nuque–buste](https://www.osha.gov/etools/computer-workstations/checklists/evaluation). Les seuils numériques du logiciel restent des heuristiques expérimentales, sans validation clinique. Le suivi filtre les points peu fiables, lisse les observations et demande une stabilité dans le temps avant de changer de catégorie.

Une vue de profil permet de mieux estimer une tête avancée. En cadrage tête–épaules, l’alignement de face de la nuque est évalué avec les oreilles ou les yeux et le centre des épaules, même lorsque les hanches sont hors champ. La catégorie reste affichée avec « partielle » si l’avancée de la tête ne peut pas être estimée ; elle n’est plus masquée comme entièrement non mesurable. La profondeur MediaPipe exige des points fiables du buste et des hanches visibles. En vue de face, MoveNet et YOLO Pose ne donnent pas cette profondeur. Un bon résultat partiel est affiché comme « Zones visibles alignées », y compris en vue compacte ; « Bonne posture » est réservé à l’analyse complète. Les points hors cadre, masqués ou incertains restent non mesurables. Une rotation de la tête, un vêtement large ou une caméra inclinée peuvent modifier les estimations. Le retour est indicatif et ne constitue pas un diagnostic de santé.

Le traitement centralisé sur un serveur n’est pas encore branché : il faudra définir son API. L’objet à transmettre serait la liste des points du squelette et leur confiance, après estimation, et non l’image de la webcam. La logique de calcul et les paramètres pourront évoluer après des essais réels avec plusieurs cadrages et éclairages.

Le modèle [YOLOv8n Pose ONNX](https://huggingface.co/Xenova/yolov8-pose-onnx) provient d’Ultralytics et relève de sa [licence AGPL-3.0 ou d’une licence Enterprise](https://docs.ultralytics.com/models/yolov8/). Vérifier les obligations de licence avant redistribution de l’installateur. MediaPipe et TensorFlow.js ont leurs propres licences dans leurs paquets npm.

Pour vérifier la construction et le chargement de l’interface sans webcam réelle :

```powershell
task check:desktop
task smoke:desktop
task smoke:desktop:models
```
