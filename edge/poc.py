"""La vraie session du POC (docs/poc-raspberry.md §5.5) : sans fenêtre, une image de temps en temps.

Boucle : capture → MoveNet → l'image est oubliée → angles → règles → bocaux → événements.
- Bocal « vers l'avant » (tête en avant, dos penché, cou penché) et bocal « allongé » : alerte si
  ≥ 70 % d'images mauvaises sur 60 s pendant 1 min, fin sous 40 %, nom = cause la plus fréquente.
  Tête en avant et cou penché ont un seul nom d'alerte : vus de profil, leurs angles se confondent
  (la part de chacun est gardée dans l'événement et les règles restent séparées dans les mesures).
- « Levez-vous » après 50 min assis sans pause (absent ≥ 1 min = pause).
- Résumé toutes les 5 min : score (% du temps en bonne posture), temps vert / orange / rouge,
  temps ignoré (image mal vue) et absent.
- Cadence adaptative : 10 s si tout va bien, 2 s tant qu'au moins 20 % des images de la fenêtre sont
  mauvaises (Bocal.en_doute) ou après une image non jugée (absence vue en ~12 s), 30 s si personne
  n'est là (posture.points.Presence).
Aucune calibration : les règles utilisent des seuils fixes (algo-posture.md).

Écrit dans resultats/ (chiffres seulement, jamais d'image) :
    poc_<date>.csv              une ligne par image (format posture.mesures.COLONNES_CSV)
    poc_<date>_evenements.csv   début et fin de chaque alerte
    poc_<date>_resumes.csv      un résumé toutes les 5 min (audit §7.2)
En mode service, alertes et résumés partent aussi au serveur (envoyer_evenement(), envoyer_resume() :
contrat docs/liaison-serveur.md §4), sans jamais bloquer l'analyse.

Mode service (--service) : le serveur décide quand une session commence et finit (docs/liaison-serveur.md).
La webcam n'est ouverte que pendant une session ; une coupure de la liaison n'arrête pas l'analyse.

Lancer depuis edge/ avec .venv activé :
    python poc.py                    # session normale, Ctrl+C pour terminer
    python poc.py --rapide           # durées raccourcies pour tester (fenêtre 10 s, alerte en 10 s…)
    python poc.py --cadence-fixe 2   # T7 : comparer avec une image toutes les 2 s
    python poc.py --service          # attend session:start / session:stop (configuration : edge/.env)
Depuis le PC :  ssh -t pi 'cd ~/dos-d-ane/edge && .venv/bin/python poc.py'
Ctrl+C ou SIGTERM (systemd) : l'analyse en cours se termine proprement (dernier résumé, bilan).
"""

import argparse
import csv
import logging
import queue
import signal
import sys
import time
from datetime import datetime, timezone

from posture.angles import angles
from posture.camera import capturer, ouvrir_camera
from posture.chemins import DOSSIER_RESULTATS
from posture.filtre import Bocal, TempsAssis
from posture.mesures import COLONNES_CSV, ligne_csv
from posture.movenet import MoveNet
from posture.pi import temperature_pi, throttled_pi
from posture.points import Completeur, CoteStable, Presence
from posture.regles import postures
from posture.score import DUREE_RESUME, Resume
from posture.serveur import Config, Envoi, ErreurConfig, Liaison, commande

CADENCE_CALME, CADENCE_DOUTE, CADENCE_ABSENT = 10, 2, 30     # s entre deux images
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
# État en direct (message state, docs/liaison-serveur.md §3)
COULEURS_DIRECT = {"vert": "green", "orange": "orange", "rouge": "red", "ignore": "ignored", "absent": "absent"}
COLONNES_EVENEMENTS = ["id", "session", "type", "phase", "heure", "debut", "duree_s", "tete_moy", "tronc_moy",
                       "detail"]
# secondes_bonne / moyenne / a_ameliorer = temps en vert / orange / rouge (audit §7.2)
COLONNES_RESUMES = ["id", "session", "periode", "score_moyen", "secondes_bonne", "secondes_moyenne",
                    "secondes_a_ameliorer", "secondes_ignore", "secondes_absent"]


def heure_utc(moment):
    """Heure locale du Pi → ISO 8601 en UTC, comme l'attend le serveur."""
    return moment.astimezone(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")


class Session:
    """Numérote les événements et résumés, les affiche, les écrit, et les envoie au serveur en mode service.

    Une alerte garde le même id au début et à la fin : le serveur complète la même ligne (contrat §4).
    """

    def __init__(self, base, id_session=None, envoi=None):
        self.id = id_session or f"ses_{datetime.now():%Y%m%d_%H%M%S}"     # id du serveur en mode service
        self.envoi = envoi
        self.ids = {}               # cause → id de l'alerte en cours
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
        maintenant = datetime.now()
        if phase == "debut" or cause not in self.ids:
            self.numero += 1
            self.ids[cause] = f"evt_{self.numero:04d}"
        id_alerte = self.ids[cause] if phase == "debut" else self.ids.pop(cause)
        if phase == "debut":
            self.debuts[cause] = maintenant
            self.nombre += 1
        debut = self.debuts.get(cause, maintenant)
        duree = round((maintenant - debut).total_seconds()) if phase == "fin" else ""
        message = {"id": id_alerte, "session": self.id, "type": TYPES[cause], "phase": phase,
                   "heure": maintenant.isoformat(timespec="seconds"), "debut": debut.isoformat(timespec="seconds"),
                   "duree_s": duree, **({"tete_moy": moyennes["tete"], "tronc_moy": moyennes["tronc"]}
                                        if moyennes else {"tete_moy": "", "tronc_moy": ""}),
                   "detail": ";".join(f"{TYPES[c]}:{p}" for c, p in (detail or {}).items())}
        self.ecrivain.writerow([message[k] for k in COLONNES_EVENEMENTS])
        self.fichier.flush()
        if self.envoi:                           # même contenu, aux noms de l'API (contrat §4)
            self.envoi.deposer(f"/api/analysis-sessions/{self.id}/events", {
                "clientId": id_alerte, "type": TYPES[cause], "phase": "start" if phase == "debut" else "end",
                "startedAt": heure_utc(debut), **({"endedAt": heure_utc(maintenant)} if phase == "fin" else {}),
                "headAngleAvg": moyennes["tete"] if moyennes else None,
                "trunkAngleAvg": moyennes["tronc"] if moyennes else None,
                "causes": {TYPES[c]: p for c, p in detail.items()} if detail else None})
        if phase == "debut":
            parts = f"  ({', '.join(f'{c} {p} %' for c, p in detail.items())})" if detail and len(detail) > 1 else ""
            print(f"\a🔔 {maintenant:%H:%M:%S}  ALERTE {cause.upper()} — {CONSEILS[cause]}{parts}")
        else:
            print(f"✅ {maintenant:%H:%M:%S}  fin : {cause} (durée {duree // 60} min {duree % 60} s)")

    def envoyer_resume(self, resume, debut):
        self.numero_resume += 1
        fin = datetime.now()
        s = {k: round(v) for k, v in resume.secondes.items()}
        message = {"id": f"res_{self.numero_resume:04d}", "session": self.id,
                   "periode": f"{debut:%H:%M}-{fin:%H:%M}", "score_moyen": resume.score(),
                   "secondes_bonne": s.get("vert", 0), "secondes_moyenne": s.get("orange", 0),
                   "secondes_a_ameliorer": s.get("rouge", 0), "secondes_ignore": s.get("ignore", 0),
                   "secondes_absent": s.get("absent", 0)}
        self.ecrivain_resumes.writerow([message[k] for k in COLONNES_RESUMES])
        self.fichier_resumes.flush()
        if self.envoi:
            self.envoi.deposer(f"/api/analysis-sessions/{self.id}/summaries", {
                "clientId": message["id"], "periodStart": heure_utc(debut), "periodEnd": heure_utc(fin),
                "score": message["score_moyen"], "secondsGreen": message["secondes_bonne"],
                "secondsOrange": message["secondes_moyenne"], "secondsRed": message["secondes_a_ameliorer"],
                "secondsIgnored": message["secondes_ignore"], "secondsAbsent": message["secondes_absent"]})
        score = "-" if message["score_moyen"] is None else f"{message['score_moyen']} / 100"
        print(f"📊 résumé {message['periode']} : score {score}, vert {message['secondes_bonne']} s, "
              f"orange {message['secondes_moyenne']} s, rouge {message['secondes_a_ameliorer']} s, "
              f"ignoré {message['secondes_ignore']} s, absent {message['secondes_absent']} s")

    def fermer(self):
        self.fichier.close()
        self.fichier_resumes.close()


class Analyse:
    """Une session d'analyse, de l'ouverture de la webcam (fournie) à terminer() : une image à la fois."""

    def __init__(self, args, cam, movenet, id_session=None, liaison=None, envoi=None):
        self.args, self.cam, self.movenet, self.liaison = args, cam, movenet, liaison
        if args.rapide:
            reglages = dict(fenetre=10, confirmation=10, anti_rafale=60)
            self.assis, self.duree_resume = TempsAssis(assis_max=60, pause_min=15), 60
        else:
            reglages = {}
            self.assis, self.duree_resume = TempsAssis(), DUREE_RESUME
        self.avant, self.allonge = Bocal(regroupement=REGROUPEMENT, **reglages), Bocal(**reglages)
        self.cote_stable, self.completeur, self.presence = CoteStable(), Completeur(), Presence()
        DOSSIER_RESULTATS.mkdir(exist_ok=True)
        base = DOSSIER_RESULTATS / f"poc_{datetime.now():%Y-%m-%d_%H%M%S}"
        self.session = Session(base, id_session, envoi)
        self.mesures = open(f"{base}.csv", "w", newline="")
        self.ecrivain = csv.writer(self.mesures)
        self.ecrivain.writerow(COLONNES_CSV)

        print(f"Session {self.session.id}{' (mode rapide)' if args.rapide else ''}")
        print(f"Mesures : {base}.csv   Événements et résumés : {base}_evenements.csv, _resumes.csv")
        self.temp_debut, self.debut_session = temperature_pi(), time.monotonic()
        self.images, self.echecs = 0, 0
        self.resume, self.total = Resume(), Resume()
        self.debut_resume, self.debut_resume_heure = self.debut_session, datetime.now()
        self.precedente = None        # (instant, état, bonne) de l'image précédente, pour les durées

    def image(self):
        """Analyse une image ; renvoie l'attente (s) avant la suivante."""
        t_boucle = time.monotonic()
        image = capturer(self.cam)
        if image is None:
            self.echecs += 1
            print(f"capture ratée ({self.echecs})")
            if self.echecs % ECHECS_REOUVERTURE == 0:     # webcam débranchée ou figée : on la rouvre
                self.cam.release()
                self.cam = ouvrir_camera()
                print("webcam rouverte" if self.cam.isOpened() else "webcam toujours absente")
            return CADENCE_DOUTE
        self.echecs = 0
        pts = self.movenet.points(image)
        del image                                        # l'image n'a existé qu'en mémoire
        self.images += 1
        cote = self.cote_stable.maj(pts)
        pts_c, complete = self.completeur.maj(pts, cote)
        a = angles(pts_c, cote)
        vue = self.presence.maj(pts, a is not None)
        if not vue:
            a = None                                     # image fantôme sur la chaise vide : pas jugée
        self.ecrivain.writerow(ligne_csv("SESSION", pts, cote, a, None, complete))

        avant, allonge, assis, session = self.avant, self.allonge, self.assis, self.session
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
            posture = "ignorée" if vue else "absent"
        for liste, bocal in evenements:
            for phase, nom in liste:
                session.envoyer_evenement(nom, phase, bocal.moyennes(), bocal.detail())
        phase_assis = assis.maj(instant, vue)
        if phase_assis:
            session.envoyer_evenement("Assis trop longtemps", phase_assis)

        # État en direct, envoyé au serveur à chaque image en mode service (audit §7.2)
        couleur = "rouge" if "rouge" in (avant.couleur(), allonge.couleur()) else \
            "orange" if "orange" in (avant.couleur(), allonge.couleur()) else "vert"
        etat = couleur if a else "ignore" if vue else "absent"
        if self.precedente:           # l'image précédente compte jusqu'à celle-ci
            for r in (self.resume, self.total):
                r.ajouter(instant - self.precedente[0], *self.precedente[1:])
        self.precedente = (instant, etat, posture == "bonne posture")
        if self.liaison:              # perdu si la liaison est coupée : l'état suivant le remplace
            self.liaison.envoyer("state", {
                "sessionId": self.session.id,
                "at": heure_utc(datetime.now()),
                "color": COULEURS_DIRECT[etat],
                "posture": ("GOOD" if posture == "bonne posture" else TYPES[posture]) if a else None,
                "headAngle": round(a["tete"], 1) if a else None,      # deux angles, aucun point du corps
                "trunkAngle": round(a["tronc"], 1) if a else None,
                "score": self.resume.score()})
        if instant - self.debut_resume >= self.duree_resume:
            session.envoyer_resume(self.resume, self.debut_resume_heure)
            self.resume, self.debut_resume, self.debut_resume_heure = Resume(), instant, datetime.now()
        mesure = f"tête {a['tete']:3.0f}°  tronc {a['tronc']:+4.0f}°  " if a else " " * 23
        print(f"{datetime.now():%H:%M:%S}  {couleur:6s} {posture:24s} {mesure}"
              f"avant {100 * avant.taux():3.0f} %  assis {assis.duree(instant) / 60:4.1f} min")
        self.mesures.flush()

        if self.args.cadence_fixe:
            cadence = self.args.cadence_fixe
        elif not vue:
            cadence = CADENCE_ABSENT
        elif not a or avant.en_doute() or allonge.en_doute():
            cadence = CADENCE_DOUTE
        else:
            cadence = CADENCE_CALME
        return max(0.0, cadence - (time.monotonic() - t_boucle))

    def terminer(self):
        """Ferme les alertes ouvertes, envoie le dernier résumé (période incomplète), ferme tout, affiche le bilan."""
        print("\nSession terminée.")
        try:
            for bocal in (self.avant, self.allonge):
                if bocal.alerte:
                    self.session.envoyer_evenement(bocal.alerte, "fin", bocal.moyennes(), bocal.detail())
            if self.assis.alerte:
                self.session.envoyer_evenement("Assis trop longtemps", "fin")
            if self.precedente:
                for r in (self.resume, self.total):
                    r.ajouter(time.monotonic() - self.precedente[0], *self.precedente[1:])
                self.session.envoyer_resume(self.resume, self.debut_resume_heure)
        finally:
            self.cam.release()
            self.mesures.close()
            self.session.fermer()

        minutes = (time.monotonic() - self.debut_session) / 60
        total = self.total
        print("\n===== Bilan =====")
        print(f"Durée       : {minutes:.1f} min, {self.images} images "
              f"({self.images / max(minutes, 1e-9):.1f} par minute)")
        print(f"Alertes     : {self.session.nombre}")
        score = total.score()
        suivi = sum(total.secondes[c] for c in ("vert", "orange", "rouge"))
        print(f"Score       : {'-' if score is None else f'{score} / 100'} (% du temps en bonne posture, sur "
              f"{suivi / 60:.1f} min suivies ; ignoré {total.secondes['ignore']:.0f} s, absent {total.secondes['absent']:.0f} s)")
        print(f"Température : {self.temp_debut} °C → {temperature_pi()} °C, throttled {throttled_pi()}")


def manuel(args):
    """Une seule session, lancée tout de suite, jusqu'au Ctrl+C."""
    cam = ouvrir_camera()
    if not cam.isOpened():
        print("ÉCHEC : impossible d'ouvrir la webcam")
        return
    analyse = Analyse(args, cam, MoveNet())
    print("Ctrl+C pour terminer")
    try:
        while True:
            time.sleep(analyse.image())
    except KeyboardInterrupt:
        pass
    finally:
        analyse.terminer()


def service(args):
    """Attend les ordres du serveur : une Analyse par session, la webcam fermée entre deux sessions."""
    logging.basicConfig(level=logging.INFO, format="%(asctime)s  %(message)s", datefmt="%H:%M:%S")
    try:
        config = Config.depuis_env()
    except ErreurConfig as e:
        sys.exit(f"ÉCHEC : {e}")
    movenet = MoveNet()                    # chargé une fois, pour toutes les sessions
    liaison = Liaison(config).demarrer()
    envoi = Envoi(config, liaison.jeton).demarrer()     # alertes et résumés, même jeton que la liaison
    analyse, prochaine = None, 0.0         # prochaine : instant de la prochaine image
    print("Service démarré : en attente d'une session (Ctrl+C pour arrêter)")
    try:
        while liaison.erreur is None:
            if analyse and time.monotonic() >= prochaine:
                prochaine = time.monotonic() + analyse.image()
            # Attente de la prochaine image sur la file des ordres : un stop est traité tout de suite.
            attente = max(0.0, prochaine - time.monotonic()) if analyse else 1.0
            try:
                evenement, donnees = liaison.recus.get(timeout=attente)
            except queue.Empty:
                continue
            if evenement == "exception":           # message refusé par le serveur (state invalide…)
                logging.warning("refusé par le serveur : %s", donnees)
            for action, id_session in commande(analyse and analyse.session.id, evenement, donnees):
                if action == "arreter":
                    analyse.terminer()
                    analyse = None
                    print("En attente d'une session")
                else:
                    cam = ouvrir_camera()
                    if not cam.isOpened():         # image() retentera de l'ouvrir
                        print("webcam absente : nouvel essai toutes les 5 captures ratées")
                    analyse, prochaine = Analyse(args, cam, movenet, id_session, liaison, envoi), 0.0
    except KeyboardInterrupt:
        pass
    finally:
        if analyse:
            analyse.terminer()
        envoi.arreter()                    # après terminer() : le dernier résumé part aussi
        liaison.arreter()
        print(f"Envoyés au serveur : {envoi.envoyes}, refusés : {envoi.rejetes}, non envoyés : {envoi.en_attente}")
    if liaison.erreur:
        sys.exit(f"ÉCHEC : {liaison.erreur}")


def main():
    parser = argparse.ArgumentParser(description="Session de suivi de posture (POC)")
    parser.add_argument("--rapide", action="store_true",
                        help="fenêtre 10 s, confirmation 10 s, anti-rafale 1 min, « levez-vous » après 1 min")
    parser.add_argument("--cadence-fixe", type=float, help="une image toutes les N s (comparaison T7)")
    parser.add_argument("--service", action="store_true",
                        help="sessions démarrées et arrêtées par le serveur (docs/liaison-serveur.md)")
    args = parser.parse_args()
    # systemd arrête le service par SIGTERM : même fin propre qu'un Ctrl+C
    signal.signal(signal.SIGTERM, signal.default_int_handler)
    service(args) if args.service else manuel(args)


if __name__ == "__main__":
    main()
