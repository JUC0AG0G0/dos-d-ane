import { Link, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { useConnexion } from '@/auth/hooks';
import { CadreAuth } from '@/composants/CadreAuth';
import { Bandeau, BoutonPrincipal, Champ, ChampMotDePasse } from '@/composants/formulaire';
import { couleurs, polices } from '@/theme';

export default function Connexion() {
  // Après une inscription, l'email arrive prérempli avec un message de succès.
  const params = useLocalSearchParams<{ email?: string; inscrit?: string }>();
  const [email, setEmail] = useState(params.email ?? '');
  const [password, setPassword] = useState('');
  const { login, error, pending } = useConnexion();

  const envoyer = () => void login(email, password);

  return (
    <CadreAuth titre="Connexion" sousTitre="Content de te revoir ! Connecte-toi pour continuer.">
      {params.inscrit && !error ? (
        <Bandeau type="succes">Compte créé, tu peux te connecter.</Bandeau>
      ) : null}
      {error ? <Bandeau type="erreur">{error}</Bandeau> : null}

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
        returnKeyType="next"
      />
      <ChampMotDePasse
        libelle="Mot de passe"
        value={password}
        onChangeText={setPassword}
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={envoyer}
      />
      <BoutonPrincipal
        texte={pending ? 'Connexion…' : 'Se connecter'}
        onPress={envoyer}
        desactive={!email || !password}
        enCours={pending}
      />

      <Text style={styles.bas}>
        Pas encore de compte ?{' '}
        <Link href="/inscription" replace style={styles.lien}>
          Créer un compte
        </Link>
      </Text>
    </CadreAuth>
  );
}

const styles = StyleSheet.create({
  bas: {
    fontFamily: polices.regular,
    fontSize: 14,
    color: couleurs.texteSecondaire,
    textAlign: 'center',
  },
  lien: { fontFamily: polices.semiBold, color: couleurs.vertFonce },
});
