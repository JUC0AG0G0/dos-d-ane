import { Link } from 'expo-router';
import { useState } from 'react';
import { Linking, StyleSheet, Switch, Text, View } from 'react-native';

import { useInscription } from '@/auth/hooks';
import { CadreAuth } from '@/composants/CadreAuth';
import { Bandeau, BoutonPrincipal, Champ, ChampMotDePasse } from '@/composants/formulaire';
import { env } from '@/config/env';
import { couleurs, polices } from '@/theme';

export default function Inscription() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(false);
  const { register, error, pending } = useInscription();

  // Mêmes règles que le serveur (RegisterDto) : on évite un aller-retour inutile.
  const valide =
    displayName.trim().length >= 2 &&
    displayName.trim().length <= 50 &&
    email.includes('@') &&
    password.length >= 8 &&
    password.length <= 128 &&
    consent;

  const ouvrir = (chemin: string) => Linking.openURL(`${env.siteUrl}${chemin}`);

  return (
    <CadreAuth titre="Créer un compte" sousTitre="Quelques informations pour commencer.">
      {error ? <Bandeau type="erreur">{error}</Bandeau> : null}

      <Champ
        libelle="Nom affiché"
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="Jules"
        autoComplete="nickname"
        textContentType="nickname"
        maxLength={50}
      />
      <Champ
        libelle="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="jules@test.fr"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
      />
      <ChampMotDePasse
        libelle="Mot de passe"
        aide="8 caractères minimum."
        value={password}
        onChangeText={setPassword}
        autoComplete="new-password"
        textContentType="newPassword"
        maxLength={128}
      />

      <View style={styles.accord}>
        <Switch
          value={consent}
          onValueChange={setConsent}
          trackColor={{ true: couleurs.vert, false: couleurs.bordure }}
          accessibilityLabel="J’accepte les conditions d’utilisation et j’ai lu la politique de confidentialité"
        />
        <Text style={styles.accordTexte}>
          J’accepte les{' '}
          <Text style={styles.lien} onPress={() => ouvrir('/legal/terms')}>
            conditions d’utilisation
          </Text>{' '}
          et j’ai lu la{' '}
          <Text style={styles.lien} onPress={() => ouvrir('/legal/privacy')}>
            politique de confidentialité
          </Text>
          .
        </Text>
      </View>

      <BoutonPrincipal
        texte={pending ? 'Création…' : 'Créer mon compte'}
        onPress={() => void register({ displayName: displayName.trim(), email, password })}
        desactive={!valide}
        enCours={pending}
      />

      <Text style={styles.bas}>
        Déjà un compte ?{' '}
        <Link href="/connexion" replace style={styles.lien}>
          Se connecter
        </Link>
      </Text>
    </CadreAuth>
  );
}

const styles = StyleSheet.create({
  accord: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  accordTexte: { flex: 1, fontFamily: polices.regular, fontSize: 13, color: couleurs.texte },
  lien: { fontFamily: polices.semiBold, color: couleurs.vertFonce },
  bas: {
    fontFamily: polices.regular,
    fontSize: 14,
    color: couleurs.texteSecondaire,
    textAlign: 'center',
  },
});
