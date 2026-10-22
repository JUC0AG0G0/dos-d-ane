import { useVideoPlayer, VideoView } from 'expo-video';
import { useMemo } from 'react';
import { Image, StyleSheet } from 'react-native';

import { sourceApi } from '@/services/http';
import { couleurs, rayons } from '@/styles/theme';

import { ADVICE_ROUTES } from '../services/advice.routes';
import type { MediaRef } from '../types/advice.types';

/** Image, GIF ou vidéo d'un exercice, chargé avec le jeton de session (le serveur l'exige). */
export function MediaExercice({ media, titre }: { media: MediaRef; titre: string }) {
  const source = useMemo(() => sourceApi(ADVICE_ROUTES.media(media.id)), [media.id]);
  if (media.mimeType === 'video/mp4') return <Video source={source} />;
  return (
    <Image source={source} style={styles.media} resizeMode="cover" accessibilityLabel={titre} />
  );
}

function Video({ source }: { source: ReturnType<typeof sourceApi> }) {
  const lecteur = useVideoPlayer(source, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });
  return <VideoView player={lecteur} style={styles.media} contentFit="cover" nativeControls />;
}

const styles = StyleSheet.create({
  media: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: rayons.carte,
    backgroundColor: couleurs.vertFondIcone,
  },
});
