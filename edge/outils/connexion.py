"""Teste la liaison avec le serveur : login, WebSocket, ping (docs/liaison-serveur.md).

Lancer depuis edge/ avec .venv activé, après avoir chargé la configuration (edge/.env) :
    set -a; source .env; set +a
    python -m outils.connexion
"""

import sys
import time

from websockets.exceptions import ConnectionClosed

from posture.serveur import (Config, ConnexionRefusee, ErreurConfig, ErreurLogin, envoyer, fermeture, login,
                             ouvrir, recevoir)


def main():
    try:
        config = Config.depuis_env()
    except ErreurConfig as e:
        sys.exit(f"ÉCHEC : {e}")
    print(f"Serveur   : {config.serveur}")
    print(f"WebSocket : {config.url_ws}")
    if config.serveur.startswith("http://") and "localhost" not in config.serveur:
        print("Attention : liaison non chiffrée (http) — à réserver au réseau de test")

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
    except (OSError, TimeoutError) as e:
        sys.exit(f"ÉCHEC : WebSocket injoignable ({e})")
    print("Liaison OK")


if __name__ == "__main__":
    main()
