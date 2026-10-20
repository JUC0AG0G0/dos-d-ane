import { Accelerometer } from 'expo-sensors';
import { useEffect, useRef } from 'react';

import type { EtatTelephone } from '@/features/analysis';

import { creerSuiviTelephone } from '../telephone';

const INTERVALLE_MS = 100;

/**
 * Lit l'accéléromètre 10 fois par seconde et transmet l'inclinaison et l'état
 * du téléphone à `surChangement`. Sans capteur, rien n'est transmis : la page
 * reste alors sans correction (état `inconnu`).
 */
export function useTelephone(surChangement: (inclinaison: number, etat: EtatTelephone) => void) {
  const rappel = useRef(surChangement);
  useEffect(() => {
    rappel.current = surChangement;
  });

  useEffect(() => {
    let abonnement: { remove(): void } | null = null;
    let actif = true;
    const suivi = creerSuiviTelephone();

    Accelerometer.isAvailableAsync().then((disponible) => {
      if (!disponible || !actif) return;
      Accelerometer.setUpdateInterval(INTERVALLE_MS);
      abonnement = Accelerometer.addListener((g) => {
        const { inclinaison, etat } = suivi.mesurer(g, Date.now());
        rappel.current(inclinaison, etat);
      });
    });

    return () => {
      actif = false;
      abonnement?.remove();
    };
  }, []);
}

/** Commande à injecter dans la page pour lui transmettre l'état du téléphone. */
export function commandeTelephone(inclinaison: number, etat: EtatTelephone): string {
  return `window.PoseControle && window.PoseControle.telephone(${inclinaison.toFixed(1)}, '${etat}'); true;`;
}
