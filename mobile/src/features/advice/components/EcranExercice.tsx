import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AvertissementSante, Carte, Pastille } from '@/components/elements';
import { IconeFlecheGauche } from '@/components/icones';
import { couleurs, espaces, polices, rayons } from '@/styles/theme';

import { PASTILLE_CIBLE, trouverExercice } from '../exercices';
import { IconeExercice } from './IconeExercice';

export function EcranExercice({ id }: { id: string }) {
  const exercice = trouverExercice(id);

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
        {!exercice ? (
          <Carte>
            <Text style={styles.texte}>Exercice introuvable.</Text>
          </Carte>
        ) : (
          <>
            <View style={styles.entete}>
              <View style={styles.fondIcone}>
                <IconeExercice icone={exercice.icone} />
              </View>
              <View style={styles.enteteTexte}>
                <Text style={styles.titre}>{exercice.titre}</Text>
                <Text style={styles.sousTitre}>
                  {exercice.duree} · {exercice.zone}
                </Text>
                <Pastille texte={PASTILLE_CIBLE[exercice.cible]} />
              </View>
            </View>

            <Carte style={styles.bloc}>
              <Text style={styles.titreBloc}>Pourquoi</Text>
              <Text style={styles.texte}>{exercice.pourquoi}</Text>
            </Carte>

            <Carte style={styles.bloc}>
              <Text style={styles.titreBloc}>Comment faire</Text>
              {exercice.etapes.map((etape, i) => (
                <View key={etape} style={styles.etape}>
                  <View style={styles.numero}>
                    <Text style={styles.numeroTexte}>{i + 1}</Text>
                  </View>
                  <Text style={[styles.texte, styles.etapeTexte]}>{etape}</Text>
                </View>
              ))}
              <Text style={styles.prudence}>Arrêtez si le mouvement provoque une douleur.</Text>
            </Carte>

            <AvertissementSante />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
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
  prudence: { fontFamily: polices.regular, fontSize: 12, color: couleurs.texteSecondaire },
});
