# Dos d’âne — application PC React + Electron

Cette version ouvre une petite fenêtre dans le coin inférieur droit de Windows. **Démarrer** active la webcam. La vue verticale montre l’aperçu caméra, le squelette coloré et l’état **Bonne / Moyenne / À corriger** pour la tête, la nuque et les épaules. Les degrés servent uniquement aux calculs internes. **Comparer les 3** analyse la même image figée avec MediaPipe, MoveNet et YOLO Pose ; les résultats et le temps réel d’analyse apparaissent séparément, en excluant le chargement initial du modèle. Une notification Windows est envoyée si une posture jugée mauvaise dure au moins 30 secondes, puis au plus une fois par minute.

## Lancer et installer

Depuis `desktop/` avec Node.js 22 ou plus récent :

```powershell
npm install
npm run dev
```

Pour créer l’installateur Windows :

```powershell
npm run dist:win
```

Le fichier à ouvrir se trouve dans `desktop/release/` et s’appelle `Dos d'âne Setup 0.3.0.exe`. Le premier lancement de la compilation télécharge les modèles nécessaires et vérifie leurs empreintes SHA-256. Le modèle MoveNet est téléchargé par TensorFlow.js lors de sa première utilisation ; une connexion Internet est nécessaire à ce moment-là. Les vidéos de la webcam sont analysées dans l’application. Elle n’enregistre ni images ni vidéos et n’envoie pas le flux caméra à un serveur.

La fenêtre compacte montre l’aperçu de la tête, la mascotte, le statut et l’action principale. La vue dépliée donne accès à la pause, à l’arrêt et aux trois modèles. En pause ou à l’arrêt, la piste webcam est fermée. Les calculs tournent dans un Worker séparé de l’interface, avec une seule image en cours, une résolution adaptée et une cadence ajustée au temps d’analyse. Le modèle sélectionné suit le corps ; un suivi FaceLandmarker commun affine l’orientation du visage à une cadence plus faible pour limiter le coût.

## Base de l’évaluation

La croix masque la fenêtre sans arrêter la session : la webcam, l’analyse et les notifications continuent. Cliquez sur l’icône Dos d’âne près de l’horloge pour la rouvrir ; son menu propose « Quitter et arrêter la caméra ». Le chevron bascule entre les vues compacte et détaillée.

Le petit âne est une véritable animation Rive locale : trois poses se mélangent selon l’inclinaison mesurée de la tête et son avancée par rapport aux épaules. Il représente ces signaux de manière simplifiée, sans inventer la forme d’un dos hors champ. Son animation se suspend lorsque la fenêtre est masquée pour économiser les ressources. Les sources et le contrat de contrôle se trouvent dans [mascot-rive/README.md](mascot-rive/README.md).

Les modèles estiment les articulations et les points du visage. Le classement de posture est ensuite calculé par l’application : orientation du visage, niveau des épaules, relation oreilles–épaules, axe de la nuque et inclinaison du buste. MediaPipe fournit aussi une estimation du corps en 3D, lorsque ses points sont suffisamment fiables. La nuque est estimée à partir de la position de la tête par rapport aux épaules ; le squelette ne contient pas chaque vertèbre cervicale.

Les principes d’alignement sont cohérents avec les [repères de posture neutre de l’OSHA](https://www.osha.gov/etools/computer-workstations/positions) et sa [grille d’évaluation tête–nuque–buste](https://www.osha.gov/etools/computer-workstations/checklists/evaluation). Les seuils numériques du logiciel restent des heuristiques expérimentales, sans validation clinique. Le suivi filtre les points peu fiables, lisse les observations et demande une stabilité dans le temps avant de changer de catégorie.

Une vue de profil permet de mieux estimer une tête avancée. En cadrage tête–épaules, l’alignement de face de la nuque est évalué avec les oreilles ou les yeux et le centre des épaules, même lorsque les hanches sont hors champ. La catégorie reste affichée avec « partielle » si l’avancée de la tête ne peut pas être estimée ; elle n’est plus masquée comme entièrement non mesurable. La profondeur MediaPipe exige des points fiables du buste et des hanches visibles. En vue de face, MoveNet et YOLO Pose ne donnent pas cette profondeur. Un bon résultat partiel est affiché comme « Zones visibles alignées », y compris en vue compacte ; « Bonne posture » est réservé à l’analyse complète. Les points hors cadre, masqués ou incertains restent non mesurables. Une rotation de la tête, un vêtement large ou une caméra inclinée peuvent modifier les estimations. Le retour est indicatif et ne constitue pas un diagnostic de santé.

Le traitement centralisé sur un serveur n’est pas encore branché : il faudra définir son API. L’objet à transmettre serait la liste des points du squelette et leur confiance, après estimation, et non l’image de la webcam. La logique de calcul et les paramètres pourront évoluer après des essais réels avec plusieurs cadrages et éclairages.

Le modèle [YOLOv8n Pose ONNX](https://huggingface.co/Xenova/yolov8-pose-onnx) provient d’Ultralytics et relève de sa [licence AGPL-3.0 ou d’une licence Enterprise](https://docs.ultralytics.com/models/yolov8/). Vérifier les obligations de licence avant redistribution de l’installateur. MediaPipe et TensorFlow.js ont leurs propres licences dans leurs paquets npm.

Pour vérifier la construction et le chargement de l’interface sans webcam réelle :

```powershell
npm run check
npm run smoke
npm run smoke:models
```
