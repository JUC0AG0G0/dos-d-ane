import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Carte, Pastille } from '@/components/elements';
import { IconeChevron } from '@/components/icones';
import { couleurs, polices, rayons } from '@/styles/theme';

import { texteDureeExercice } from '../exercices';
import { ZONE_LABELS, type ExerciseSummary } from '../types/advice.types';
import { IconeExercice } from './IconeExercice';

/** Exercice d'une liste ; `raison` : pourquoi il est conseillé (« Pour la tête en avant »). */
export function CarteExercice({
  exercice,
  raison,
}: {
  exercice: ExerciseSummary;
  raison?: string | null;
}) {
  const duree = texteDureeExercice(exercice.durationSeconds);
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/exercice/[id]', params: { id: exercice.id } })}
      style={({ pressed }) => pressed && styles.appuye}
      accessibilityRole="button"
      accessibilityLabel={`${exercice.title}, ${duree}`}
    >
      <Carte style={styles.carte}>
        <View style={styles.fondIcone}>
          <IconeExercice zone={exercice.zone} />
        </View>
        <View style={styles.texte}>
          <Text style={styles.titre}>{exercice.title}</Text>
          <Text style={styles.sousTitre}>
            {duree} · {ZONE_LABELS[exercice.zone]}
          </Text>
          {raison ? <Pastille texte={raison} /> : null}
        </View>
        <IconeChevron couleur={couleurs.ongletInactif} />
      </Carte>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  carte: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 18,
  },
  fondIcone: {
    width: 52,
    height: 52,
    borderRadius: rayons.icone,
    backgroundColor: couleurs.vertFondIcone,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texte: { flex: 1, gap: 4, alignItems: 'flex-start' },
  titre: { fontFamily: polices.semiBold, fontSize: 15, color: couleurs.texte },
  sousTitre: { fontFamily: polices.regular, fontSize: 12, color: couleurs.texteSecondaire },
  appuye: { opacity: 0.85 },
});
