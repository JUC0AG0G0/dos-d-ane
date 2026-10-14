import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { couleurs, espaces, polices } from '@/theme';

/**
 * Cadre commun des écrans à onglet : fond vert pâle, marges de la maquette,
 * contenu défilant. La barre d'onglets gère elle-même le bas de l'écran.
 */
export function Ecran({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView style={styles.ecran} edges={['top']}>
      <ScrollView contentContainerStyle={styles.contenu}>{children}</ScrollView>
    </SafeAreaView>
  );
}

/** Titre de page (22 px gras), avec une ligne au-dessus ou en dessous. */
export function EnTete({
  surTitre,
  titre,
  sousTitre,
}: {
  surTitre?: string;
  titre: string;
  sousTitre?: string;
}) {
  return (
    <View style={styles.enTete}>
      {surTitre ? <Text style={styles.petit}>{surTitre}</Text> : null}
      <Text style={styles.titre}>{titre}</Text>
      {sousTitre ? <Text style={styles.sousTitre}>{sousTitre}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  ecran: { flex: 1, backgroundColor: couleurs.fond },
  contenu: {
    paddingHorizontal: espaces.bordEcran,
    paddingVertical: 12,
    gap: espaces.entreCartes,
  },
  enTete: { gap: 2 },
  petit: { fontFamily: polices.medium, fontSize: 13, color: couleurs.texteSecondaire },
  titre: { fontFamily: polices.bold, fontSize: 22, color: couleurs.texte },
  sousTitre: {
    fontFamily: polices.regular,
    fontSize: 13,
    color: couleurs.texteSecondaire,
    marginTop: 2,
  },
});
