import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Rect } from 'react-native-svg';

import { angleCou, angleTronc, classer, CONFIG } from '@/features/analysis';
import { couleurs, couleursNiveau, rayons } from '@/styles/theme';

import { lirePose, MASCOTTE, silhouette } from '../captures';
import type { Capture } from '../types/sessions.types';
import { PastilleAngle } from './PastilleAngle';
import { SqueletteCapture } from './SqueletteCapture';

type XY = { x: number; y: number };

/**
 * Mascotte assise qui reprend la posture d'une capture (comme la maquette de
 * l'écran de session). Seuls les 3 points capturés (oreille, épaule, hanche)
 * sont marqués, reliés par le cou et le tronc colorés selon les seuils de
 * l'app ; le reste du corps n'est qu'une forme. Sans ces 3 points, on revient
 * au squelette brut.
 */
export function MascotteCapture({ capture }: { capture: Capture }) {
  const pose = lirePose(capture.keypoints);
  if (!pose) {
    return (
      <View style={styles.squelette}>
        <SqueletteCapture capture={capture} />
      </View>
    );
  }

  const { oreille, epaule, hanche, sens } = pose;
  const cou = angleCou(epaule, oreille, sens);
  const tronc = angleTronc(epaule, hanche);
  const troncSigne = (epaule.x - hanche.x) * sens >= 0 ? tronc : -tronc;
  const niveauCou = classer(cou, CONFIG.cou);
  const niveauTronc = classer(tronc, CONFIG.tronc);
  const p = silhouette(troncSigne, cou);
  const hx = p.hanche.x;

  const forme: [XY, XY][] = [
    [p.hanche, p.genou],
    [p.genou, p.cheville],
    [p.cheville, p.pied],
    [p.epaule, p.coude],
    [p.coude, p.poignet],
    [p.hanche, p.epaule],
    [p.epaule, p.oreille],
  ];
  const mesures: [XY, XY, string][] = [
    [p.hanche, p.epaule, couleursNiveau[niveauTronc]],
    [p.epaule, p.oreille, couleursNiveau[niveauCou]],
  ];
  const trait = (a: XY, b: XY, couleur: string, epaisseur: number, cle: string) => (
    <Line
      key={cle}
      x1={a.x}
      y1={a.y}
      x2={b.x}
      y2={b.y}
      stroke={couleur}
      strokeWidth={epaisseur}
      strokeLinecap="round"
    />
  );
  const decor = (x1: number, y1: number, x2: number, y2: number, cle: string) =>
    trait({ x: x1, y: y1 }, { x: x2, y: y2 }, couleurs.bordure, 6, cle);

  return (
    <View style={styles.cadre}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${MASCOTTE.largeur} ${MASCOTTE.hauteur}`}>
        <Rect width={MASCOTTE.largeur} height={MASCOTTE.hauteur} fill={couleurs.vertFondPastille} />

        <Line x1={20} y1={282} x2={300} y2={282} stroke={couleurs.bordure} strokeWidth={3} />
        {decor(hx - 34, 108, hx - 34, 212, 'dossier')}
        {decor(hx - 34, 212, hx + 50, 212, 'assise')}
        {decor(hx + 8, 212, hx + 8, 282, 'pied-chaise')}
        <Rect x={268} y={100} width={18} height={62} rx={5} fill={couleurs.bordure} />
        {decor(236, 176, 310, 176, 'bureau')}
        {decor(296, 176, 296, 282, 'pied-bureau')}

        <Line
          x1={hx}
          y1={p.hanche.y}
          x2={hx}
          y2={p.hanche.y - 120}
          stroke={couleurs.vert}
          strokeWidth={2}
          strokeDasharray="6 6"
        />

        {forme.map(([a, b], i) => trait(a, b, couleurs.vertPale, 26, `forme-${i}`))}
        <Circle cx={p.oreille.x + 4} cy={p.oreille.y - 4} r={24} fill={couleurs.vertPale} />

        {mesures.map(([a, b, couleur], i) => trait(a, b, couleur, 5, `mesure-${i}`))}
        {[p.hanche, p.epaule, p.oreille].map((q, i) => (
          <Circle
            key={`point-${i}`}
            cx={q.x}
            cy={q.y}
            r={7}
            fill={couleurs.carte}
            stroke={couleurs.vertFonce}
            strokeWidth={3}
          />
        ))}
      </Svg>

      <View style={styles.pastilles} pointerEvents="none">
        <PastilleAngle libelle="Cou" angle={cou} niveau={niveauCou} />
        <PastilleAngle libelle="Tronc" angle={tronc} niveau={niveauTronc} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cadre: {
    width: '100%',
    aspectRatio: MASCOTTE.largeur / MASCOTTE.hauteur,
    borderRadius: rayons.icone,
    overflow: 'hidden',
  },
  pastilles: { position: 'absolute', top: 10, left: 10, gap: 8, alignItems: 'flex-start' },
  squelette: { width: '70%', alignSelf: 'center' },
});
