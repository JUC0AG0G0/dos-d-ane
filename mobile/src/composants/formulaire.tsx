import { useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { couleurs, polices, rayons } from '@/theme';

/** Champ de saisie avec son libellé. */
export function Champ({
  libelle,
  aide,
  ...props
}: TextInputProps & { libelle: string; aide?: string }) {
  return (
    <View style={styles.champ}>
      <Text style={styles.libelle}>{libelle}</Text>
      <TextInput
        style={styles.saisie}
        placeholderTextColor={couleurs.ongletInactif}
        accessibilityLabel={libelle}
        {...props}
      />
      {aide ? <Text style={styles.aide}>{aide}</Text> : null}
    </View>
  );
}

/** Mot de passe masqué, avec un bouton pour l'afficher. */
export function ChampMotDePasse(props: TextInputProps & { libelle: string; aide?: string }) {
  const [visible, setVisible] = useState(false);
  const { libelle, aide, ...reste } = props;
  return (
    <View style={styles.champ}>
      <Text style={styles.libelle}>{libelle}</Text>
      <View style={styles.ligneMotDePasse}>
        <TextInput
          style={[styles.saisie, styles.flex]}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor={couleurs.ongletInactif}
          accessibilityLabel={libelle}
          {...reste}
        />
        <Pressable
          onPress={() => setVisible(!visible)}
          style={styles.boutonVoir}
          accessibilityRole="button"
          accessibilityLabel={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          hitSlop={8}
        >
          <Text style={styles.boutonVoirTexte}>{visible ? 'Masquer' : 'Afficher'}</Text>
        </Pressable>
      </View>
      {aide ? <Text style={styles.aide}>{aide}</Text> : null}
    </View>
  );
}

/** Bouton vert pleine largeur, avec un indicateur pendant l'envoi. */
export function BoutonPrincipal({
  texte,
  onPress,
  desactive,
  enCours,
}: {
  texte: string;
  onPress: () => void;
  desactive?: boolean;
  enCours?: boolean;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.bouton,
        (desactive || enCours) && styles.boutonDesactive,
        pressed && styles.appuye,
      ]}
      onPress={onPress}
      disabled={desactive || enCours}
      accessibilityRole="button"
      accessibilityState={{ disabled: desactive || enCours, busy: enCours }}
    >
      {enCours ? <ActivityIndicator color={couleurs.blanc} /> : null}
      <Text style={styles.boutonTexte}>{texte}</Text>
    </Pressable>
  );
}

/** Bandeau d'erreur ou de succès. */
export function Bandeau({ type, children }: { type: 'erreur' | 'succes'; children: ReactNode }) {
  const erreur = type === 'erreur';
  return (
    <View
      style={[styles.bandeau, erreur ? styles.bandeauErreur : styles.bandeauSucces]}
      accessibilityRole="alert"
    >
      <Text style={erreur ? styles.bandeauTexteErreur : styles.bandeauTexteSucces}>{children}</Text>
    </View>
  );
}

const ROUGE = '#B91C1C';

const styles = StyleSheet.create({
  champ: { gap: 6 },
  libelle: { fontFamily: polices.medium, fontSize: 14, color: couleurs.texte },
  saisie: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: couleurs.bordure,
    backgroundColor: couleurs.carte,
    paddingHorizontal: 14,
    fontFamily: polices.regular,
    fontSize: 15,
    color: couleurs.texte,
  },
  aide: { fontFamily: polices.regular, fontSize: 12, color: couleurs.texteSecondaire },
  ligneMotDePasse: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  flex: { flex: 1 },
  boutonVoir: { paddingHorizontal: 6, paddingVertical: 8 },
  boutonVoirTexte: { fontFamily: polices.semiBold, fontSize: 13, color: couleurs.vertFonce },
  bouton: {
    height: 50,
    borderRadius: rayons.bouton,
    backgroundColor: couleurs.vert,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  boutonDesactive: { opacity: 0.5 },
  appuye: { opacity: 0.85 },
  boutonTexte: { fontFamily: polices.semiBold, fontSize: 15, color: couleurs.blanc },
  bandeau: { borderRadius: rayons.icone, borderWidth: 1, padding: 12 },
  bandeauErreur: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  bandeauSucces: { backgroundColor: couleurs.vertFondPastille, borderColor: couleurs.vertPale },
  bandeauTexteErreur: { fontFamily: polices.medium, fontSize: 13, color: ROUGE },
  bandeauTexteSucces: { fontFamily: polices.medium, fontSize: 13, color: couleurs.vertTexte },
});
