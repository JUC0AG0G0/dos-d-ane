"""La vraie session du POC (docs/poc-raspberry.md §5.5) : sans fenêtre, une image de temps en temps.

Boucle : capture → MoveNet → l'image est oubliée → angles → règles → bocaux → événements.
- Bocal « vers l'avant » (tête en avant, dos penché, cou penché) et bocal « allongé » : alerte si
  ≥ 70 % d'images mauvaises sur 60 s pendant 2 min, fin sous 40 %, nom = cause la plus fréquente.
  Tête en avant et cou penché ont un seul nom d'alerte : vus de profil, leurs angles se confondent
  (la part de chacun est gardée dans l'événement et les règles restent séparées dans les mesures).
- « Levez-vous » après 50 min assis sans pause (absent ≥ 1 min = pause).
- Résumé toutes les 5 min : score (% du temps en bonne posture), temps vert / orange / rouge,
  temps ignoré (image mal vue) et absent.
- Cadence adaptative : 10 s si tout va bien, 2 s dès qu'une image est mauvaise (tant qu'il en reste
  une dans la fenêtre), 30 s si personne n'est vu sur 3 images d'affilée.
Aucune calibration : les règles utilisent des seuils fixes (algo-posture.md).

Écrit dans resultats/ (chiffres seulement, jamais d'image) :
    poc_<date>.csv              une ligne par image (format posture_lib.COLONNES_CSV)
    poc_<date>_evenements.csv   début et fin de chaque alerte
    poc_<date>_resumes.csv      un résumé toutes les 5 min (audit §7.2)
Rien n'est encore envoyé au serveur : tout passe par envoyer_evenement(), où l'envoi s'ajoutera.

Lancer depuis edge/ avec .venv activé :
    python poc.py                    # session normale, Ctrl+C pour terminer
    python poc.py --rapide           # durées raccourcies pour tester (fenêtre 10 s, alerte en 10 s…)
    python poc.py --cadence-fixe 2   # T7 : comparer avec une image toutes les 2 s
Depuis le PC :  ssh -t pi 'cd ~/dos-d-ane/edge && .venv/bin/python poc.py'
"""

import argparse
import csv
import time
from datetime import datetime

from posture_lib import (COLONNES_CSV, DOSSIER_RESULTATS, DUREE_RESUME, Bocal, Completeur, CoteStable, MoveNet,
                         Resume, TempsAssis,
                         angles, capturer, ligne_csv, ouvrir_camera, personne_vue, postures, temperature_pi,
                         throttled_pi)

CADENCE_CALME, CADENCE_DOUTE, CADENCE_ABSENT = 10, 2, 30     # s entre deux images
IMAGES_ABSENT = 3                                             # images d'affilée sans personne = absent
ECHECS_REOUVERTURE = 5                                        # captures ratées d'affilée avant de rouvrir la webcam
VERS_L_AVANT = ("Dos penche", "Cou penche", "Tete en avant")  # une seule cause par image, dans cet ordre
ALLONGE = "Allonge dans la chaise"
TETE = "Tete en avant ou baissee"                              # nom commun de tête en avant et cou penché
REGROUPEMENT = {"Tete en avant": TETE, "Cou penche": TETE}
# Codes des messages (audit §7.2) et conseils affichés
TYPES = {TETE: "FORWARD_HEAD", "Tete en avant": "FORWARD_HEAD", "Cou penche": "NECK_FLEXION",
         "Dos penche": "TRUNK_FORWARD", ALLONGE: "TRUNK_BACKWARD", "Assis trop longtemps": "IMMOBILE"}
CONSEILS = {TETE: "relevez la tête (téléphone ou écran à hauteur des yeux) et reculez-vous de l'écran",
            "Dos penche": "redressez-vous, le dos contre le dossier",
            ALLONGE: "rasseyez-vous au fond de la chaise",
            "Assis trop longtemps": "levez-vous 2 minutes"}
COLONNES_EVENEMENTS = ["id", "session", "type", "phase", "heure", "debut", "duree_s", "tete_moy", "tronc_moy",
                       "detail"]
# secondes_bonne / moyenne / a_ameliorer = temps en vert / orange / rouge (audit §7.2)
COLONNES_RESUMES = ["id", "session", "periode", "score_moyen", "secondes_bonne", "secondes_moyenne",
                    "secondes_a_ameliorer", "secondes_ignore", "secondes_absent"]


class Session:
    """Numérote les événements et résumés, les affiche et les écrit (puis les enverra au serveur)."""

    def __init__(self, base):
        self.id = f"ses_{datetime.now():%Y%m%d_%H%M%S}"
        self.fichier = open(f"{base}_evenements.csv", "w", newline="")
        self.ecrivain = csv.writer(self.fichier)
        self.ecrivain.writerow(COLONNES_EVENEMENTS)
        self.fichier_resumes = open(f"{base}_resumes.csv", "w", newline="")
        self.ecrivain_resumes = csv.writer(self.fichier_resumes)
        self.ecrivain_resumes.writerow(COLONNES_RESUMES)
        self.numero = self.numero_resume = 0
        self.debuts = {}            # cause → heure de début de l'alerte en cours
        self.nombre = 0             # alertes déclenchées

    def envoyer_evenement(self, cause, phase, moyennes=None, detail=None):
        self.numero += 1
        maintenant = datetime.now()
        if phase == "debut":
            self.debuts[cause] = maintenant
            self.nombre += 1
        debut = self.debuts.get(cause, maintenant)
        duree = round((maintenant - debut).total_seconds()) if phase == "fin" else ""
        message = {"id": f"evt_{self.numero:04d}", "session": self.id, "type": TYPES[cause], "phase": phase,
                   "heure": maintenant.isoformat(timespec="seconds"), "debut": debut.isoformat(timespec="seconds"),
                   "duree_s": duree, **({"tete_moy": moyennes["tete"], "tronc_moy": moyennes["tronc"]}
                                        if moyennes else {"tete_moy": "", "tronc_moy": ""}),
                   "detail": ";".join(f"{TYPES[c]}:{p}" for c, p in (detail or {}).items())}
        self.ecrivain.writerow([message[k] for k in COLONNES_EVENEMENTS])
        self.fichier.flush()
        # (après le POC) : envoi HTTPS POST au serveur, avec ce même message
        if phase == "debut":
            parts = f"  ({', '.join(f'{c} {p} %' for c, p in detail.items())})" if detail and len(detail) > 1 else ""
            print(f"\a🔔 {maintenant:%H:%M:%S}  ALERTE {cause.upper()} — {CONSEILS[cause]}{parts}")
        else:
            print(f"✅ {maintenant:%H:%M:%S}  fin : {cause} (durée {duree // 60} min {duree % 60} s)")

    def envoyer_resume(self, resume, debut):
        self.numero_resume += 1
        s = {k: round(v) for k, v in resume.secondes.items()}
        message = {"id": f"res_{self.numero_resume:04d}", "session": self.id,
                   "periode": f"{debut:%H:%M}-{datetime.now():%H:%M}", "score_moyen": resume.score(),
                   "secondes_bonne": s.get("vert", 0), "secondes_moyenne": s.get("orange", 0),
                   "secondes_a_ameliorer": s.get("rouge", 0), "secondes_ignore": s.get("ignore", 0),
                   "secondes_absent": s.get("absent", 0)}
        self.ecrivain_resumes.writerow([message[k] for k in COLONNES_RESUMES])
        self.fichier_resumes.flush()
        # (après le POC) : envoi HTTPS POST au serveur, avec ce même message
        score = "-" if message["score_moyen"] is None else f"{message['score_moyen']} / 100"
        print(f"📊 résumé {message['periode']} : score {score}, vert {message['secondes_bonne']} s, "
              f"orange {message['secondes_moyenne']} s, rouge {message['secondes_a_ameliorer']} s, "
              f"ignoré {message['secondes_ignore']} s, absent {message['secondes_absent']} s")

    def fermer(self):
        self.fichier.close()
        self.fichier_resumes.close()


def main():
    parser = argparse.ArgumentParser(description="Session de suivi de posture (POC)")
    parser.add_argument("--rapide", action="store_true",
                        help="fenêtre 10 s, confirmation 10 s, anti-rafale 1 min, « levez-vous » après 1 min")
    parser.add_argument("--cadence-fixe", type=float, help="une image toutes les N s (comparaison T7)")
    args = parser.parse_args()

    if args.rapide:
        reglages = dict(fenetre=10, confirmation=10, anti_rafale=60)
        assis, duree_resume = TempsAssis(assis_max=60, pause_min=15), 60
    else:
        reglages = {}
        assis, duree_resume = TempsAssis(), DUREE_RESUME
    avant, allonge = Bocal(regroupement=REGROUPEMENT, **reglages), Bocal(**reglages)

    cam = ouvrir_camera()
    if not cam.isOpened():
        print("ÉCHEC : impossible d'ouvrir la webcam")
        return
    movenet, cote_stable, completeur = MoveNet(), CoteStable(), Completeur()
    DOSSIER_RESULTATS.mkdir(exist_ok=True)
    base = DOSSIER_RESULTATS / f"poc_{datetime.now():%Y-%m-%d_%H%M%S}"
    session = Session(base)
    mesures = open(f"{base}.csv", "w", newline="")
    ecrivain = csv.writer(mesures)
    ecrivain.writerow(COLONNES_CSV)

    print(f"Session {session.id}{' (mode rapide)' if args.rapide else ''} : Ctrl+C pour terminer")
    print(f"Mesures : {base}.csv   Événements et résumés : {base}_evenements.csv, _resumes.csv")
    temp_debut, debut_session = temperature_pi(), time.monotonic()
    images, absent_de_suite, echecs = 0, 0, 0
    resume, total = Resume(), Resume()
    debut_resume, debut_resume_heure = debut_session, datetime.now()
    precedente = None                 # (instant, état, bonne) de l'image précédente, pour les durées
    try:
        while True:
            t_boucle = time.monotonic()
            image = capturer(cam)
            if image is None:
                echecs += 1
                print(f"capture ratée ({echecs})")
                if echecs % ECHECS_REOUVERTURE == 0:     # webcam débranchée ou figée : on la rouvre
                    cam.release()
                    cam = ouvrir_camera()
                    print("webcam rouverte" if cam.isOpened() else "webcam toujours absente")
                time.sleep(CADENCE_DOUTE)
                continue
            echecs = 0
            pts = movenet.points(image)
            del image                                        # l'image n'a existé qu'en mémoire
            images += 1
            cote = cote_stable.maj(pts)
            pts_c, complete = completeur.maj(pts, cote)
            a = angles(pts_c, cote)
            vue = personne_vue(pts)
            absent_de_suite = 0 if vue else absent_de_suite + 1
            ecrivain.writerow(ligne_csv("SESSION", pts, cote, a, None, complete))

            instant = time.monotonic()
            evenements = []
            if a:
                regles = postures(a)
                cause = next((n for n in VERS_L_AVANT if regles[n][0]), None)
                evenements.append((avant.ajouter(instant, cause, a), avant))
                evenements.append((allonge.ajouter(instant, ALLONGE if regles[ALLONGE][0] else None, a), allonge))
                posture = REGROUPEMENT.get(cause, cause) or (ALLONGE if regles[ALLONGE][0] else "bonne posture")
            else:                                            # fenêtre vide : l'alerte en cours se termine
                evenements.append((avant.elaguer(instant), avant))
                evenements.append((allonge.elaguer(instant), allonge))
                posture = "absent" if absent_de_suite >= IMAGES_ABSENT else "ignorée"
            for liste, bocal in evenements:
                for phase, nom in liste:
                    session.envoyer_evenement(nom, phase, bocal.moyennes(), bocal.detail())
            phase_assis = assis.maj(instant, vue)
            if phase_assis:
                session.envoyer_evenement("Assis trop longtemps", phase_assis)

            # État en direct (plus tard envoyé à l'app à chaque image, audit §7.2)
            couleur = "rouge" if "rouge" in (avant.couleur(), allonge.couleur()) else \
                "orange" if "orange" in (avant.couleur(), allonge.couleur()) else "vert"
            etat = couleur if a else "absent" if absent_de_suite >= IMAGES_ABSENT else "ignore"
            if precedente:                # l'image précédente compte jusqu'à celle-ci
                for r in (resume, total):
                    r.ajouter(instant - precedente[0], *precedente[1:])
            precedente = (instant, etat, posture == "bonne posture")
            if instant - debut_resume >= duree_resume:
                session.envoyer_resume(resume, debut_resume_heure)
                resume, debut_resume, debut_resume_heure = Resume(), instant, datetime.now()
            mesure = f"tête {a['tete']:3.0f}°  tronc {a['tronc']:+4.0f}°  " if a else " " * 23
            print(f"{datetime.now():%H:%M:%S}  {couleur:6s} {posture:24s} {mesure}"
                  f"avant {100 * avant.taux():3.0f} %  assis {assis.duree(instant) / 60:4.1f} min")

            if args.cadence_fixe:
                cadence = args.cadence_fixe
            elif absent_de_suite >= IMAGES_ABSENT:
                cadence = CADENCE_ABSENT
            elif avant.mauvaise_recente() or allonge.mauvaise_recente():
                cadence = CADENCE_DOUTE
            else:
                cadence = CADENCE_CALME
            time.sleep(max(0.0, cadence - (time.monotonic() - t_boucle)))
            mesures.flush()
    except KeyboardInterrupt:
        print("\nSession terminée.")
        for bocal in (avant, allonge):            # fermer les alertes encore ouvertes
            if bocal.alerte:
                session.envoyer_evenement(bocal.alerte, "fin", bocal.moyennes(), bocal.detail())
        if assis.alerte:
            session.envoyer_evenement("Assis trop longtemps", "fin")
        if precedente:                    # dernière image, puis dernier résumé (période incomplète)
            for r in (resume, total):
                r.ajouter(time.monotonic() - precedente[0], *precedente[1:])
            session.envoyer_resume(resume, debut_resume_heure)
    finally:
        cam.release()
        mesures.close()
        session.fermer()

    minutes = (time.monotonic() - debut_session) / 60
    print("\n===== Bilan =====")
    print(f"Durée       : {minutes:.1f} min, {images} images ({images / max(minutes, 1e-9):.1f} par minute)")
    print(f"Alertes     : {session.nombre}")
    score = total.score()
    suivi = sum(total.secondes[c] for c in ("vert", "orange", "rouge"))
    print(f"Score       : {'-' if score is None else f'{score} / 100'} (% du temps en bonne posture, sur "
          f"{suivi / 60:.1f} min suivies ; ignoré {total.secondes['ignore']:.0f} s, absent {total.secondes['absent']:.0f} s)")
    print(f"Température : {temp_debut} °C → {temperature_pi()} °C, throttled {throttled_pi()}")


if __name__ == "__main__":
    main()
