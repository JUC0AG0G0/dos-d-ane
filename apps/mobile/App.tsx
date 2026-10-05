import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { config } from './src/config';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dos d'âne</Text>
      <Text accessibilityRole="alert" style={styles.disclaimer}>
        Cette application donne des conseils généraux et ne remplace pas l'avis
        d'un professionnel de santé.
      </Text>
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
