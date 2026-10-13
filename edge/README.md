# Edge : analyse de posture sur le Raspberry Pi

Webcam de profil → MoveNet (17 points du corps) → angles tête, tronc et cou → règles de posture → filtre dans le temps → alertes.
**Aucune image ne quitte le Pi ni n'est écrite sur le disque.**

- Comment l'algorithme décide (contrôles, angles, seuils et leurs sources, filtre, score) : [docs/algo-posture.md](docs/algo-posture.md)
- Plan, installation détaillée et résultats des tests du POC : [docs/poc-raspberry.md](docs/poc-raspberry.md)
- Architecture complète (serveur, RGPD, messages) : [docs/Audit_technique_final_Fil_Rouge_Master_UHA_4_0_v3.md](docs/Audit_technique_final_Fil_Rouge_Master_UHA_4_0_v3.md)

## Installation

Sur le Pi (Raspberry Pi 4, Raspberry Pi OS 64 bits Debian 13, Python 3.13 ; compatible Python 3.11+) :

```bash
cd edge
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Modèles MoveNet à placer dans `models/` (non commités) : voir [docs/poc-raspberry.md §3.4](docs/poc-raspberry.md).

Pour les tests unitaires seulement (PC ou Pi, pas besoin de webcam ni de modèle) : `pip install -r requirements-dev.txt`.

## Organisation

```text
edge/
├── poc.py          la vraie session : une image de temps en temps, alertes, résumés (sans fenêtre)
├── live.py         outil de debug : fenêtre en direct avec squelette, angles et règles
├── posture/        le cœur, commun à tous les scripts
│   ├── camera.py      ouvrir la webcam, capturer une image fraîche
│   ├── movenet.py     image → 17 points
│   ├── points.py      côté vu, point mal vu complété, personne présente
│   ├── angles.py      points → angles ; contrôle « de profil »
│   ├── regles.py      angles → postures (seuils fixes)
│   ├── filtre.py      bocal (fenêtre glissante → alertes), temps assis
│   ├── score.py       résumé de 5 min, score
│   ├── mesures.py     une ligne de CSV par image
│   └── chemins.py, pi.py
├── outils/         outils de mesure sur le Pi (T2, T4, enregistrement des volontaires, F1…)
├── tests/          tests unitaires de l'algorithme (pytest)
├── docs/           documentation
├── models/         modèles MoveNet .tflite (non commités) ; Thunder int8 par défaut
└── resultats/      CSV de mesures, jamais d'images (non commités : données personnelles)
```

## Lancer (depuis `edge/`, `.venv` activé)

```bash
python poc.py                          # session normale ; Ctrl+C pour terminer
python poc.py --rapide                 # durées raccourcies pour essayer (alerte en 10 s…)
python live.py                         # debug en direct (sur le bureau du Pi) ; q pour quitter

python -m outils.t2_camera --court     # T2 : la webcam tient (1 minute ; sans --court : 1 heure)
python -m outils.t4_modeles            # T4 : Lightning contre Thunder
python -m outils.enregistrer P02       # T5 : enregistrement guidé d'un volontaire
python -m outils.evaluer               # T5 : F1 des règles sur les enregistrements
python -m outils.confiance             # images ignorées et seuil de confiance

python -m pytest                       # tests unitaires (sur le PC ou le Pi)
```
