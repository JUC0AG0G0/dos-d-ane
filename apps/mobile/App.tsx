import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fetchHealth } from './src/api';
import { config } from './src/config';

export default function App() {
  const [apiStatus, setApiStatus] = useState("Connexion à l'API…");

  useEffect(() => {
    const controller = new AbortController();
    fetchHealth(controller.signal)
      .then((h) => setApiStatus(`API connectée (${h.env}, version ${h.version})`))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setApiStatus(err instanceof Error ? err.message : 'Erreur inconnue');
      });
    return () => controller.abort();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dos d'âne</Text>
      <Text accessibilityRole="alert" style={styles.disclaimer}>
        Cette application donne des conseils généraux et ne remplace pas l'avis
        d'un professionnel de santé.
      </Text>
      <Text>{apiStatus}</Text>
      {config.appEnv !== 'production' && (
        <Text style={styles.env}>Environnement : {config.appEnv}</Text>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f5f2',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  title: { fontSize: 28, fontWeight: '700' },
  disclaimer: {
    backgroundColor: '#fff7ed',
    borderLeftColor: '#c2410c',
    borderLeftWidth: 4,
    padding: 12,
  },
  env: { color: '#6b7280', fontSize: 12 },
});
