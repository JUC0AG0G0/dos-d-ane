# Mascotte Dos d’âne

Illustration vectorielle originale, créée pour cette application. Le projet Rive est éditable dans `scene.rml` ; le générateur est `../scripts/create-mascot.mjs`.

- Artboard : `Ane`
- State machine : `Posture`
- View model : `Posture`, instance `Default`
- Propriétés indépendantes : `pitch` (-45 à 55), `forward` (0 à 100), `roll` (-40 à 40), `lateral` (-30 à 30), `yaw` (-60 à 60), `view` (0 profil, 1 face).
- Vingt-six couches indépendantes, sans scripts embarqués. Le profil montre la rotation verticale de la tête et son avancée ; la face montre aussi le hochement par un raccourcissement de la tête et un déplacement indépendant des yeux et du museau. L'inclinaison latérale peut se combiner au hochement. Le corps reste fixe lorsque son mouvement n'est pas mesuré.
- Pour chaque côté `left` / `right` : rotations `Upper`, `Lower`, `Wrist` de -180 à 180 ; flexion individuelle `Thumb`, `Index`, `Middle`, `Ring`, `Pinky` de 0 (tendu) à 100 (replié) ; visibilité `ArmVisible` et `HandVisible` de 0 à 1. Par exemple `leftMiddle` pilote uniquement le majeur gauche de l'image. Aucune catégorie de geste n'est imposée : main ouverte, poing, V et majeur levé utilisent les mêmes cinq valeurs de flexion.
- Convention géométrique : `left` désigne la gauche de l'image, pas le côté anatomique. Les angles sont locaux, positifs dans le sens horaire. Les deux segments du bras pointent vers le bas à 0° ; au poignet, les doigts pointent vers le haut à 0°. La rotation absolue de la main est donc `Upper + Lower + Wrist`. Les épaules de face sont en (89,137) et (151,137), le bras mesure 24 unités, l'avant-bras 22. En profil, les épaules sont en (91,133) et (110,133), avec les mêmes articulations. Les doigts restent dans l'artboard 240×240 même quand les bras sont tendus horizontalement.
- Les rotations des bras utilisent des étapes de 45° pour éviter l'ambiguïté de mélange entre deux angles séparés de 180°. La flexion des doigts se représente par un raccourcissement progressif et le repli du pouce ; ce dessin reste une projection stylisée, pas une main en 3D. Bras et mains sont masqués par défaut tant que le suivi correspondant est absent.
- Les rotations sont en degrés en interne seulement ; l'interface n'affiche pas de degrés. L'avancée est normalisée selon la source (3D MediaPipe ou ratio de profil). La vue frontale illustre cette avancée par un léger changement d'échelle : ce n'est pas une reconstruction 3D.
- Le composant lit la dernière mesure par référence à chaque frame visible, sans attendre les textes React. Filtre visuel exponentiel de 35 ms, sans file de transitions ; la cadence d'inférence reste adaptée aux performances du PC.

Compilation avec Rive CLI 1.5.1 :

```text
rive desktop/mascot-rive --verify
rive inspect desktop/mascot-rive --summary
rive desktop/mascot-rive --once
```

Copier ensuite `build/mascot-rive.riv` vers `../public/mascot/ane.riv`. Le fichier compilé est livré avec l’application, ainsi que le runtime WASM local. La mascotte illustre les signaux visibles de tête et de nuque ; elle ne reconstruit pas un dos masqué. L’animation se suspend lorsque la fenêtre est masquée, tandis que la détection continue.
