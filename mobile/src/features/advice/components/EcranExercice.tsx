import { router } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AvertissementSante, Carte, Pastille } from '@/components/elements';
import { IconeFlecheGauche } from '@/components/icones';
import { useChargement } from '@/hooks/useChargement';
import { couleurs, espaces, polices, rayons } from '@/styles/theme';

import { texteDureeExercice } from '../exercices';
import { adviceService } from '../services/advice.service';
import { ZONE_LABELS, type Exercise } from '../types/advice.types';
import { IconeExercice } from './IconeExercice';
import { MediaExercice } from './MediaExercice';

export function EcranExercice({ id }: { id: string }) {
  const charger = useCallback(() => adviceService.exercise(id), [id]);
  const [etat] = useChargement(charger);

  return (
    <SafeAreaView style={styles.ecran} edges={['top']}>
      <View style={styles.barreHaut}>
        <Pressable
          style={styles.boutonRond}
          onPress={() => router.back()}
          accessibilityLabel="Retour"
          hitSlop={8}
        >
          <IconeFlecheGauche couleur={couleurs.texte} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.contenu}>
        {etat.statut === 'chargement' ? (
          <ActivityIndicator color={couleurs.vert} />
        ) : etat.statut === 'erreur' ? (
          <Carte>
            <Text style={styles.texte}>Exercice introuvable : {etat.message}</Text>
          </Carte>
        ) : (
          <Fiche exercice={etat.donnees} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Fiche({ exercice }: { exercice: Exercise }) {
  return (
    <>
      <View style={styles.entete}>
        <View style={styles.fondIcone}>
          <IconeExercice zone={exercice.zone} />
        </View>
        <View style={styles.enteteTexte}>
          <Text style={styles.titre}>{exercice.title}</Text>
          <Text style={styles.sousTitre}>
            {texteDureeExercice(exercice.durationSeconds)} · {ZONE_LABELS[exercice.zone]} ·{' '}
            {exercice.posture}
          </Text>
          <View style={styles.pastilles}>
            {exercice.isPreventive ? <Pastille texte="Préventif" /> : null}
            {exercice.isForPain ? <Pastille texte="En cas de douleur" /> : null}
          </View>
        </View>
      </View>

      {exercice.media ? <MediaExercice media={exercice.media} titre={exercice.title} /> : null}

      <Carte style={styles.bloc}>
        <Text style={styles.titreBloc}>Comment faire</Text>
        {exercice.steps.map((etape, i) => (
          <View key={`${i}-${etape}`} style={styles.etape}>
            <View style={styles.numero}>
              <Text style={styles.numeroTexte}>{i + 1}</Text>
            </View>
            <Text style={[styles.texte, styles.etapeTexte]}>{etape}</Text>
          </View>
        ))}
      </Carte>

      {exercice.precautions ? (
        <Carte style={styles.bloc}>
          <Text style={styles.titreBloc}>Précautions</Text>
          <Text style={styles.texte}>{exercice.precautions}</Text>
        </Carte>
      ) : null}

      <AvertissementSante />
    </>
  );
}

const styles = StyleSheet.create({
  ecran: { flex: 1, backgroundColor: couleurs.fond },
  barreHaut: { paddingHorizontal: espaces.bordEcran, paddingVertical: 8 },
  boutonRond: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: couleurs.carte,
    borderColor: couleurs.bordure,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contenu: { paddingHorizontal: espaces.bordEcran, paddingBottom: 32, gap: espaces.entreCartes },
  entete: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  fondIcone: {
    width: 64,
    height: 64,
    borderRadius: rayons.icone,
    backgroundColor: couleurs.vertFondIcone,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enteteTexte: { flex: 1, gap: 4, alignItems: 'flex-start' },
  titre: { fontFamily: polices.bold, fontSize: 22, color: couleurs.texte },
  sousTitre: { fontFamily: polices.regular, fontSize: 13, color: couleurs.texteSecondaire },
  pastilles: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  bloc: { gap: 10 },
  titreBloc: { fontFamily: polices.semiBold, fontSize: 16, color: couleurs.texte },
  texte: { fontFamily: polices.regular, fontSize: 14, lineHeight: 20, color: couleurs.texte },
  etape: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  etapeTexte: { flex: 1 },
  numero: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: couleurs.vertFondIcone,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numeroTexte: { fontFamily: polices.semiBold, fontSize: 12, color: couleurs.vertFonce },
});
