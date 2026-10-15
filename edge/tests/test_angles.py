"""Points → angles (algo-posture.md §4) et contrôles C2 / C3 (images ignorées)."""

import pytest

from posture.angles import ECART_EPAULES_MAX, angle_cou, angles, ecart_epaules
from tests.aide import personne


@pytest.mark.parametrize("tete, tronc, cou", [(90, 0, 10), (45, 0, 20), (70, 25, 5), (85, -35, 0), (60, 10, 50)])
def test_retrouve_les_angles(tete, tronc, cou):
    a = angles(personne(tete=tete, tronc=tronc, cou=cou), "gauche")
    assert a["tete"] == pytest.approx(tete, abs=0.5)
    assert a["tronc"] == pytest.approx(tronc, abs=0.5)
    assert a["cou"] == pytest.approx(cou, abs=0.5)
    assert a["tete_tronc"] == pytest.approx(90 + tete + tronc, abs=1)


@pytest.mark.parametrize("cote", ["gauche", "droite"])
@pytest.mark.parametrize("regard", ["gauche", "droite"])
def test_memes_angles_quel_que_soit_le_cote_de_la_camera(cote, regard):
    a = angles(personne(tete=55, tronc=12, cote=cote, regard=regard), cote)
    assert a["tete"] == pytest.approx(55, abs=0.5)
    assert a["tronc"] == pytest.approx(12, abs=0.5)


def test_sens_du_regard_sans_le_nez():
    pts = personne(tete=70, tronc=5, regard="gauche")
    pts[0, 2] = 0.05                                   # nez mal vu : sens déduit de l'oreille
    a = angles(pts, "gauche")
    assert a["tete"] == pytest.approx(70, abs=0.5)
    assert a["cou"] is None


@pytest.mark.parametrize("point", [3, 5, 11])          # oreille, épaule, hanche (côté gauche)
def test_point_mal_vu_image_ignoree(point):
    pts = personne()
    pts[point, 2] = 0.19
    assert angles(pts, "gauche") is None


def test_confiance_au_seuil_acceptee():
    pts = personne(conf=0.2)
    assert angles(pts, "gauche") is not None


def test_de_face_image_ignoree():
    assert angles(personne(ecart=0.8), "gauche") is None
    assert angles(personne(ecart=ECART_EPAULES_MAX + 0.01), "gauche") is None
    assert angles(personne(ecart=ECART_EPAULES_MAX - 0.01), "gauche") is not None


def test_epaule_cote_mur_cachee_reste_valable():
    pts = personne()
    pts[6, 2] = 0.05                                   # épaule droite cachée : écart non mesurable
    assert ecart_epaules(pts, "gauche") is None
    assert angles(pts, "gauche")["ecart_epaules"] is None


def test_ecart_epaules_relatif_au_tronc():
    assert ecart_epaules(personne(ecart=0.3), "gauche") == pytest.approx(0.3, abs=0.01)
    assert ecart_epaules(personne(ecart=0.3, longueur_tronc=100), "gauche") == pytest.approx(0.3, abs=0.01)


def test_angle_cou_positif_quand_on_regarde_vers_le_bas():
    assert angle_cou(personne(cou=55), "gauche") == pytest.approx(55, abs=0.5)
    assert angle_cou(personne(cou=-10), "gauche") == pytest.approx(-10, abs=0.5)


@pytest.mark.parametrize("fantome", [dict(tete=-55, tronc=40), dict(tete=40, tronc=-77),
                                     dict(tete=98, tronc=0, longueur_tronc=36)])
def test_angles_impossibles_ignores(fantome):
    # 14/10, caméra devant une chaise vide : MoveNet place quand même un corps, aux angles absurdes
    assert angles(personne(**fantome), "gauche") is None


def test_angles_extremes_mais_possibles_gardes():
    # bornes des 13 519 images réelles du 12–14/10 : tête 2°, tronc −56° et +46°, tronc de 108 px
    for p in (dict(tete=2), dict(tronc=-56), dict(tronc=46), dict(longueur_tronc=108)):
        assert angles(personne(**p), "gauche") is not None
