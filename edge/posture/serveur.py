"""Liaison avec le serveur (contrat : docs/liaison-serveur.md).

Le Pi fait un login, puis ouvre lui-même la WebSocket : aucun port n'est ouvert sur le Pi.
Liaison la garde ouverte dans un thread à part et la rouvre quand elle tombe.
Configuration par variables d'environnement, dans edge/.env (modèle : .env.example).
Le mot de passe et le jeton ne sont jamais affichés. Aucun point du corps n'est envoyé (audit §7.2).

websockets (option pi) n'est importé qu'une fois la WebSocket ouverte : le reste se teste sans.
"""

import json
import logging
import os
import queue
import random
import threading
import urllib.error
import urllib.request
from dataclasses import dataclass, field

from posture.chemins import FICHIER_APPAREIL

journal = logging.getLogger(__name__)

CHEMIN_WS = "/api/devices/ws"
TAILLE_MAX = 16 * 1024            # comme le serveur (maxPayload)
CODE_JETON_REFUSE = 4401          # jeton absent, invalide ou expiré : refaire un login
CODE_APPAREIL_REFUSE = 4403       # session ouverte depuis un autre type d'appareil : ne pas réessayer
VARIABLES = ("DOSDANE_SERVEUR", "DOSDANE_EMAIL", "DOSDANE_MOT_DE_PASSE")
ATTENTE_MIN, ATTENTE_MAX = 1, 60  # secondes entre deux tentatives, doublées à chaque échec


class ErreurConfig(Exception):
    """Variable d'environnement manquante ou invalide."""


class ErreurLogin(Exception):
    """Email ou mot de passe refusé : réessayer ne sert à rien."""


class ConnexionRefusee(Exception):
    """Le serveur a fermé la WebSocket au lieu de l'accepter (code du contrat §2)."""

    def __init__(self, code, raison):
        super().__init__(f"connexion refusée par le serveur (code {code} : {raison or 'sans raison'})")
        self.code = code


@dataclass(frozen=True)
class Config:
    serveur: str                              # ex. http://192.168.1.20:3000, sans / final
    email: str
    mot_de_passe: str = field(repr=False)     # jamais affiché, même dans une trace d'erreur

    @classmethod
    def depuis_env(cls, env=os.environ):
        manquantes = [nom for nom in VARIABLES if not env.get(nom)]
        if manquantes:
            raise ErreurConfig(f"variables manquantes : {', '.join(manquantes)} (modèle : edge/.env.example)")
        serveur = env["DOSDANE_SERVEUR"].rstrip("/")
        if not serveur.startswith(("http://", "https://")):
            raise ErreurConfig("DOSDANE_SERVEUR doit commencer par http:// ou https://")
        return cls(serveur, env["DOSDANE_EMAIL"], env["DOSDANE_MOT_DE_PASSE"])

    @property
    def url_ws(self):
        """Même hôte que l'API : http → ws, https → wss (chiffré)."""
        return "ws" + self.serveur.removeprefix("http") + CHEMIN_WS


def lire_appareil():
    try:
        return FICHIER_APPAREIL.read_text().strip() or None
    except FileNotFoundError:
        return None


def ecrire_appareil(id_appareil):
    FICHIER_APPAREIL.parent.mkdir(parents=True, exist_ok=True)
    FICHIER_APPAREIL.write_text(id_appareil + "\n")


def login(config, timeout=10):
    """Ouvre une session « raspberry » sur le serveur et renvoie son jeton (accessToken).

    Réutilise l'id d'appareil reçu au premier login : sans lui, le serveur créerait un appareil à chaque fois.
    """
    appareil = {"type": "raspberry"}
    if id_appareil := lire_appareil():
        appareil["id"] = id_appareil
    corps = json.dumps({"email": config.email, "password": config.mot_de_passe, "device": appareil})
    requete = urllib.request.Request(f"{config.serveur}/api/auth/login", data=corps.encode(), method="POST",
                                     headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(requete, timeout=timeout) as reponse:
            donnees = json.load(reponse)
    except urllib.error.HTTPError as e:
        if e.code in (400, 401):
            raise ErreurLogin(f"login refusé (HTTP {e.code}) : vérifier DOSDANE_EMAIL et "
                              "DOSDANE_MOT_DE_PASSE") from None
        raise ConnectionError(f"login : erreur du serveur (HTTP {e.code})") from None
    except urllib.error.URLError as e:
        raise ConnectionError(f"serveur injoignable ({config.serveur}) : {e.reason}") from None
    except TimeoutError:
        raise ConnectionError(f"serveur injoignable ({config.serveur}) : pas de réponse en {timeout} s") from None
    except OSError as e:                         # connexion coupée pendant la réponse…
        raise ConnectionError(f"serveur injoignable ({config.serveur}) : {e}") from None
    ecrire_appareil(donnees["deviceId"])
    return donnees["accessToken"]


def ouvrir(config, jeton, timeout=10):
    """Ouvre la WebSocket et attend `ready` : avant, le serveur refuserait nos messages.

    Le jeton passe dans le header, jamais dans l'URL (contrat §2). Lève ConnexionRefusee si le serveur
    ferme au lieu d'accepter, ConnectionError s'il est injoignable, TimeoutError s'il n'envoie pas `ready`.
    """
    from websockets.exceptions import ConnectionClosed, InvalidHandshake
    from websockets.sync.client import connect

    try:
        ws = connect(config.url_ws, additional_headers={"Authorization": f"Bearer {jeton}"},
                     max_size=TAILLE_MAX, open_timeout=timeout)
    except (OSError, InvalidHandshake) as e:     # serveur arrêté, mauvaise adresse, proxy…
        raise ConnectionError(f"WebSocket injoignable ({config.url_ws}) : {e}") from None
    try:
        evenement, _ = recevoir(ws, timeout)
    except ConnectionClosed as e:
        raise ConnexionRefusee(*fermeture(e)) from None
    except BaseException:
        ws.close()
        raise
    if evenement != "ready":
        ws.close()
        raise ConnectionError(f"le serveur a répondu {evenement!r} au lieu de 'ready'")
    return ws


def envoyer(ws, evenement, donnees):
    ws.send(json.dumps({"event": evenement, "data": donnees}))


def recevoir(ws, timeout=None):
    """Prochain message du serveur : (event, data). Lève TimeoutError, ou ConnectionClosed si la connexion est fermée."""
    message = json.loads(ws.recv(timeout))
    return message.get("event"), message.get("data")


def fermeture(exc):
    """(code, raison) de la fermeture envoyée par le serveur ; (None, "") si la connexion a juste été coupée."""
    return (exc.rcvd.code, exc.rcvd.reason) if exc.rcvd else (None, "")


def que_faire(code):
    """Réaction du Pi à une fermeture (contrat §2) : "login", "arret" ou "attendre"."""
    if code == CODE_JETON_REFUSE:
        return "login"
    if code == CODE_APPAREIL_REFUSE:
        return "arret"
    return "attendre"


def prochaine_attente(attente):
    """Doublée à chaque échec, plafonnée : un serveur en panne n'est pas bombardé de tentatives."""
    return min(attente * 2, ATTENTE_MAX)


class Liaison:
    """Garde la WebSocket ouverte dans un thread à part et la rouvre quand elle tombe.

    La boucle d'analyse n'attend jamais le réseau : envoyer() ne bloque pas et renvoie False si la
    liaison est coupée (le message est perdu : réservé à l'état en direct, que le suivant remplace).
    Les messages du serveur arrivent dans la file `recus`, en (event, data).
    Après une erreur de configuration (mauvais mot de passe, 4403), la liaison s'arrête et `erreur` dit pourquoi.
    """

    def __init__(self, config):
        self.config = config
        self.recus = queue.Queue()
        self.erreur = None
        self._arret = threading.Event()
        self._ws = None
        self._thread = threading.Thread(target=self._boucle, name="liaison-serveur", daemon=True)

    @property
    def connectee(self):
        return self._ws is not None

    def demarrer(self):
        self._thread.start()
        return self

    def arreter(self, timeout=5):
        self._arret.set()
        if ws := self._ws:
            ws.close()
        self._thread.join(timeout)

    def envoyer(self, evenement, donnees):
        ws = self._ws
        if ws is None:
            return False
        from websockets.exceptions import ConnectionClosed

        try:
            envoyer(ws, evenement, donnees)
            return True
        except ConnectionClosed:                 # la boucle va se reconnecter
            return False

    def _boucle(self):
        jeton, attente = None, ATTENTE_MIN
        while not self._arret.is_set():
            code = None
            try:
                if jeton is None:
                    jeton = login(self.config)
                ws = ouvrir(self.config, jeton)
            except ErreurLogin as e:
                return self._abandonner(str(e))
            except ConnexionRefusee as e:
                journal.warning("%s", e)
                code = e.code
            except (ConnectionError, TimeoutError) as e:
                journal.warning("%s", e)
            except Exception:                    # imprévu : la liaison ne doit jamais mourir en silence
                journal.exception("erreur inattendue de la liaison")
            else:
                journal.info("liaison ouverte : %s", self.config.url_ws)
                self._ws, attente = ws, ATTENTE_MIN
                code = self._recevoir(ws)
                self._ws = None
                if self._arret.is_set():
                    break
                journal.warning("liaison perdue (code %s)", code)

            action = que_faire(code)
            if action == "arret":
                return self._abandonner("appareil refusé (4403) : le login doit se faire en raspberry")
            if action == "login":
                jeton = None
            pause = attente * random.uniform(0.8, 1.2)   # étalée : plusieurs Pi ne reviennent pas tous ensemble
            journal.info("nouvelle tentative dans %.0f s", pause)
            self._arret.wait(pause)
            attente = prochaine_attente(attente)
        journal.info("liaison fermée")

    def _recevoir(self, ws):
        """Range les messages du serveur dans `recus` jusqu'à la fermeture, dont il renvoie le code."""
        from websockets.exceptions import ConnectionClosed

        while True:
            try:
                brut = ws.recv()
            except ConnectionClosed as e:
                return fermeture(e)[0]
            try:
                message = json.loads(brut)
                self.recus.put((message["event"], message.get("data")))
            except (ValueError, TypeError, KeyError):
                journal.warning("message du serveur illisible, ignoré")

    def _abandonner(self, raison):
        self.erreur = raison
        journal.error("liaison arrêtée : %s", raison)
