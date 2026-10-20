"""Liaison avec le serveur (contrat : docs/liaison-serveur.md).

Le Pi échange sa clé d'appareil contre un JWT (login), puis ouvre lui-même la WebSocket : aucun port
n'est ouvert sur le Pi, aucun mot de passe n'y est gardé.
Liaison la garde ouverte dans un thread à part et la rouvre quand elle tombe.
Configuration par variables d'environnement, dans edge/.env (modèle : .env.example).
La clé et le jeton ne sont jamais affichés. Aucun point du corps n'est envoyé (audit §7.2).

websockets (option pi) n'est importé qu'une fois la WebSocket ouverte : le reste se teste sans.
"""

import json
import logging
import os
import queue
import random
import re
import sqlite3
import threading
import time
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone

from posture.chemins import FICHIER_ENVOI

journal = logging.getLogger(__name__)
# websockets journalise lui-même chaque coupure avec une trace complète ; Liaison la rapporte déjà
# (« liaison perdue »), on ne garde que ses erreurs graves.
logging.getLogger("websockets").setLevel(logging.CRITICAL)

CHEMIN_WS = "/api/devices/ws"
TAILLE_MAX = 16 * 1024            # comme le serveur (maxPayload)
CODE_JETON_REFUSE = 4401          # jeton absent, invalide ou expiré : refaire un login
CODE_APPAREIL_REFUSE = 4403       # session ouverte depuis un autre type d'appareil : ne pas réessayer
VARIABLES = ("DOSDANE_SERVEUR", "DOSDANE_APPAREIL", "DOSDANE_CLE")
FORMAT_CLE = re.compile(r"dk_[A-Za-z0-9_-]{43}")    # clé donnée par POST /devices
# Appairage par code d'étiquette (contrat §2) : code de 9 caractères Crockford base32, secret de relève
VARIABLES_APPAIRAGE = ("DOSDANE_SERVEUR", "DOSDANE_CODE", "DOSDANE_SECRET_APPAIRAGE")
FORMAT_CODE = re.compile(r"[0-9ABCDEFGHJKMNPQRSTVWXYZ]{9}")
FORMAT_SECRET = re.compile(r"ps_[A-Za-z0-9_-]{43}")
ATTENTE_APPAIRAGE = 5             # s entre deux demandes du Pi qui attend d'être ajouté à un compte
ATTENTE_REFUS = 60                # s après un refus (code pris par un autre secret, trop de demandes)
ATTENTE_MIN, ATTENTE_MAX = 1, 60  # secondes entre deux tentatives, doublées à chaque échec
CONSERVATION = timedelta(days=7)  # file d'envoi purgée au-delà (audit §12) : résultats de posture
PURGE_TOUTES_LES = 3600          # s entre deux purges


class ErreurConfig(Exception):
    """Variable d'environnement manquante ou invalide."""


class ErreurLogin(Exception):
    """Clé refusée (fausse, révoquée ou remplacée) : réessayer ne sert à rien."""


class ConnexionRefusee(Exception):
    """Le serveur a fermé la WebSocket au lieu de l'accepter (code du contrat §2)."""

    def __init__(self, code, raison):
        super().__init__(f"connexion refusée par le serveur (code {code} : {raison or 'sans raison'})")
        self.code = code


@dataclass(frozen=True)
class Config:
    serveur: str                              # ex. http://192.168.1.20:3000, sans / final
    appareil: str                             # deviceId donné avec la clé
    cle: str = field(repr=False)              # jamais affichée, même dans une trace d'erreur

    @classmethod
    def depuis_env(cls, env=os.environ):
        serveur = _serveur(env, VARIABLES)
        if not FORMAT_CLE.fullmatch(env["DOSDANE_CLE"]):
            raise ErreurConfig("DOSDANE_CLE doit être la clé donnée par le serveur (dk_…)")
        return cls(serveur, env["DOSDANE_APPAREIL"], env["DOSDANE_CLE"])

    @property
    def url_ws(self):
        """Même hôte que l'API : http → ws, https → wss (chiffré)."""
        return "ws" + self.serveur.removeprefix("http") + CHEMIN_WS


@dataclass(frozen=True)
class ConfigAppairage:
    """Pi préparé avec un code d'étiquette (outils/preparer.py) : de quoi obtenir sa clé sans SSH."""

    serveur: str
    code: str                                 # 9 caractères, sans tirets
    secret: str = field(repr=False)           # secret de relève, connu du Pi seul : jamais affiché

    @classmethod
    def depuis_env(cls, env=os.environ):
        """None si le Pi n'a pas de code (préparé avant l'appairage par code : il lui faut une clé)."""
        if not env.get("DOSDANE_CODE") and not env.get("DOSDANE_SECRET_APPAIRAGE"):
            return None
        serveur = _serveur(env, VARIABLES_APPAIRAGE)
        code = env["DOSDANE_CODE"].upper().replace("-", "")
        if not FORMAT_CODE.fullmatch(code):
            raise ErreurConfig("DOSDANE_CODE doit être le code de l'étiquette (9 caractères, ex. K7F-29Q-M4T)")
        if not FORMAT_SECRET.fullmatch(env["DOSDANE_SECRET_APPAIRAGE"]):
            raise ErreurConfig("DOSDANE_SECRET_APPAIRAGE doit être le secret créé par outils/preparer.py (ps_…)")
        return cls(serveur, code, env["DOSDANE_SECRET_APPAIRAGE"])

    @property
    def code_affiche(self):
        """Comme sur l'étiquette : K7F-29Q-M4T."""
        return f"{self.code[:3]}-{self.code[3:6]}-{self.code[6:]}"


def _serveur(env, variables):
    """Vérifie que les variables sont là et renvoie l'adresse du serveur, sans / final."""
    manquantes = [nom for nom in variables if not env.get(nom)]
    if manquantes:
        raise ErreurConfig(f"variables manquantes : {', '.join(manquantes)} (modèle : edge/.env.example)")
    serveur = env["DOSDANE_SERVEUR"].rstrip("/")
    if not serveur.startswith(("http://", "https://")):
        raise ErreurConfig("DOSDANE_SERVEUR doit commencer par http:// ou https://")
    return serveur


def login(config, timeout=10):
    """Échange la clé d'appareil contre un JWT (POST /auth/device-login) et renvoie ce jeton (accessToken)."""
    corps = json.dumps({"deviceId": config.appareil, "key": config.cle})
    requete = urllib.request.Request(f"{config.serveur}/api/auth/device-login", data=corps.encode(), method="POST",
                                     headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(requete, timeout=timeout) as reponse:
            donnees = json.load(reponse)
    except urllib.error.HTTPError as e:
        if e.code in (400, 401):
            raise ErreurLogin(f"clé refusée (HTTP {e.code}) : vérifier DOSDANE_APPAREIL et DOSDANE_CLE "
                              "(clé révoquée ou remplacée ? en créer une avec POST /devices/:id/key)") from None
        raise ConnectionError(f"login : erreur du serveur (HTTP {e.code})") from None
    except urllib.error.URLError as e:
        raise ConnectionError(f"serveur injoignable ({config.serveur}) : {e.reason}") from None
    except TimeoutError:
        raise ConnectionError(f"serveur injoignable ({config.serveur}) : pas de réponse en {timeout} s") from None
    except OSError as e:                         # connexion coupée pendant la réponse…
        raise ConnectionError(f"serveur injoignable ({config.serveur}) : {e}") from None
    return donnees["accessToken"]


class Jeton:
    """Jeton partagé par la WebSocket et les envois : un deuxième login révoquerait le premier
    (une seule session de connexion par appareil côté serveur)."""

    def __init__(self, config):
        self.config = config
        self._valeur = None
        self._verrou = threading.Lock()

    def valeur(self):
        """Jeton en cours, après un login s'il n'y en a pas (ErreurLogin, ConnectionError)."""
        with self._verrou:
            if self._valeur is None:
                self._valeur = login(self.config)
            return self._valeur

    def perime(self, ancien):
        """Refusé par le serveur : le prochain valeur() refera un login (une seule fois si deux threads le voient)."""
        with self._verrou:
            if self._valeur == ancien:
                self._valeur = None


def poster(config, jeton, chemin, corps, timeout=10):
    """POST JSON au serveur. Renvoie (code HTTP, message d'erreur du serveur ou None).

    Une réponse d'erreur (4xx, 5xx) est renvoyée, pas levée ; ConnectionError si le serveur est injoignable.
    """
    requete = urllib.request.Request(f"{config.serveur}{chemin}", data=json.dumps(corps).encode(), method="POST",
                                     headers={"Content-Type": "application/json",
                                              "Authorization": f"Bearer {jeton}"})
    try:
        with urllib.request.urlopen(requete, timeout=timeout) as reponse:
            return reponse.status, None
    except urllib.error.HTTPError as e:
        try:
            message = json.loads(e.read(4096)).get("message")
        except (ValueError, AttributeError):
            message = None
        return e.code, message
    except urllib.error.URLError as e:
        raise ConnectionError(f"serveur injoignable ({config.serveur}) : {e.reason}") from None
    except OSError as e:                         # délai dépassé, connexion coupée pendant la réponse…
        raise ConnectionError(f"serveur injoignable ({config.serveur}) : {e}") from None


def ouvrir(config, jeton, timeout=10):
    """Ouvre la WebSocket et attend `ready` : avant, le serveur refuserait nos messages.

    Renvoie (ws, data de `ready`) : data["sessionId"] est la session à analyser (contrat §3).
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
        evenement, donnees = recevoir(ws, timeout)
    except ConnectionClosed as e:
        raise ConnexionRefusee(*fermeture(e)) from None
    except BaseException:
        ws.close()
        raise
    if evenement != "ready":
        ws.close()
        raise ConnectionError(f"le serveur a répondu {evenement!r} au lieu de 'ready'")
    return ws, donnees if isinstance(donnees, dict) else {}


def envoyer(ws, evenement, donnees):
    ws.send(json.dumps({"event": evenement, "data": donnees}))


def recevoir(ws, timeout=None):
    """Prochain message du serveur : (event, data). Lève TimeoutError, ou ConnectionClosed si la connexion est fermée."""
    message = json.loads(ws.recv(timeout))
    return message.get("event"), message.get("data")


def fermeture(exc):
    """(code, raison) de la fermeture envoyée par le serveur ; (None, "") si la connexion a juste été coupée."""
    return (exc.rcvd.code, exc.rcvd.reason) if exc.rcvd else (None, "")


def commande(en_cours, evenement, donnees):
    """Ce que la session locale doit faire d'un message du serveur (contrat §3, « la base fait foi »).

    `en_cours` : id de la session analysée en ce moment, None si aucune. Renvoie une liste d'actions
    ("arreter", id) puis ("demarrer", id), vide si rien ne change : un message répété ne fait rien,
    un session:stop d'une autre session est ignoré, passer d'une session à une autre arrête d'abord la première.
    """
    session = donnees.get("sessionId") if isinstance(donnees, dict) else None
    if evenement == "ready":
        voulue = session                         # None : rien à analyser
    elif evenement == "session:start" and session:
        voulue = session
    elif evenement == "session:stop" and session == en_cours:
        voulue = None
    else:
        return []                                # autre message, ordre incomplet ou stop d'une autre session
    actions = []
    if en_cours and voulue != en_cours:
        actions.append(("arreter", en_cours))
    if voulue and voulue != en_cours:
        actions.append(("demarrer", voulue))
    return actions


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


def requete(serveur, methode, chemin, corps=None, jeton=None, timeout=10):
    """Appel JSON au serveur : (code HTTP, réponse ou None) ; lève ConnectionError s'il est injoignable."""
    entetes = {"Content-Type": "application/json", **({"Authorization": f"Bearer {jeton}"} if jeton else {})}
    donnees = json.dumps(corps).encode() if corps is not None else None
    try:
        with urllib.request.urlopen(urllib.request.Request(f"{serveur}{chemin}", data=donnees, method=methode,
                                                           headers=entetes), timeout=timeout) as reponse:
            brut = reponse.read()
            return reponse.status, json.loads(brut) if brut else None
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read(4096))
        except ValueError:
            return e.code, None
    except OSError as e:                         # injoignable, délai dépassé, connexion coupée…
        raise ConnectionError(f"serveur injoignable ({serveur}) : {e}") from None


def mettre_a_jour_env(texte, valeurs):
    """Remplace (ou ajoute à la fin) les lignes NOM=… de `valeurs` ; garde les autres lignes telles quelles."""
    restantes, lignes = dict(valeurs), []
    for ligne in texte.splitlines():
        nom = ligne.split("=", 1)[0].strip()
        if not ligne.lstrip().startswith("#") and nom in restantes:
            lignes.append(f"{nom}={restantes.pop(nom)}")
        else:
            lignes.append(ligne)
    lignes += [f"{nom}={valeur}" for nom, valeur in restantes.items()]
    return "\n".join(lignes) + "\n"


def enregistrer_env(fichier, valeurs):
    """Écrit `valeurs` dans edge/.env (créé si besoin), lisible par l'utilisateur seul : il contient la clé."""
    ancien = fichier.read_text() if fichier.exists() else ""
    masque = os.umask(0o077)
    try:
        fichier.write_text(mettre_a_jour_env(ancien, valeurs))
    finally:
        os.umask(masque)
    fichier.chmod(0o600)


def attendre_appairage(config, fichier_env):
    """Attend qu'un compte valide le code de l'étiquette, puis enregistre la clé et renvoie la Config.

    Une demande toutes les 5 s (contrat §2). Seule une erreur de configuration (ErreurConfig) l'arrête :
    réseau coupé ou serveur absent, il réessaie (attente croissante). Ctrl+C ou SIGTERM l'interrompent.
    """
    journal.info("en attente d'appairage : code %s, à taper dans « Ajouter un Raspberry Pi »",
                 config.code_affiche)
    attente = ATTENTE_MIN
    while True:
        try:
            code, reponse = requete(config.serveur, "POST", "/api/devices/pairing/poll",
                                    {"code": config.code, "secret": config.secret})
        except ConnectionError as e:
            journal.warning("%s ; nouvel essai dans %d s", e, attente)
            time.sleep(attente)
            attente = prochaine_attente(attente)
            continue
        attente = ATTENTE_MIN
        if code == 200 and (reponse or {}).get("status") == "paired":
            enregistrer_env(fichier_env, {"DOSDANE_APPAREIL": reponse["deviceId"], "DOSDANE_CLE": reponse["key"]})
            journal.info("ajouté à un compte : clé enregistrée dans %s", fichier_env)
            return Config(config.serveur, reponse["deviceId"], reponse["key"])
        if code == 200:
            pause = ATTENTE_APPAIRAGE
        elif code == 400:
            raise ErreurConfig("code ou secret refusé par le serveur : "
                               "préparer le Pi de nouveau (outils/preparer.py)")
        elif code == 409:
            journal.error("ce code est déjà utilisé par un autre appareil : préparer le Pi de nouveau "
                          "(outils/preparer.py, nouveau code)")
            pause = ATTENTE_REFUS
        elif code == 429:
            journal.warning("trop de demandes : nouvel essai dans %d s", ATTENTE_REFUS)
            pause = ATTENTE_REFUS
        else:
            journal.warning("appairage : erreur du serveur (HTTP %s) ; nouvel essai dans %d s", code, ATTENTE_REFUS)
            pause = ATTENTE_REFUS
        time.sleep(pause)


class Liaison:
    """Garde la WebSocket ouverte dans un thread à part et la rouvre quand elle tombe.

    La boucle d'analyse n'attend jamais le réseau : envoyer() ne bloque pas et renvoie False si la
    liaison est coupée (le message est perdu : réservé à l'état en direct, que le suivant remplace).
    Les messages du serveur arrivent dans la file `recus`, en (event, data), en commençant par `ready` à
    chaque connexion : les passer à commande() pour savoir quoi démarrer ou arrêter.
    Après une erreur de configuration (clé refusée, 4403), la liaison s'arrête et `erreur` dit pourquoi ;
    `cle_refusee` : la clé ne marche plus (révoquée ou remplacée), le Pi peut repasser en attente d'appairage.
    """

    def __init__(self, config):
        self.config = config
        self.jeton = Jeton(config)               # à partager avec Envoi
        self.recus = queue.Queue()
        self.erreur = None
        self.cle_refusee = False
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
                jeton = self.jeton.valeur()
                ws, pret = ouvrir(self.config, jeton)
            except ErreurLogin as e:
                self.cle_refusee = True
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
                self.recus.put(("ready", pret))     # la session à analyser, pour se remettre à jour
                self._ws, attente = ws, ATTENTE_MIN
                code = self._recevoir(ws)
                self._ws = None
                if self._arret.is_set():
                    break
                journal.warning("liaison perdue (code %s)", code)

            action = que_faire(code)
            if action == "arret":
                return self._abandonner("appareil refusé (4403) : DOSDANE_APPAREIL n'est pas un Raspberry Pi")
            if action == "login":
                self.jeton.perime(jeton)
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


class Numeros:
    """clientId des alertes et résumés (contrat §4) : evt_<début de l'analyse>_0001, res_…_0001.

    L'heure de début de l'analyse est dans l'id : si le service redémarre pendant une session, la nouvelle
    analyse ne reprend pas evt_0001, que le serveur prendrait pour un renvoi (et ignorerait).
    """

    def __init__(self, debut=None):
        self.prefixe = f"{debut or datetime.now():%Y%m%d%H%M%S}"
        self.evenements = self.resumes = 0

    def evenement(self):
        self.evenements += 1
        return f"evt_{self.prefixe}_{self.evenements:04d}"

    def resume(self):
        self.resumes += 1
        return f"res_{self.prefixe}_{self.resumes:04d}"


def que_faire_reponse(code):
    """Réaction à la réponse d'un POST (contrat §4) : "envoye", "login", "rejete" ou "attendre"."""
    if code is not None and 200 <= code < 300:
        return "envoye"
    if code == 401:
        return "login"
    if code is not None and 400 <= code < 500:
        return "rejete"                          # 400, 404, 409… : renvoyer ne changerait rien
    return "attendre"                            # 5xx ou réseau


SCHEMA_FILE = """
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,      -- ordre d'envoi
    chemin TEXT NOT NULL,                      -- /api/analysis-sessions/<id>/events ou /summaries
    corps TEXT NOT NULL,                       -- JSON du message (contrat §4)
    depose TEXT NOT NULL                       -- heure de dépôt (ISO, UTC)
);
CREATE TABLE IF NOT EXISTS rejetes (           -- refusés par le serveur (4xx) : gardés pour comprendre
    id INTEGER PRIMARY KEY,
    chemin TEXT NOT NULL,
    corps TEXT NOT NULL,
    depose TEXT NOT NULL,
    rejete TEXT NOT NULL,
    code INTEGER NOT NULL,
    raison TEXT
);
"""


def maintenant_utc():
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


class FileEnvoi:
    """File des messages à envoyer, sur disque (SQLite) : elle survit à un arrêt du Pi.

    Le dossier est réservé à l'utilisateur (700) : les messages contiennent des résultats de posture.
    Appelée depuis la boucle d'analyse (ajouter) et depuis le thread d'envoi : un verrou protège la connexion.
    """

    def __init__(self, fichier):
        fichier.parent.mkdir(parents=True, exist_ok=True)
        os.chmod(fichier.parent, 0o700)
        self._cnx = sqlite3.connect(fichier, check_same_thread=False)
        self._verrou = threading.Lock()
        with self._verrou, self._cnx:
            self._cnx.executescript(SCHEMA_FILE)

    def ajouter(self, chemin, corps):
        with self._verrou, self._cnx:
            self._cnx.execute("INSERT INTO messages (chemin, corps, depose) VALUES (?, ?, ?)",
                              (chemin, json.dumps(corps), maintenant_utc()))

    def premier(self):
        """Plus ancien message en attente : (id, chemin, corps), ou None."""
        with self._verrou:
            ligne = self._cnx.execute("SELECT id, chemin, corps FROM messages ORDER BY id LIMIT 1").fetchone()
        return (ligne[0], ligne[1], json.loads(ligne[2])) if ligne else None

    def retirer(self, id_message):
        with self._verrou, self._cnx:
            self._cnx.execute("DELETE FROM messages WHERE id = ?", (id_message,))

    def rejeter(self, id_message, code, raison):
        """Déplace le message dans `rejetes`, avec la réponse du serveur (une seule transaction)."""
        with self._verrou, self._cnx:
            self._cnx.execute("INSERT INTO rejetes (id, chemin, corps, depose, rejete, code, raison) "
                              "SELECT id, chemin, corps, depose, ?, ?, ? FROM messages WHERE id = ?",
                              (maintenant_utc(), code, raison if raison is None else str(raison), id_message))
            self._cnx.execute("DELETE FROM messages WHERE id = ?", (id_message,))

    def purger(self, avant):
        """Supprime messages et refus déposés avant `avant` (datetime UTC) ; renvoie (messages, refus)."""
        limite = avant.isoformat(timespec="seconds")   # même format que `depose` : comparable en texte
        with self._verrou, self._cnx:
            messages = self._cnx.execute("DELETE FROM messages WHERE depose < ?", (limite,)).rowcount
            refus = self._cnx.execute("DELETE FROM rejetes WHERE depose < ?", (limite,)).rowcount
        return messages, refus

    def __len__(self):
        with self._verrou:
            return self._cnx.execute("SELECT count(*) FROM messages").fetchone()[0]

    def fermer(self):
        with self._verrou:
            self._cnx.close()


class Envoi:
    """Envoie au serveur les alertes et les résumés (contrat §4) dans un thread à part.

    deposer() écrit le message sur disque (FileEnvoi) et rend la main : la boucle d'analyse n'attend jamais
    le réseau. Les messages partent dans l'ordre ; un message n'est effacé qu'une fois reçu par le serveur
    (2xx). En cas d'échec, il est renvoyé (même clientId : le serveur ignore les doublons) avec une attente
    doublée à chaque échec. Ceux qui restent à l'arrêt partent au démarrage suivant, en premier.
    """

    def __init__(self, config, jeton, fichier=FICHIER_ENVOI):
        self.config, self.jeton = config, jeton
        self.envoyes = self.rejetes = 0
        self._file, self._restant = FileEnvoi(fichier), None
        self._nouveau = threading.Event()
        self._arret, self._limite = threading.Event(), None
        self._thread = threading.Thread(target=self._boucle, name="envoi-serveur", daemon=True)
        self._purger()
        if reste := len(self._file):
            journal.info("envoi : %d message(s) restés de l'exécution précédente, envoyés en premier", reste)

    def demarrer(self):
        self._thread.start()
        return self

    def deposer(self, chemin, corps):
        try:
            self._file.ajouter(chemin, corps)
        except sqlite3.Error:                    # disque plein… : ne pas arrêter l'analyse (le CSV le garde)
            journal.exception("envoi : message non enregistré dans la file")
            return
        self._nouveau.set()

    @property
    def en_attente(self):
        return self._restant if self._restant is not None else len(self._file)

    def arreter(self, timeout=15):
        """Envoie ce qui reste en `timeout` s au plus (en réessayant si besoin), puis s'arrête.
        Ce qui n'est pas parti reste sur disque pour le prochain démarrage."""
        self._limite = time.monotonic() + timeout
        self._arret.set()
        self._nouveau.set()
        self._thread.join(timeout + 1)
        if not self._thread.is_alive():
            self._restant = len(self._file)      # en_attente reste lisible une fois la file fermée
            self._file.fermer()

    def _purger(self):
        """Au-delà de 7 jours, un message ne sera plus utile et ne doit pas être gardé (audit §12)."""
        self._derniere_purge = time.monotonic()
        messages, refus = self._file.purger(datetime.now(timezone.utc) - CONSERVATION)
        if messages or refus:
            journal.warning("envoi : purge de %d message(s) jamais envoyés et %d refus de plus de %d jours",
                            messages, refus, CONSERVATION.days)

    def _boucle(self):
        attente = ATTENTE_MIN
        while True:
            if time.monotonic() - self._derniere_purge >= PURGE_TOUTES_LES:
                self._purger()
            courant = self._file.premier()
            if courant is None:
                if self._arret.is_set():
                    break
                self._nouveau.wait(1.0)
                self._nouveau.clear()
                continue
            id_message, chemin, corps = courant
            jeton, code, message = None, None, None
            try:
                jeton = self.jeton.valeur()
                code, message = poster(self.config, jeton, chemin, corps)
            except (ErreurLogin, ConnectionError) as e:
                journal.warning("envoi impossible : %s", e)
            except Exception:                    # imprévu : l'envoi ne doit jamais mourir en silence
                journal.exception("erreur inattendue de l'envoi")

            action = que_faire_reponse(code)
            if action == "envoye":
                self._file.retirer(id_message)
                self.envoyes += 1
                attente = ATTENTE_MIN
                continue
            if action == "rejete":
                self._file.rejeter(id_message, code, message)
                self.rejetes += 1
                journal.error("refusé par le serveur (HTTP %s : %s) : %s %s — gardé dans la table rejetes",
                              code, message, chemin, corps.get("clientId"))
                continue
            if action == "login" and jeton:
                self.jeton.perime(jeton)
            pause = attente * random.uniform(0.8, 1.2)
            if self._arret.is_set():                 # arrêt demandé : réessayer seulement jusqu'à la limite
                reste = self._limite - time.monotonic()
                if reste <= 0:
                    journal.warning("arrêt : %d message(s) gardés sur disque pour le prochain démarrage",
                                    len(self._file))
                    break
                time.sleep(min(pause, reste))
            else:
                journal.info("envoi : nouvel essai dans %.0f s (%d en attente)", pause, len(self._file))
                self._arret.wait(pause)
            attente = prochaine_attente(attente)
