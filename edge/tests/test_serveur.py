"""Configuration de la liaison avec le serveur (docs/liaison-serveur.md), sans réseau ni websockets."""

import re
from datetime import datetime

import pytest

import posture.serveur as serveur
from posture.serveur import (ATTENTE_MAX, Config, Envoi, ErreurConfig, Numeros, commande, prochaine_attente,
                             que_faire, que_faire_reponse)

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


def test_ready_aligne_sur_la_session_du_serveur():
    assert commande(None, "ready", {"sessionId": "s1"}) == [("demarrer", "s1")]       # start manqué
    assert commande("s1", "ready", {"sessionId": None}) == [("arreter", "s1")]        # stop manqué
    assert commande("s1", "ready", {"sessionId": "s1"}) == []                         # déjà à jour
    assert commande("s1", "ready", {"sessionId": "s2"}) == [("arreter", "s1"), ("demarrer", "s2")]


def test_ordres_repetes_ou_d_une_autre_session_sans_effet():
    assert commande(None, "session:start", {"sessionId": "s1"}) == [("demarrer", "s1")]
    assert commande("s1", "session:start", {"sessionId": "s1"}) == []
    assert commande("s1", "session:stop", {"sessionId": "s1"}) == [("arreter", "s1")]
    assert commande(None, "session:stop", {"sessionId": "s1"}) == []
    assert commande("s2", "session:stop", {"sessionId": "s1"}) == []                  # pas la nôtre


def test_messages_inconnus_ou_incomplets_ignores():
    assert commande("s1", "pong", "10:00:00") == []
    assert commande("s1", "session:start", {}) == []
    assert commande("s1", "session:start", "pas un objet") == []


def test_reaction_aux_reponses_des_post():
    assert que_faire_reponse(201) == "envoye"
    assert que_faire_reponse(401) == "login"                       # jeton expiré
    assert [que_faire_reponse(c) for c in (400, 404, 409)] == ["rejete"] * 3   # renvoyer ne changerait rien
    assert [que_faire_reponse(c) for c in (500, 503, None)] == ["attendre"] * 3


class FauxJeton:
    def __init__(self):
        self.numero, self.perimes = 1, []

    def valeur(self):
        return f"jeton{self.numero}"

    def perime(self, ancien):
        self.perimes.append(ancien)
        self.numero += 1


def envoyer_tout(monkeypatch, reponses, messages):
    """Fait passer `messages` par Envoi face à un faux serveur qui répond `reponses` dans l'ordre."""
    monkeypatch.setattr(serveur, "ATTENTE_MIN", 0.01)
    recus, reponses = [], list(reponses)

    def faux_poster(config, jeton, chemin, corps):
        recus.append((jeton, corps["clientId"]))
        reponse = reponses.pop(0) if reponses else 201
        if reponse is None:
            raise ConnectionError("réseau coupé")
        return reponse, None

    monkeypatch.setattr(serveur, "poster", faux_poster)
    jeton = FauxJeton()
    envoi = Envoi(Config.depuis_env(ENV), jeton).demarrer()
    for clientId in messages:
        envoi.deposer("/api/analysis-sessions/s1/events", {"clientId": clientId})
    envoi.arreter(timeout=5)
    return envoi, jeton, recus


def test_echec_renvoye_dans_l_ordre(monkeypatch):
    envoi, _, recus = envoyer_tout(monkeypatch, [None, 503, 201, 201], ["evt_0001", "evt_0002"])
    assert [c for _, c in recus] == ["evt_0001"] * 3 + ["evt_0002"]   # le 2ᵉ attend que le 1ᵉʳ soit passé
    assert (envoi.envoyes, envoi.rejetes, envoi.en_attente) == (2, 0, 0)


def test_refus_mis_de_cote_sans_bloquer_la_suite(monkeypatch):
    envoi, _, recus = envoyer_tout(monkeypatch, [409, 201], ["evt_0001", "evt_0002"])
    assert [c for _, c in recus] == ["evt_0001", "evt_0002"]
    assert (envoi.envoyes, envoi.rejetes) == (1, 1)


def test_jeton_expire_renouvele_puis_renvoye(monkeypatch):
    envoi, jeton, recus = envoyer_tout(monkeypatch, [401, 201], ["evt_0001"])
    assert recus == [("jeton1", "evt_0001"), ("jeton2", "evt_0001")]
    assert jeton.perimes == ["jeton1"] and envoi.envoyes == 1


def test_ids_uniques_apres_un_redemarrage_pendant_la_session():
    avant = Numeros(datetime(2026, 10, 19, 13, 32, 42))
    ids_avant = [avant.evenement(), avant.evenement(), avant.resume()]
    apres = Numeros(datetime(2026, 10, 19, 13, 40, 5))           # service relancé, même session
    ids_apres = [apres.evenement(), apres.resume()]
    assert ids_avant == ["evt_20261019133242_0001", "evt_20261019133242_0002", "res_20261019133242_0001"]
    assert not set(ids_avant) & set(ids_apres)                   # sinon pris pour des renvois et ignorés
    assert all(re.fullmatch(r"[A-Za-z0-9_-]{1,64}", i) for i in ids_avant + ids_apres)   # format du serveur
