"""Prépare ce Pi pour l'appairage par code (docs/liaison-serveur.md §2) : à lancer une fois, par l'équipe.

Crée le code de l'étiquette et le secret de relève, et les écrit dans edge/.env avec l'adresse du serveur.
Ensuite, l'utilisateur n'a qu'à brancher le Pi et taper le code dans « Ajouter un Raspberry Pi » :
le service (C1) attend d'être ajouté à un compte, reçoit sa clé et se connecte, sans SSH ni mot de passe.

Relancé sur un Pi déjà préparé, il garde son code (--nouveau-code pour en créer un autre).
Une clé déjà présente n'est retirée qu'après confirmation : copie de edge/.env dans .env.avant-preparation.

Lancer depuis edge/ avec .venv activé :
    python -m outils.preparer --serveur https://dos-d-ane.julescorneille.fr
"""

import argparse
import secrets
import shutil
import subprocess
import sys

from posture.chemins import FICHIER_ENV
from posture.serveur import FORMAT_CODE, FORMAT_SECRET, ConfigAppairage, ErreurConfig, enregistrer_env, requete

# Crockford base32 : sans I, L, O, U (pas de confusion 1/I/L, 0/O en recopiant l'étiquette)
ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"


def nouveau_code():
    """9 caractères tirés au hasard (~45 bits) ; deviner un code est rendu impossible par les limites du serveur."""
    return "".join(secrets.choice(ALPHABET) for _ in range(9))


def nouveau_secret():
    """Secret de relève : 256 bits, connu du Pi seul."""
    return "ps_" + secrets.token_urlsafe(32)


def lire_env(fichier):
    """Variables NOM=valeur du fichier (sans les commentaires) ; vide s'il n'existe pas."""
    if not fichier.exists():
        return {}
    lignes = (ligne.strip() for ligne in fichier.read_text().splitlines())
    return dict(ligne.split("=", 1) for ligne in lignes if "=" in ligne and not ligne.startswith("#"))


def valeurs_preparees(actuel, serveur, nouveau=False, retirer_cle=False):
    """Variables à écrire dans edge/.env : code et secret gardés s'ils sont valables, sauf `nouveau`."""
    garder = (not nouveau and FORMAT_CODE.fullmatch(actuel.get("DOSDANE_CODE", "").upper().replace("-", ""))
              and FORMAT_SECRET.fullmatch(actuel.get("DOSDANE_SECRET_APPAIRAGE", "")))
    valeurs = {
        "DOSDANE_SERVEUR": serveur,
        "DOSDANE_CODE": actuel["DOSDANE_CODE"] if garder else nouveau_code(),
        "DOSDANE_SECRET_APPAIRAGE": actuel.get("DOSDANE_SECRET_APPAIRAGE") if garder else nouveau_secret(),
    }
    if retirer_cle:
        valeurs |= {"DOSDANE_APPAREIL": "", "DOSDANE_CLE": ""}
    return valeurs


def etiquette(code_affiche):
    return "\n".join(["┌─────────────────────────┐",
                      "│  Dos d'âne              │",
                      f"│  Code : {code_affiche}     │",
                      "└─────────────────────────┘"])


def main():
    parser = argparse.ArgumentParser(description="Prépare ce Pi pour l'appairage par code d'étiquette")
    parser.add_argument("--serveur", help="adresse du serveur (par défaut : celle de edge/.env, sinon demandée)")
    parser.add_argument("--nouveau-code", action="store_true", help="créer un autre code (étiquette à refaire)")
    parser.add_argument("--oui", action="store_true", help="retirer la clé actuelle sans demander")
    args = parser.parse_args()

    actuel = lire_env(FICHIER_ENV)
    serveur = (args.serveur or actuel.get("DOSDANE_SERVEUR") or input("Serveur (https://…) : ")).strip().rstrip("/")
    a_une_cle = bool(actuel.get("DOSDANE_CLE"))
    retirer = a_une_cle and (args.oui or input(
        "Ce Pi a déjà une clé. La retirer pour qu'il attende d'être ajouté avec son code ? [o/N] ")
        .strip().lower() in ("o", "oui"))

    valeurs = valeurs_preparees(actuel, serveur, args.nouveau_code, retirer)
    try:                                         # même vérification que le service au démarrage
        config = ConfigAppairage.depuis_env(valeurs)
    except ErreurConfig as e:
        sys.exit(f"ÉCHEC : {e}")
    if FICHIER_ENV.exists():
        copie = FICHIER_ENV.with_name(".env.avant-preparation")
        shutil.copy2(FICHIER_ENV, copie)
        copie.chmod(0o600)
        print(f"Copie de l'ancienne configuration : {copie}")
    enregistrer_env(FICHIER_ENV, valeurs)
    print(f"✓ code et secret enregistrés dans {FICHIER_ENV} (lisible par vous seul)")
    if a_une_cle and not retirer:
        print("  La clé actuelle est gardée : le code servira si elle est révoquée depuis le site.")

    try:
        code, _ = requete(serveur, "GET", "/api/health")
        print("✓ serveur joignable" if code == 200 else f"⚠ le serveur répond HTTP {code}")
    except ConnectionError as e:
        print(f"⚠ {e} : le Pi réessaiera tout seul, mais vérifier le réseau et l'adresse")
    actif = subprocess.run(["systemctl", "is-enabled", "dos-dane"], capture_output=True, text=True).stdout.strip()
    if actif != "enabled":
        print("⚠ service pas activé au démarrage : voir docs/poc-raspberry.md §3.6")

    print("\nÀ écrire sur l'étiquette collée sur le Pi :\n")
    print(etiquette(config.code_affiche))
    print("\nEnsuite : sudo systemctl restart dos-dane, puis journalctl -u dos-dane -f"
          " (« en attente d'appairage »), et taper le code dans « Ajouter un Raspberry Pi ».")


if __name__ == "__main__":
    main()
