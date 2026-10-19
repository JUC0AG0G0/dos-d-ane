"""Écriture du deviceId et de la clé dans edge/.env par outils/appairer.py, sans réseau."""

from outils.appairer import mettre_a_jour_env

VALEURS = {"DOSDANE_SERVEUR": "https://dosdane.example.com", "DOSDANE_APPAREIL": "01a1-…", "DOSDANE_CLE": "dk_x"}


def test_fichier_vide():
    assert mettre_a_jour_env("", VALEURS) == (
        "DOSDANE_SERVEUR=https://dosdane.example.com\nDOSDANE_APPAREIL=01a1-…\nDOSDANE_CLE=dk_x\n")


def test_remplace_l_ancienne_configuration_et_garde_le_reste():
    ancien = ("# Configuration du Pi\nDOSDANE_SERVEUR=http://localhost:3000\nDOSDANE_EMAIL=pi@example.com\n"
              "AUTRE=garde\n# DOSDANE_CLE=commentaire laissé tel quel\n")
    nouveau = mettre_a_jour_env(ancien, VALEURS)
    assert nouveau.splitlines() == [
        "# Configuration du Pi", "DOSDANE_SERVEUR=https://dosdane.example.com", "DOSDANE_EMAIL=pi@example.com",
        "AUTRE=garde", "# DOSDANE_CLE=commentaire laissé tel quel", "DOSDANE_APPAREIL=01a1-…", "DOSDANE_CLE=dk_x"]
