# Présentation aux encadrants — trame

> Support pour présenter l'avancement, la démarche de recherche et la solution MVP.
> Durée visée : **10 minutes**, puis questions. Le contenu de référence est dans [solution-mvp.md](solution-mvp.md).

**Message à faire passer :** *nous avons une solution claire et réaliste, centrée sur le Raspberry Pi, qui respecte la vie privée. Chaque choix technique est une hypothèse que nous allons tester, avec des critères définis à l'avance.*

---

## Slide 1 — Le problème · *1 min*

**À afficher :** une photo ou un dessin d'une personne avachie devant son écran + la problématique.

**À dire :**
- Le travail assis provoque des postures qu'on ne remarque pas : tête en avant, dos penché.
- Le sujet demande de les détecter, de proposer des conseils et des exercices, sans porter atteinte à la vie privée.
- Notre question : *peut-on détecter ces postures de façon fiable avec une caméra et un Raspberry Pi, sans jamais envoyer ni stocker d'image ?*

---

## Slide 2 — Notre solution en une phrase · *1 min 30*

**À afficher :** [schéma MVP](images/schema-mvp.png), partie haute.

**À dire :**
- *« La caméra voit la personne, le Raspberry transforme l'image en chiffres grâce à une IA, l'image est effacée, et seuls les résultats partent au serveur. »*
- La zone verte est la **zone privée** : l'image n'en sort jamais.
- Le serveur ne reçoit que des chiffres. L'app mobile et le site web affichent les résultats et les conseils.

---

## Slide 3 — Ce que fait le Raspberry · *1 min 30*

**À afficher :** les 5 étapes du schéma (capture → points du corps → angles → règles → résultat), puis le tableau des 4 postures du §4 de [solution-mvp.md](solution-mvp.md).

**À dire :**
- *« Le Raspberry regarde régulièrement, mais il n'enregistre rien : l'image est effacée tout de suite, et on n'envoie un résultat que si une mauvaise posture dure. »*
- **Cadence adaptative** : une capture toutes les 10 s quand tout va bien, toutes les 2 s en cas de doute, toutes les 30 s si personne n'est là. Pas de vidéo, car une posture dure des minutes. C'est la **sobriété** demandée par le sujet.
- L'IA (MoveNet, déjà entraînée) repère 17 points du corps. **Elle ne juge pas la posture** : c'est notre logique qui le fait, avec des angles et des règles.
- Caméra **de profil**, car c'est la vue où l'on voit la tête avancer et le dos se pencher.
- **4 postures** : tête en avant, dos penché en avant, avachi en arrière, immobilité prolongée (suggestion de pause).

---

## Slide 4 — Le parcours utilisateur · *1 min*

**À afficher :** les 6 étapes du §3 de [solution-mvp.md](solution-mvp.md), ou une maquette de l'app.

**À dire :**
- Connexion → « Démarrer » → on travaille → « Terminer » → résumé, score, exercices.
- Avec un seul Raspberry dans le MVP, la connexion suffit à savoir qui est au poste. Avec plusieurs postes, on ajoutera un poste attribué ou un QR code.
- Le Raspberry **n'analyse que pendant une session** démarrée par l'utilisateur : c'est notre base de consentement.
- L'app rappelle qu'elle **ne remplace pas un professionnel de santé**.

---

## Slide 5 — Nos choix et pourquoi · *1 min 30*

**À afficher :** le tableau du §7 de [solution-mvp.md](solution-mvp.md), réduit à 4 lignes.

| Choix | Pourquoi |
|---|---|
| IA sur le Raspberry | l'image ne quitte jamais le poste |
| Caméra plutôt que capteurs portés | rien à porter sur soi |
| MoveNet | léger, conçu pour les petits appareils — **à comparer avec MediaPipe** |
| Peu de captures, cadence adaptative | sobriété : la posture change lentement |

**À dire :**
- Le schéma du sujet envoie les photos au serveur. Nous avons choisi l'inverse, en nous appuyant sur les règles RGPD du sujet lui-même : *favoriser les traitements sans transfert*, *ne pas stocker la donnée brute inutile*.
- Les seuils d'angles partent d'une méthode d'ergonomie reconnue (**RULA**) et seront ajustés par nos tests.

---

## Slide 6 — Démarche de recherche : nos hypothèses à tester · *2 min*

**À afficher :** le tableau des tests T1–T7 du §8 de [solution-mvp.md](solution-mvp.md).

**À dire :**
- Nous ne considérons aucun choix comme acquis : **chaque choix est une hypothèse**, avec un test et un critère de réussite fixés **avant** de tester.
- Exemples :
  - *T1* : l'IA tourne-t-elle sur le Pi 4 en moins de 150 ms par photo ?
  - *T3* : voit-elle bien une personne assise de profil ?
  - *T5* : nos règles reconnaissent-elles chacune des 4 postures, avec au moins 80 % de bonnes détections ?
  - *T7* : la cadence adaptative détecte-t-elle aussi bien qu'une cadence fixe, avec beaucoup moins de captures ?
- Si un test échoue, nous avons un **plan B** : MediaPipe, Arducam CSI à la place de la webcam USB, captures moins fréquentes.
- Les résultats, y compris les échecs, iront dans le rapport : c'est notre partie « blocages et solutions ».

---

## Slide 7 — Méthode : PC d'abord, puis Raspberry · *1 min*

**À afficher :** le bandeau du bas du [schéma MVP](images/schema-mvp.png) (étapes 1 → 2 → 3).

**À dire :**
- **Étape 1 :** on valide l'IA sur PC avec une webcam placée de profil.
- **Étape 2 :** on passe sur le Raspberry avec **la même webcam USB et le même code**. Si un problème apparaît, on sait qu'il vient du matériel, pas de l'algorithme. L'Arducam CSI est testée en alternative (T2).
- **Étape 3 :** on branche le serveur et les apps pour la démo complète.

---

## Slide 8 — Avancement et prochaines étapes · *1 min*

**À afficher :** le tableau du §9 de [solution-mvp.md](solution-mvp.md).

**À dire :**
- **Fait :**
  - analyse du sujet ;
  - choix d'architecture et audit technique ;
  - squelette du code : serveur, site, app mobile, programme du Raspberry, déploiement automatique ;
  - schémas.
- **Prochaine étape :** T1 et T2, l'installation de l'IA et de la caméra sur le Raspberry. C'est le risque principal, nous le traitons en premier.
- Ensuite : tests de MoveNet sur PC, calcul des angles et premières règles.

---

## Slide 9 — Ce qui viendra après le MVP · *30 s*

**À afficher :** la colonne « Plus tard » du §6 de [solution-mvp.md](solution-mvp.md).

**À dire :**
- Deuxième caméra de face, squelette animé en direct dans l'app, notifications, outil d'annotation, IA de classification entraînée sur nos propres données.
- **Le MVP reste volontairement petit** pour être fiable et démontrable.

---

## Questions probables des encadrants

| Question | Réponse courte |
|---|---|
| *Où est l'IA, si vous utilisez une IA déjà entraînée ?* | MoveNet fournit les points du corps. Notre travail d'IA porte sur : le **benchmark** MoveNet / MediaPipe sur notre cas réel, la **validation** des règles (précision, fausses alertes) et, ensuite, un **classifieur entraîné** sur nos propres données annotées pour remplacer les règles. |
| *Pourquoi pas envoyer les images au serveur, comme sur le schéma du sujet ?* | Le sujet lui-même demande de favoriser les traitements sans transfert et de ne pas stocker la donnée brute. Le Raspberry suffit pour le calcul : l'envoi d'images n'apporte rien et crée un risque. |
| *Vos seuils, d'où viennent-ils ?* | D'une méthode d'ergonomie publiée (RULA, 1993), puis ajustés par nos tests T5 et par une posture de référence propre à chaque personne. |
| *Et si le Raspberry est trop lent ?* | Test T1 en premier. Plans B : photos moins fréquentes, autre moteur IA, ou un mini-PC à la place. L'architecture ne change pas. |
| *Pourquoi une webcam USB et pas la caméra Raspberry (Arducam) ?* | Avec la webcam, c'est le même code sur PC et sur Pi, le câble est long (placement de profil facile) et on n'a rien à configurer. L'Arducam CSI est comparée dans le test T2 ; le programme accepte les deux. |
| *Comment savez-vous qui est devant la caméra ?* | L'utilisateur se connecte et démarre lui-même la session. Avec un seul Raspberry, la session lui est rattachée directement. Avec plusieurs postes partagés, on ajoutera un QR code par poste. Pas de reconnaissance faciale. |
| *Comment prouvez-vous qu'aucune image ne sort ?* | Test T6 : capture du trafic réseau pendant l'analyse. Nous pourrons la montrer en démo. |
| *Pourquoi 4 postures, pas plus ?* | Ce sont celles qu'une caméra de profil mesure de façon fiable. Rien ne nous limite : chaque posture ajoutée demande un angle, un seuil justifié et des tests. Nous en ajouterons une à la fois une fois les premières validées (cou penché vers le bas, puis coudes). Les postures vues de face (épaules inclinées) viendront avec une 2ᵉ vue. |
| *Vous prenez une photo en continu ?* | Non : une capture toutes les 2 à 30 s selon la situation. L'image est analysée puis effacée aussitôt. Rien n'est enregistré, et on n'envoie un résultat que si une mauvaise posture dure. |
| *Les données sont-elles anonymes ?* | Elles sont **pseudonymisées** : un identifiant à la place du nom. L'admin ne voit que des statistiques globales. |

---

## Conseils pour la présentation

- Commencer par le schéma : c'est lui qui fait comprendre la solution en 30 secondes.
- Répéter la phrase clé : *« l'image ne quitte jamais le Raspberry »*.
- Présenter les tests comme une **force** : la démarche est scientifique, avec des critères fixés à l'avance.
- Ne pas détailler la technique (API, base de données) sauf si on vous pose la question : l'audit v3 est là pour ça.
