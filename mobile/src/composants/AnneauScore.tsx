import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { couleurs, polices } from '@/theme';

// Cercle de rayon 37 dans un carré de 88, comme dans la maquette.
const CERCLE =
  'M81 44C81 23.5655 64.4345 7 44 7C23.5655 7 7 23.5655 7 44C7 64.4345 23.5655 81 44 81C64.4345 81 81 64.4345 81 44Z';
const CIRCONFERENCE = 2 * Math.PI * 37;

/**
 * Anneau de score (0–100) : fond vert pâle, arc vert proportionnel au score.
 * La maquette l'utilise en 88 px (accueil) et 92 px (résultats).
 */
export function AnneauScore({ score, taille = 88 }: { score: number; taille?: number }) {
  const borne = Math.max(0, Math.min(100, score));
  const longueurArc = (CIRCONFERENCE * borne) / 100;

  return (
    <View style={{ width: taille, height: taille }}>
      <Svg width={taille} height={taille} viewBox="0 0 88 88" fill="none">
        <Path d={CERCLE} stroke={couleurs.vertFondIcone} strokeWidth={9} />
        {borne > 0 ? (
          <Path
            d={CERCLE}
            stroke={couleurs.vert}
            strokeWidth={9}
            strokeLinecap="round"
            strokeDasharray={`${longueurArc} ${CIRCONFERENCE}`}
          />
        ) : null}
      </Svg>
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.centre}>
          <Text style={[styles.score, { fontSize: taille >= 92 ? 28 : 26 }]}>
            {Math.round(borne)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centre: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  score: { fontFamily: polices.bold, color: couleurs.texte },
});
