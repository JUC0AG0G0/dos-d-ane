import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { AvertissementSante, Carte, Pastille } from '@/components/elements';
import { IconeChevron } from '@/components/icones';
import { Ecran, EnTete } from '@/components/layouts/Ecran';
import { useChargement } from '@/hooks/useChargement';
import { couleurs, polices, rayons } from '@/styles/theme';

import { PASTILLE_CIBLE, type Exercice, type Filtre } from '../exercices';
import { chargerConseils } from '../services/advice.service';
import { IconeExercice } from './IconeExercice';

const FILTRES: { valeur: Filtre; libelle: string }[] = [
  { valeur: 'tous', libelle: 'Tous' },
  { valeur: 'cou', libelle: 'Cou' },
  { valeur: 'dos', libelle: 'Dos' },
  { valeur: 'epaules', libelle: 'Épaules' },
];

export function EcranConseils() {
  const [filtre, setFiltre] = useState<Filtre>('tous');
  const charger = useCallback(() => chargerConseils(filtre), [filtre]);
  const [etat] = useChargement(charger);

  return (
    <Ecran>
      <EnTete titre="Conseils & exercices" sousTitre="Basés sur vos postures détectées" />

      {etat.statut === 'ok' ? <Text style={styles.resume}>{etat.donnees.resume}</Text> : null}

      <View style={styles.filtres}>
        {FILTRES.map(({ valeur, libelle }) => {
          const actif = valeur === filtre;
          return (
            <Pressable
              key={valeur}
              style={[styles.filtre, actif ? styles.filtreActif : styles.filtreInactif]}
              onPress={() => setFiltre(valeur)}
              accessibilityRole="button"
              accessibilityState={{ selected: actif }}
            >
              <Text style={actif ? styles.filtreTexteActif : styles.filtreTexte}>{libelle}</Text>
            </Pressable>
          );
        })}
      </View>

      {etat.statut === 'chargement' ? (
        <ActivityIndicator color={couleurs.vert} />
      ) : etat.statut === 'erreur' ? (
        <Carte>
          <Text style={styles.resume}>Impossible de charger les conseils : {etat.message}</Text>
        </Carte>
      ) : (
        etat.donnees.exercices.map((e) => <CarteExercice key={e.id} exercice={e} />)
      )}

      <AvertissementSante />
    </Ecran>
  );
}

function CarteExercice({ exercice }: { exercice: Exercice }) {
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/exercice/[id]', params: { id: exercice.id } })}
      style={({ pressed }) => pressed && styles.appuye}
      accessibilityRole="button"
      accessibilityLabel={`${exercice.titre}, ${exercice.duree}`}
    >
      <Carte style={styles.carte}>
        <View style={styles.fondIcone}>
          <IconeExercice icone={exercice.icone} />
        </View>
        <View style={styles.texte}>
          <Text style={styles.titre}>{exercice.titre}</Text>
          <Text style={styles.sousTitre}>
            {exercice.duree} · {exercice.zone}
          </Text>
          <Pastille texte={PASTILLE_CIBLE[exercice.cible]} />
        </View>
        <IconeChevron couleur={couleurs.ongletInactif} />
      </Carte>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  resume: { fontFamily: polices.regular, fontSize: 13, color: couleurs.texteSecondaire },
  filtres: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filtre: { borderRadius: rayons.pastille, paddingHorizontal: 16, paddingVertical: 8 },
  filtreActif: { backgroundColor: couleurs.vert },
  filtreInactif: {
    backgroundColor: couleurs.carte,
    borderColor: couleurs.bordure,
    borderWidth: 1,
  },
  filtreTexte: { fontFamily: polices.semiBold, fontSize: 13, color: couleurs.texte },
  filtreTexteActif: { fontFamily: polices.semiBold, fontSize: 13, color: couleurs.blanc },
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
