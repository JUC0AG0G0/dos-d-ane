import { StyleSheet, Text, View } from 'react-native';

import { Carte } from '@/components/elements';
import { couleurs, polices } from '@/styles/theme';

/** Carte « Répartition des postures » : pourcentages entiers dont la somme fait 100. */
export function Repartition({
  bonne,
  moyenne,
  ameliorer,
}: {
  bonne: number;
  moyenne: number;
  ameliorer: number;
}) {
  const lignes = [
    { libelle: 'Bonne', valeur: bonne, couleur: couleurs.vertFonce },
    { libelle: 'Moyenne', valeur: moyenne, couleur: couleurs.vertMoyen },
    { libelle: 'À améliorer', valeur: ameliorer, couleur: couleurs.vertPale },
  ];
  return (
    <Carte style={styles.carte}>
      <Text style={styles.titre}>Répartition des postures</Text>
      <View style={styles.barre}>
        {lignes.map((l) =>
          l.valeur > 0 ? (
            <View key={l.libelle} style={{ flex: l.valeur, backgroundColor: l.couleur }} />
          ) : null,
        )}
      </View>
      {lignes.map((l) => (
        <View key={l.libelle} style={styles.ligne}>
          <View style={styles.libelle}>
            <View style={[styles.point, { backgroundColor: l.couleur }]} />
            <Text style={styles.texte}>{l.libelle}</Text>
          </View>
          <Text style={styles.valeur}>{l.valeur} %</Text>
        </View>
      ))}
    </Carte>
  );
}

const styles = StyleSheet.create({
  carte: { gap: 10 },
  titre: { fontFamily: polices.semiBold, fontSize: 16, color: couleurs.texte },
  barre: { flexDirection: 'row', height: 14, borderRadius: 7, overflow: 'hidden' },
  ligne: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  libelle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  point: { width: 10, height: 10, borderRadius: 5 },
  texte: { fontFamily: polices.medium, fontSize: 13, color: couleurs.texte },
  valeur: { fontFamily: polices.semiBold, fontSize: 13, color: couleurs.texte },
});
