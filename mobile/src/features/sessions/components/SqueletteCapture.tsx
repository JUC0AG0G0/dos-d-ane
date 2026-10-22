import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Rect } from 'react-native-svg';

import { couleurs, rayons } from '@/styles/theme';

import { segmentsVisibles } from '../captures';
import type { Capture } from '../types/sessions.types';

/** Squelette d'une capture, dans le repère de l'image (comme l'aperçu du site). */
export function SqueletteCapture({ capture }: { capture: Capture }) {
  const { imageWidth: l, imageHeight: h, keypoints } = capture;
  const r = Math.max(l, h) / 90;
  return (
    <View style={[styles.cadre, { aspectRatio: l / h }]}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${l} ${h}`}>
        <Rect x={0} y={0} width={l} height={h} fill={couleurs.vertFondPastille} />
        {segmentsVisibles(keypoints).map(([p, q]) => (
          <Line
            key={`${p.bodyPart}-${q.bodyPart}`}
            x1={p.x}
            y1={p.y}
            x2={q.x}
            y2={q.y}
            stroke={couleurs.vert}
            strokeWidth={r * 0.8}
            strokeLinecap="round"
          />
        ))}
        {keypoints.map((k) => (
          <Circle
            key={k.bodyPart}
            cx={k.x}
            cy={k.y}
            r={r}
            fill={couleurs.carte}
            stroke={couleurs.vertFonce}
            strokeWidth={r * 0.6}
          />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  cadre: { width: '100%', borderRadius: rayons.icone, overflow: 'hidden' },
});
