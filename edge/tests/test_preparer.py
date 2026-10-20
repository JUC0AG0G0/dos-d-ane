"""Préparation d'un Pi pour l'appairage par code (outils/preparer.py), sans réseau."""

from outils.preparer import etiquette, lire_env, nouveau_code, nouveau_secret, valeurs_preparees
from posture.serveur import FORMAT_CODE, FORMAT_SECRET, ConfigAppairage

SERVEUR = "https://dosdane.example.com"


def test_code_et_secret_au_format_attendu_par_le_serveur():
    codes = {nouveau_code() for _ in range(200)}
    assert all(FORMAT_CODE.fullmatch(code) for code in codes) and len(codes) == 200   # tirés au hasard
    assert FORMAT_SECRET.fullmatch(nouveau_secret())


def test_premiere_preparation_lisible_par_le_service():
    valeurs = valeurs_preparees({}, SERVEUR)
    assert ConfigAppairage.depuis_env(valeurs).serveur == SERVEUR
    assert "DOSDANE_CLE" not in valeurs                          # rien à retirer


def test_relancee_garde_le_code_de_l_etiquette():
    actuel = {"DOSDANE_CODE": "K7F-29Q-M4T", "DOSDANE_SECRET_APPAIRAGE": "ps_" + "s" * 43}
    assert valeurs_preparees(actuel, SERVEUR)["DOSDANE_CODE"] == "K7F-29Q-M4T"
    assert valeurs_preparees(actuel, SERVEUR, nouveau=True)["DOSDANE_CODE"] != "K7F-29Q-M4T"


def test_code_sans_secret_valable_remplace():
    valeurs = valeurs_preparees({"DOSDANE_CODE": "K7F-29Q-M4T"}, SERVEUR)
    assert valeurs["DOSDANE_CODE"] != "K7F-29Q-M4T" and ConfigAppairage.depuis_env(valeurs)


def test_cle_retiree_seulement_si_demande():
    actuel = {"DOSDANE_APPAREIL": "01a1-pi", "DOSDANE_CLE": "dk_" + "k" * 43}
    assert "DOSDANE_CLE" not in valeurs_preparees(actuel, SERVEUR)
    retiree = valeurs_preparees(actuel, SERVEUR, retirer_cle=True)
    assert (retiree["DOSDANE_APPAREIL"], retiree["DOSDANE_CLE"]) == ("", "")


def test_lire_env_ignore_commentaires(tmp_path):
    fichier = tmp_path / ".env"
    fichier.write_text("# commentaire\nDOSDANE_SERVEUR=http://x\nDOSDANE_CLE=\n\n")
    assert lire_env(fichier) == {"DOSDANE_SERVEUR": "http://x", "DOSDANE_CLE": ""}
    assert lire_env(tmp_path / "absent") == {}


def test_etiquette_alignee():
    assert len({len(ligne) for ligne in etiquette("K7F-29Q-M4T").splitlines()}) == 1
