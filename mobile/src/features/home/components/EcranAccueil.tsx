import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';

import { AnneauPourcentage } from '@/components/AnneauPourcentage';
import { AvertissementSante, Carte, Pastille } from '@/components/elements';
import { IconeFeuille } from '@/components/icones';
import { Ecran, EnTete } from '@/components/layouts/Ecran';
import { useDeconnexion } from '@/features/auth';
import { texteEcart } from '@/features/history';
import { CarteDemarrer } from '@/features/sessions';
import { useChargement } from '@/hooks/useChargement';
import { couleurs, polices, rayons } from '@/styles/theme';

import { chargerAccueil } from '../services/home.service';

export function EcranAccueil() {
  const [etat] = useChargement(chargerAccueil);
  const deconnexion = useDeconnexion();

  function seDeconnecter() {
    Alert.alert('Se déconnecter ?', 'Tes données restent sur ce téléphone, liées à ton compte.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Se déconnecter', style: 'destructive', onPress: () => void deconnexion() },
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

  const { nomAffiche, bonneDuJour, ecartVeille, conseilDuJour } = etat.donnees;

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
        {bonneDuJour === null ? (
          <Text style={styles.texteSecondaire}>
            Pas encore de session aujourd’hui : démarrez-en une pour suivre votre posture.
          </Text>
        ) : (
          <>
            <AnneauPourcentage valeur={bonneDuJour} />
            <View style={styles.detail}>
              <Text style={styles.texteSecondaire}>Aujourd’hui</Text>
              <Text style={styles.appreciation}>du temps en bonne posture</Text>
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
    </Ecran>
  );
}

const styles = StyleSheet.create({
  chargement: { marginTop: 40 },
  ligne: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  detail: { flex: 1, gap: 6 },
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
});
