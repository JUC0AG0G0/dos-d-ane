import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { IconeInfo } from '@/composants/icones';
import { couleurs, espaces, polices, rayons } from '@/theme';

/** Carte blanche à bordure verte pâle, brique de base de tous les écrans. */
export function Carte({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.carte, style]}>{children}</View>;
}

/** Pastille arrondie : « +6 pts vs hier », « Tête en avant »… */
export function Pastille({ texte }: { texte: string }) {
  return (
    <View style={styles.pastille}>
      <Text style={styles.pastilleTexte}>{texte}</Text>
    </View>
  );
}

/** Rappel obligatoire du sujet, affiché sur les écrans de conseils et de score. */
export function AvertissementSante() {
  return (
    <View style={styles.avertissement}>
      <IconeInfo couleur={couleurs.vertFonce} />
      <Text style={styles.avertissementTexte}>
        Cette application ne remplace pas l’avis d’un professionnel de santé.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  carte: {
    backgroundColor: couleurs.carte,
    borderColor: couleurs.bordure,
    borderWidth: 1,
    borderRadius: rayons.carte,
    padding: espaces.interieurCarte,
  },
  pastille: {
    alignSelf: 'flex-start',
    backgroundColor: couleurs.vertFondPastille,
    borderColor: couleurs.vertPale,
    borderWidth: 1,
    borderRadius: rayons.pastille,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pastilleTexte: { fontFamily: polices.semiBold, fontSize: 12, color: couleurs.vertTexte },
  avertissement: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: couleurs.vertFondPastille,
    borderColor: couleurs.vertPale,
    borderWidth: 1,
    borderRadius: rayons.icone,
    padding: 12,
  },
  avertissementTexte: {
    flex: 1,
    fontFamily: polices.regular,
    fontSize: 12,
    color: couleurs.vertTexte,
  },
});
