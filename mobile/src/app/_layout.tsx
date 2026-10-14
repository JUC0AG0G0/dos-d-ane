import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { authService } from '@/auth/service';
import { FournisseurSession, useSession } from '@/auth/session';
import { couleurs } from '@/theme';

export default function RacineLayout() {
  // Inter est la police de la maquette ; rien ne s'affiche tant qu'elle n'est
  // pas chargée, sinon le texte changerait de police sous les yeux.
  const [policesChargees] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  if (!policesChargees) return null;

  return (
    <FournisseurSession>
      <StatusBar style="dark" />
      <Navigation />
    </FournisseurSession>
  );
}

/**
 * Écrans de l'app réservés à un utilisateur connecté ; Connexion et
 * Inscription réservés aux autres. Expo Router bascule tout seul de l'un à
 * l'autre quand la session change (connexion, déconnexion, session expirée).
 */
function Navigation() {
  const { etat, mettreAJourUtilisateur } = useSession();
  const connecte = etat.statut === 'connecte';

  // Au lancement, avec une session enregistrée : rafraîchit l'utilisateur
  // (nom affiché modifié sur le site…). Un 401 déconnecte ; hors ligne, on
  // garde la session enregistrée.
  useEffect(() => {
    if (!connecte) return;
    authService
      .me()
      .then(mettreAJourUtilisateur)
      .catch(() => undefined);
    // Une seule fois par ouverture de session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connecte]);

  // Session en cours de lecture dans le trousseau : rien à afficher encore.
  if (etat.statut === 'chargement') return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: couleurs.fond },
      }}
    >
      <Stack.Protected guard={connecte}>
        <Stack.Screen name="(onglets)" />
        {/* Pas de retour par glissement : on quitte une session par « Terminer ». */}
        <Stack.Screen name="session-en-cours" options={{ gestureEnabled: false }} />
        <Stack.Screen name="exercice/[id]" />
        <Stack.Screen name="test-postures/index" />
        <Stack.Screen name="test-postures/[participant]" />
        {/* Test de faisabilité caméra + MoveNet, gardé à part (fond noir). */}
        <Stack.Screen name="test-camera" options={{ contentStyle: { backgroundColor: '#000' } }} />
      </Stack.Protected>

      <Stack.Protected guard={!connecte}>
        <Stack.Screen name="connexion" />
        <Stack.Screen name="inscription" />
      </Stack.Protected>
    </Stack>
  );
}
