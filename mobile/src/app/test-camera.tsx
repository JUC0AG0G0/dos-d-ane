import { useMemo, useState } from 'react';
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { WebView } from 'react-native-webview';

import { urlPageParDefaut } from '@/camera/urlPage';

/**
 * Test de faisabilité : afficher la caméra en direct avec les 17 points MoveNet
 * dessinés par-dessus, en Expo Go seulement (aucun module natif hors Expo Go).
 *
 * `expo-camera` ne donne pas les images à JS dans Expo Go, donc tout se passe
 * dans une WebView : getUserMedia + TensorFlow.js + canvas.
 *
 * getUserMedia exige un CONTEXTE SÉCURISÉ (https:// ou localhost) : la page
 * public/pose.html doit être servie en https (tunnel). Une page embarquée dans
 * l'app (source={{ html }}) ne marche pas : getUserMedia y reste bloqué
 * (react-native-webview #2004).
 */
type Mode = 'accueil' | 'video';

export default function TestCamera() {
  const [mode, setMode] = useState<Mode>('accueil');
  const defaut = useMemo(() => urlPageParDefaut(), []);
  const [url, setUrl] = useState(defaut);
  const [journal, setJournal] = useState<string>('');

  if (mode === 'accueil') {
    const securise = url.startsWith('https://');
    return (
      <View style={styles.ecran}>
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={styles.accueil}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.retour}>‹ Retour à l’app</Text>
          </Pressable>
          <Text style={styles.titre}>Points de posture</Text>
          <Text style={styles.sousTitre}>
            Test de faisabilité. Rien n’est enregistré ni envoyé : les images de la caméra servent
            seulement à l’affichage et au calcul.
          </Text>

          <Text style={styles.etiquette}>URL de la page (servie par le dev server)</Text>
          <TextInput
            style={styles.champ}
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            placeholder="https://…/pose.html"
            placeholderTextColor="#666"
          />
          <Text style={securise ? styles.aideOk : styles.aideAlerte}>
            {securise
              ? 'https détecté : getUserMedia peut fonctionner.'
              : 'Pas en https : getUserMedia sera indisponible. Relance avec « npx expo start --tunnel ».'}
          </Text>

          <Pressable
            style={[styles.bouton, styles.boutonPrincipal]}
            onPress={() => setMode('video')}
            disabled={!url}
          >
            <Text style={styles.boutonTexte}>Lancer la vidéo avec les points</Text>
          </Pressable>

          <Pressable
            style={styles.lien}
            onPress={() => url && Linking.openURL(url)}
            disabled={!url}
          >
            <Text style={styles.lienTexte}>
              Ouvrir la même page dans Safari (pour comparer, hors WebView)
            </Text>
          </Pressable>

          {journal ? (
            <View style={styles.journal}>
              <Text style={styles.etiquette}>Dernier message de la page</Text>
              <Text style={styles.journalTexte}>{journal}</Text>
            </View>
          ) : null}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.ecran}>
      <StatusBar barStyle="light-content" />
      <View style={styles.barre}>
        <Pressable onPress={() => setMode('accueil')} hitSlop={12}>
          <Text style={styles.retour}>‹ Retour</Text>
        </Pressable>
        <Text style={styles.barreTexte} numberOfLines={1}>
          {url}
        </Text>
      </View>

      <WebView
        style={styles.webview}
        source={{ uri: url }}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        // --- indispensables pour la caméra et la vidéo sur iOS ---
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        // iOS 15+ : accorde la caméra à la page sans second dialogue. La
        // permission système, elle, est demandée par Expo Go au premier usage.
        mediaCapturePermissionGrantType="grant"
        onMessage={(e) => {
          // Les mesures (4 par seconde) sont pour l'écran de session, pas pour ce journal.
          if (e.nativeEvent.data.includes('"type":"mesure"')) return;
          setJournal(e.nativeEvent.data);
        }}
        onError={({ nativeEvent }) =>
          setJournal(`Erreur WebView : ${nativeEvent.description ?? 'inconnue'}`)
        }
        onHttpError={({ nativeEvent }) =>
          setJournal(`HTTP ${nativeEvent.statusCode} sur ${nativeEvent.url}`)
        }
      />

      {journal ? (
        <Text style={styles.piedJournal} numberOfLines={3}>
          {journal}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  ecran: { flex: 1, backgroundColor: '#000' },
  accueil: { padding: 20, paddingTop: Platform.OS === 'ios' ? 72 : 48, gap: 12 },
  titre: { color: '#fff', fontSize: 26, fontWeight: '700' },
  sousTitre: { color: '#9aa0a6', fontSize: 14, lineHeight: 20, marginBottom: 8 },
  etiquette: { color: '#9aa0a6', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  champ: {
    backgroundColor: '#1b1b1d',
    color: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  aideOk: { color: '#2ecc71', fontSize: 12 },
  aideAlerte: { color: '#f39c12', fontSize: 12 },
  bouton: {
    backgroundColor: '#1b1b1d',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  boutonPrincipal: { backgroundColor: '#2f6fed' },
  boutonTexte: { color: '#fff', fontSize: 16, fontWeight: '600' },
  lien: { paddingVertical: 14, alignItems: 'center' },
  lienTexte: { color: '#2f6fed', fontSize: 13, textAlign: 'center' },
  journal: { marginTop: 16, gap: 4 },
  journalTexte: {
    color: '#ddd',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  barre: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingTop: Platform.OS === 'ios' ? 56 : 32,
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: '#111',
  },
  retour: { color: '#2f6fed', fontSize: 16, fontWeight: '600' },
  barreTexte: { color: '#9aa0a6', fontSize: 12, flex: 1 },
  webview: { flex: 1, backgroundColor: '#000' },
  piedJournal: { color: '#9aa0a6', fontSize: 11, padding: 10, backgroundColor: '#111' },
});
