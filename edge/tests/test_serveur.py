"""Configuration de la liaison avec le serveur (docs/liaison-serveur.md), sans réseau ni websockets."""

import pytest

from posture.serveur import ATTENTE_MAX, Config, ErreurConfig, prochaine_attente, que_faire

ENV = {"DOSDANE_SERVEUR": "http://localhost:3000/", "DOSDANE_EMAIL": "pi@example.com",
       "DOSDANE_MOT_DE_PASSE": "secret-de-test"}


def test_websocket_sur_le_meme_hote():
    assert Config.depuis_env(ENV).url_ws == "ws://localhost:3000/api/devices/ws"
    https = Config.depuis_env(ENV | {"DOSDANE_SERVEUR": "https://dosdane.example.com"})
    assert https.url_ws == "wss://dosdane.example.com/api/devices/ws"     # chiffré comme l'API


def test_variables_manquantes_nommees_sans_valeur():
    with pytest.raises(ErreurConfig) as erreur:
        Config.depuis_env({"DOSDANE_SERVEUR": "http://localhost:3000"})
    assert "DOSDANE_EMAIL" in str(erreur.value) and "DOSDANE_MOT_DE_PASSE" in str(erreur.value)


def test_adresse_sans_protocole_refusee():
    with pytest.raises(ErreurConfig):
        Config.depuis_env(ENV | {"DOSDANE_SERVEUR": "localhost:3000"})


def test_mot_de_passe_jamais_affiche():
    assert "secret-de-test" not in repr(Config.depuis_env(ENV))


def test_reaction_aux_codes_du_contrat():
    assert que_faire(4401) == "login"        # jeton expiré : nouveau login
    assert que_faire(4403) == "arret"        # mauvaise configuration : réessayer ne sert à rien
    for code in (1011, 1006, 1001, None):    # serveur en panne, réseau coupé…
        assert que_faire(code) == "attendre"


def test_attente_doublee_puis_plafonnee():
    attentes = [1]
    for _ in range(10):
        attentes.append(prochaine_attente(attentes[-1]))
    assert attentes[:4] == [1, 2, 4, 8]
    assert max(attentes) == ATTENTE_MAX == attentes[-1]
