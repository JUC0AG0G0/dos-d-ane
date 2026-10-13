"""MoveNet (LiteRT) : image → 17 points du corps."""

import cv2
import numpy as np
from ai_edge_litert.interpreter import Interpreter

from posture.chemins import DOSSIER_MODELES

# Thunder plutôt que Lightning : mesuré le 12/10/2026 (T4), tête 2,9° d'écart-type au lieu de 4,9°,
# hanche bien mieux vue (confiance 0,62 au lieu de 0,34), pour 70 ms par image au lieu de 27 ms.
MODELE_PAR_DEFAUT = DOSSIER_MODELES / "movenet_thunder_int8.tflite"


class MoveNet:
    def __init__(self, chemin=MODELE_PAR_DEFAUT, threads=4):
        self.modele = Interpreter(model_path=str(chemin), num_threads=threads)
        self.modele.allocate_tensors()
        self.entree = self.modele.get_input_details()[0]
        self.sortie = self.modele.get_output_details()[0]
        self.taille = int(self.entree["shape"][1])         # 192 (Lightning) ou 256 (Thunder)

    def points(self, image_bgr):
        """Renvoie 17 points (x, y en pixels, confiance entre 0 et 1)."""
        h, w = image_bgr.shape[:2]
        cote = max(h, w)                                   # on complète en carré
        carre = np.zeros((cote, cote, 3), dtype=np.uint8)  # pour ne pas déformer
        haut, gauche = (cote - h) // 2, (cote - w) // 2    # la personne
        carre[haut:haut + h, gauche:gauche + w] = image_bgr
        rgb = cv2.cvtColor(carre, cv2.COLOR_BGR2RGB)
        x = cv2.resize(rgb, (self.taille, self.taille))[np.newaxis].astype(self.entree["dtype"])
        self.modele.set_tensor(self.entree["index"], x)
        self.modele.invoke()
        res = self.modele.get_tensor(self.sortie["index"])[0, 0]   # 17 × (y, x, score)
        pts = np.empty((17, 3), dtype=np.float32)
        pts[:, 0] = res[:, 1] * cote - gauche              # x en pixels
        pts[:, 1] = res[:, 0] * cote - haut                # y en pixels
        pts[:, 2] = res[:, 2]                              # confiance
        return pts
