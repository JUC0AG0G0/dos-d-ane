"""Des angles aux postures : seuils fixes (algo-posture.md, « Les règles en une page »)."""

import numpy as np

# Seuils fixes, sans calibration. T5 du 12/10/2026, 4 volontaires : « tête < 50° ou tronc > 20° »
# repère la personne penchée vers l'écran (F1 0,82, 97 % d'alertes justes) ; la cause annoncée
# (dos penché si tronc > 20°, sinon tête en avant) est juste 66 à 85 % du temps, car tête et buste
# avancent souvent ensemble. Calibration écartée : chacun calibrait calé au dossier puis se
# redressait, et des écarts serrés à cette référence sonnaient à tort. « Allongé » = avachi
# prononcé seulement : à −30°, 0,8 % de fausses alertes, alors qu'un avachi léger (−20°)
# se confond avec « calé au dossier » (12 % de fausses alertes). « Cou penché » (regarder son
# téléphone) : le nez plonge sous l'oreille (+51° et +58° chez 2 personnes le 12/10, contre +5 à +33°
# en bonne posture et +13 à +43° tête en avant). 42° et non 45° : téléphone tenu plus haut (nez à +41–53°)
# vu à 91 % au lieu de 64 %, pour 0 à 4 % des images de bonne posture (essais du 12/10).
SEUILS = {"tete": 50, "tronc": 20, "allonge": -30, "cou": 42}

# Calibration : médiane des angles pendant les 2 premières minutes de travail normal. Écartée des
# alertes (voir SEUILS) et du score (% du temps en bonne posture, algo-posture.md §7.4) : ne sert plus
# qu'aux outils de mesure (live.py, enregistrer.py). Mesuré le 12/10/2026 : 10 s « tenez-vous droit »
# donnaient une référence jouée, trop haute ou trop basse.
DUREE_CALIBRATION = 120


def postures(a, seuils=SEUILS):
    """Règle d'alerte (algo-posture.md). Renvoie {posture: (mauvaise ?, règle appliquée)}.

    seuils : evaluer.py en essaie d'autres.
    """
    t, c, al, cp = seuils["tete"], seuils["tronc"], seuils["allonge"], seuils["cou"]
    # Une seule cause vers l'avant, par ordre : dos penché, puis cou penché, puis tête en avant
    # (regarder son téléphone baisse aussi l'angle de la tête).
    cou = a.get("cou") is not None and a["cou"] > cp and a["tronc"] <= c
    return {
        "Tete en avant": (a["tete"] < t and a["tronc"] <= c and not cou, f"tete < {t}"),
        "Dos penche": (a["tronc"] > c, f"tronc > {c}"),
        "Cou penche": (cou, f"cou > {cp}"),
        "Allonge dans la chaise": (a["tronc"] < al, f"tronc < {al}"),
    }


def reference(liste_angles):
    """Posture de référence = médiane des angles relevés pendant la calibration (None si aucun)."""
    if not liste_angles:
        return None
    return {"tete": float(np.median([a["tete"] for a in liste_angles])),
            "tronc": float(np.median([a["tronc"] for a in liste_angles]))}
