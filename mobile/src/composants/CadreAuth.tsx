import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AvertissementSante } from '@/composants/elements';
import { env } from '@/config/env';
import { couleurs, espaces, polices } from '@/theme';

/** Cadre des écrans Connexion et Inscription : titre, formulaire, avertissement santé, liens légaux. */
export function CadreAuth({
  titre,
  sousTitre,
  children,
}: {
  titre: string;
  sousTitre: string;
  children: ReactNode;
}) {
  return (
    <SafeAreaView style={styles.ecran}>
      <KeyboardAvoidingView
        style={styles.ecran}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.contenu} keyboardShouldPersistTaps="handled">
          <Text style={styles.marque}>🫏 Dos d’âne</Text>
          <View style={styles.enTete}>
            <Text style={styles.titre}>{titre}</Text>
            <Text style={styles.sousTitre}>{sousTitre}</Text>
          </View>
          {children}
          <AvertissementSante />
          <LiensLegaux />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/** Pages légales du site, ouvertes dans le navigateur. */
export function LiensLegaux() {
  const liens = [
    { texte: 'Mentions légales', chemin: '/legal/notice' },
    { texte: 'Confidentialité', chemin: '/legal/privacy' },
    { texte: 'Conditions', chemin: '/legal/terms' },
  ];
  return (
    <View style={styles.liens}>
      {liens.map((l) => (
        <Text
          key={l.chemin}
          style={styles.lien}
          accessibilityRole="link"
          onPress={() => Linking.openURL(`${env.siteUrl}${l.chemin}`)}
        >
          {l.texte}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  ecran: { flex: 1, backgroundColor: couleurs.fond },
  contenu: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: espaces.bordEcran,
    paddingVertical: 24,
    gap: 20,
  },
  marque: {
    fontFamily: polices.semiBold,
    fontSize: 20,
    color: couleurs.texte,
    textAlign: 'center',
  },
  enTete: { gap: 4 },
  titre: { fontFamily: polices.bold, fontSize: 24, color: couleurs.texte },
  sousTitre: { fontFamily: polices.regular, fontSize: 14, color: couleurs.texteSecondaire },
  liens: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', columnGap: 16 },
  lien: {
    fontFamily: polices.medium,
    fontSize: 12,
    color: couleurs.texteSecondaire,
    paddingVertical: 6,
  },
});
