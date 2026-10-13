"""Score d'une période (algo-posture.md §7.4) et format des mesures CSV."""

import pytest

from posture.mesures import COLONNES_CSV, ligne_csv
from posture.score import Resume
from tests.aide import personne
from posture.angles import angles


def test_score_pondere_par_le_temps():
    r = Resume()
    r.ajouter(10, "vert", bonne=True)          # une image calme compte pour 10 s
    for _ in range(5):
        r.ajouter(2, "orange", bonne=False)    # 5 images « en doute » comptent pour 10 s au total
    assert r.score() == 50


def test_ignore_et_absent_hors_score():
    r = Resume()
    r.ajouter(30, "vert", bonne=True)
    r.ajouter(10, "rouge", bonne=False)
    r.ajouter(500, "ignore")
    r.ajouter(900, "absent")
    assert r.score() == 75
    assert r.secondes["ignore"] == 500 and r.secondes["absent"] == 900


def test_pas_de_score_sans_temps_suivi():
    r = Resume()
    assert r.score() is None
    r.ajouter(60, "absent")
    assert r.score() is None


def test_image_bonne_dans_un_bocal_orange():
    # le score suit l'image elle-même, pas la couleur du bocal
    r = Resume()
    r.ajouter(10, "orange", bonne=True)
    assert r.score() == 100


@pytest.mark.parametrize("ignoree", [False, True])
def test_ligne_csv_complete(ignoree):
    pts = personne()
    a = None if ignoree else angles(pts, "gauche")
    ligne = ligne_csv("SESSION", pts, "gauche", a, None, None)
    assert len(ligne) == len(COLONNES_CSV)
    colonne = dict(zip(COLONNES_CSV, ligne))
    assert (colonne["tete"] == "") == ignoree
    assert colonne["calibre"] == 0
