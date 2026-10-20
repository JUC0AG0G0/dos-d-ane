import { StyleSheet, Text, View } from 'react-native';

import type { Niveau } from '@/features/analysis';
import { couleurs, couleursNiveau, polices, rayons } from '@/styles/theme';

/** « ● Cou 42° » : le point a la couleur du niveau, le texte reste lisible sans la couleur. */
export function PastilleAngle({
  libelle,
  angle,
  niveau,
}: {
  libelle: string;
  angle: number | null;
  niveau: Niveau;
}) {
  return (
    <View style={styles.pastille}>
      <View style={[styles.point, { backgroundColor: couleursNiveau[niveau] }]} />
      <Text style={styles.texte}>
        {libelle} {angle === null ? '—' : `${Math.round(angle)}°`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pastille: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: couleurs.carte,
    borderWidth: 1,
    borderColor: couleurs.vertPale,
    borderRadius: rayons.pastille,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  point: { width: 7, height: 7, borderRadius: 3.5 },
  texte: { fontFamily: polices.semiBold, fontSize: 12, color: couleurs.vertTexte },
});
