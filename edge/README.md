# Edge : analyse de posture sur le Raspberry Pi

Webcam de profil → MoveNet (17 points du corps) → angles tête et tronc → règles de posture.
**Aucune image ne quitte le Pi ni n'est écrite sur le disque.**

Plan et résultats du POC : [docs/poc-raspberry.md](docs/poc-raspberry.md).

## Installation (sur le Pi)

Testé sur Raspberry Pi 4, Raspberry Pi OS 64 bits (Debian 13), Python 3.13 ; compatible Python 3.11+.

```bash
cd edge
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Modèles MoveNet à placer dans `models/` (non commités) : voir [docs/poc-raspberry.md §3.4](docs/poc-raspberry.md).

## Les fichiers

| Fichier | Rôle | En session réelle ? |
|---|---|---|
| `posture_lib.py` | le cœur : caméra, MoveNet, angles, règles | ✅ |
| `poc.py` | la vraie session (à écrire, §5.8 de la doc) | ✅ |
| `live.py` | outil de debug : fenêtre en direct avec squelette, angles et règles | ❌ |
| `tests_poc/` | tests de mesure (T1, T2, T5…) | ❌ |
| `models/` | modèles MoveNet `.tflite` (non commités) | |
| `resultats/` | CSV de mesures, jamais d'images (non commités : données personnelles) | |

## Lancer (depuis `edge/`, `.venv` activé)

```bash
python live.py                          # debug en direct (sur le bureau du Pi) ; q pour quitter
python -m tests_poc.t2_camera --court   # test T2 de la caméra, 1 minute
python -m tests_poc.t2_camera           # test T2 complet, 1 heure
```
