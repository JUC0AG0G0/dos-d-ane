import { useCallback, useEffect, useRef } from 'react';

import { ajouterEchantillon, enregistrer, type Tranche } from '@/features/history';

import type { Mesure } from '../mesure';

/** Une mesure ne représente jamais plus d'une seconde (page figée, appli en fond…). */
const DUREE_MAX_MESURE = 1;
const SAUVEGARDE_MS = 30 * 1000;

/**
 * Enregistre les mesures d'une session sur le téléphone. Chaque mesure compte
 * pour le temps écoulé depuis la précédente : on sait ainsi combien de temps
 * la posture a été verte, orange ou rouge.
 * Sauvegarde toutes les 30 s, pour ne rien perdre si l'app est fermée.
 */
export function useEnregistrementSession() {
  const tranches = useRef(new Map<number, Tranche>());
  const derniere = useRef<number | null>(null);
  const debut = useRef(0);
  const termine = useRef(false);

  const sauvegarder = useCallback((session?: { secondes: number }) => {
    const liste = [...tranches.current.values()];
    tranches.current.clear();
    const fin = Date.now();
    const enregistree =
      session && session.secondes > 0
        ? { debut: debut.current, fin, secondes: Math.round(session.secondes) }
        : undefined;
    if (!liste.length && !enregistree) return Promise.resolve();
    // Échec possible si la session a expiré entre-temps : rien à sauver alors.
    return enregistrer(liste, enregistree).catch(() => undefined);
  }, []);

  useEffect(() => {
    const debutSession = Date.now();
    debut.current = debutSession;
    const id = setInterval(() => void sauvegarder(), SAUVEGARDE_MS);
    return () => {
      clearInterval(id);
      if (!termine.current) {
        void sauvegarder({ secondes: (Date.now() - debutSession) / 1000 });
      }
    };
  }, [sauvegarder]);

  const ajouter = useCallback((mesure: Mesure) => {
    const maintenant = Date.now();
    const precedente = derniere.current;
    derniere.current = maintenant;
    if (precedente === null || !mesure.personne) return;
    if (mesure.telephone === 'mouvement' || mesure.telephone === 'penche') return;
    ajouterEchantillon(tranches.current, {
      instant: maintenant,
      duree: Math.min((maintenant - precedente) / 1000, DUREE_MAX_MESURE),
      cou: mesure.cou,
      tronc: mesure.tronc,
    });
  }, []);

  /** Pause : le temps écoulé jusqu'à la reprise ne compte pas. */
  const interrompre = useCallback(() => {
    derniere.current = null;
  }, []);

  const terminer = useCallback(
    (secondesActives: number) => {
      termine.current = true;
      return sauvegarder({ secondes: secondesActives });
    },
    [sauvegarder],
  );

  return { ajouter, interrompre, terminer };
}
