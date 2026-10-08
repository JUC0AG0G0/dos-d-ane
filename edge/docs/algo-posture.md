# Comment l'algorithme détecte la posture

> Explication simple de l'algorithme du POC edge : les points, les axes, les angles, les seuils, et la possibilité d'entraîner un modèle plus tard.
> Détails techniques et code : [poc-raspberry.md](poc-raspberry.md) §5. Choix et RGPD : [poc-edge.md](poc-edge.md).

---

## 1. Où en est le POC (8 octobre 2026)

| Étape | État |
|---|---|
| Caméra + OpenCV + IA (MoveNet trouve les points, OpenCV les dessine) | ✅ validé |
| T2 : la webcam tient dans la durée | ✅ 0 échec sur 526 captures (44 min) |
| Placer la caméra **de profil** et vérifier que les points sont bien vus (T3) | ⬜ prochaine étape |
| Voir en direct angles, règles et verdict bonne / mauvaise posture | ⬜ code prêt (`live.py`), à tester de profil |
| Régler les seuils avec de vraies mesures (étapes 4 et 5) | ⬜ |
| (Plus tard, optionnel) entraîner un modèle | ⬜ |

---

## 2. Comment l'algorithme décide, en 5 étapes

```text
image ─► ① IA (MoveNet) ─► 17 points
                             │
                  ② on garde 3 points : oreille, épaule, hanche
                             │
                  ③ on calcule 2 angles : tête et tronc
                             │
                  ④ on compare aux seuils ─► verdict de CETTE image
                             │
                  ⑤ on regarde sur la durée ─► alerte (ou pas)
```

**L'IA ne décide pas si la posture est bonne.** MoveNet sert **seulement** à trouver où sont les points du corps. Ce sont des **règles** écrites par l'équipe (des « si… alors… ») qui décident ce qui est bon ou mauvais.

---

## 3. Les axes : comment l'ordinateur voit l'image

Une image est une grille de pixels. Chaque point est repéré par **x** (horizontal) et **y** (vertical) :

```text
(0,0) ───────── x augmente ──────────►  (640,0)
  │
  │        ● oreille (x=380, y=140)
  y
augmente   ● épaule  (x=300, y=200)
  │
  ▼        ● hanche  (x=300, y=400)
(0,480)
```

⚠️ **y augmente vers le bas**, contrairement à un graphique de maths. C'est pour ça que les formules font des soustractions « à l'envers » ([poc-raspberry.md](poc-raspberry.md) §5.3).

MoveNet donne aussi, pour chaque point, une **confiance** entre 0 et 1. En dessous de **0,3**, le point est jugé mal vu, et l'image est ignorée (UNKNOWN) plutôt que de calculer un angle faux. On utilise le **côté le mieux vu** (gauche ou droit) : celui qui fait face à la caméra.

---

## 4. Les deux angles

On mesure l'écart par rapport à une ligne de référence, horizontale ou verticale.

### Angle de la tête : la droite épaule → oreille, par rapport à l'horizontale

```text
   BONNE POSTURE                   TÊTE EN AVANT

        ● oreille                         ● oreille
        |                                /
        | 90°                           /  40°
        |                              /
   ─────●───── horizontale        ────●──────── horizontale
      épaule                        épaule
```

- **90°** : l'oreille est juste au-dessus de l'épaule, la tête est droite.
- **Plus l'angle baisse, plus la tête est en avant.**
- Cette mesure s'inspire de l'**angle cranio-vertébral** utilisé en posturologie, pour lequel les études situent souvent la tête trop en avant **en dessous d'environ 50°**.

### Angle du tronc : la droite hanche → épaule, par rapport à la verticale

```text
  DROIT          PENCHÉ EN AVANT        AVACHI EN ARRIÈRE

   ● épaule            ● épaule        ● épaule
   |                  /                 \
   | 0°              / +30°              \ -30°
   |                /                     \
   ● hanche        ● hanche                ● hanche
```

- **0°** : le dos est droit.
- **Positif** : le dos est penché en avant.
- **Négatif** : la personne est avachie en arrière.
- Les seuils de départ viennent de **RULA**, une méthode d'ergonomie utilisée en entreprise : de 0 à 20° c'est acceptable, au-delà de 20° c'est à surveiller.

### Mesure complémentaire à tester au T3 : l'angle oreille–épaule–hanche

Idée reprise d'autres projets de détection de posture sur Raspberry Pi : mesurer l'angle **au niveau de l'épaule**, entre la droite vers l'oreille et la droite vers la hanche, au lieu de le mesurer par rapport à l'horizontale.

```text
   oreille ●
            \
             \  ← angle AU NIVEAU de l'épaule
      épaule  ●
              |
              |
      hanche  ●
```

| | Angle oreille–épaule–hanche | Angles actuels (`tete`, `tronc`) |
|---|---|---|
| Caméra un peu penchée | ✅ **insensible** : l'angle entre deux segments ne change pas si l'image tourne | ❌ une caméra penchée de 5° fausse les angles de 5° |
| Ce qu'il mesure | la tête **par rapport au tronc** : peut aider pour le dos en « C » | la tête et le tronc **par rapport à la verticale** (inclinaison réelle) |
| Points nécessaires | oreille, épaule, hanche (les mêmes) | oreille, épaule, hanche |

Il **ne remplace pas** l'angle `tronc`, seul capable de dire si tout le corps penche en avant ou en arrière. À relever au **T3** à côté de `tete` et `tronc` ([poc-raspberry.md](poc-raspberry.md) §6, étape 3) ; s'il s'avère plus fiable, il pourra compléter ou remplacer `tete` dans les règles.

On écarte l'angle épaule–hanche–genou, utilisé par certains projets pour le tronc : à un bureau, le **genou est souvent caché**.

### Pourquoi « de profil » est obligatoire

Ces angles mesurent un mouvement **vers l'avant ou vers l'arrière**. Seule une caméra **sur le côté** voit ce mouvement. De face, l'avancée de la tête est invisible, puisqu'elle se fait vers la caméra, et les angles calculés n'ont plus de sens. Constaté lors du premier essai de `live.py` : face à la caméra, le statut « tête en avant » clignotait sans raison.

**Placement de la caméra :** sur le côté de la personne, perpendiculaire à elle, à hauteur d'épaule, à 1,5–3 m. L'oreille, l'épaule et la hanche du côté caméra doivent être visibles. Pas de contre-jour.

---

## 5. Les seuils : comment on les définit, en 3 temps

### Temps 1 : des valeurs de départ, tirées de la littérature

| Posture | Règle de départ | D'où ça vient |
|---|---|---|
| Tête en avant | tête < **50°** | angle cranio-vertébral |
| Dos penché en avant | tronc > **+20°** | méthode RULA |
| Avachi en arrière | tronc < **−25°** | estimation de départ |

Ce sont des **points de départ, pas des vérités**. Notre angle de tête utilise l'**épaule**, et non la vertèbre C7 comme dans les études : pour une même posture, il risque d'être **plus grand** que l'angle cranio-vertébral. Le seuil de 50° est donc probablement trop bas pour nous, et c'est ce que le temps 3 permettra de vérifier. Par ailleurs, la caméra n'est jamais placée parfaitement.

### Temps 2 : la calibration, des seuils adaptés à chaque personne

Chaque corps est différent : chez certaines personnes, l'oreille est naturellement un peu en avant. Au début de la session, la personne se tient **droite pendant 10 s**, et on mesure **sa** posture de référence (médiane des angles sur ces 10 s) :

```text
Exemple : référence tête 82°, tronc +3°
→ « tête en avant » si tête  < 82 − 8  = 74°
→ « dos penché »    si tronc > 3 + 12  = 15°
→ « avachi »        si tronc < 3 − 12  = −9°
```

On ne compare plus à une valeur générale, mais à **l'écart par rapport à soi-même**, ce qui est en général plus juste. Dans `live.py`, c'est la touche `c`.

### Temps 3 : ajuster avec de vraies mesures (étapes 4 et 5)

C'est ici qu'on « montre » à l'algorithme ce qu'est une bonne et une mauvaise posture.

**a) Enregistrer des exemples étiquetés.** La personne se place de profil et prend chaque posture pendant 30 s, en appuyant sur une touche pour dire laquelle c'est (`0` bonne, `1` tête en avant, `2` dos penché, `3` avachi). Le programme écrit les **angles** avec cette **étiquette** dans un CSV, sans aucune image.

**b) Regarder les chiffres.** Par exemple :

```text
Angle tête, selon ce que la personne faisait vraiment :

 bonne posture    :                    ████████████   (entre 75° et 90°)
 tête en avant    :  ███████████                      (entre 35° et 55°)
                  30°    40°    50°    60°    70°    80°    90°
                                    ▲
                     le seuil se place ENTRE les deux groupes (ici ~62°)
```

Si les deux groupes sont **bien séparés**, le seuil se place entre les deux. S'ils se **chevauchent**, l'angle seul ne suffit pas : il faut une autre mesure ou un autre placement de caméra.

**c) Mesurer la qualité.** Le script `evaluer.py` compte combien de fois chaque règle a raison. C'est le **score F1** : 1 = parfait, et l'objectif est **au moins 0,80** pour chaque posture. Si c'est insuffisant, on ajuste le seuil et on recommence.

### Et le temps (contre les fausses alertes)

Un seul verdict ne déclenche **pas** d'alerte. On regarde sur la durée ([poc-raspberry.md](poc-raspberry.md) §5.5) :

- **70 %** des images « mauvaises » sur la dernière minute, **pendant au moins 2 min** → **alerte** ;
- en dessous de **40 %** → fin de l'alerte.

Ces chiffres sont aussi des seuils à ajuster par les tests. À terme, ils seront envoyés par le serveur pour pouvoir être modifiés sans toucher au Pi ([poc-edge.md](poc-edge.md) §6).

---

## 6. Pas à pas, avec un exemple : comment l'algorithme évite de se tromper

Exemple : Léa, assise à son bureau, avec la caméra sur son côté gauche.

### 6.1 Ce que fait l'algorithme avec UNE image : 4 contrôles

Toutes les quelques secondes, le Pi prend une photo et la fait passer par 4 contrôles, comme un dossier qui passe de guichet en guichet.

**Guichet 1 : « Est-ce que je vois bien la personne ? »** MoveNet donne une note de confiance (0 à 1) pour chaque point.

```text
oreille : 0,85   épaule : 0,90   hanche : 0,78    → tout est au-dessus de 0,3 → ✅ on continue
oreille : 0,85   épaule : 0,90   hanche : 0,12    → la hanche est mal vue (cachée par le bureau ?)
                                                     → ❌ image IGNORÉE (« UNKNOWN »)
```

👉 Si on ne voit pas bien, on ne juge pas. On ne devine jamais un point.

**Guichet 2 : « Est-ce que la personne est bien de profil ? »** On mesure l'écart horizontal entre les deux épaules, divisé par la longueur du tronc (pour ne pas dépendre de la distance à la caméra). De profil, les deux épaules sont l'une derrière l'autre : écart proche de 0. De face, elles sont bien écartées : environ 0,8.

```text
écart 0,06  → de profil                                   → ✅ on continue
écart 0,75  → de face ou très en biais (> 0,35)           → ❌ image IGNORÉE (« UNKNOWN »)
épaule côté mur cachée → normal de profil, non mesurable  → ✅ on continue
```

Le seuil de **0,35** (environ 25° de rotation) est une valeur de départ, à ajuster par les tests. Dans `live.py`, l'écart s'affiche en haut de l'image : pratique pour placer la caméra. Idée reprise de la démo « Body Posture Analyzer » (LearnOpenCV, MediaPipe).

👉 Si la vue est mauvaise, on ne juge pas.

**Guichet 3 : « Quels sont les angles ? »** Par exemple : tête = 78°, tronc = +4°.

**Guichet 4 : « Ces angles sont-ils bons ? »** On compare à la posture de référence de Léa, mesurée au début (calibration : tête 82°, tronc +3°) :

```text
tête en avant ?   78° < 82 − 8 = 74° ?   NON → ✅
dos penché ?       4° > 3 + 12 = 15° ?   NON → ✅
avachi ?           4° < 3 − 12 = −9° ?   NON → ✅
→ verdict de CETTE image : BONNE
```

À ce stade, **on n'alerte pas encore** : on a juste un verdict pour une image (`BONNE`, `MAUVAISE (tête en avant)` ou `IGNORÉE`).

### 6.2 Pourquoi une seule image ne suffit pas

| Ce qui se passe vraiment | Ce que voit l'image | Verdict de l'image |
|---|---|---|
| Léa **boit son café** et se penche 2 secondes | dos penché | ❌ MAUVAISE, alors que c'est normal |
| Léa **ramasse un stylo** | dos très penché | ❌ MAUVAISE, alors que c'est normal |
| MoveNet place l'oreille **un peu trop loin** sur cette image | tête un peu en avant | ❌ MAUVAISE, alors que c'est une erreur de l'IA |
| Léa a vraiment la **tête en avant depuis 10 minutes** | tête en avant | ✅ MAUVAISE, c'est vrai |

Si on alertait à chaque image mauvaise, Léa recevrait des alertes pour un café ou un stylo, et elle abandonnerait l'application. **On regarde donc la tendance sur plusieurs minutes, pas une image.**

### 6.3 Le filtre dans le temps

L'algorithme garde en mémoire les verdicts de **la dernière minute** et calcule un pourcentage :

```text
Dernière minute : ✅ ✅ ❌ ✅ ✅ ✅      → 1 mauvaise sur 6 = 17 %
```

| Règle | Pourquoi |
|---|---|
| **1.** Les images IGNORÉES **ne comptent pas** | une image où l'on voit mal ne doit ni accuser ni excuser |
| **2.** **ALERTE** si au moins **70 %** de mauvaises sur la dernière minute, **pendant au moins 2 minutes d'affilée** | un café ou un stylo dure quelques secondes : ça ne fait jamais 70 % pendant 2 minutes |
| **3.** **FIN de l'alerte** seulement sous **40 %** | sinon, autour de 70 %, l'alerte s'allumerait et s'éteindrait sans arrêt |

La règle 3 fonctionne comme un **thermostat** : le chauffage s'allume à 19 °C mais ne s'éteint qu'à 21 °C, pour ne pas claquer toutes les 10 secondes.

#### La fenêtre glissante expliquée avec un bocal de billes

**Quatre durées à ne pas confondre :**

| | Ce que c'est | Durée |
|---|---|---|
| **La capture** | prendre UNE photo et l'analyser | environ **0,08 s** (instantané) |
| **L'intervalle** | le temps d'attente **entre deux photos** | **10 s** si tout va bien, **2 s** en cas de doute |
| **La fenêtre glissante** | les verdicts des photos des **60 dernières secondes** | **60 s** |
| **La confirmation** | combien de temps la fenêtre doit rester « mauvaise » avant d'alerter | **2 min** |

Les 2 secondes ne servent pas à confirmer : c'est seulement le rythme des photos quand il y a un doute.

**L'image du bocal.** Un bocal ne peut contenir que **10 billes**. Chaque photo donne une bille : 🟢 **verte** (bonne posture sur cette photo) ou 🔴 **rouge** (mauvaise). À chaque nouvelle photo, on **ajoute** sa bille ; si le bocal est plein, on **retire la plus ancienne**. Le bocal contient donc toujours **les 10 dernières photos** : c'est la fenêtre glissante. Règle : **au moins 7 rouges sur 10 (70 %), et que ça dure**, alors on alerte.

```text
Photo 1  🟢                          bocal : 🟢                              0 rouge
Photo 2  🟢                          bocal : 🟢🟢                            0 rouge
Photo 3  🔴  (elle boit son café)    bocal : 🟢🟢🔴                          1 rouge
...
Photo 10 🟢                          bocal : 🟢🟢🔴🟢🟢🟢🟢🟢🟢🟢              1 rouge sur 10 → rien
```

Une seule bille rouge sur 10 : pas d'alerte. Le café n'a rien déclenché.

```text
Photo 11 🔴  (elle avance la tête)
   → on ajoute 🔴, on retire la plus vieille (🟢)
   bocal : 🟢🔴🟢🟢🟢🟢🟢🟢🟢🔴                                            2 rouges → rien

Photo 12 🔴    bocal : 🔴🟢🟢🟢🟢🟢🟢🟢🔴🔴                                  3 rouges → rien
Photo 13 🔴    bocal : 🟢🟢🟢🟢🟢🟢🟢🔴🔴🔴                                  3 rouges → rien
Photo 14 🔴    bocal : 🟢🟢🟢🟢🟢🟢🔴🔴🔴🔴                                  4 rouges → rien
Photo 15 🔴    bocal : 🟢🟢🟢🟢🟢🔴🔴🔴🔴🔴                                  5 rouges → rien
Photo 16 🟢    bocal : 🟢🟢🟢🟢🔴🔴🔴🔴🔴🟢   (elle se redresse 1 instant)    5 rouges → rien
Photo 17 🔴    bocal : 🟢🟢🟢🔴🔴🔴🔴🔴🟢🔴                                  6 rouges → rien
Photo 18 🔴    bocal : 🟢🟢🔴🔴🔴🔴🔴🟢🔴🔴                                  7 rouges → ⚠️ 70 % atteint !
```

À la photo 18, on n'alerte pas tout de suite : on vérifie que **ça dure**.

```text
Photo 19 🔴    bocal : 🟢🔴🔴🔴🔴🔴🟢🔴🔴🔴     8 rouges → toujours ≥ 7, ça dure…
Photo 20 🔴    bocal : 🔴🔴🔴🔴🔴🟢🔴🔴🔴🔴     9 rouges → toujours ≥ 7, ça dure…
...  (ça reste au-dessus de 7 pendant 2 minutes)
             → 🔔 ALERTE « Tête en avant »

Puis la personne se corrige : les photos redeviennent 🟢, les 🔴 sortent du bocal une à une…
             bocal : 🟢🟢🟢🔴🟢🟢🟢🟢🔴🟢     2 rouges → moins de 4 sur 10 (40 %)
             → ✅ FIN de l'alerte
```

**Deux idées à retenir :**

1. **On ne juge jamais sur UNE photo.** Une bille rouge isolée (café, stylo, erreur de l'IA) ne pèse presque rien.
2. **Il faut que le rouge soit majoritaire ET que ça dure.** 🔴🟢🔴🟢🔴🟢… (5 sur 10, posture hésitante) ne déclenche jamais d'alerte ; 🔴🔴🔴🟢🔴🔴🔴🔴… (7 ou plus sur 10 pendant 2 min) déclenche l'alerte.

**Dans la vraie version**, c'est le même principe :

| | Exemple du bocal | Vraie version |
|---|---|---|
| Taille du bocal | 10 photos | toutes les photos des **60 dernières secondes** (~30 photos à 1 photo / 2 s) |
| Seuil d'alerte | 7 rouges sur 10 | **70 %** de rouges |
| Durée de confirmation | « un moment » | **2 minutes** au-dessus de 70 % |
| Fin d'alerte | moins de 4 sur 10 | moins de **40 %** |
| Photo mal vue | — | **pas de bille du tout** (ne compte ni pour, ni contre) |

Le rythme des photos (10 s ou 2 s) dit seulement **à quelle vitesse on ajoute des billes** ; il ne change pas la règle.

### 6.4 Exemple complet, minute par minute

✅ = image bonne, ❌ = mauvaise, ⬜ = ignorée. Chaque ligne montre quelques-unes des images de la minute.

```text
14:00  ✅ ✅ ✅ ✅ ✅ ✅              0 %   → tout va bien (1 photo / 10 s)

14:01  ✅ ✅ ❌ ✅ ✅ ✅             17 %   → Léa boit son café : une image mauvaise
                                           → 17 % < 70 % → PAS d'alerte ✅

14:02  ✅ ❌ ⬜ ✅ ✅ ✅             20 %   → elle se lève à moitié : une image ignorée
                                           → ignorée = ne compte pas → PAS d'alerte ✅

14:03  ❌ ❌ ✅ ❌ ❌ ❌ ...         83 %   → Léa se concentre, la tête avance
                                           → au-dessus de 70 %, mais depuis 1 min seulement
                                           → on ATTEND (et on passe à 1 photo / 2 s pour mieux suivre)

14:04  ❌ ❌ ❌ ✅ ❌ ❌ ...         85 %   → toujours au-dessus de 70 %…

14:05  ❌ ❌ ❌ ❌ ✅ ❌ ...         85 %   → au-dessus de 70 % DEPUIS 2 MINUTES
                                           → 🔔 ALERTE « Tête en avant » envoyée à l'app

14:06  ❌ ✅ ❌ ❌ ✅ ❌ ...         60 %   → Léa se corrige un peu : 60 %
                                           → pas encore sous 40 % → l'alerte CONTINUE

14:07  ✅ ✅ ✅ ❌ ✅ ✅ ...         17 %   → Léa est bien redressée
                                           → sous 40 % → ✅ FIN de l'alerte
                                           → enregistré : « tête en avant, 14:05 → 14:07 »
```

Le café (14:01) n'a pas déclenché d'alerte ; la vraie mauvaise posture (14:03–14:06) en a déclenché une.

### 6.5 Les deux erreurs possibles, et ce qui protège de chacune

**Erreur 1 : la FAUSSE ALERTE** (« mauvaise posture » alors que non). C'est la plus grave pour l'utilisateur, qui perd confiance et désactive l'application.

| Cause | Protection |
|---|---|
| point mal détecté par l'IA | **guichet 1** : confiance < 0,3 → image ignorée |
| personne de face | **guichet 2** : pas de profil → image ignorée |
| corps différent (oreille naturellement en avant) | **calibration** : comparaison à sa propre référence |
| geste bref (café, stylo) | **filtre** : 70 % pendant 2 min |
| IA qui tremble d'une image à l'autre | **filtre** : une image isolée ne pèse rien |
| alerte qui clignote | **règle des 40 %** (thermostat) |

**Erreur 2 : l'ALERTE RATÉE** (mauvaise posture, et rien ne se passe).

| Cause | Protection |
|---|---|
| seuil trop tolérant | **réglage des seuils** avec de vraies mesures (étapes 4 et 5) |
| caméra mal placée, beaucoup d'images ignorées | **T3** : au moins 90 % d'images exploitables |
| posture non mesurable (dos en « C » pur) | **limite connue** (§8), détectée en partie par ses effets (tête en avant) |

⚖️ **Les deux erreurs tirent en sens inverse.** Un seuil plus sévère donne moins d'alertes ratées mais plus de fausses alertes, et inversement. Le réglage cherche le bon équilibre : score **F1 ≥ 0,80** et **moins d'1 fausse alerte par heure**.

### 6.6 Comment on vérifie que ça marche

```text
1. La personne prend chaque posture devant la caméra, en appuyant sur une touche pour dire laquelle
   → on obtient la VÉRITÉ (ce qu'elle faisait vraiment)

2. On fait tourner l'algorithme sur ces mesures
   → on obtient ce que l'ALGO a répondu

3. On compare :
   Vérité : tête en avant   │ Algo : tête en avant   → ✅ juste
   Vérité : bonne           │ Algo : bonne           → ✅ juste
   Vérité : bonne           │ Algo : tête en avant   → ❌ fausse alerte
   Vérité : tête en avant   │ Algo : bonne           → ❌ alerte ratée

4. On compte les ✅ et les ❌ → score F1
   → trop de ❌ ? on ajuste le seuil, et on recommence
```

### 6.7 En résumé

1. **L'IA trouve les points**, elle ne juge pas la posture.
2. **On ne juge pas une image qu'on voit mal** : point peu sûr ou pas de profil → ignorée.
3. **Chaque image reçoit un verdict** en comparant ses angles à la posture de référence de la personne.
4. **On n'alerte que sur la durée** : 70 % de mauvaises images pendant 2 minutes, fin sous 40 %. Les gestes brefs et les erreurs ponctuelles de l'IA sont absorbés.
5. **Les seuils se règlent en mesurant** les vraies postures et en comptant les erreurs.

---

## 7. Côté utilisateur : retours, alertes et score

### 7.1 Deux types de retour, à deux vitesses

| | **L'écran « en direct »** | **L'alerte** |
|---|---|---|
| Quand | mis à jour **à chaque photo** (toutes les 10 s, ou 2 s en cas de doute) | **seulement si** la mauvaise posture est confirmée (70 % pendant 2 min) |
| Ce qu'on voit | la silhouette, les angles, un statut, le score | une **notification** sur le téléphone (son ou vibration) avec un conseil |
| À quoi ça sert | regarder sa posture quand on **en a envie** | **prévenir** la personne quand elle **ne regarde pas** l'app |

En travaillant, personne ne regarde son téléphone en permanence : **c'est l'alerte qui va chercher la personne**, l'écran en direct n'est qu'un plus.

### 7.2 Ce que vit Léa pendant une session

```text
14:00  Léa ouvre l'app → « Démarrer la session »
       → « Tenez-vous droite 10 secondes » (calibration)
       → « C'est parti ! » Elle pose son téléphone et travaille.

14:00 → 14:03   Tout va bien.
       Écran en direct (si elle regarde) : silhouette droite, « Posture correcte 🟢 », score 92
       Aucune notification : elle n'est pas dérangée.

14:01  Elle boit son café (1 photo rouge).
       Écran : peut afficher « tête en avant » quelques secondes, puis revient à 🟢
       Aucune notification. ✅

14:03  Elle se concentre et avance la tête : les photos deviennent rouges.
       Écran : « À surveiller 🟠 » (entre 40 et 70 % de rouge dans le bocal)
       Pas encore de notification : on attend de confirmer.

14:05  Rouge confirmé (≥ 70 % pendant 2 min)
       📳 NOTIFICATION : « Tête en avant détectée — rentrez légèrement le menton »
       Écran : « Tête en avant 🔴 », score 64

14:06  Léa se redresse. Écran : redevient 🟢 en quelques photos.

14:07  Le bocal repasse sous 40 % de rouge → fin de l'alerte
       (optionnel) message positif : « Bien joué, posture corrigée 👍 »

16:00  Fin de session → résumé : « Score 82, 74 % de bonne posture, 1 alerte tête en avant »
```

**Délai entre « je me tiens mal » et « je suis prévenue » : au moins 2 minutes environ, et c'est voulu.** Mieux vaut prévenir un peu tard mais à raison que vite mais pour rien. Cette durée est un réglage, qui pourra être raccourci si les tests le montrent (seuil piloté par le serveur).

### 7.3 Les 3 couleurs

| Couleur | Quand (rouge dans le bocal) | Ce qui se passe |
|---|---|---|
| 🟢 **Bonne** | moins de 40 % | rien |
| 🟠 **Moyenne / à surveiller** | entre 40 et 70 % | l'écran change de couleur, **pas de notification** |
| 🔴 **À améliorer** | ≥ 70 % pendant 2 min | **notification** avec un conseil |

Ce sont ces couleurs qui remplissent la « Répartition des postures » (Bonne / Moyenne / À améliorer) de l'écran « Mes résultats ».

**Deux règles de confort :**

1. **Pas de rafale de notifications** : après une alerte « tête en avant », pas de nouvelle alerte du même type avant **10 minutes**.
2. **Immobilité** : alerte à part, « Levez-vous 2 minutes », après **50 minutes** sans bouger.

### 7.4 Le score de 0 à 100 (proposition à valider)

**Score d'une photo** : on part de 100 et on retire des points selon l'écart à la posture de référence (calibration), au-delà d'une petite tolérance :

```text
écart tête  = (référence tête − tête mesurée) − 3°     (0 si négatif : la tête n'est pas en avant)
écart tronc = |tronc mesuré − référence tronc| − 4°     (0 si négatif)
score photo = 100 − 4 × écart tête − 4 × écart tronc     (borné entre 0 et 100)
```

Exemples avec la référence de Léa (tête 82°, tronc +3°) :

| Photo | Tête | Tronc | Écart tête | Écart tronc | **Score** |
|---|---|---|---|---|---|
| assise droite | 80° | +4° | 0° | 0° | **100** |
| légèrement penchée | 78° | +5° | 1° | 0° | **96** |
| tête en avant | 70° | +5° | 9° | 0° | **64** |
| tête en avant + dos penché | 66° | +18° | 13° | 11° | **4** |

**Score d'une période** (5 min, une session, une journée) : la **moyenne des scores des photos, pondérée par le temps**. Chaque photo compte pour la durée jusqu'à la photo suivante. Sans cette pondération, les moments « en doute » (une photo toutes les 2 s) pèseraient 5 fois plus que les moments calmes (une photo toutes les 10 s) et feraient baisser le score à tort. Les photos ignorées ne comptent pas.

**% de bonne posture** = temps passé en 🟢 ÷ temps suivi (hors photos ignorées).

Tous ces chiffres (3°, 4°, 4 points par degré) sont des **valeurs de départ**, à ajuster après les tests pour que le score « parle » aux utilisateurs.

**Qui calcule quoi (les couches) :**

```text
┌──────────────── PI (edge) ───────────────────────────┐
│ ① photo → angles → SCORE DE LA PHOTO (ex. 64)        │
│ ② toutes les 5 min → SCORE MOYEN des 5 min (ex. 78)  │
└───────────────────────────┬──────────────────────────┘
                            │ état en direct (score photo)
                            │ résumé 5 min (score moyen + temps 🟢🟠🔴)
                            ▼
┌──────────────── SERVEUR (NestJS + base) ─────────────┐
│ ③ stocke les résumés                                 │
│ ④ calcule : score par heure, du jour, de la semaine, │
│    « +6 pts vs hier », % de bonne posture            │
└───────────────────────────┬──────────────────────────┘
                            ▼
┌──────────────── APP MOBILE / SITE WEB ───────────────┐
│ ⑤ AFFICHE les chiffres et les graphiques             │
└──────────────────────────────────────────────────────┘
```

| Couche | Ce qu'elle calcule | Pourquoi là |
|---|---|---|
| **Pi** | ① score de chaque photo ; ② score moyen et temps 🟢🟠🔴 sur 5 min | seul à avoir les angles et la posture de référence (les points ne sortent pas) |
| **Serveur** | ③ stockage ; ④ score par heure, du jour, de la semaine, comparaison avec la veille | seul à voir toutes les sessions d'un utilisateur, sur plusieurs postes et plusieurs jours |
| **App / site** | ⑤ affichage | — |

**⚠️ Le score ne décide pas des alertes.** Sur le Pi, deux mécanismes séparés partent des mêmes angles :

```text
                        angles de la photo (tête, tronc)
                       ╱                                ╲
      VERDICT (règles + seuils)                  SCORE (0 à 100)
      « tête < 74° ? » → 🔴 ou 🟢               « 82 − 70 = 12° d'écart » → 64
              │                                          │
      bocal / fenêtre glissante                   moyenne sur 5 min
              │                                          │
      🔔 ALERTE (70 % pendant 2 min)              📊 AFFICHAGE (app, graphiques)
```

| | **Verdict** | **Score** |
|---|---|---|
| Question | posture **bonne ou mauvaise** ? | posture **à quel point** bonne ? |
| Résultat | 🟢 ou 🔴 | une note de 0 à 100 |
| Sert à | **déclencher les alertes** (bocal) et les couleurs | **montrer une note** à l'utilisateur |

Le verdict doit être simple et sûr (oui / non + fenêtre glissante, contre les fausses alertes) ; le score doit être nuancé (« un peu penché » 96, « très penché » 4). Ils restent cohérents car ils partent des mêmes angles et de la même référence : avec une référence tête à 82°, le seuil d'alerte (74°) correspond à un score d'environ **80**.

Dans le code du Pi :

```python
# posture_lib.py
def score_photo(a, ref):          # → note sur 100 pour UNE photo

# poc.py, à chaque photo
verdict = postures(a, ref)        # → 🟢 / 🔴, va dans le bocal → alertes
score   = score_photo(a, ref)     # → envoyé à l'app (état en direct)

# poc.py, toutes les 5 min
resume = {score_moyen, secondes_bonne, secondes_moyenne, secondes_a_ameliorer, secondes_ignore}
```

### 7.5 Ce que le Pi envoie (les bonnes postures aussi)

| Message | Quand | Contenu | Stocké sur le serveur ? | Sert à |
|---|---|---|---|---|
| **État en direct** | à chaque photo | posture, couleur, angle tête, angle tronc, score de la photo | ❌ relayé à l'app seulement | écran « session en cours » |
| **Résumé** | toutes les **5 min** | score moyen (pondéré), temps en 🟢 / 🟠 / 🔴, temps ignoré | ✅ | score du jour, score par heure, répartition, % de bonne posture, comparaison avec la veille |
| **Événement** | début et fin d'une alerte | type, début, fin, durée, angles moyens | ✅ | historique, conseils |

Exemple de résumé :

```json
{ "session": "ses_8f2c41", "periode": "14:00-14:05", "score_moyen": 78,
  "secondes_bonne": 210, "secondes_moyenne": 60, "secondes_a_ameliorer": 30, "secondes_ignore": 0 }
```

**Les bonnes postures sont donc bien envoyées**, sous forme de **temps et de score** dans les résumés. Ce sont des chiffres agrégés, jamais les points du corps ni les images.

---

## 8. Les limites connues

| Limite | Conséquence | Piste |
|---|---|---|
| **Vue de face** | angles faux, statuts qui clignotent | détecter « pas de profil » (épaules trop écartées par rapport au tronc) et ignorer l'image |
| **Dos rond « en C »** | la courbure de la colonne est invisible : MoveNet n'a aucun point le long du dos, seulement oreille, épaule et hanche reliées par des droites | souvent détecté **indirectement** (tête en avant, tronc penché). Piste à tester : le « tassement » (longueur épaule–hanche plus courte que celle de la calibration) |
| **Points qui tremblent** d'une image à l'autre | verdict qui change autour du seuil | normal : le filtre dans le temps (70 % sur 1 min, 2 min) l'absorbe |

---

## 9. « Entraîner l'IA » : oui, mais plus tard et en option

### Ce qu'on n'entraîne pas

**MoveNet**, qui trouve les points, est **déjà entraîné par Google** sur des milliers d'images. On ne le modifie pas.

### Ce qu'on pourrait entraîner plus tard

Au lieu d'écrire les règles à la main (« si tête < 50° »), un **petit modèle** pourrait apprendre la règle à partir des exemples étiquetés :

```text
ENTRÉE : angles (tête, tronc) + éventuellement les points
SORTIE : « bonne », « tête en avant », « dos penché », « avachi »
APPRIS À PARTIR DE : des centaines d'exemples étiquetés (étape 4)
```

C'est utile si les règles simples ne suffisent pas, par exemple pour le dos en « C », qu'aucun angle seul ne capte bien.

### Avec quoi ?

| Outil | Quand |
|---|---|
| **scikit-learn** (arbre de décision, régression logistique) | **premier choix** : simple, rapide, et la décision reste **explicable** |
| **TensorFlow / Keras** (petit réseau de neurones) | si scikit-learn ne suffit pas. Le modèle s'exporte en **`.tflite`** et tourne sur le Pi avec `ai-edge-litert`, **le même moteur que MoveNet** : rien de nouveau à installer sur le Pi |

L'**entraînement** se fait sur un **PC**. Le Pi ne fait qu'**utiliser** le modèle entraîné.

### Pourquoi pas maintenant ?

1. **Il faut d'abord des données** : les exemples étiquetés de l'étape 4.
2. **Les règles simples suffisent peut-être.** Pour un POC, des règles compréhensibles et justifiables valent mieux qu'un modèle « boîte noire ».
3. **Les mêmes données servent aux deux.** En enregistrant les exemples pour régler les seuils, on prépare déjà un éventuel entraînement : rien n'est perdu.

---

## 10. La suite, pas à pas

| # | Étape | Ce qu'on fait | Ce que ça valide |
|---|---|---|---|
| 1 | **T2** ✅ | test de 1 capture toutes les 5 s (0 échec sur 526) | la webcam tient la durée |
| 2 | **Placer la caméra de profil** | caméra sur le côté, à hauteur d'épaule, à 1,5–3 m ; vérifier dans `live.py` que l'oreille, l'épaule et la hanche du côté caméra sont bien vues | la vue latérale |
| 3 | **T3** | rester immobile 60 s et regarder si les angles tremblent (objectif : moins de 3° de variation) | les points sont fiables de profil |
| 4 | **Tester les règles en direct** | dans `live.py`, prendre chaque posture, vérifier que la bonne ligne passe au **rouge**, noter les angles | l'affichage, les degrés, les règles |
| 5 | **Calibration** | touche `c`, puis comparer | les seuils personnalisés |
| 6 | **Enregistrer des exemples** (étape 4) | ajouter les touches `0` à `3` dans `live.py` | les données |
| 7 | **Ajuster les seuils** (étape 5) | `evaluer.py` : distributions et score F1 | les seuils définitifs |
| 8 | **`poc.py`** | la vraie session ([poc-raspberry.md](poc-raspberry.md) §5.8) | la chaîne complète |
| 9 | *(option)* **Entraîner un modèle** | scikit-learn ou TensorFlow | si les règles ne suffisent pas |
