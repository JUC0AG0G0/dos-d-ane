"""Cœur du POC edge, commun à poc.py (la vraie session), live.py (debug), outils/ et tests/.

Aucune image n'est jamais écrite : elles n'existent qu'en mémoire.

    chemins   dossiers du projet (modèles, résultats)
    camera    ouvrir la webcam, capturer une image fraîche
    movenet   image → 17 points (x, y, confiance)
    points    côté vu, point mal vu complété, personne présente
    angles    points → angles tête, tronc, cou (contrôle « de profil » compris)
    regles    angles → postures (seuils fixes)
    filtre    bocal (fenêtre glissante → alertes), temps assis
    score     résumé d'une période (% du temps en bonne posture)
    mesures   une ligne de CSV par image (jamais d'image)
    pi        température et ralentissement du Raspberry Pi

Seuls camera et movenet ont besoin d'OpenCV et de LiteRT : le reste (et les tests) ne demande que NumPy.
"""
