"""Filtre dans le temps (algo-posture.md ⑤) : bocal → alertes, et temps assis sans pause."""

import math
from collections import Counter, deque

import numpy as np

FENETRE = 60             # s : verdicts gardés dans le bocal
TAUX_ALERTE = 0.70       # début d'alerte…
# s : … si le taux reste au-dessus pendant ce temps. 1 min : au-delà, RULA compte une posture comme
# statique. Rejoué le 13/10 sur une session de 67 min : mêmes alertes qu'à 2 min, 1 min plus tôt, aucune en plus.
CONFIRMATION = 60
TAUX_FIN = 0.40          # fin d'alerte (l'écart 70 / 40 évite une alerte qui clignote)
TAUX_DOUTE = 0.20        # cadence de 2 s à partir de ce taux (à 10 s : 2 images mauvaises sur 6)
ANTI_RAFALE = 600        # s après la fin d'une alerte avant une nouvelle alerte de la même cause
# « Levez-vous » : temps assis sans pause. La règle de la doc (points presque immobiles, < 0,02 du
# tronc) ne peut pas marcher : mesuré le 12/10, les points tremblent de 0,025 d'une image à l'autre
# en travail normal. Une pause = la personne quitte le champ de la caméra au moins PAUSE_MIN.
ASSIS_MAX = 50 * 60      # s
PAUSE_MIN = 60           # s


class Bocal:
    """Fenêtre glissante des verdicts d'une famille de postures (algo-posture.md ⑤, « le bocal »).

    Une image bonne donne une bille sans cause, une image mauvaise une bille avec sa cause ; une
    image ignorée ne donne pas de bille. L'alerte porte le nom de la cause la plus fréquente ; si
    une autre cause devient la plus fréquente, avec au moins 70 % d'images mauvaises, pendant toute
    une confirmation, l'alerte change de nom (fin de l'ancienne, début de la nouvelle).
    regroupement : {cause: nom d'alerte} pour donner un seul nom à des causes que la caméra confond.
    """

    def __init__(self, fenetre=FENETRE, confirmation=CONFIRMATION, anti_rafale=ANTI_RAFALE, regroupement=None):
        self.fenetre, self.confirmation, self.anti_rafale = fenetre, confirmation, anti_rafale
        self.regroupement = regroupement or {}
        self.billes = deque()          # (instant, cause ou None, angles)
        self.depuis = None             # instant où le taux a passé TAUX_ALERTE
        self.alerte = None             # cause de l'alerte en cours
        self.autre = None              # (cause devenue la plus fréquente pendant l'alerte, depuis quand)
        self.fins = {}                 # cause → instant de la fin de sa dernière alerte

    def elaguer(self, instant):
        """Retire les billes trop vieilles. Renvoie les événements, comme ajouter().

        Fenêtre vide (personne absente, ou mal vue pendant toute la fenêtre) : on ne peut plus rien
        juger, donc le compte de la confirmation repart de zéro (sinon une seule image penchée en se
        rasseyant déclenchait l'alerte) et l'alerte en cours se termine (sinon elle restait ouverte
        pendant toute l'absence).
        """
        while self.billes and self.billes[0][0] <= instant - self.fenetre:
            self.billes.popleft()
        if self.billes:
            return []
        self.depuis = self.autre = None
        return self.terminer(instant) if self.alerte else []

    def terminer(self, instant):
        ancienne = self.alerte
        self.alerte = self.depuis = self.autre = None
        self.fins[ancienne] = instant
        return [("fin", ancienne)]

    def taux(self):
        return sum(c is not None for _, c, _ in self.billes) / len(self.billes) if self.billes else 0.0

    def couleur(self):
        return "rouge" if self.alerte else "orange" if self.taux() >= TAUX_FIN else "vert"

    def en_doute(self):
        """Au moins TAUX_DOUTE d'images mauvaises dans la fenêtre : la cadence passe à 2 s.

        Pas dès la première image mauvaise : le 13/10 (67 min), des images isolées (cou à 43°, tête à
        49°) gardaient la cadence à 2 s 82 % du temps sans jamais mener à une alerte. À 20 % : 57 %.
        """
        return self.taux() >= TAUX_DOUTE

    def detail(self):
        """Part de chaque cause (avant regroupement) parmi les images mauvaises, en %."""
        causes = Counter(c for _, c, _ in self.billes if c)
        return {c: round(100 * n / sum(causes.values())) for c, n in causes.most_common()}

    def moyennes(self):
        """Angles moyens des images mauvaises de la fenêtre (envoyés avec l'événement)."""
        mauvaises = [a for _, c, a in self.billes if c is not None] or [a for _, _, a in self.billes]
        if not mauvaises:
            return None                # fenêtre vide (alerte terminée pendant une absence)
        return {k: round(float(np.mean([a[k] for a in mauvaises])), 1) for k in ("tete", "tronc")}

    def ajouter(self, instant, cause, a):
        """Ajoute le verdict d'une image. Renvoie la liste des événements : ("debut" / "fin", cause)."""
        self.billes.append((instant, cause, a))
        self.elaguer(instant)
        taux = self.taux()
        noms = Counter(self.regroupement.get(c, c) for _, c, _ in self.billes if c)
        principale = noms.most_common(1)[0][0] if taux else None
        if self.alerte is None:
            if taux < TAUX_ALERTE:
                self.depuis = None
                return []
            if self.depuis is None:
                self.depuis = instant
            # anti-rafale par cause : un « cou penché » juste après un « dos penché » reste signalé
            if instant - self.depuis >= self.confirmation and self.anti_rafale_passe(principale, instant):
                self.alerte = principale
                return [("debut", principale)]
            return []
        if taux < TAUX_FIN:
            return self.terminer(instant)
        # Changement de nom : la nouvelle cause doit être la plus fréquente ET confirmée comme une
        # alerte (taux >= 70 %) pendant toute une confirmation. Sans le taux, le 13/10 à 16:17, une
        # personne déjà presque redressée a reçu « tête baissée » 12 s, et l'anti-rafale ainsi armé a
        # bloqué sa vraie tête baissée de 16:24 (2 min 30) : alerte ratée.
        if principale == self.alerte or taux < TAUX_ALERTE:
            self.autre = None
        elif self.autre is None or self.autre[0] != principale:
            self.autre = (principale, instant)
        elif instant - self.autre[1] >= self.confirmation and self.anti_rafale_passe(principale, instant):
            ancienne, self.alerte, self.autre = self.alerte, principale, None
            self.fins[ancienne] = instant
            return [("fin", ancienne), ("debut", principale)]
        return []

    def anti_rafale_passe(self, cause, instant):
        return instant - self.fins.get(cause, -math.inf) >= self.anti_rafale


class TempsAssis:
    """Temps passé devant la caméra sans pause ; une pause = absent au moins PAUSE_MIN."""

    def __init__(self, assis_max=ASSIS_MAX, pause_min=PAUSE_MIN):
        self.assis_max, self.pause_min = assis_max, pause_min
        self.debut = None              # début de la période assise en cours
        self.derniere_vue = None
        self.alerte = False

    def duree(self, instant):
        return instant - self.debut if self.debut is not None else 0.0

    def maj(self, instant, vue):
        """vue : quelqu'un est-il devant la caméra ? Renvoie "debut", "fin" ou None."""
        en_pause = self.derniere_vue is not None and instant - self.derniere_vue >= self.pause_min
        if not vue:
            if en_pause and self.alerte:
                self.alerte = False
                return "fin"               # elle s'est levée : l'alerte a été suivie
            return None
        if self.debut is None or en_pause:
            self.debut, self.alerte = instant, False
        self.derniere_vue = instant
        if not self.alerte and self.duree(instant) >= self.assis_max:
            self.alerte = True
            return "debut"
        return None
