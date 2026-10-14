import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

type Etat<T> =
  { statut: 'chargement' } | { statut: 'ok'; donnees: T } | { statut: 'erreur'; message: string };

/**
 * Charge des données à chaque fois que l'écran redevient visible (retour d'une
 * session, changement d'onglet), quand `charger` change, ou sur `recharger()`.
 * `charger` doit être stable (useCallback) pour ne pas recharger à chaque rendu.
 * Pendant un rechargement, les données précédentes restent affichées.
 */
export function useChargement<T>(charger: () => Promise<T>): [Etat<T>, () => void] {
  const [etat, setEtat] = useState<Etat<T>>({ statut: 'chargement' });
  const [version, setVersion] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let actif = true;
      charger().then(
        (donnees) => actif && setEtat({ statut: 'ok', donnees }),
        (err: unknown) =>
          actif &&
          setEtat({ statut: 'erreur', message: err instanceof Error ? err.message : String(err) }),
      );
      return () => {
        actif = false;
      };
      // `version` force un nouveau chargement quand on appelle recharger().
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [charger, version]),
  );

  const recharger = useCallback(() => setVersion((v) => v + 1), []);
  return [etat, recharger];
}
