import { useImperativeHandle, useMemo, useRef, useState, type Ref } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';

import { Pastille } from '@/components/elements';
import { lireMessagePage } from '@/features/analysis';
import { couleurs, polices, rayons } from '@/styles/theme';

import { commandeTelephone, useTelephone } from '../hooks/useTelephone';
import type { Mesure } from '../mesure';
import { urlPageParDefaut } from '../urlPage';
import { PastilleAngle } from './PastilleAngle';

export type CommandesCamera = { pause: () => void; reprendre: () => void };

/**
 * Caméra frontale + analyse MoveNet (public/pose.html), avec
 * les pastilles « Vue de profil », « Cou », « Tronc » par-dessus. Chaque
 * mesure (environ 4 par seconde) est remontée par `onMesure`. Aucune image ne
 * sort de la page : seuls les angles et leurs niveaux remontent.
 */
export function CameraAnalyse({
  onMesure,
  onErreur,
  style,
  ref,
}: {
  onMesure: (mesure: Mesure) => void;
  onErreur?: (message: string) => void;
  style?: StyleProp<ViewStyle>;
  ref?: Ref<CommandesCamera>;
}) {
  const webview = useRef<WebView>(null);
  const [mesure, setMesure] = useState<Mesure | null>(null);

  const url = useMemo(() => urlPageParDefaut(), []);
  const securise = url.startsWith('https://');
  // La WebView ne doit naviguer que sur cette origine : c'est à elle seule que
  // la caméra est accordée.
  const origine = url.match(/^https?:\/\/[^/?#]+/)?.[0] ?? '';

  useImperativeHandle(ref, () => {
    const commande = (nom: 'pause' | 'reprendre') =>
      webview.current?.injectJavaScript(
        `window.PoseControle && window.PoseControle.${nom}(); true;`,
      );
    return { pause: () => commande('pause'), reprendre: () => commande('reprendre') };
  }, []);

  useTelephone((inclinaison, etat) =>
    webview.current?.injectJavaScript(commandeTelephone(inclinaison, etat)),
  );

  const mesurePersonne = mesure && mesure.personne ? mesure : null;

  return (
    <View style={[styles.zone, style]}>
      {securise ? (
        <WebView
          ref={webview}
          style={styles.webview}
          source={{ uri: url }}
          originWhitelist={[origine]}
          javaScriptEnabled
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          // iOS 15+ : accorde la caméra à la page sans second dialogue.
          mediaCapturePermissionGrantType="grant"
          onMessage={(e) => {
            const message = lireMessagePage(e.nativeEvent.data);
            if (message?.type === 'mesure') {
              setMesure(message);
              onMesure(message);
            } else if (message?.type === 'erreur') {
              onErreur?.(message.message);
            }
          }}
          onError={({ nativeEvent }) => onErreur?.(nativeEvent.description ?? 'page injoignable')}
          onHttpError={({ nativeEvent }) => onErreur?.(`HTTP ${nativeEvent.statusCode}`)}
        />
      ) : (
        <View style={styles.horsLigne}>
          <Text style={styles.horsLigneTitre}>La caméra a besoin d’une adresse https</Text>
          <Text style={styles.horsLigneTexte}>
            Relancez le serveur avec EXPO_PUBLIC_PAGE_URL pointant vers le tunnel https (voir
            mobile/README.md).
          </Text>
        </View>
      )}

      <View style={styles.pastilles} pointerEvents="none">
        <Pastille texte="Vue de profil" />
        {mesurePersonne ? (
          <>
            <PastilleAngle
              libelle="Cou"
              angle={mesurePersonne.cou.angle}
              niveau={mesurePersonne.cou.niveau}
            />
            <PastilleAngle
              libelle="Tronc"
              angle={mesurePersonne.tronc.angle}
              niveau={mesurePersonne.tronc.niveau}
            />
          </>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  zone: {
    borderRadius: rayons.zoneAnalyse,
    borderColor: couleurs.bordure,
    borderWidth: 1,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  webview: { flex: 1, backgroundColor: '#000' },
  horsLigne: {
    flex: 1,
    backgroundColor: couleurs.carte,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 8,
  },
  horsLigneTitre: {
    fontFamily: polices.semiBold,
    fontSize: 15,
    color: couleurs.texte,
    textAlign: 'center',
  },
  horsLigneTexte: {
    fontFamily: polices.regular,
    fontSize: 13,
    color: couleurs.texteSecondaire,
    textAlign: 'center',
  },
  pastilles: { position: 'absolute', top: 13, left: 13, gap: 8, alignItems: 'flex-start' },
});
