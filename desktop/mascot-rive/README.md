# Mascotte Dos d’âne

Illustration vectorielle originale, créée pour cette application. Le projet Rive est éditable dans `scene.rml` ; le générateur est `../scripts/create-mascot.mjs`.

- Artboard : `Ane`
- State machine : `Posture`
- View model : `Posture`, instance `Default`
- Propriété numérique : `bend` (0 = droit, 50 = penché, 100 = courbé)
- Trois poses interpolées et un clignement des yeux, sans scripts embarqués.

Compilation avec Rive CLI 1.5.1 :

```text
rive desktop/mascot-rive --verify
rive inspect desktop/mascot-rive --summary
rive desktop/mascot-rive --once
```

Copier ensuite `build/mascot-rive.riv` vers `../public/mascot/ane.riv`. Le fichier compilé est livré avec l’application, ainsi que le runtime WASM local. La mascotte illustre les signaux visibles de tête et de nuque ; elle ne reconstruit pas un dos masqué. L’animation se suspend lorsque la fenêtre est masquée, tandis que la détection continue.
