import { Link } from 'expo-router';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';

import { useDeconnexion } from '@/auth/hooks';
import { AnneauScore } from '@/composants/AnneauScore';
import { CarteDemarrer } from '@/composants/CarteDemarrer';
import { Ecran, EnTete } from '@/composants/Ecran';
import { AvertissementSante, Carte, Pastille } from '@/composants/elements';
import { IconeFeuille } from '@/composants/icones';
import {
  appreciationScore,
  chargerAccueil,
  effacerHistorique,
  remplirAvecDemo,
  texteEcart,
} from '@/donnees';
import { useChargement } from '@/donnees/useChargement';
import { couleurs, polices, rayons } from '@/theme';

export default function Accueil() {
  const [etat, recharger] = useChargement(chargerAccueil);
  const deconnexion = useDeconnexion();

  function seDeconnecter() {
    Alert.alert('Se déconnecter ?', 'Tes données restent sur ce téléphone, liées à ton compte.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Se déconnecter', style: 'destructive', onPress: () => void deconnexion() },
    ]);
  }

  function demo() {
    Alert.alert(
      'Données de démonstration',
      'Remplace votre historique par 5 semaines de sessions fictives.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Remplir', onPress: () => remplirAvecDemo().then(recharger) },
      ],
    );
  }

  function effacer() {
    Alert.alert('Effacer l’historique ?', 'Tous vos scores enregistrés seront supprimés.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Effacer', style: 'destructive', onPress: () => effacerHistorique().then(recharger) },
    ]);
  }

  if (etat.statut === 'chargement') {
    return (
      <Ecran>
        <ActivityIndicator color={couleurs.vert} style={styles.chargement} />
      </Ecran>
    );
  }
  if (etat.statut === 'erreur') {
    return (
      <Ecran>
        <Carte>
          <Text style={styles.texteSecondaire}>
            Impossible de charger l’accueil : {etat.message}
          </Text>
        </Carte>
      </Ecran>
    );
  }

  const { nomAffiche, scoreDuJour, ecartVeille, conseilDuJour } = etat.donnees;

  return (
    <Ecran>
      <View style={styles.entete}>
        <EnTete surTitre={`Bonjour ${nomAffiche}`} titre="Prêt à bien vous tenir ?" />
        <Text style={styles.deconnexion} onPress={seDeconnecter} accessibilityRole="button">
          Se déconnecter
        </Text>
      </View>

      <CarteDemarrer />

      <Carte style={styles.ligne}>
        {scoreDuJour === null ? (
          <Text style={styles.texteSecondaire}>
            Pas encore de session aujourd’hui : démarrez-en une pour obtenir votre score.
          </Text>
        ) : (
          <>
            <AnneauScore score={scoreDuJour} />
            <View style={styles.detailScore}>
              <Text style={styles.texteSecondaire}>Score du jour</Text>
              <Text style={styles.appreciation}>{appreciationScore(scoreDuJour)}</Text>
              {ecartVeille !== null ? <Pastille texte={texteEcart(ecartVeille, 'hier')} /> : null}
            </View>
          </>
        )}
      </Carte>

      <Carte style={[styles.ligne, styles.carteConseil]}>
        <View style={styles.fondIcone}>
          <IconeFeuille couleur={couleurs.vertFonce} />
        </View>
        <View style={styles.texteConseil}>
          <Text style={styles.petitLibelle}>Conseil du jour</Text>
          <Text style={styles.conseil}>{conseilDuJour}</Text>
        </View>
      </Carte>

      <AvertissementSante />

      {/* Outils discrets pour les tests et la démo. */}
      <View style={styles.outils}>
        <Link href="/test-postures" style={styles.lienTest}>
          Test des postures
        </Link>
        <Link href="/test-camera" style={styles.lienTest}>
          Test caméra
        </Link>
        <Text style={styles.lienTest} onPress={demo}>
          Données de démo
        </Text>
        <Text style={styles.lienTest} onPress={effacer}>
          Effacer l’historique
        </Text>
      </View>
    </Ecran>
  );
}

const styles = StyleSheet.create({
  chargement: { marginTop: 40 },
  ligne: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  detailScore: { flex: 1, gap: 6 },
  appreciation: { fontFamily: polices.bold, fontSize: 20, color: couleurs.texte },
  texteSecondaire: { fontFamily: polices.medium, fontSize: 13, color: couleurs.texteSecondaire },
  carteConseil: { padding: 18, gap: 14 },
  fondIcone: {
    width: 44,
    height: 44,
    borderRadius: rayons.icone,
    backgroundColor: couleurs.vertFondIcone,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texteConseil: { flex: 1, gap: 3 },
  petitLibelle: { fontFamily: polices.medium, fontSize: 12, color: couleurs.texteSecondaire },
  conseil: { fontFamily: polices.semiBold, fontSize: 14, color: couleurs.texte },
  entete: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  deconnexion: {
    fontFamily: polices.semiBold,
    fontSize: 13,
    color: couleurs.vertFonce,
    paddingVertical: 4,
  },
  outils: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', columnGap: 18 },
  lienTest: {
    paddingVertical: 12,
    fontFamily: polices.medium,
    fontSize: 12,
    color: couleurs.ongletInactif,
  },
});
