# Comment l'algorithme détecte la posture

> Explication simple de l'algorithme du POC edge : les points, les axes, les angles, les seuils, et la possibilité d'entraîner un modèle plus tard.
> Détails techniques et code : [poc-raspberry.md](poc-raspberry.md) §5. Choix, RGPD et messages vers le serveur : [audit technique](Audit_technique_final_Fil_Rouge_Master_UHA_4_0_v3.md) §7 et §15.

---

## Les règles en une page

Les seuils de posture sont vérifiés sur 4 volontaires (T5) ; les autres valeurs sont des **valeurs de départ**, réglées ensuite par nos mesures (objectif F1 ≥ 0,80 par alerte, < 1 fausse alerte par heure). Code : paquet `posture/` (`regles.py` pour les seuils, `filtre.py` pour le bocal) ; chaque règle est vérifiée par les tests unitaires de `tests/`.

```text
① Capture ─► ② Squelette ─► ③ Contrôles ─► ④ Angles + règles ─► ⑤ Filtre dans le temps ─► alerte
  (mémoire)    (MoveNet,      (image          (verdict de           (fenêtre glissante,
                17 points)     exploitable ?)  CETTE image)          70 % / 40 %)
```

**① Capture.** Une image en mémoire seulement (jamais écrite, jamais envoyée). Cadence adaptative : 10 s si la posture est bonne ; **2 s dès que 20 % des images des 60 dernières secondes sont mauvaises** (à 10 s : 2 images sur 6), pour confirmer vite (la fenêtre contient alors ~30 images au lieu de 6) ; retour à 10 s sous 20 %. Au départ, c'était 2 s dès la première image mauvaise : en session réelle (13/10, 67 min), des images isolées (cou à 43°, tête à 49°) gardaient le Pi à 2 s 82 % du temps sans jamais mener à une alerte ; à 20 %, 57 % sur les mêmes données ; 30 s si personne n'est détecté.

**② Squelette.** MoveNet donne 17 points (x, y, confiance). On n'en garde que 3, du côté visible : **oreille, épaule, hanche**.

**③ Contrôles**, dans l'ordre. Un contrôle raté → image **IGNORÉE** (UNKNOWN), comptée ni bonne ni mauvaise.

| # | Contrôle | Règle | Valeur |
|---|---|---|---|
| C1 | Côté vu | côté gauche ou droit le mieux vu **en moyenne sur les 10 premières images où quelqu'un est vu**, puis **bloqué** ; change seulement si l'autre a 0,15 de confiance d'avance pendant 5 images d'affilée. Choisi d'abord sur la 1ʳᵉ image seule : le 13/10, elle a donné le côté caché, gardé 36 min (tête mesurée ~11° trop bas) | `CoteStable` |
| C2 | Points fiables | confiance de l'oreille, de l'épaule **et** de la hanche ≥ 0,20 | `CONF_MIN` |
| C2 bis | Trou court | si **un seul** point est sous 0,20 et qu'il était bien vu il y a **≤ 2,5 s** (une image à la cadence de 2 s, avec la marge du temps de capture), on reprend sa dernière position au lieu d'ignorer l'image | `Completeur` |
| C3 | De profil | écart des 2 épaules ÷ longueur du tronc ≤ 0,35 (jamais complété) | `ECART_EPAULES_MAX` |

La caméra peut être à gauche ou à droite : C1 choisit le côté, et le calcul des angles tient compte du sens du regard, donc les angles ont le même sens des deux côtés.

**④ Angles et règle.**

| Angle | Définition | Lecture |
|---|---|---|
| Tête | droite épaule → oreille, par rapport à l'horizontale | 90° = oreille au-dessus de l'épaule ; plus petit = tête en avant |
| Tronc | droite hanche → épaule, par rapport à la verticale | 0° = droit ; > 0 = penché en avant ; < 0 = avachi en arrière |

**Les règles du MVP : ce qu'on mesure, le seuil, sa source, la durée avant alerte.** 5 règles, **4 alertes** : tête en avant et cou penché donnent la même alerte, « Tête en avant ou baissée ». Les seuils ne sont pas inventés : ils viennent de méthodes d'ergonomie publiées, et ont été vérifiés sur 4 volontaires (T5, 12/10/2026, §1). Seuils **fixes**, sans calibration.

| Alerte | Ce qu'on mesure | Seuil | Source du seuil | Durée avant alerte |
|---|---|---|---|---|
| Tête en avant | angle **tête** | tête < 50° (et tronc ≤ 20°, sinon c'est « dos penché ») | **angle cranio-vertébral** (Yip et al., 2008 : plus il est petit, plus la tête est en avant) | ≥ 70 % d'images mauvaises sur 60 s, **pendant 1 min** |
| Dos penché en avant | angle **tronc** | tronc > +20° | **RULA** (McAtamney & Corlett, 1993) : tronc fléchi de 0 à 20° acceptable, au-delà à surveiller | idem |
| Cou penché (regarder son téléphone) | angle **cou** : droite oreille → nez sous l'horizontale | cou > 42° (et tronc ≤ 20°) | mesuré le 12/10 sur **2 personnes** : nez à +51° et +58° en regardant son téléphone, contre +5 à +33° en bonne posture et +13 à +43° tête en avant. À 45° : 87 et 96 % reconnus, 0 à 1,2 % de fausses alertes ; **abaissé à 42°** après un test de `poc.py` où le téléphone, tenu plus haut (nez à +41–53°), n'était vu qu'à 64 % (91 % à 42°, pour 0 à 4 % des images de bonne posture). Pas de source publiée pour cet angle : valeur fixée par nos mesures | idem |
| Allongé dans la chaise | angle **tronc** | tronc < −30° | **REBA** (Hignett & McAtamney, 2000) : tronc en extension de plus de 20° = palier de risque supérieur. −30° et non −20° : « calé contre le dossier », une bonne posture, va jusqu'à −24° (T5) | idem |
| Assis trop longtemps (« Levez-vous ») | **temps assis sans pause** : devant la caméra sans la quitter au moins 1 min | 50 min | ⚠️ **à sourcer** : recommandations de santé publique sur l'interruption du temps assis (pistes : ANSES, INRS, OMS). Vérifier le chiffre exact avant de le citer | alerte dès 50 min → « Levez-vous 2 minutes » |

- **Tête en avant et dos penché sont fiables ensemble, moins séparément** : « tête < 50° ou tronc > 20° » repère la personne penchée vers l'écran avec un F1 de 0,82 (97 % d'alertes justes). Mais les volontaires avançaient souvent la tête **et** le buste : la cause annoncée est juste **66 %** du temps pour la tête en avant, **85 %** pour le dos penché. Le conseil reste utile dans les deux cas (se reculer, se redresser).
- **Tête en avant et cou penché : règles séparées, une seule alerte « Tête en avant ou baissée ».** Vus de profil, leurs angles se confondent : en test de `poc.py` (12/10), la tête restait à 40–48° et le nez à 38–49° dans les deux cas, et le nom changeait d'une image à l'autre autour du seuil (impression d'un programme « aléatoire »). Le conseil est le même (relever la tête, écran ou téléphone à hauteur des yeux, se reculer). Les deux règles restent séparées dans le CSV des mesures, et l'événement garde la part de chacune (`detail`, ex. `FORWARD_HEAD:60;NECK_FLEXION:40`).
- **Pourquoi une règle du cou** : regarder son téléphone baisse aussi l'angle de la tête (48° au lieu de 62–95°), donc « tête en avant » s'allumait. Le nez, lui, plonge sous l'oreille (+55°) ; quand la tête avance, il reste à +13–43°. Une image n'a qu'une cause vers l'avant, par ordre : dos penché, cou penché, tête en avant. Premier essai : 85 % des images « téléphone » reconnues, 0 à 2 % de fausses alertes en bonne posture chez les 4 volontaires ; mais 35 % des têtes en avant du 2ᵉ essai de P01 passent en « cou penché ».
- **Seuil de la tête : 50° gardé, 45° en réserve.** Au 2ᵉ essai de P01, la tête est restée à 48–51° pendant ~1 min de travail normal (31 % de la calibration sous 50°), sans doute en regardant vers le bas. À 45° : 8 %, pour un F1 presque inchangé (0,83 contre 0,84). On garde la valeur publiée tant que le filtre de 2 min suffit ; si `poc.py` donne trop de fausses alertes en vraie session, passer `SEUILS["tete"]` à 45°.
- **Allongé, et non « avachi »** : un avachi léger (tronc −20°) se confond avec « calé au dossier » (F1 0,64 en T5). L'alerte ne vise que l'avachi **prononcé** : à −30°, 0,8 % de fausses alertes et 96 % d'alertes justes, mais seulement 35 % des avachis joués en T5 l'atteignaient. Vérifié sur un « allongé » joué (1 personne) : tronc −35° à −47°, 84 % des images sous −30° une fois installé ; à refaire avec d'autres volontaires (nouvelle consigne d'`enregistrer.py`).
- **Pas de calibration pour les alertes** : la calibration a été testée (écarts à une référence personnelle) puis écartée, voir §5 Temps 2. Le score ne l'utilise pas non plus (§7.4).
- **La durée de confirmation : 1 min**, au lieu de 2 min au départ. Le but est qu'un geste bref (boire, ramasser un stylo) ne déclenche jamais d'alerte. **RULA** compte une posture comme **statique** quand elle est tenue **plus d'1 minute** : c'est à partir de là qu'on alerte. Rejoué sur la session réelle du 13/10 (67 min, 1 personne, postures jouées) : mêmes alertes qu'à 2 min, **1 min plus tôt**, aucune en plus. À vérifier en travail normal (lire une feuille, écrire à la main) : si plus d'1 fausse alerte par heure, passer à 1 min 30. Idée appuyée par la norme **ISO 11226** (postures de travail statiques), pour laquelle le caractère acceptable d'une posture dépend de la **durée** pendant laquelle on la garde. Ajustée par T5 et T7.
- **Ce qui part au serveur** (jamais d'image, jamais les points du corps) : voir l'[audit technique](Audit_technique_final_Fil_Rouge_Master_UHA_4_0_v3.md) §7.2.

Verdict de l'image : **BONNE**, **MAUVAISE (posture)** ou **IGNORÉE**.

**⑤ Filtre dans le temps.** Une image seule ne déclenche jamais d'alerte. **Un seul bocal pour les 3 postures vers l'avant** (tête en avant, dos penché, cou penché) : une image y est MAUVAISE si l'une des trois règles s'allume, et l'alerte porte le nom de **la cause la plus fréquente** parmi les mauvaises images de la fenêtre. Tête en avant et cou penché comptent pour une seule cause, « Tête en avant ou baissée ». Si, pendant l'alerte, une autre cause devient la plus fréquente pendant toute une confirmation (1 min), l'alerte change de nom : fin de l'ancienne, début de la nouvelle (vu en test : dos penché, bref redressement, puis téléphone ; sans cela l'alerte restait « dos penché »). Allongé et temps assis ont chacun leur bocal.

Pourquoi un bocal commun : tête, cou et dos avancent souvent ensemble, et la cause change d'une image à l'autre. Avec un bocal par posture, une tête en avant à 59 % « tête » + 41 % « cou » n'atteignait jamais 70 % : pas d'alerte, alors que la personne était mal installée 100 % du temps. Sur les postures jouées du T5, la cause la plus fréquente est juste dans **10 cas sur 12** (contre 62 % image par image pour la tête en avant) ; les 2 erreurs : tête **et** dos avancés ensemble, et une égalité sur une posture à peine faite.

| Règle | Valeur |
|---|---|
| Fenêtre glissante | verdicts des 60 dernières secondes, images IGNORÉES exclues |
| Début d'alerte | ≥ 70 % de MAUVAISES dans la fenêtre, pendant 1 min d'affilée |
| Fin d'alerte | < 40 % (l'écart 70 / 40 évite une alerte qui clignote) |
| Fenêtre vide | plus aucune image jugée depuis 60 s (personne partie, ou mal vue) : l'alerte en cours se termine et le compte de la confirmation repart de zéro. Sans cela, une alerte restait ouverte pendant toute l'absence, et une seule image penchée en se rasseyant déclenchait l'alerte (bug trouvé le 13/10 en simulation) |
| Assis trop longtemps | 50 min devant la caméra ; une absence d'au moins 1 min (la personne s'est levée) remet le compteur à zéro. L'idée de départ (points presque immobiles, déplacement médian < 0,02 du tronc) ne marche pas : mesuré le 12/10, les points tremblent déjà de 0,025 d'une image à l'autre en travail normal (erreurs de MoveNet, respiration, mains), donc personne n'était jamais « immobile » |
| Absence | personne vue sur aucune des 3 dernières images (ni oreille ni épaule fiable) → cadence de 30 s |
| Anti-rafale | après la fin d'une alerte, pas de nouvelle alerte de la **même cause** avant 10 min (un « cou penché » juste après un « dos penché » reste signalé) |


---

## 1. Où en est le POC (12 octobre 2026)

| Étape | État |
|---|---|
| Caméra + OpenCV + IA (MoveNet trouve les points, OpenCV les dessine) | ✅ validé |
| T2 : la webcam tient dans la durée | ✅ 0 échec sur 526 captures (44 min) |
| Choix du modèle (T4) | ✅ **MoveNet Thunder** : tête 2,9° d'écart-type au lieu de 4,9° avec Lightning, 70 ms par image |
| Caméra **de profil**, points bien vus (T3) | ✅ pour 1 personne : 100 % d'images exploitables, angles stables à < 3° |
| Les angles bougent dans le bon sens pour chaque posture | ✅ vérifié dans `live.py` |
| Vérifier les seuils sur des volontaires (étapes 4 et 5, T5) | ✅ **4 volontaires** : tête en avant / dos penché F1 0,82 ensemble (ci-dessous) ; « allongé » ✅ sur 1 personne |
| `poc.py` : filtre dans le temps, cadence, temps assis, événements | ✅ écrit (12/10) ; ⏳ à tester en vraie session (fausses alertes par heure, T7) |
| (Plus tard, optionnel) entraîner un modèle | ⬜ |

**T5 : 4 volontaires (12/10, Thunder, `outils/enregistrer.py`, 2 min de calibration puis chaque posture 30 s)** — détail dans [poc-raspberry.md](poc-raspberry.md) §7. Score F1 image par image, une posture contre la bonne posture :

| Règle | F1 (4 pers.) | Précision | Verdict |
|---|---|---|---|
| **Tête en avant ou dos penché : tête < 50° ou tronc > 20°** (fixe) | **0,82** | **0,97** | ✅ retenue ; cause juste 66 % (tête) / 85 % (dos) |
| Tête en avant seule, calibrée (réf. − 8°) | 0,58 | 0,49 | ❌ |
| Tête en avant seule, meilleur écart, un volontaire mis de côté | 0,67 | 0,68 | ❌ |
| Dos penché seul, un volontaire mis de côté | 0,88 | 0,89 | ✅ |
| Avachi, un volontaire mis de côté | 0,64 | 0,55 | ❌ |
| **Allongé : tronc < −30°** (fixe), sur les avachis joués | 0,51 | **0,96** | ✅ retenue pour l'avachi prononcé : 0,8 % de fausses alertes |
| Cou penché : nez > 45° sous l'oreille (2 pers., regarder son téléphone 30 s) | 0,93 et 0,97 | 1,00 et 0,97 | ✅ retenue : nom annoncé « cou penché » 100 % du temps ; sans cette règle, le téléphone de la 2ᵉ personne (tête à 56°) passait inaperçu |
| Allongé, vraiment joué (1 pers., 30 s) | — | — | ✅ tronc −35° à −47° : 84 % des images sous −30° une fois installé, 0 fausse alerte hors transitions |

Ce qu'on en retient :

- **Les seuils de départ (50° et 20°) suffisent.** Les meilleurs seuils cherchés sur ces données (tête < 45° ou tronc > 10°) ne font pas mieux (F1 0,83). Comme 50° et 20° n'ont pas été réglés sur ces données, leur F1 n'est pas « optimiste ».
- **Tête et buste vont ensemble** : en « tête en avant », le tronc passait de −15° à +10/+20° chez la plupart des volontaires. D'où une règle commune, la cause étant annoncée d'après le tronc.
- **La calibration a été écartée pour l'alerte** : les 4 volontaires ont calibré calés au dossier (tronc −12° à −18°, sauf un à +2°), puis se sont redressés vers 0° en revenant à la normale. Avec des écarts serrés (− 8°, + 12°), se redresser déclenchait « dos penché » (précision 0,49 à 0,57).
- **Limite** : une tête en avant faite **en restant calé au dossier** (P03, tronc −26°) ne baisse pas l'angle de la tête : moitié des images ratées (F1 0,67 pour P03 et P04). Ni l'angle oreille–épaule–hanche (F1 0,73), ni la combinaison des deux (0,74) ne règlent ce cas.
- **Avachi** : chacun s'avachit à sa façon (tête qui monte à 94° chez P01, qui descend à 49° chez P02), et le tronc avachi (−20° à −30°) chevauche « calé au dossier » (−12° à −18°).

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

MoveNet donne aussi, pour chaque point, une **confiance** entre 0 et 1. En dessous de **0,2**, le point est jugé mal vu, et l'image est ignorée (UNKNOWN) plutôt que de calculer un angle faux. Le seuil était de 0,3 au départ : la mesure du 8 octobre a montré que, de profil, l'oreille et l'épaule sont souvent vues entre 0,2 et 0,3 avec des angles corrects, et que 0,3 rejetait 20 % des images pour rien. On utilise le **côté le mieux vu** (gauche ou droit) : celui qui fait face à la caméra.

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

| Posture | Règle de départ | D'où ça vient | Après T5 (4 volontaires) |
|---|---|---|---|
| Tête en avant | tête < **50°** | angle cranio-vertébral | gardés : F1 0,82 ensemble ✅ |
| Dos penché en avant | tronc > **+20°** | méthode RULA | |
| Avachi en arrière | tronc < **−25°** | estimation de départ | devient « allongé » : tronc < **−30°** (0,8 % de fausses alertes) |

Ce sont des **points de départ, pas des vérités**. Notre angle de tête utilise l'**épaule**, et non la vertèbre C7 comme dans les études : pour une même posture, il pouvait être **plus grand** que l'angle cranio-vertébral. T5 a montré que 50° convient tout de même (les meilleurs seuils trouvés, 45° et 10°, ne font pas mieux).

### Temps 2 : la calibration, testée puis écartée pour l'alerte

L'idée : chaque corps est différent, donc comparer chaque personne à **sa propre posture de référence**, la médiane des angles pendant ses **2 premières minutes de travail normal** (« tenez-vous droit 10 s » donnait une posture jouée : référence trop haute ou trop basse selon l'essai). Règles testées : tête < réf − 8°, tronc > réf + 12°, tronc < réf − 12°.

**Résultat en T5 : moins bon que les seuils fixes.** On n'a pas une, mais **deux postures normales** : calé contre le dossier (tronc −12° à −18°) et assis droit (tronc vers 0°). Les 4 volontaires ont calibré calés au dossier, puis se sont redressés : se redresser devenait « dos penché » (précision 0,49 à 0,57). Pour ne plus sonner, il faudrait des écarts de 20 à 30°, et on retombe sur des seuils fixes. Une calibration ratée (personne tournée ou qui parle pendant les 2 min, P04) fausse en plus toute la session.

**Version mixte, testée aussi** (6 enregistrements, tête en avant, dos penché et cou penché contre la bonne posture) :

| Méthode | Précision | F1 |
|---|---|---|
| **Seuils fixes** : tête < 50°, tronc > 20°, cou > 45° | **0,95** | **0,86** |
| Calibrés : réf. − 8° / + 12° / + 15° | 0,71 | 0,78 |
| Mixtes : min(50°, réf. − 15°) / max(20°, réf. + 15°) / max(45°, réf. + 15°) | 0,96 | 0,85 |
| Mixtes plus larges : min(50°, réf. − 25°) / max(20°, réf. + 20°) / max(45°, réf. + 20°) | 0,97 | 0,82 |

La raison : la référence d'une **même personne** varie trop. P01, même chaise, même jour : tête de référence 69°, **55°** puis 77° selon ce qu'il faisait pendant les 2 minutes (regarder son téléphone ou son clavier baisse la tête). Un seuil calculé dessus bouge d'autant ; un seuil fixe n'en dépend pas.

**Décidé** : l'alerte utilise les **seuils fixes**, et le score ne dépend pas non plus de la calibration (§7.4). Elle reste seulement notée dans les CSV des outils de mesure (touche `c` de `live.py`) ; `poc.py` ne calibre pas.

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

- **70 %** des images « mauvaises » sur la dernière minute, **pendant au moins 1 min** → **alerte** ;
- en dessous de **40 %** → fin de l'alerte.

Ces chiffres sont aussi des seuils à ajuster par les tests. À terme, ils seront envoyés par le serveur pour pouvoir être modifiés sans toucher au Pi ([audit technique](Audit_technique_final_Fil_Rouge_Master_UHA_4_0_v3.md) §7.1).

---

## 6. Pas à pas, avec un exemple : comment l'algorithme évite de se tromper

Exemple : Léa, assise à son bureau, avec la caméra sur son côté gauche.

### 6.1 Ce que fait l'algorithme avec UNE image : 4 contrôles

Toutes les quelques secondes, le Pi prend une photo et la fait passer par 4 contrôles, comme un dossier qui passe de guichet en guichet.

**Guichet 1 : « Est-ce que je vois bien la personne ? »** MoveNet donne une note de confiance (0 à 1) pour chaque point.

```text
oreille : 0,85   épaule : 0,90   hanche : 0,78    → tout est au-dessus de 0,2 → ✅ on continue
oreille : 0,85   épaule : 0,90   hanche : 0,12    → la hanche est mal vue (cachée par le bureau ?)
   … mais bien vue il y a 2,5 s au plus          → on reprend sa dernière position → ✅ on continue
   … sinon, ou si 2 points sont mal vus          → ❌ image IGNORÉE (« UNKNOWN »)
```

👉 Un trou **court sur un seul point** (bras qui passe devant, confiance qui chute une image) est complété avec l'image d'avant : le corps n'a pas bougé en 2 secondes. Au-delà, on ne juge pas : on n'invente jamais une posture.

**Guichet 2 : « Est-ce que la personne est bien de profil ? »** On mesure l'écart horizontal entre les deux épaules, divisé par la longueur du tronc (pour ne pas dépendre de la distance à la caméra). De profil, les deux épaules sont l'une derrière l'autre : écart proche de 0. De face, elles sont bien écartées : environ 0,8.

```text
écart 0,06  → de profil                                   → ✅ on continue
écart 0,75  → de face ou très en biais (> 0,35)           → ❌ image IGNORÉE (« UNKNOWN »)
épaule côté mur cachée → normal de profil, non mesurable  → ✅ on continue
```

Le seuil de **0,35** (environ 25° de rotation) est une valeur de départ, à ajuster par les tests. Dans `live.py`, l'écart s'affiche en haut de l'image : pratique pour placer la caméra. Idée reprise de la démo « Body Posture Analyzer » (LearnOpenCV, MediaPipe).

👉 Si la vue est mauvaise, on ne juge pas.

**Guichet 3 : « Quels sont les angles ? »** Par exemple : tête = 78°, tronc = +4°.

**Guichet 4 : « Ces angles sont-ils bons ? »** On applique les 4 règles :

```text
tête en avant ?   78° < 50° ?    NON
dos penché ?       4° > 20° ?    NON
cou penché ?      nez 20° > 42° ?   NON
allongé ?          4° < −30° ?   NON
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
| **2.** **ALERTE** si au moins **70 %** de mauvaises sur la dernière minute, **pendant au moins 1 minute d'affilée** | un café ou un stylo dure quelques secondes : ça ne fait jamais 70 % pendant 2 minutes |
| **3.** **FIN de l'alerte** seulement sous **40 %** | sinon, autour de 70 %, l'alerte s'allumerait et s'éteindrait sans arrêt |

La règle 3 fonctionne comme un **thermostat** : le chauffage s'allume à 19 °C mais ne s'éteint qu'à 21 °C, pour ne pas claquer toutes les 10 secondes.

#### La fenêtre glissante expliquée avec un bocal de billes

**Quatre durées à ne pas confondre :**

| | Ce que c'est | Durée |
|---|---|---|
| **La capture** | prendre UNE photo et l'analyser | environ **0,08 s** (instantané) |
| **L'intervalle** | le temps d'attente **entre deux photos** | **10 s** si tout va bien, **2 s** en cas de doute |
| **La fenêtre glissante** | les verdicts des photos des **60 dernières secondes** | **60 s** |
| **La confirmation** | combien de temps la fenêtre doit rester « mauvaise » avant d'alerter | **1 min** |

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
...  (ça reste au-dessus de 7 pendant 1 minute)
             → 🔔 ALERTE « Tête en avant »

Puis la personne se corrige : les photos redeviennent 🟢, les 🔴 sortent du bocal une à une…
             bocal : 🟢🟢🟢🔴🟢🟢🟢🟢🔴🟢     2 rouges → moins de 4 sur 10 (40 %)
             → ✅ FIN de l'alerte
```

**Deux idées à retenir :**

1. **On ne juge jamais sur UNE photo.** Une bille rouge isolée (café, stylo, erreur de l'IA) ne pèse presque rien.
2. **Il faut que le rouge soit majoritaire ET que ça dure.** 🔴🟢🔴🟢🔴🟢… (5 sur 10, posture hésitante) ne déclenche jamais d'alerte ; 🔴🔴🔴🟢🔴🔴🔴🔴… (7 ou plus sur 10 pendant 1 min) déclenche l'alerte.

**Dans la vraie version**, c'est le même principe :

| | Exemple du bocal | Vraie version |
|---|---|---|
| Taille du bocal | 10 photos | toutes les photos des **60 dernières secondes** (~30 photos à 1 photo / 2 s) |
| Seuil d'alerte | 7 rouges sur 10 | **70 %** de rouges |
| Durée de confirmation | « un moment » | **1 minute** au-dessus de 70 % |
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
                                           → au-dessus de 70 %, mais depuis moins d'1 min
                                           → on ATTEND (et on passe à 1 photo / 2 s pour mieux suivre)

14:04  ❌ ❌ ❌ ✅ ❌ ❌ ...         85 %   → au-dessus de 70 % DEPUIS 1 MINUTE
                                           → 🔔 ALERTE « Tête en avant » envoyée à l'app

14:05  ❌ ❌ ❌ ❌ ✅ ❌ ...         85 %   → toujours au-dessus de 70 % → l'alerte continue

14:06  ❌ ✅ ❌ ❌ ✅ ❌ ...         60 %   → Léa se corrige un peu : 60 %
                                           → pas encore sous 40 % → l'alerte CONTINUE

14:07  ✅ ✅ ✅ ❌ ✅ ✅ ...         17 %   → Léa est bien redressée
                                           → sous 40 % → ✅ FIN de l'alerte
                                           → enregistré : « tête en avant, 14:04 → 14:07 »
```

Le café (14:01) n'a pas déclenché d'alerte ; la vraie mauvaise posture (14:03–14:06) en a déclenché une.

### 6.5 Les deux erreurs possibles, et ce qui protège de chacune

**Erreur 1 : la FAUSSE ALERTE** (« mauvaise posture » alors que non). C'est la plus grave pour l'utilisateur, qui perd confiance et désactive l'application.

| Cause | Protection |
|---|---|
| point mal détecté par l'IA | **guichet 1** : confiance < 0,2 → image ignorée |
| personne de face | **guichet 2** : pas de profil → image ignorée |
| deux postures normales (calé au dossier ou droit) | **seuils fixes et larges** (tête < 50°, tronc entre −30° et +20°) : les deux restent 🟢 (T5) |
| geste bref (café, stylo) | **filtre** : 70 % pendant 1 min |
| IA qui tremble d'une image à l'autre | **filtre** : une image isolée ne pèse rien |
| alerte qui clignote | **règle des 40 %** (thermostat) |
| la personne se rassoit (penchée quelques secondes) | **fenêtre vide** pendant l'absence : le compte de la confirmation repart de zéro |

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
3. **Chaque image reçoit un verdict** en comparant ses angles aux seuils (tête < 50°, tronc > 20°, cou > 42°, tronc < −30°).
4. **On n'alerte que sur la durée** : 70 % de mauvaises images pendant 1 minute, fin sous 40 %. Les gestes brefs et les erreurs ponctuelles de l'IA sont absorbés.
5. **Les seuils se règlent en mesurant** les vraies postures et en comptant les erreurs.

---

## 7. Côté utilisateur : retours, alertes et score

### 7.1 Deux types de retour, à deux vitesses

| | **L'écran « en direct »** | **L'alerte** |
|---|---|---|
| Quand | mis à jour **à chaque photo** (toutes les 10 s, ou 2 s en cas de doute) | **seulement si** la mauvaise posture est confirmée (70 % pendant 1 min) |
| Ce qu'on voit | un statut, sa couleur, le score (silhouette animée : plus tard) | une **notification** sur le téléphone (son ou vibration) avec un conseil |
| Transport | Pi → serveur en WebSocket, serveur → app en SSE ([audit technique](Audit_technique_final_Fil_Rouge_Master_UHA_4_0_v3.md) §7.2) | SSE si l'app est ouverte, **notification push** sinon |
| À quoi ça sert | regarder sa posture quand on **en a envie** | **prévenir** la personne quand elle **ne regarde pas** l'app |

En travaillant, personne ne regarde son téléphone en permanence : **c'est l'alerte qui va chercher la personne**, l'écran en direct n'est qu'un plus.

### 7.2 Ce que vit Léa pendant une session

```text
14:00  Léa ouvre l'app → « Démarrer la session »
       → « Installez-vous comme d'habitude et travaillez » (pas de calibration : seuils fixes)
       Elle pose son téléphone et travaille.

14:00 → 14:03   Tout va bien.
       Écran en direct (si elle regarde) : « Posture correcte 🟢 », score 92
       Aucune notification : elle n'est pas dérangée.

14:01  Elle boit son café (1 photo rouge).
       Écran : peut afficher « dos penché » quelques secondes, puis revient à 🟢
       Aucune notification. ✅

14:03  Elle se concentre et avance la tête : les photos deviennent rouges.
       Écran : « À surveiller 🟠 » (entre 40 et 70 % de rouge dans le bocal)
       Pas encore de notification : on attend de confirmer.

14:04  Rouge confirmé (≥ 70 % pendant 1 min)
       📳 NOTIFICATION : « Tête en avant détectée — reculez-vous de l'écran »
       Écran : « Tête en avant 🔴 », score 64

14:06  Léa se redresse. Écran : redevient 🟢 en quelques photos.

14:07  Le bocal repasse sous 40 % de rouge → fin de l'alerte
       (optionnel) message positif : « Bien joué, posture corrigée 👍 »

16:00  Fin de session → résumé : « Score 82, 74 % de bonne posture, 1 alerte tête en avant »
```

**Délai entre « je me tiens mal » et « je suis prévenue » : environ 1 min 30 à 2 min, et c'est voulu** (le temps que 70 % des photos de la dernière minute soient mauvaises, puis 1 min de confirmation). Mieux vaut prévenir un peu tard mais à raison que vite mais pour rien. Avec 2 min de confirmation (réglage de départ), c'était environ 3 min. Cette durée est un réglage (piloté par le serveur à terme).

### 7.3 Les 3 couleurs

| Couleur | Quand (rouge dans le bocal) | Ce qui se passe |
|---|---|---|
| 🟢 **Bonne** | moins de 40 % | rien |
| 🟠 **Moyenne / à surveiller** | entre 40 et 70 % | l'écran change de couleur, **pas de notification** |
| 🔴 **À améliorer** | ≥ 70 % pendant 1 min | **notification** avec un conseil |

Ce sont ces couleurs qui remplissent la « Répartition des postures » (Bonne / Moyenne / À améliorer) de l'écran « Mes résultats ».

**Deux règles de confort :**

1. **Pas de rafale de notifications** : après une alerte « tête en avant », pas de nouvelle alerte du même type avant **10 minutes**.
2. **Assis trop longtemps** : alerte à part, « Levez-vous 2 minutes », après **50 minutes** sans quitter son poste.

### 7.4 Le score de 0 à 100

**Score d'une période** (5 min, une session, une journée) = **% du temps passé en bonne posture**, hors temps ignoré (image mal vue) et absent. Exemple : sur 2 h suivies, 1 h 30 en bonne posture → score **75**. Code : `posture.score.Resume`, résumé toutes les 5 min dans `poc.py`.

- **Pondéré par le temps** : chaque image compte pour la durée jusqu'à l'image suivante. Sans cela, les moments « en doute » (une image toutes les 2 s) pèseraient 5 fois plus que les moments calmes (toutes les 10 s) et feraient baisser le score à tort.
- **Pourquoi pas une note par image** (« un peu penché » 96, « très penché » 4) : la formule prévue au départ comptait les degrés d'écart à la référence de calibration. La calibration a été écartée (§5, Temps 2), et une note par degré demanderait de nouveaux chiffres à inventer puis à valider. Le % du temps en bonne posture s'appuie directement sur les règles validées en T5 et se comprend tout de suite.
- **Le résumé de 5 min** (audit §7.2) donne aussi le temps en 🟢 / 🟠 / 🔴 (couleur du bocal, §7.3), le **temps ignoré** et le temps absent : le temps ignoré montre si la caméra voyait mal pendant la session (outil d'analyse : `outils/confiance.py`).

**Qui calcule quoi (les couches) :**

```text
┌──────────────── PI (edge) ───────────────────────────┐
│ ① photo → angles → posture de la photo (🟢 / 🔴)     │
│ ② toutes les 5 min → SCORE = % temps en bonne posture│
└───────────────────────────┬──────────────────────────┘
                            │ état en direct (posture, couleur)
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
| **Pi** | ① score de chaque photo ; ② score moyen et temps 🟢🟠🔴 sur 5 min | seul à avoir les angles de chaque image (les points ne sortent pas) |
| **Serveur** | ③ stockage ; ④ score par heure, du jour, de la semaine, comparaison avec la veille | seul à voir toutes les sessions d'un utilisateur, sur plusieurs postes et plusieurs jours |
| **App / site** | ⑤ affichage | — |

**⚠️ Le score ne décide pas des alertes.** Sur le Pi, deux mécanismes séparés partent des mêmes angles :

```text
                        angles de la photo (tête, tronc)
                       ╱                                ╲
      VERDICT (règles + seuils)                  SCORE (0 à 100)
      « tête < 50° ? » → 🔴 ou 🟢               temps en bonne posture ÷ temps suivi
              │                                          │
      bocal / fenêtre glissante                   sur 5 min, une session, un jour
              │                                          │
      🔔 ALERTE (70 % pendant 1 min)              📊 AFFICHAGE (app, graphiques)
```

| | **Verdict** | **Score** |
|---|---|---|
| Question | posture **bonne ou mauvaise** maintenant ? | **quelle part du temps** en bonne posture ? |
| Résultat | 🟢 ou 🔴 | une note de 0 à 100 |
| Sert à | **déclencher les alertes** (bocal) et les couleurs | **montrer une note** à l'utilisateur |

Le verdict doit être simple et sûr (oui / non + fenêtre glissante, contre les fausses alertes) ; le score résume la période. Ils partent des **mêmes règles** : une image bonne pour le verdict est une image bonne pour le score.

Dans le code du Pi :

```python
# poc.py, à chaque photo
regles = postures(a)              # → 🟢 / 🔴, va dans le bocal → alertes
resume.ajouter(duree, couleur, bonne)   # durée jusqu'à la photo suivante

# poc.py, toutes les 5 min
{score_moyen, secondes_bonne, secondes_moyenne, secondes_a_ameliorer, secondes_ignore, secondes_absent}
```

### 7.5 Ce que le Pi envoie (les bonnes postures aussi)

| Message | Quand | Contenu | Stocké sur le serveur ? | Sert à |
|---|---|---|---|---|
| **État en direct** | à chaque photo | posture, couleur, angle tête, angle tronc | ❌ relayé à l'app seulement | écran « session en cours » |
| **Résumé** | toutes les **5 min** | score (% du temps en bonne posture, pondéré), temps en 🟢 / 🟠 / 🔴, temps ignoré et absent | ✅ | score du jour, score par heure, répartition, % de bonne posture, comparaison avec la veille |
| **Événement** | début et fin d'une alerte | type, début, fin, durée, angles moyens | ✅ | historique, conseils |

Exemple de résumé :

```json
{ "id": "res_0042", "session": "ses_8f2c41", "periode": "14:00-14:05", "score_moyen": 78,
  "secondes_bonne": 210, "secondes_moyenne": 60, "secondes_a_ameliorer": 30, "secondes_ignore": 0 }
```

Le format exact des trois messages et leur transport (WebSocket, HTTPS, SSE, notification push) sont décrits dans l'[audit technique](Audit_technique_final_Fil_Rouge_Master_UHA_4_0_v3.md) §7.2.

**Les bonnes postures sont donc bien envoyées**, sous forme de **temps et de score** dans les résumés. Ce sont des chiffres agrégés, jamais les points du corps ni les images.

---

## 8. Les limites connues

| Limite | Conséquence | Piste |
|---|---|---|
| **Vue de face** | angles faux, statuts qui clignotent | ✅ traité : épaules trop écartées par rapport au tronc (> 0,35) → image ignorée (§6.1, guichet 2). Seuil à confirmer par les tests |
| **Dos rond « en C »** | la courbure de la colonne est invisible : MoveNet n'a aucun point le long du dos, seulement oreille, épaule et hanche reliées par des droites | souvent détecté **indirectement** (tête en avant, tronc penché). Piste à tester : le « tassement » (longueur épaule–hanche plus courte que celle de la calibration) |
| **Points qui tremblent** d'une image à l'autre | verdict qui change autour du seuil | MoveNet **Thunder** au lieu de Lightning (tête 2,9° d'écart-type au lieu de 4,9°, T4) ; le reste est absorbé par le filtre dans le temps (70 % sur 1 min, confirmé pendant 1 min) |
| **Dossier incliné : « appuyé » ou « avachi » ?** | les deux penchent le tronc en arrière ; la différence (dos arrondi, bassin qui bascule) est invisible avec 3 points. Mesuré le 12/10 : tronc −11° appuyé contre −18° avachi, hanche immobile, longueur du tronc −7 % mais trop variable | **seul l'avachi prononcé est détecté** (« allongé », tronc < −30°) ; l'avachi léger ne l'est pas : T5 sur 4 volontaires, F1 0,64 (tronc avachi −20° à −30° contre −12° à −18° calé au dossier ; la tête monte chez l'un, descend chez l'autre). **Allongé, la hanche passe sous le bureau** : MoveNet la devine (confiance 0,27 contre 0,4–0,7 assis) et le tronc mesuré reste vers −10/−20° même bien allongé ; une caméra posée sur le bureau ne peut pas la voir. L'épaule qui descend (+7 à +25 % du tronc) chevauche la bonne posture (jusqu'à +12 %). Pistes pour plus tard : modèle avec des points sur la colonne, modèle entraîné (§9) |
| **Tête en avant en restant calé au dossier** | le buste penché en arrière compense : l'angle de la tête (par rapport à l'horizontale) ne baisse pas. T5 : moitié des images ratées chez P03 et P04 | limite acceptée ; l'angle oreille–épaule–hanche (F1 0,73) ne la règle pas. Piste : modèle entraîné (§9) |
| **Une autre personne dans le cadre** | MoveNet ne suit qu'une personne : il peut sauter de l'une à l'autre ou mélanger leurs points | cadrer serré sur la personne ; piste : recadrer l'image autour de la personne suivie |

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
| 5 | **Calibration** ✅ testée, écartée (§5) | touche `c`, puis comparer | les seuils personnalisés : moins bons que les seuils fixes |
| 6 | **Enregistrer des exemples** (étape 4) | ajouter les touches `0` à `3` dans `live.py` | les données |
| 7 | **Ajuster les seuils** (étape 5) | `evaluer.py` : distributions et score F1 | les seuils définitifs |
| 8 | **`poc.py`** | la vraie session ([poc-raspberry.md](poc-raspberry.md) §5.5) | la chaîne complète |
| 9 | *(option)* **Entraîner un modèle** | scikit-learn ou TensorFlow | si les règles ne suffisent pas |
