"""Filtre dans le temps (algo-posture.md ⑤) : bocal → alertes, temps assis.

Les instants sont en secondes ; une image toutes les 2 s (cadence « doute ») sauf mention contraire.
"""

import pytest

from posture.filtre import (ANTI_RAFALE, ASSIS_MAX, CONFIRMATION, FENETRE, PAUSE_MIN, TAUX_DOUTE, Bocal,
                            TempsAssis)

A = {"tete": 45.0, "tronc": 5.0}                   # angles joints à chaque bille (pour moyennes())
DOS, COU, TETE = "Dos penche", "Cou penche", "Tete en avant"


def remplir(bocal, debut, fin, cause, pas=2):
    """Ajoute une image toutes les `pas` s de debut (inclus) à fin (exclu). Renvoie [(instant, événement)]."""
    evenements, t = [], debut
    while t < fin:
        evenements += [(t, e) for e in bocal.ajouter(t, cause, A)]
        t += pas
    return evenements


def ignorer(bocal, debut, fin, pas=2):
    """Images ignorées ou personne absente : poc.py appelle seulement elaguer()."""
    evenements, t = [], debut
    while t < fin:
        evenements += [(t, e) for e in bocal.elaguer(t)]
        t += pas
    return evenements


def alerte_dos():
    """Bocal avec une alerte « dos penché » déclenchée à t = CONFIRMATION, puis instant suivant."""
    b = Bocal()
    assert remplir(b, 0, CONFIRMATION + 2, DOS) == [(CONFIRMATION, ("debut", DOS))]
    return b, CONFIRMATION + 2


class TestDebutAlerte:
    def test_alerte_apres_2_min_de_mauvaise_posture(self):
        b = Bocal()
        assert remplir(b, 0, CONFIRMATION, DOS) == []         # pas avant la confirmation
        assert b.ajouter(CONFIRMATION, DOS, A) == [("debut", DOS)]
        assert b.alerte == DOS

    def test_geste_bref_ne_declenche_rien(self):
        b = Bocal()
        ev = remplir(b, 0, 60, None, pas=10)
        ev += remplir(b, 60, 66, DOS)                          # boire son café : 3 images penchées
        ev += remplir(b, 66, 600, None)
        assert ev == [] and b.alerte is None

    def test_posture_hesitante_sous_70_ne_declenche_rien(self):
        b = Bocal()
        ev, t = [], 0
        while t < 600:                                          # 1 bonne sur 2 : 50 %
            ev += b.ajouter(t, DOS if t % 4 == 0 else None, A)
            t += 2
        assert ev == []

    def test_compte_repart_si_le_taux_retombe(self):
        b = Bocal()
        presque = CONFIRMATION - 20
        assert remplir(b, 0, presque, DOS) == []
        remplir(b, presque, presque + 60, None)                 # taux < 70 % : on repart de zéro
        ev = remplir(b, presque + 60, presque + 400, DOS)
        assert ev and ev[0][0] >= presque + 60 + CONFIRMATION

    def test_images_ignorees_ne_comptent_pas(self):
        b = Bocal()
        ev, t = [], 0
        while t <= CONFIRMATION:                                # une image sur deux ignorée
            ev += b.ajouter(t, DOS, A) if t % 4 == 0 else b.elaguer(t)
            t += 2
        assert ev == [("debut", DOS)]


class TestFinAlerte:
    def test_fin_sous_40(self):
        b, t = alerte_dos()
        ev = remplir(b, t, t + FENETRE, None)
        assert [e for _, e in ev] == [("fin", DOS)]
        assert b.alerte is None

    def test_hysteresis_pas_de_fin_a_50(self):
        b, t = alerte_dos()
        ev, fin = [], t + 600
        while t < fin:                                          # 50 % : entre 40 et 70
            ev += b.ajouter(t, DOS if t % 4 == 0 else None, A)
            t += 2
        assert ev == [] and b.alerte == DOS


class TestCause:
    def test_regroupement_en_une_alerte(self):
        # tête 60 % + cou 40 % : aucune des deux n'atteint 70 %, mais ensemble c'est 100 %
        b = Bocal(regroupement={TETE: "Tete ou cou", COU: "Tete ou cou"})
        ev, t = [], 0
        while not ev:
            ev = b.ajouter(t, TETE if t % 10 < 6 else COU, A)
            t += 2
        assert ev == [("debut", "Tete ou cou")]
        assert b.detail() == {TETE: 60, COU: 40}

    def test_cause_la_plus_frequente(self):
        b = Bocal()
        ev, t = [], 0
        while not ev:
            ev = b.ajouter(t, DOS if t % 10 < 6 else COU, A)
            t += 2
        assert ev == [("debut", DOS)]

    def test_changement_de_nom_apres_une_confirmation(self):
        b, t = alerte_dos()
        ev = remplir(b, t, t + 400, COU)                        # dos penché, puis téléphone
        assert [e for _, e in ev] == [("fin", DOS), ("debut", COU)]
        # le cou devient majoritaire après ~30 s, puis doit le rester pendant toute une confirmation
        assert ev[0][0] >= t + CONFIRMATION
        assert ev[0][0] == ev[1][0]

    def test_pas_de_changement_de_nom_si_bref(self):
        b, t = alerte_dos()
        ev = remplir(b, t, t + CONFIRMATION // 2, COU)          # cou majoritaire moins qu'une confirmation
        ev += remplir(b, t + CONFIRMATION // 2, t + 300, DOS)
        assert ev == [] and b.alerte == DOS


class TestAntiRafale:
    def test_meme_cause_pas_avant_10_min(self):
        b, t = alerte_dos()
        (t_fin, _), = remplir(b, t, t + FENETRE, None)
        ev = remplir(b, t + FENETRE, t_fin + ANTI_RAFALE + 60, DOS)
        assert [e for _, e in ev] == [("debut", DOS)]
        assert ev[0][0] >= t_fin + ANTI_RAFALE

    def test_autre_cause_signalee_tout_de_suite(self):
        b, t = alerte_dos()
        remplir(b, t, t + FENETRE, None)
        ev = remplir(b, t + FENETRE, t + FENETRE + 300, COU)
        assert [e for _, e in ev] == [("debut", COU)]
        # 70 % atteint après ~42 s (le bocal se vide de ses images bonnes), puis la confirmation
        assert ev[0][0] < t + FENETRE + 60 + CONFIRMATION


class TestFenetreVide:
    def test_pas_d_alerte_au_retour_d_une_absence(self):
        # penché 30 s, part 3 min, se rassoit (une image penchée en s'asseyant) : pas d'alerte
        b = Bocal()
        remplir(b, 0, 30, DOS)
        assert ignorer(b, 30, 210, pas=30) == []
        assert b.ajouter(210, DOS, A) == []
        assert b.depuis == 210

    def test_alerte_terminee_pendant_l_absence(self):
        b, t = alerte_dos()
        ev = ignorer(b, t, t + 1200, pas=30)
        assert [e for _, e in ev] == [("fin", DOS)]
        assert ev[0][0] - t <= FENETRE + 30                    # au plus ~1 min 30 après le départ
        assert b.moyennes() is None

    def test_absence_courte_ne_coupe_pas(self):
        b, t = alerte_dos()
        assert ignorer(b, t, t + 30) == []
        assert b.alerte == DOS


class TestEtat:
    def test_couleurs(self):
        b = Bocal()
        assert b.couleur() == "vert"
        remplir(b, 0, 20, None)
        remplir(b, 20, 40, DOS)                                 # 50 %
        assert b.couleur() == "orange"
        remplir(b, 40, 200, DOS)
        assert b.couleur() == "rouge"

    def test_une_image_mauvaise_isolee_ne_fait_pas_passer_a_2_s(self):
        # 13/10 : des images isolées (cou à 43°) gardaient la cadence à 2 s 82 % du temps
        b = Bocal()
        remplir(b, 0, 50, None, pas=10)
        b.ajouter(50, COU, A)                                   # 1 sur 6 = 17 %
        assert not b.en_doute()

    def test_deux_images_mauvaises_sur_six_font_passer_a_2_s(self):
        b = Bocal()
        remplir(b, 0, 40, None, pas=10)
        b.ajouter(40, COU, A)
        b.ajouter(50, COU, A)                                   # 2 sur 6 = 33 %
        assert b.en_doute()

    def test_retour_a_10_s_quand_le_taux_retombe(self):
        b = Bocal()
        remplir(b, 0, 20, DOS)
        assert b.en_doute()
        remplir(b, 20, 20 + FENETRE, None)
        assert not b.en_doute()

    def test_seuil_de_doute_inclus(self):
        b = Bocal()
        remplir(b, 0, 8, None)
        b.ajouter(8, DOS, A)                                    # 1 sur 5 = 20 %
        assert b.taux() == pytest.approx(TAUX_DOUTE)
        assert b.en_doute()

    def test_moyennes_des_images_mauvaises(self):
        b = Bocal()
        b.ajouter(0, None, {"tete": 90.0, "tronc": 0.0})
        b.ajouter(2, DOS, {"tete": 60.0, "tronc": 30.0})
        b.ajouter(4, DOS, {"tete": 50.0, "tronc": 26.0})
        assert b.moyennes() == {"tete": 55.0, "tronc": 28.0}


class TestTempsAssis:
    def test_alerte_apres_50_min(self):
        s = TempsAssis()
        phases = [(t, s.maj(t, True)) for t in range(0, ASSIS_MAX + 10, 10)]
        assert [p for p in phases if p[1]] == [(ASSIS_MAX, "debut")]

    def test_absence_courte_ne_remet_pas_a_zero(self):
        s = TempsAssis()
        for t in range(0, 600, 10):
            s.maj(t, True)                                      # dernière image vue : 590 s
        retour = 590 + PAUSE_MIN - 10                           # l'absence se compte depuis 590 s
        for t in range(600, retour, 10):
            s.maj(t, False)
        s.maj(retour, True)
        assert s.duree(retour) == pytest.approx(retour)

    def test_absence_d_une_minute_remet_a_zero(self):
        s = TempsAssis()
        for t in range(0, 600, 10):
            s.maj(t, True)
        s.maj(590 + PAUSE_MIN, True)
        assert s.duree(590 + PAUSE_MIN) == 0

    def test_pause_d_une_minute_termine_l_alerte_et_remet_a_zero(self):
        s = TempsAssis()
        for t in range(0, ASSIS_MAX + 10, 10):
            s.maj(t, True)
        fin = ASSIS_MAX + PAUSE_MIN + 30
        phases = [s.maj(t, False) for t in range(ASSIS_MAX + 30, fin, 30)]
        assert phases.count("fin") == 1
        assert s.maj(fin, True) is None
        assert s.duree(fin) == 0
