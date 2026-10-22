import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useRef } from 'react';

import { CONSEILS, creerSuiviAlerte, SEUILS_ALERTE, type Mesure } from '../mesure';

const DUREE =
  SEUILS_ALERTE.dureeMs < 60_000
    ? `${SEUILS_ALERTE.dureeMs / 1000} s`
    : `${SEUILS_ALERTE.dureeMs / 60_000} min`;

/**
 * Notification locale quand la posture reste mauvaise (voir SEUILS_ALERTE).
 * Les notifications locales marchent dans Expo Go ; elles s'affichent aussi
 * app ouverte, le cas normal pendant une session (écran gardé allumé). Sans
 * autorisation de l'utilisateur, rien n'est envoyé.
 */
export function useAlertePosture() {
  const suivi = useRef(creerSuiviAlerte());
  const autorise = useRef(false);

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    Notifications.requestPermissionsAsync()
      .then((reponse) => {
        autorise.current = reponse.granted;
      })
      .catch(() => undefined);
  }, []);

  const ajouter = useCallback((mesure: Mesure) => {
    const cause = suivi.current.ajouter(mesure, Date.now());
    if (!cause || !autorise.current) return;
    Notifications.scheduleNotificationAsync({
      content: {
        title: `Mauvaise posture depuis ${DUREE}`,
        body: CONSEILS[cause],
      },
      trigger: null,
    }).catch(() => undefined);
  }, []);

  const reinitialiser = useCallback(() => suivi.current.reinitialiser(), []);

  return { ajouter, reinitialiser };
}
