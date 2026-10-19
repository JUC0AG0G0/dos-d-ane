"""Teste la liaison avec le serveur (docs/liaison-serveur.md).

Lancer depuis edge/ avec .venv activé, après avoir chargé la configuration (edge/.env) :
    set -a; source .env; set +a
    python -m outils.connexion            # une fois : login, WebSocket, ping
    python -m outils.connexion --rester   # garde la liaison et la rouvre quand elle tombe (Ctrl+C pour finir)
"""

import argparse
import logging
import queue
import sys
import time

from websockets.exceptions import ConnectionClosed

from posture.serveur import (Config, ConnexionRefusee, ErreurConfig, ErreurLogin, Liaison, envoyer, fermeture,
                             login, ouvrir, recevoir)


def une_fois(config):
    try:
        jeton = login(config)
        print("Login     : OK")
        with ouvrir(config, jeton) as ws:
            print("Connexion : OK (ready reçu)")
            debut = time.monotonic()
            envoyer(ws, "ping", "bonjour")
            evenement, donnees = recevoir(ws, timeout=5)
            print(f"Ping      : {evenement} {donnees!r} en {1000 * (time.monotonic() - debut):.0f} ms")
    except (ErreurLogin, ConnexionRefusee, ConnectionError) as e:
        sys.exit(f"ÉCHEC : {e}")
    except ConnectionClosed as e:
        code, raison = fermeture(e)
        sys.exit(f"ÉCHEC : connexion fermée pendant le test (code {code} : {raison})")
    except TimeoutError:
        sys.exit("ÉCHEC : le serveur ne répond pas")
    print("Liaison OK")


def rester(config):
    """Ping toutes les 10 s quand la liaison est ouverte ; affiche ce que le serveur envoie."""
    logging.basicConfig(level=logging.INFO, format="%(asctime)s  %(message)s", datefmt="%H:%M:%S")
    liaison = Liaison(config).demarrer()
    print("Liaison démarrée : Ctrl+C pour finir")
    prochain_ping = time.monotonic()
    try:
        while liaison.erreur is None:
            if time.monotonic() >= prochain_ping:
                liaison.envoyer("ping", time.strftime("%H:%M:%S"))
                prochain_ping = time.monotonic() + 10
            try:
                evenement, donnees = liaison.recus.get(timeout=1)
                logging.info("reçu : %s %r", evenement, donnees)
            except queue.Empty:
                pass
    except KeyboardInterrupt:
        pass
    finally:
        liaison.arreter()
    if liaison.erreur:
        sys.exit(f"ÉCHEC : {liaison.erreur}")


def main():
    parser = argparse.ArgumentParser(description="Teste la liaison avec le serveur")
    parser.add_argument("--rester", action="store_true", help="garder la liaison ouverte et la rouvrir si elle tombe")
    args = parser.parse_args()
    try:
        config = Config.depuis_env()
    except ErreurConfig as e:
        sys.exit(f"ÉCHEC : {e}")
    print(f"Serveur   : {config.serveur}")
    print(f"WebSocket : {config.url_ws}")
    if config.serveur.startswith("http://") and "localhost" not in config.serveur:
        print("Attention : liaison non chiffrée (http) — à réserver au réseau de test")
    rester(config) if args.rester else une_fois(config)


if __name__ == "__main__":
    main()
