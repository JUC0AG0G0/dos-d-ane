import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { AvertissementSante, Carte } from '@/components/elements';
import { Ecran, EnTete } from '@/components/layouts/Ecran';
import { useChargement } from '@/hooks/useChargement';
import { couleurs, polices, rayons } from '@/styles/theme';

import { raison, type Filtre } from '../exercices';
import { chargerConseils } from '../services/advice.service';
import { EXERCISE_ZONES, ZONE_LABELS } from '../types/advice.types';
import { CarteExercice } from './CarteExercice';

const FILTRES: { valeur: Filtre; libelle: string }[] = [
  { valeur: 'tous', libelle: 'Tous' },
  ...EXERCISE_ZONES.map((zone) => ({ valeur: zone, libelle: ZONE_LABELS[zone] })),
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
      ) : etat.donnees.exercices.length === 0 ? (
        <Carte>
          <Text style={styles.resume}>Aucun exercice pour cette partie du corps.</Text>
        </Carte>
      ) : (
        etat.donnees.exercices.map((e) => (
          <CarteExercice key={e.id} exercice={e} raison={raison(e, etat.donnees.situation)} />
        ))
      )}

      <AvertissementSante />
    </Ecran>
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
});
