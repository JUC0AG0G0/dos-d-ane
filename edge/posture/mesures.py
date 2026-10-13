"""Enregistrement des mesures : une ligne de chiffres par image, jamais d'image."""

from datetime import datetime

from posture.points import COTES
from posture.regles import postures

COLONNES_CSV = (["heure", "etiquette", "cote", "conf_oreille", "conf_epaule", "conf_hanche", "tete", "tronc",
                 "tete_tronc", "cou", "ecart_epaules", "longueur_tronc", "calibre", "ref_tete", "ref_tronc",
                 "regle_tete_avant", "regle_dos_penche", "regle_cou", "regle_allonge", "point_complete"]
                + [f"{c}{i}" for i in range(17) for c in ("x", "y", "c")])


def ligne_csv(etiquette, pts, cote, a, ref, complete=None):
    """Une ligne de chiffres par image (colonnes COLONNES_CSV) ; angles vides si l'image est ignorée.

    pts : points bruts de MoveNet (confiances réelles) ; complete : point repris de l'image d'avant.
    """
    o, e, h = COTES[cote]
    regles = [int(m) for m, _ in postures(a).values()] if a else ["", "", "", ""]
    valeurs = ([a[k] for k in ("tete", "tronc", "tete_tronc")] + [a["cou"] if a["cou"] is not None else ""]
               if a else ["", "", "", ""]) \
        + [a["ecart_epaules"] if a and a["ecart_epaules"] is not None else "", a["longueur_tronc"] if a else ""]
    return ([datetime.now().isoformat(timespec="milliseconds"), etiquette, cote,
             f"{pts[o, 2]:.3f}", f"{pts[e, 2]:.3f}", f"{pts[h, 2]:.3f}"]
            + [f"{v:.2f}" if isinstance(v, float) else v for v in valeurs]
            + [int(ref is not None)] + ([f"{ref['tete']:.2f}", f"{ref['tronc']:.2f}"] if ref else ["", ""])
            + regles + [complete or ""]
            + [f"{v:.3f}" for v in pts.reshape(-1)])
