"""Webcam : ouvrir, capturer une image fraîche (en mémoire uniquement)."""

import cv2


def ouvrir_camera(numero=0, largeur=640, hauteur=480):
    cam = cv2.VideoCapture(numero, cv2.CAP_V4L2)
    cam.set(cv2.CAP_PROP_FRAME_WIDTH, largeur)
    cam.set(cv2.CAP_PROP_FRAME_HEIGHT, hauteur)
    # Par défaut la webcam garde 4 images en réserve : après quelques secondes sans
    # lecture, elles sont périmées. Avec une réserve de 1, capturer() n'en jette qu'une.
    cam.set(cv2.CAP_PROP_BUFFERSIZE, 1)
    return cam


def capturer(cam):
    """Renvoie une image fraîche (en mémoire uniquement), ou None si la capture échoue."""
    cam.grab()                            # jette l'image en réserve, prise lors de la capture précédente
    ok, image = cam.read()                # attend une image fraîche
    # copy() : OpenCV peut réutiliser la même zone mémoire d'une capture à l'autre ; sans copie,
    # ce qu'on dessine sur l'image (textes de live.py) se retrouvait sur les images suivantes.
    return image.copy() if ok else None
