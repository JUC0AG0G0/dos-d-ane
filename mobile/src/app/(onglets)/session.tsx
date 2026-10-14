import { StyleSheet, Text, View } from 'react-native';

import { CarteDemarrer } from '@/composants/CarteDemarrer';
import { Ecran, EnTete } from '@/composants/Ecran';
import { AvertissementSante, Carte } from '@/composants/elements';
import { couleurs, polices } from '@/theme';

const CONSEILS_PLACEMENT = [
  'Posez le téléphone de côté, à hauteur d’épaule, à 1 ou 2 m.',
  'Oreille, épaule et hanche doivent être visibles à l’écran.',
  'Évitez le contre-jour : la lumière doit venir de face ou du côté.',
];

export default function Session() {
  return (
    <Ecran>
      <EnTete titre="Session" sousTitre="Analyse de votre posture par la caméra du téléphone" />
      <CarteDemarrer />

      <Carte style={styles.placement}>
        <Text style={styles.titreCarte}>Bien placer le téléphone</Text>
        {CONSEILS_PLACEMENT.map((conseil) => (
          <View key={conseil} style={styles.ligne}>
            <View style={styles.puce} />
            <Text style={styles.conseil}>{conseil}</Text>
          </View>
        ))}
        <Text style={styles.vieprivee}>
          Aucune image n’est enregistrée ni envoyée : seuls vos scores et angles moyens sont gardés,
          sur ce téléphone.
        </Text>
      </Carte>

      <AvertissementSante />
    </Ecran>
  );
}

const styles = StyleSheet.create({
  placement: { gap: 10 },
  titreCarte: { fontFamily: polices.semiBold, fontSize: 16, color: couleurs.texte },
  ligne: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  puce: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: couleurs.vert, marginTop: 6 },
  conseil: { flex: 1, fontFamily: polices.regular, fontSize: 14, color: couleurs.texte },
  vieprivee: { fontFamily: polices.regular, fontSize: 12, color: couleurs.texteSecondaire },
});
