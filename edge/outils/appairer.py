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
import json
import os
import sys
import urllib.error
import urllib.request

from posture.chemins import DOSSIER_EDGE
from posture.serveur import Config, ErreurConfig, ErreurLogin, login

FICHIER_ENV = DOSSIER_EDGE / ".env"


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


def requete(serveur, methode, chemin, corps=None, jeton=None):
    """Appel JSON au serveur : (code HTTP, réponse) ; lève ConnectionError si le serveur est injoignable."""
    entetes = {"Content-Type": "application/json", **({"Authorization": f"Bearer {jeton}"} if jeton else {})}
    donnees = json.dumps(corps).encode() if corps is not None else None
    try:
        with urllib.request.urlopen(urllib.request.Request(f"{serveur}{chemin}", data=donnees, method=methode,
                                                           headers=entetes), timeout=10) as reponse:
            brut = reponse.read()
            return reponse.status, json.loads(brut) if brut else None
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read(4096))
        except ValueError:
            return e.code, None
    except OSError as e:
        raise ConnectionError(f"serveur injoignable ({serveur}) : {e}") from None


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
    ancien_umask = os.umask(0o077)
    try:
        FICHIER_ENV.write_text(mettre_a_jour_env(ancien, valeurs))
    finally:
        os.umask(ancien_umask)
    FICHIER_ENV.chmod(0o600)
    print(f"✓ « {appareil['name']} » ajouté au compte ; deviceId et clé enregistrés dans {FICHIER_ENV}")

    try:                                         # vérification : le Pi se connecte avec sa clé
        login(Config.depuis_env(valeurs))
        print("✓ connexion par clé vérifiée")
    except (ErreurConfig, ErreurLogin, ConnectionError) as e:
        sys.exit(f"ÉCHEC de la vérification : {e}")
    print("Ensuite : set -a; source .env; set +a ; python -m outils.connexion (ou le service)")


if __name__ == "__main__":
    main()
