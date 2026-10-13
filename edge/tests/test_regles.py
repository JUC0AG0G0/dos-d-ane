"""Angles → postures, avec les seuils fixes (algo-posture.md, « Les règles en une page »)."""

import pytest

from posture.regles import SEUILS, postures, reference


def mauvaises(tete=80, tronc=0, cou=15):
    """Noms des règles qui s'allument pour ces angles."""
    return {nom for nom, (mauvaise, _) in postures({"tete": tete, "tronc": tronc, "cou": cou}).items() if mauvaise}


def test_seuils_valides_en_t5():
    assert SEUILS == {"tete": 50, "tronc": 20, "allonge": -30, "cou": 42}


def test_bonne_posture():
    assert mauvaises() == set()


@pytest.mark.parametrize("tronc", [-12, -18, -24, 0])      # calé au dossier ou droit : deux postures normales
def test_cale_au_dossier_ou_droit_reste_bon(tronc):
    assert mauvaises(tronc=tronc) == set()


def test_tete_en_avant():
    assert mauvaises(tete=45) == {"Tete en avant"}


def test_dos_penche():
    assert mauvaises(tronc=25) == {"Dos penche"}


def test_cou_penche():
    assert mauvaises(cou=50) == {"Cou penche"}


def test_allonge():
    assert mauvaises(tronc=-35) == {"Allonge dans la chaise"}


def test_une_seule_cause_vers_l_avant_dos_d_abord():
    assert mauvaises(tete=40, tronc=25, cou=55) == {"Dos penche"}


def test_cou_avant_tete():
    # regarder son téléphone baisse aussi l'angle de la tête : c'est le cou qui est annoncé
    assert mauvaises(tete=45, cou=55) == {"Cou penche"}


def test_allonge_et_tete_en_avant_ensemble():
    # deux bocaux différents : une image peut être mauvaise dans les deux
    assert mauvaises(tete=45, tronc=-35) == {"Tete en avant", "Allonge dans la chaise"}


@pytest.mark.parametrize("tete, tronc, cou", [(50, 0, 15), (80, 20, 15), (80, 0, 42), (80, -30, 15)])
def test_seuils_stricts(tete, tronc, cou):
    assert mauvaises(tete=tete, tronc=tronc, cou=cou) == set()


def test_cou_inconnu():
    assert postures({"tete": 80, "tronc": 0, "cou": None})["Cou penche"][0] is False
    assert postures({"tete": 80, "tronc": 0})["Cou penche"][0] is False


def test_autres_seuils():
    a = {"tete": 47, "tronc": 0, "cou": 15}
    assert postures(a)["Tete en avant"][0]
    assert not postures(a, {**SEUILS, "tete": 45})["Tete en avant"][0]


def test_reference_mediane():
    assert reference([]) is None
    ref = reference([{"tete": 60, "tronc": -10}, {"tete": 80, "tronc": 0}, {"tete": 70, "tronc": 50}])
    assert ref == {"tete": 70, "tronc": 0}
