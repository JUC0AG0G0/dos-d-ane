"""Configuration de la liaison avec le serveur (docs/liaison-serveur.md), sans réseau ni websockets."""

import pytest

from posture.serveur import Config, ErreurConfig

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
