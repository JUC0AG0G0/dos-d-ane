"""Contrôles C1 (côté stable) et C2 bis (un point complété), présence de la personne."""

import pytest

from posture.points import CONF_MIN, Completeur, CoteStable, Presence, points_nets
from tests.aide import personne


def mieux_vu(cote, conf_autre):
    """Personne vue du côté `cote`, l'autre côté avec la confiance conf_autre."""
    pts = personne(cote=cote, conf=0.6)
    autre = (4, 6, 12) if cote == "gauche" else (3, 5, 11)
    pts[list(autre), 2] = conf_autre
    return pts


def cote_choisi(cote):
    """CoteStable dont le choix de départ (IMAGES_CHOIX images) est fait, sur `cote`."""
    c = CoteStable()
    for _ in range(CoteStable.IMAGES_CHOIX):
        c.maj(mieux_vu(cote, 0.1))
    return c


class TestCoteStable:
    def test_choisit_le_cote_le_mieux_vu(self):
        assert CoteStable().maj(mieux_vu("droite", 0.1)) == "droite"

    def test_premiere_image_trompeuse_corrigee_pendant_le_choix(self):
        # 13/10 : la première image (personne qui s'installe) donnait le côté caché, gardé 36 min
        c = CoteStable()
        assert c.maj(mieux_vu("gauche", 0.1)) == "gauche"
        cotes = [c.maj(mieux_vu("droite", 0.5)) for _ in range(CoteStable.IMAGES_CHOIX - 1)]
        assert cotes[-1] == "droite"

    def test_choix_sur_la_moyenne_et_non_la_majorite(self):
        # droite un peu mieux vue sur chaque image (+0,04, comme le 13/10) : droite, malgré l'écart < MARGE
        c = CoteStable()
        pts = mieux_vu("gauche", 0.1)
        pts[[4, 6, 12], 2] = 0.64                          # droite 0,64 contre gauche 0,60
        assert [c.maj(pts) for _ in range(CoteStable.IMAGES_CHOIX)][-1] == "droite"

    def test_images_sans_personne_ne_comptent_pas_dans_le_choix(self):
        c = CoteStable()
        vide = personne()
        vide[:, 2] = 0.05
        for _ in range(30):
            c.maj(vide)
        assert c.vues == 0
        assert [c.maj(mieux_vu("droite", 0.1)) for _ in range(CoteStable.IMAGES_CHOIX)][-1] == "droite"

    def test_ne_bascule_pas_sur_une_image(self):
        c = cote_choisi("gauche")
        for _ in range(CoteStable.IMAGES - 1):
            assert c.maj(mieux_vu("droite", 0.1)) == "gauche"

    def test_bascule_apres_plusieurs_images_nettement_meilleures(self):
        c = cote_choisi("gauche")
        cotes = [c.maj(mieux_vu("droite", 0.1)) for _ in range(CoteStable.IMAGES)]
        assert cotes[-1] == "droite"

    def test_petite_avance_ne_suffit_pas(self):
        c = cote_choisi("gauche")
        pts = mieux_vu("gauche", 0.1)
        pts[[4, 6, 12], 2] = 0.7                           # droite à 0,7 contre 0,6 : < 0,15 d'avance
        assert all(c.maj(pts) == "gauche" for _ in range(20))

    def test_compteur_remis_a_zero_si_interrompu(self):
        c = cote_choisi("gauche")
        for _ in range(CoteStable.IMAGES - 1):
            c.maj(mieux_vu("droite", 0.1))
        c.maj(mieux_vu("gauche", 0.1))
        assert c.maj(mieux_vu("droite", 0.1)) == "gauche"


class TestCompleteur:
    def test_reprend_un_point_vu_recemment(self):
        c = Completeur()
        vu = personne()
        c.maj(vu, "gauche", instant=0.0)
        trou = vu.copy()
        trou[11, 2] = 0.05                                 # hanche mal vue
        pts, nom = c.maj(trou, "gauche", instant=2.04)     # cadence de 2 s + temps de capture
        assert nom == "hanche"
        assert tuple(pts[11, :2]) == tuple(vu[11, :2])
        assert pts[11, 2] == pytest.approx(CONF_MIN)
        assert trou[11, 2] == pytest.approx(0.05)          # les points d'origine ne sont pas modifiés

    def test_pas_de_reprise_au_dela_de_la_duree_max(self):
        c = Completeur()
        c.maj(personne(), "gauche", instant=0.0)
        trou = personne()
        trou[3, 2] = 0.05
        assert c.maj(trou, "gauche", instant=Completeur.DUREE_MAX + 0.1)[1] is None

    def test_pas_de_reprise_si_deux_points_manquent(self):
        c = Completeur()
        c.maj(personne(), "gauche", instant=0.0)
        trou = personne()
        trou[[3, 11], 2] = 0.05
        assert c.maj(trou, "gauche", instant=1.0)[1] is None

    def test_pas_de_reprise_sans_vue_precedente(self):
        trou = personne()
        trou[5, 2] = 0.05
        assert Completeur().maj(trou, "gauche", instant=0.0)[1] is None

    def test_rien_a_completer(self):
        pts = personne()
        assert Completeur().maj(pts, "gauche", instant=0.0) == (pts, None)


def chaise_vide():
    """Points d'une chaise vide (14/10) : MoveNet y voit un corps, avec des confiances de 0,1 à 0,4."""
    pts = personne(conf=0.37)
    pts[3, 2] = 0.73                                       # parfois une oreille fantôme bien notée
    return pts


class TestPresence:
    def absente(self):
        p = Presence()
        for _ in range(Presence.IMAGES_ABSENT):
            p.maj(chaise_vide(), jugee=False)
        return p

    def test_personne_nette_presente(self):
        assert points_nets(personne()) >= Presence.POINTS_NETS
        assert Presence().maj(personne(), jugee=True)

    def test_chaise_vide_absente_apres_quelques_images(self):
        p = Presence()
        for _ in range(Presence.IMAGES_ABSENT - 1):
            assert p.maj(chaise_vide(), jugee=False)       # pas encore : peut-être une personne mal vue
        assert not p.maj(chaise_vide(), jugee=False)

    def test_image_fantome_jugee_ne_fait_pas_revenir(self):
        # 14/10 à 08:46:52 : la chaise vide a donné des angles (« dos penché ») une fois sur 19
        p = self.absente()
        assert not p.maj(chaise_vide(), jugee=True)

    def test_retour_sur_une_image_jugee_et_nette(self):
        p = self.absente()
        assert p.maj(personne(), jugee=True)

    def test_personne_mal_vue_mais_jugee_reste_presente(self):
        # 13/10 à 16:05 : allongée, 4 points nets seulement, mais des angles à chaque image
        p = Presence()
        for _ in range(3 * Presence.IMAGES_ABSENT):
            assert p.maj(chaise_vide(), jugee=True)

    def test_hanche_cachee_mais_personne_nette_reste_presente(self):
        p = Presence()
        for _ in range(3 * Presence.IMAGES_ABSENT):
            assert p.maj(personne(), jugee=False)

    def test_images_non_jugees_isolees_ne_font_pas_partir(self):
        p = Presence()
        for _ in range(3):
            for _ in range(Presence.IMAGES_ABSENT - 1):
                p.maj(chaise_vide(), jugee=False)
            assert p.maj(chaise_vide(), jugee=True)
