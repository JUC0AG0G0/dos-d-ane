"""Appairage par code d'étiquette (docs/liaison-serveur.md §2), sans réseau : le serveur est simulé."""

import pytest

import posture.serveur as serveur
from posture.serveur import ConfigAppairage, ErreurConfig, attendre_appairage

SECRET = "ps_" + "s" * 43                                         # secret de test, au format de preparer.py
CLE = "dk_" + "k" * 43
ENV = {"DOSDANE_SERVEUR": "http://localhost:3000/", "DOSDANE_CODE": "k7f-29q-m4t", "DOSDANE_SECRET_APPAIRAGE": SECRET}
APPAIRE = (200, {"status": "paired", "deviceId": "01a1-pi", "key": CLE})


def test_sans_code_pas_d_appairage():
    assert ConfigAppairage.depuis_env({"DOSDANE_SERVEUR": "http://localhost:3000"}) is None


def test_code_recopie_comme_sur_l_etiquette():
    config = ConfigAppairage.depuis_env(ENV)
    assert (config.serveur, config.code, config.code_affiche) == ("http://localhost:3000", "K7F29QM4T", "K7F-29Q-M4T")


@pytest.mark.parametrize("variables", [{"DOSDANE_CODE": "K7F-29Q"}, {"DOSDANE_CODE": "K7F-29Q-M4I"},
                                       {"DOSDANE_SECRET_APPAIRAGE": "ps_court"}, {"DOSDANE_SECRET_APPAIRAGE": ""}])
def test_code_ou_secret_mal_copie_refuse(variables):
    with pytest.raises(ErreurConfig):
        ConfigAppairage.depuis_env(ENV | variables)


def test_secret_jamais_affiche():
    assert SECRET not in repr(ConfigAppairage.depuis_env(ENV))


@pytest.fixture
def faux_serveur(monkeypatch):
    """Réponses successives du serveur à pairing/poll (une exception est levée) ; renvoie les pauses du Pi."""
    reponses, pauses = [], []

    def requete(serveur_, methode, chemin, corps=None, jeton=None, timeout=10):
        assert (methode, chemin) == ("POST", "/api/devices/pairing/poll")
        assert corps == {"code": "K7F29QM4T", "secret": SECRET}  # code sans tirets, comme le serveur l'attend
        reponse = reponses.pop(0)
        if isinstance(reponse, Exception):
            raise reponse
        return reponse

    monkeypatch.setattr(serveur, "requete", requete)
    monkeypatch.setattr(serveur.time, "sleep", pauses.append)
    return reponses, pauses


def test_attend_puis_enregistre_la_cle(faux_serveur, tmp_path):
    reponses, pauses = faux_serveur
    env = tmp_path / ".env"
    env.write_text("DOSDANE_SERVEUR=http://localhost:3000\nDOSDANE_CODE=K7F-29Q-M4T\nDOSDANE_CLE=\n")
    reponses += [ConnectionError("serveur injoignable"), (200, {"status": "waiting"}), APPAIRE]
    config = attendre_appairage(ConfigAppairage.depuis_env(ENV), env)
    assert (config.appareil, config.cle) == ("01a1-pi", CLE)
    assert pauses == [1, 5]                       # réseau : attente croissante ; en attente : toutes les 5 s
    assert env.read_text().splitlines() == ["DOSDANE_SERVEUR=http://localhost:3000", "DOSDANE_CODE=K7F-29Q-M4T",
                                            f"DOSDANE_CLE={CLE}", "DOSDANE_APPAREIL=01a1-pi"]
    assert env.stat().st_mode & 0o777 == 0o600    # la clé : lisible par l'utilisateur seul


@pytest.mark.parametrize("refus", [409, 429, 503])
def test_refus_ralentit_sans_abandonner(faux_serveur, tmp_path, refus):
    reponses, pauses = faux_serveur
    reponses += [(refus, {"message": "…"}), APPAIRE]
    attendre_appairage(ConfigAppairage.depuis_env(ENV), tmp_path / ".env")
    assert pauses == [60]


def test_code_refuse_par_le_serveur_arrete(faux_serveur, tmp_path):
    reponses, _ = faux_serveur
    reponses.append((400, {"message": "Code invalide : 9 caractères"}))
    with pytest.raises(ErreurConfig):
        attendre_appairage(ConfigAppairage.depuis_env(ENV), tmp_path / ".env")
