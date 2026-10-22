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

import { authService } from '@/features/auth';
import { FournisseurSession, useSession } from '@/store/auth.store';
import { couleurs } from '@/styles/theme';

export default function RacineLayout() {
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
 * Au lancement, l'utilisateur est rafraîchi (GET /auth/me) : un 401 déconnecte,
 * hors ligne la session enregistrée est gardée.
 */
function Navigation() {
  const { etat, mettreAJourUtilisateur } = useSession();
  const connecte = etat.statut === 'connecte';

  useEffect(() => {
    if (!connecte) return;
    authService
      .me()
      .then(mettreAJourUtilisateur)
      .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connecte]);

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
        <Stack.Screen name="session-en-cours" options={{ gestureEnabled: false }} />
        <Stack.Screen name="bilan/[debut]" />
        <Stack.Screen name="exercice/[id]" />
      </Stack.Protected>

      <Stack.Protected guard={!connecte}>
        <Stack.Screen name="connexion" />
        <Stack.Screen name="inscription" />
      </Stack.Protected>
    </Stack>
  );
}
