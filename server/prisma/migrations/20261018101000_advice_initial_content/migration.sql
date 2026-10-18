-- Contenu initial des Conseils, repris des maquettes Figma : 6 réglages du
-- poste, 8 exercices, 5 zones de douleur et le message « Quand consulter ».
-- Migration de données : `prisma migrate deploy` ne la joue qu’une fois, au
-- déploiement de cette version. Ce que les admins modifient ou suppriment
-- ensuite est gardé aux déploiements suivants.
-- Les textes des réglages sont aussi dans server/src/advice/posture-tip-defaults.ts
-- (bouton « Rétablir les textes par défaut ») : les garder identiques.

INSERT INTO "postureTips" ("key", "position", "title", "shortText", "tutorialText", "sourceLabel", "sourceUrl") VALUES
    ('ecran', 1, 'Écran à hauteur des yeux', 'Le haut de l’écran au niveau des yeux ou un peu en dessous, à une longueur de bras (50 à 70 cm).', 'Le haut de l’écran arrive au niveau de vos yeux, ou un peu en dessous. Placez-le à une longueur de bras : bras tendu, vos doigts touchent presque l’écran. Avec un portable, surélevez-le et branchez un clavier.', 'INRS · Le travail sur écran', 'https://www.inrs.fr/risques/travail-ecran/prevention-risques.html'),
    ('dossier', 2, 'Dos appuyé', 'Le dossier soutient le bas du dos. L’assise n’appuie pas derrière les genoux.', 'Asseyez-vous au fond de la chaise pour que le dossier soutienne le creux du bas du dos. Réglez la profondeur d’assise pour garder deux à trois doigts entre le bord du siège et l’arrière des genoux.', 'INRS · Le travail sur écran', 'https://www.inrs.fr/risques/travail-ecran/prevention-risques.html'),
    ('pieds', 3, 'Pieds à plat', 'Pieds au sol ou sur un repose-pieds, cuisses à peu près horizontales.', 'Réglez la hauteur du siège pour poser les pieds à plat au sol, cuisses à peu près horizontales. Si vos pieds ne touchent pas le sol une fois le siège réglé pour le bureau, utilisez un repose-pieds.', 'INRS · Le travail sur écran', 'https://www.inrs.fr/risques/travail-ecran/prevention-risques.html'),
    ('clavier', 4, 'Coudes près du corps', 'Coudes vers 90°, avant-bras posés, clavier et souris proches.', 'Gardez les coudes près du corps, pliés à environ 90°, avant-bras posés sur le bureau ou les accoudoirs. Placez le clavier à 10 à 15 cm du bord du bureau et la souris juste à côté, pour ne pas tendre le bras.', 'INRS · Le travail sur écran', 'https://www.inrs.fr/risques/travail-ecran/prevention-risques.html'),
    ('lumiere', 5, 'Lumière sans reflet', 'Écran perpendiculaire aux fenêtres, sans lumière vive devant ou derrière vous.', 'Placez l’écran perpendiculaire aux fenêtres : ni lumière vive derrière l’écran, ni fenêtre dans votre dos qui se reflète dessus. Réglez la luminosité de l’écran sur celle de la pièce.', 'INRS · Le travail sur écran', 'https://www.inrs.fr/risques/travail-ecran/prevention-risques.html'),
    ('pauses', 6, 'Bouger toutes les heures', 'Changez de position et levez-vous quelques minutes : aucune posture n’est bonne trop longtemps.', 'Aucune posture n’est bonne si on la garde trop longtemps. Au moins toutes les heures, levez-vous et bougez quelques minutes : marchez, étirez-vous, allez chercher un verre d’eau.', 'Assurance Maladie · ameli.fr', 'https://www.ameli.fr/assure/sante/themes/tms');

INSERT INTO "exercises" ("title", "zone", "isPreventive", "isForPain", "durationSeconds", "posture", "precautions", "status") VALUES
    ('Rentrer le menton', 'nuque', true, true, 60, 'assis ou debout', 'Mouvement lent, sans forcer. Arrêtez s’il provoque une douleur ou un vertige.', 'published'),
    ('Rotations des épaules', 'epaules', true, false, 30, 'assis ou debout', 'Mouvement ample mais lent. Arrêtez s’il provoque une douleur.', 'published'),
    ('Étirement latéral du cou', 'nuque', true, true, 40, 'assis', 'La main accompagne le mouvement sans tirer. Arrêtez en cas de fourmillements dans le bras.', 'published'),
    ('Extension du dos debout', 'dos', true, false, 30, 'debout', 'Amplitude modérée. Arrêtez en cas de vertige ou de douleur qui descend dans une jambe.', 'published'),
    ('Rotation du buste assis', 'dos', false, true, 40, 'assis', 'Tournez sans à-coup et sans forcer en fin de mouvement.', 'published'),
    ('Étirement des poignets', 'poignets', true, true, 40, 'assis ou debout', 'Étirement léger, jamais douloureux. Consultez si des fourmillements apparaissent la nuit.', 'published'),
    ('Règle 20-20-20', 'yeux', true, false, 20, 'assis', 'Si vos yeux restent secs, rouges ou douloureux, parlez-en à un professionnel de santé.', 'published'),
    ('Montées sur la pointe des pieds', 'jambes', true, false, 30, 'debout', 'Gardez un appui pour l’équilibre.', 'draft');

INSERT INTO "exerciseSteps" ("exerciseId", "position", "text")
SELECT e."id", s."position", s."text"
FROM (VALUES
    ('Rentrer le menton', 1, 'Asseyez-vous droit, épaules relâchées, regard droit devant.'),
    ('Rentrer le menton', 2, 'Reculez doucement le menton, comme pour faire un double menton, sans baisser la tête.'),
    ('Rentrer le menton', 3, 'Tenez 5 secondes, puis relâchez.'),
    ('Rentrer le menton', 4, 'Répétez 10 fois, plusieurs fois par jour.'),
    ('Rotations des épaules', 1, 'Tenez-vous droit, bras relâchés le long du corps.'),
    ('Rotations des épaules', 2, 'Montez les épaules vers les oreilles, puis faites-les rouler vers l’arrière et vers le bas.'),
    ('Rotations des épaules', 3, 'Faites 10 cercles lents vers l’arrière.'),
    ('Rotations des épaules', 4, 'Faites ensuite 10 cercles vers l’avant.'),
    ('Étirement latéral du cou', 1, 'Asseyez-vous droit et tenez le bord de la chaise avec la main gauche.'),
    ('Étirement latéral du cou', 2, 'Inclinez doucement l’oreille droite vers l’épaule droite, sans tourner la tête.'),
    ('Étirement latéral du cou', 3, 'Tenez 15 à 20 secondes en respirant calmement.'),
    ('Étirement latéral du cou', 4, 'Revenez lentement au centre, puis faites l’autre côté.'),
    ('Extension du dos debout', 1, 'Debout, pieds écartés de la largeur du bassin.'),
    ('Extension du dos debout', 2, 'Placez les mains en bas du dos, doigts vers le bas.'),
    ('Extension du dos debout', 3, 'Penchez doucement le haut du corps vers l’arrière en regardant devant vous.'),
    ('Extension du dos debout', 4, 'Tenez 2 à 3 secondes, revenez, et répétez 5 fois.'),
    ('Rotation du buste assis', 1, 'Asseyez-vous au bord de la chaise, pieds à plat.'),
    ('Rotation du buste assis', 2, 'Croisez les bras sur la poitrine.'),
    ('Rotation du buste assis', 3, 'Tournez lentement le buste vers la droite, le bassin reste face au bureau.'),
    ('Rotation du buste assis', 4, 'Tenez 10 secondes, revenez au centre, puis tournez vers la gauche.'),
    ('Étirement des poignets', 1, 'Tendez le bras droit devant vous, paume vers le bas.'),
    ('Étirement des poignets', 2, 'Avec l’autre main, ramenez doucement les doigts vers vous.'),
    ('Étirement des poignets', 3, 'Tenez 15 secondes, puis recommencez paume vers le haut.'),
    ('Étirement des poignets', 4, 'Changez de main.'),
    ('Règle 20-20-20', 1, 'Toutes les 20 minutes, quittez l’écran des yeux.'),
    ('Règle 20-20-20', 2, 'Regardez un point éloigné d’au moins 6 mètres pendant 20 secondes.'),
    ('Règle 20-20-20', 3, 'Clignez plusieurs fois des yeux avant de reprendre.'),
    ('Montées sur la pointe des pieds', 1, 'Debout derrière votre chaise, mains posées sur le dossier.'),
    ('Montées sur la pointe des pieds', 2, 'Montez lentement sur la pointe des pieds.'),
    ('Montées sur la pointe des pieds', 3, 'Redescendez doucement les talons au sol.'),
    ('Montées sur la pointe des pieds', 4, 'Répétez 15 fois.')
) AS s ("title", "position", "text")
JOIN "exercises" e ON e."title" = s."title";

INSERT INTO "painZones" ("name", "position", "intro", "sourceLabel", "sourceUrl", "status") VALUES
    ('Nuque', 1, 'Une raideur de la nuque vient souvent d’une tête penchée vers l’écran pendant longtemps.', 'INRS · Travail sur écran', 'https://www.inrs.fr/risques/travail-ecran/prevention-risques.html', 'published'),
    ('Épaules', 2, 'Des épaules tendues viennent souvent d’un clavier ou d’une souris trop loin ou trop haut.', 'INRS · Travail sur écran', 'https://www.inrs.fr/risques/travail-ecran/prevention-risques.html', 'published'),
    ('Bas du dos', 3, 'Fréquente au bureau, cette douleur est le plus souvent bénigne et passe en quelques semaines.', 'HAS · Lombalgie commune, 2019', 'https://www.has-sante.fr/jcms/c_2961499/fr/prise-en-charge-du-patient-presentant-une-lombalgie-commune', 'published'),
    ('Poignets', 4, 'Une gêne aux poignets vient souvent d’un poignet plié vers le haut sur le clavier ou la souris.', 'INRS · Travail sur écran', 'https://www.inrs.fr/risques/travail-ecran/prevention-risques.html', 'published'),
    ('Yeux', 5, 'Devant un écran, on cligne moins des yeux : ils sèchent et se fatiguent.', 'Assurance Maladie · ameli.fr', 'https://www.ameli.fr/assure/sante/themes/secheresse-oculaire', 'draft');

INSERT INTO "painZoneAdvices" ("painZoneId", "kind", "position", "text")
SELECT z."id", a."kind", a."position", a."text"
FROM (VALUES
    ('Nuque', 'helps', 1, 'Remonter l’écran à hauteur des yeux.'),
    ('Nuque', 'helps', 2, 'Faire de petits mouvements lents du cou plusieurs fois par jour.'),
    ('Nuque', 'helps', 3, 'La chaleur peut détendre les muscles.'),
    ('Nuque', 'avoid', 1, 'Coincer le téléphone entre l’oreille et l’épaule.'),
    ('Nuque', 'avoid', 2, 'Rester la tête penchée sur un ordinateur portable.'),
    ('Épaules', 'helps', 1, 'Rapprocher clavier et souris pour garder les coudes près du corps.'),
    ('Épaules', 'helps', 2, 'Poser les avant-bras sur le bureau ou les accoudoirs.'),
    ('Épaules', 'helps', 3, 'Relâcher les épaules plusieurs fois par heure.'),
    ('Épaules', 'avoid', 1, 'Travailler le bras tendu vers la souris.'),
    ('Bas du dos', 'helps', 1, 'Rester actif : marcher et garder ses activités aide plus que le repos au lit.'),
    ('Bas du dos', 'helps', 2, 'Alterner assis et debout, se lever toutes les heures.'),
    ('Bas du dos', 'helps', 3, 'La chaleur peut soulager.'),
    ('Bas du dos', 'avoid', 1, 'Rester allongé plusieurs jours.'),
    ('Bas du dos', 'avoid', 2, 'Garder la même position plus d’une heure.'),
    ('Poignets', 'helps', 1, 'Garder le poignet dans l’axe de l’avant-bras.'),
    ('Poignets', 'helps', 2, 'Utiliser les raccourcis clavier pour moins cliquer.'),
    ('Poignets', 'helps', 3, 'Faire de courtes pauses pour relâcher les mains.'),
    ('Poignets', 'avoid', 1, 'Appuyer le poignet sur un bord dur du bureau.'),
    ('Yeux', 'helps', 1, 'Faire régulièrement des pauses en regardant au loin.'),
    ('Yeux', 'helps', 2, 'Régler la luminosité de l’écran sur celle de la pièce.'),
    ('Yeux', 'avoid', 1, 'Travailler face à une fenêtre ou avec un reflet sur l’écran.')
) AS a ("name", "kind", "position", "text")
JOIN "painZones" z ON z."name" = a."name";

INSERT INTO "painZoneExercises" ("painZoneId", "exerciseId", "position")
SELECT z."id", e."id", l."position"
FROM (VALUES
    ('Nuque', 'Rentrer le menton', 1),
    ('Nuque', 'Étirement latéral du cou', 2),
    ('Épaules', 'Rotations des épaules', 1),
    ('Bas du dos', 'Rotation du buste assis', 1),
    ('Bas du dos', 'Extension du dos debout', 2),
    ('Poignets', 'Étirement des poignets', 1),
    ('Yeux', 'Règle 20-20-20', 1)
) AS l ("zone", "title", "position")
JOIN "painZones" z ON z."name" = l."zone"
JOIN "exercises" e ON e."title" = l."title";

INSERT INTO "adviceSettings" ("key", "text") VALUES
    ('whenToSeeDoctor', 'Douleur qui dure plus de quelques semaines ou qui s’aggrave, qui descend dans un bras ou une jambe, fourmillements, perte de force, fièvre, ou douleur après une chute.');
