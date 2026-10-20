import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { IconeScan } from '@/components/icones';
import { couleurs, polices, rayons } from '@/styles/theme';

export function CarteDemarrer() {
  return (
    <View style={styles.carte}>
      <Text style={styles.titre}>Démarrer une session</Text>
      <Text style={styles.texte}>
        Posez votre téléphone de profil, puis lancez l’analyse de votre posture.
      </Text>
      <Pressable
        style={({ pressed }) => [styles.bouton, pressed && styles.appuye]}
        onPress={() => router.push('/session-en-cours')}
      >
        <IconeScan couleur={couleurs.vertFonce} />
        <Text style={styles.boutonTexte}>Démarrer</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  carte: {
    backgroundColor: couleurs.vert,
    borderRadius: rayons.carteMiseEnAvant,
    padding: 22,
    gap: 14,
  },
  titre: { fontFamily: polices.bold, fontSize: 20, color: couleurs.blanc },
  texte: { fontFamily: polices.regular, fontSize: 13, color: couleurs.vertSurVert },
  bouton: {
    height: 50,
    borderRadius: rayons.bouton,
    backgroundColor: couleurs.blanc,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  boutonTexte: { fontFamily: polices.semiBold, fontSize: 15, color: couleurs.vertFonce },
  appuye: { opacity: 0.85 },
});
