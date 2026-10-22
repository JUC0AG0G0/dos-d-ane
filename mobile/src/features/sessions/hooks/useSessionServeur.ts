import { useCallback, useEffect, useRef } from 'react';

import { versCapture, type Mesure } from '../mesure';
import { sessionsService } from '../services/sessions.service';

/**
 * Une capture toutes les 30 s au plus : assez pour suivre la posture sur le
 * site, en gardant peu de données de santé (minimisation RGPD) : environ 120
 * captures par heure, soit jusqu'à 2 200 lignes en base.
 */
const INTERVALLE_CAPTURE_MS = 30_000;
/** Au-delà, « Terminer » n'attend plus la réponse du serveur. */
const ATTENTE_ARRET_MS = 5000;

/**
 * Session d'analyse sur le serveur, en plus de l'historique du téléphone :
 * créée et lancée à l'ouverture de l'écran, une capture (points du corps,
 * jamais l'image) toutes les 30 s, puis pause, reprise et arrêt.
 *
 * Les commandes passent l'une après l'autre : une pause demandée pendant le
 * lancement attend qu'il soit fini. Un appareil ne capture que dans une
 * session lancée à la fois : celle restée ouverte (app tuée en pleine session)
 * est arrêtée avant d'en créer une. Un échec réseau n'interrompt jamais la
 * session locale : la capture est simplement perdue.
 */
export function useSessionServeur() {
  const idSession = useRef<string | null>(null);
  const idLance = useRef<string | null>(null);
  const file = useRef<Promise<void>>(Promise.resolve());
  const enPause = useRef(false);
  const envoiEnCours = useRef(false);
  const dernierEnvoi = useRef(0);
  const termine = useRef(false);

  const enchainer = useCallback((commande: () => Promise<unknown>) => {
    const suite = file.current.then(commande).then(
      () => undefined,
      () => undefined,
    );
    file.current = suite;
    return suite;
  }, []);

  const arreter = useCallback(
    () =>
      enchainer(async () => {
        const id = idSession.current;
        idSession.current = null;
        if (id) await sessionsService.stop(id);
      }),
    [enchainer],
  );

  useEffect(() => {
    void enchainer(async () => {
      const appareils = await sessionsService.devices();
      const restee = appareils.find((a) => a.current)?.openSessionId;
      if (restee) await sessionsService.stop(restee).catch(() => undefined);
      const { id } = await sessionsService.create();
      try {
        await sessionsService.start(id);
      } catch (erreur) {
        await sessionsService.remove(id).catch(() => undefined);
        throw erreur;
      }
      idSession.current = id;
      idLance.current = id;
    });
    return () => {
      if (!termine.current) void arreter();
    };
  }, [enchainer, arreter]);

  const ajouter = useCallback((mesure: Mesure) => {
    const id = idSession.current;
    const maintenant = Date.now();
    if (!id || enPause.current || envoiEnCours.current) return;
    if (maintenant - dernierEnvoi.current < INTERVALLE_CAPTURE_MS) return;
    const capture = versCapture(mesure, maintenant);
    if (!capture) return;
    dernierEnvoi.current = maintenant;
    envoiEnCours.current = true;
    sessionsService
      .addCapture(id, capture)
      .catch(() => undefined)
      .finally(() => {
        envoiEnCours.current = false;
      });
  }, []);

  const pause = useCallback(() => {
    enPause.current = true;
    void enchainer(async () => {
      if (idSession.current) await sessionsService.pause(idSession.current);
    });
  }, [enchainer]);

  const reprendre = useCallback(() => {
    void enchainer(async () => {
      if (idSession.current) await sessionsService.resume(idSession.current);
      enPause.current = false;
    });
  }, [enchainer]);

  /** Arrête la session ; renvoie son id sur le serveur, ou null si elle n'a pas pu être lancée. */
  const terminer = useCallback(async () => {
    termine.current = true;
    await Promise.race([
      arreter(),
      new Promise<void>((fin) => setTimeout(fin, ATTENTE_ARRET_MS)),
    ]);
    return idLance.current;
  }, [arreter]);

  return { ajouter, pause, reprendre, terminer };
}
