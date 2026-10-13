import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

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
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: couleurs.fond },
        }}
      >
        <Stack.Screen name="(onglets)" />
        {/* Pas de retour par glissement : on quitte une session par « Terminer ». */}
        <Stack.Screen name="session-en-cours" options={{ gestureEnabled: false }} />
        {/* Test de faisabilité caméra + MoveNet, gardé à part (fond noir). */}
        <Stack.Screen name="test-camera" options={{ contentStyle: { backgroundColor: '#000' } }} />
      </Stack>
    </>
  );
}
