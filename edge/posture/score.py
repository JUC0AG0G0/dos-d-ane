"""Score d'une période : % du temps en bonne posture (algo-posture.md §7.4)."""

from collections import Counter

DUREE_RESUME = 300       # s : un résumé toutes les 5 min (audit §7.2)


class Resume:
    """Temps passé dans chaque état sur une période, et score = % du temps en bonne posture.

    Chaque image compte pour la durée jusqu'à l'image suivante : sinon les moments « en doute »
    (une image toutes les 2 s) pèseraient 5 fois plus que les moments calmes (toutes les 10 s).
    Le temps ignoré (image mal vue) et absent ne compte pas dans le score.
    """

    def __init__(self):
        self.secondes = Counter()      # vert, orange, rouge, ignore, absent
        self.bonne = 0.0               # secondes où l'image elle-même était bonne

    def ajouter(self, duree, etat, bonne=False):
        """etat : couleur du bocal, ou "ignore" / "absent" ; bonne : l'image était-elle bonne ?"""
        self.secondes[etat] += duree
        self.bonne += duree if bonne else 0.0

    def score(self):
        suivi = sum(self.secondes[c] for c in ("vert", "orange", "rouge"))
        return round(100 * self.bonne / suivi) if suivi else None
