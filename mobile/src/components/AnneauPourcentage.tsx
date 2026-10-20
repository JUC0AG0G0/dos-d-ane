import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { couleurs, polices } from '@/styles/theme';

const CERCLE =
  'M81 44C81 23.5655 64.4345 7 44 7C23.5655 7 7 23.5655 7 44C7 64.4345 23.5655 81 44 81C64.4345 81 81 64.4345 81 44Z';
const RAYON_CERCLE = 37;
const CIRCONFERENCE = 2 * Math.PI * RAYON_CERCLE;

export function AnneauPourcentage({ valeur, taille = 88 }: { valeur: number; taille?: number }) {
  const borne = Math.max(0, Math.min(100, valeur));
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
          <Text style={[styles.valeur, { fontSize: taille >= 92 ? 26 : 24 }]}>
            {Math.round(borne)}
            <Text style={styles.pourcent}> %</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centre: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  valeur: { fontFamily: polices.bold, color: couleurs.texte },
  pourcent: { fontSize: 14 },
});
