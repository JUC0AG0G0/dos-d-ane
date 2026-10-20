"""Appaire ce Pi avec un compte : il s'ajoute lui-même au compte et enregistre sa clé dans edge/.env.

Évite de recopier à la main le deviceId et la clé donnés par POST /api/devices (docs/liaison-serveur.md §2).
Le mot de passe est tapé une fois, sans écho, et n'est jamais enregistré : il sert à un seul login,
fermé aussitôt ; ensuite le Pi se connecte avec sa clé.

Lancer depuis edge/ avec .venv activé :
    python -m outils.appairer                           # demande le serveur, l'email, le mot de passe, le nom
    python -m outils.appairer --serveur https://… --nom "Pi du bureau"
"""

import argparse
import getpass
import os
import sys

from posture.chemins import FICHIER_ENV
from posture.serveur import Config, ErreurConfig, ErreurLogin, enregistrer_env, login, requete


def main():
    parser = argparse.ArgumentParser(description="Ajoute ce Pi à un compte et enregistre sa clé dans edge/.env")
    parser.add_argument("--serveur", help="adresse du serveur (par défaut : DOSDANE_SERVEUR, sinon demandée)")
    parser.add_argument("--nom", help="nom du Pi dans le compte (par défaut : demandé)")
    args = parser.parse_args()

    serveur = (args.serveur or os.environ.get("DOSDANE_SERVEUR") or input("Serveur (https://…) : ")).strip().rstrip("/")
    if not serveur.startswith(("http://", "https://")):
        sys.exit("ÉCHEC : l'adresse du serveur doit commencer par http:// ou https://")
    ancien = FICHIER_ENV.read_text() if FICHIER_ENV.exists() else ""
    if "DOSDANE_CLE=dk_" in ancien and input("Ce Pi a déjà une clé : en créer un nouveau dans le compte ? [o/N] ")\
            .strip().lower() not in ("o", "oui"):
        sys.exit("Rien n'a changé.")
    email = input("Email du compte : ").strip()
    mot_de_passe = getpass.getpass("Mot de passe (non affiché, jamais enregistré) : ")
    nom = args.nom or input("Nom du Pi [Raspberry Pi] : ").strip() or "Raspberry Pi"

    try:
        code, reponse = requete(serveur, "POST", "/api/auth/login", {"email": email, "password": mot_de_passe})
        del mot_de_passe                          # ne sert plus : seul ce login l'utilise
        if code != 200:
            sys.exit(f"ÉCHEC : connexion refusée (HTTP {code} : {(reponse or {}).get('message')})")
        jeton = reponse["accessToken"]
        code, appareil = requete(serveur, "POST", "/api/devices", {"name": nom}, jeton)
        requete(serveur, "POST", "/api/auth/logout", jeton=jeton)   # session d'appairage fermée aussitôt
        if code != 201:
            sys.exit(f"ÉCHEC : Pi non ajouté (HTTP {code} : {(appareil or {}).get('message')})")
    except ConnectionError as e:
        sys.exit(f"ÉCHEC : {e}")

    # Enregistrée avant tout autre essai : la clé n'est donnée qu'une fois par le serveur.
    valeurs = {"DOSDANE_SERVEUR": serveur, "DOSDANE_APPAREIL": appareil["deviceId"], "DOSDANE_CLE": appareil["key"]}
    enregistrer_env(FICHIER_ENV, valeurs)
    print(f"✓ « {appareil['name']} » ajouté au compte ; deviceId et clé enregistrés dans {FICHIER_ENV}")

    try:                                         # vérification : le Pi se connecte avec sa clé
        login(Config.depuis_env(valeurs))
        print("✓ connexion par clé vérifiée")
    except (ErreurConfig, ErreurLogin, ConnectionError) as e:
        sys.exit(f"ÉCHEC de la vérification : {e}")
    print("Ensuite : set -a; source .env; set +a ; python -m outils.connexion (ou le service)")


if __name__ == "__main__":
    main()
