import { useKeepAwake } from 'expo-keep-awake';
import { router } from 'expo-router';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconeAlerte, IconeFermer, IconeFeuille, IconeInfoRond } from '@/components/icones';
import { couleurs, couleursNiveau, espaces, polices, rayons } from '@/styles/theme';
import { formaterDuree } from '@/utils/duree';

import { useEnregistrementSession } from '../hooks/useEnregistrementSession';
import { messagePosture, type MessagePosture, type Mesure } from '../mesure';
import { CameraAnalyse, type CommandesCamera } from './CameraAnalyse';

/** Session en cours : la caméra filme en continu ; seuls les angles et leur couleur sont gardés. */
export function EcranSessionEnCours() {
  useKeepAwake();

  const camera = useRef<CommandesCamera>(null);
  const [mesure, setMesure] = useState<Mesure | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [enPause, setEnPause] = useState(false);
  const [secondes, setSecondes] = useState(0);
  const [enregistrement, setEnregistrement] = useState(false);
  const session = useEnregistrementSession();

  useEffect(() => {
    if (enPause) return;
    const id = setInterval(() => setSecondes((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [enPause]);

  function basculerPause() {
    if (enPause) {
      camera.current?.reprendre();
    } else {
      camera.current?.pause();
      session.interrompre();
    }
    setEnPause(!enPause);
  }

  function terminer() {
    Alert.alert('Terminer la session ?', `Durée : ${formaterDuree(secondes)}`, [
      { text: 'Continuer', style: 'cancel' },
      {
        text: 'Terminer',
        style: 'destructive',
        onPress: async () => {
          setEnregistrement(true);
          try {
            await session.terminer(secondes);
          } finally {
            router.back();
          }
        },
      },
    ]);
  }

  function aide() {
    Alert.alert(
      'Bien placer le téléphone',
      'Posez le téléphone de côté, à hauteur d’épaule, à 1 ou 2 m. Votre oreille, votre épaule et votre hanche doivent être visibles. Aucune image n’est enregistrée : seuls vos angles moyens et le temps passé en bonne posture sont gardés, sur ce téléphone.',
    );
  }

  const message: MessagePosture = enPause
    ? {
        titre: 'Session en pause',
        conseil: 'Plus aucune image n’est analysée',
        alerte: false,
        niveau: null,
      }
    : erreur
      ? { titre: 'Caméra indisponible', conseil: erreur, alerte: true, niveau: null }
      : messagePosture(mesure);

  return (
    <SafeAreaView style={styles.ecran} edges={['top', 'bottom']}>
      <View style={styles.barreHaut}>
        <BoutonRond onPress={terminer} libelle="Fermer la session">
          <IconeFermer couleur={couleurs.texte} />
        </BoutonRond>
        <View style={styles.titreBloc}>
          <Text style={styles.titre}>Session en cours</Text>
          <View style={styles.sousTitre}>
            <View
              style={[
                styles.pointDirect,
                { backgroundColor: enPause ? couleurs.ongletInactif : couleurs.pointDirect },
              ]}
            />
            <Text style={styles.sousTitreTexte}>
              {enPause ? 'En pause' : 'Caméra du téléphone'} · {formaterDuree(secondes)}
            </Text>
          </View>
        </View>
        <BoutonRond onPress={aide} libelle="Aide au placement">
          <IconeInfoRond couleur={couleurs.texte} />
        </BoutonRond>
      </View>

      <View style={styles.contenu}>
        <CameraAnalyse
          ref={camera}
          style={styles.zoneAnalyse}
          onMesure={(lue) => {
            if (!enPause) session.ajouter(lue);
            setMesure(lue);
            setErreur(null);
          }}
          onErreur={setErreur}
        />

        <View style={styles.carteStatut}>
          <View style={styles.iconeStatut}>
            {message.alerte ? (
              <IconeAlerte couleur={couleurs.vertFonce} />
            ) : (
              <IconeFeuille couleur={couleurs.vertFonce} taille={20} />
            )}
          </View>
          <View style={styles.message}>
            <Text style={styles.messageTitre}>{message.titre}</Text>
            <Text style={styles.messageConseil} numberOfLines={2}>
              {message.conseil}
            </Text>
          </View>
          {message.niveau ? (
            <View style={[styles.voyant, { backgroundColor: couleursNiveau[message.niveau] }]} />
          ) : null}
        </View>

        <View style={styles.boutons}>
          <Pressable
            style={({ pressed }) => [styles.bouton, styles.boutonPause, pressed && styles.appuye]}
            onPress={basculerPause}
          >
            <Text style={styles.boutonPauseTexte}>{enPause ? 'Reprendre' : 'Pause'}</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.bouton,
              styles.boutonTerminer,
              pressed && styles.appuye,
            ]}
            onPress={terminer}
            disabled={enregistrement}
          >
            <Text style={styles.boutonTerminerTexte}>Terminer</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function BoutonRond({
  onPress,
  libelle,
  children,
}: {
  onPress: () => void;
  libelle: string;
  children: ReactNode;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.boutonRond, pressed && styles.appuye]}
      onPress={onPress}
      accessibilityLabel={libelle}
      hitSlop={8}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  ecran: { flex: 1, backgroundColor: couleurs.fond },
  barreHaut: {
    height: 48,
    marginTop: 14,
    marginBottom: 14,
    paddingHorizontal: espaces.bordEcran,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  boutonRond: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: couleurs.carte,
    borderColor: couleurs.bordure,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titreBloc: { alignItems: 'center', gap: 3 },
  titre: { fontFamily: polices.semiBold, fontSize: 15, color: couleurs.texte },
  sousTitre: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pointDirect: { width: 8, height: 8, borderRadius: 4 },
  sousTitreTexte: { fontFamily: polices.regular, fontSize: 12, color: couleurs.texteSecondaire },

  contenu: { flex: 1, paddingHorizontal: espaces.bordEcran, paddingBottom: 10, gap: 14 },
  zoneAnalyse: { flex: 1 },

  carteStatut: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: couleurs.carte,
    borderColor: couleurs.bordure,
    borderWidth: 1,
    borderRadius: rayons.carte,
  },
  iconeStatut: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: couleurs.vertFondIcone,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: { flex: 1, gap: 3 },
  messageTitre: { fontFamily: polices.semiBold, fontSize: 15, color: couleurs.texte },
  messageConseil: { fontFamily: polices.regular, fontSize: 12, color: couleurs.texteSecondaire },
  voyant: { width: 16, height: 16, borderRadius: 8 },

  boutons: { flexDirection: 'row', gap: 12 },
  bouton: {
    flex: 1,
    height: 50,
    borderRadius: rayons.bouton,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boutonPause: {
    backgroundColor: couleurs.carte,
    borderColor: couleurs.vertBordureBouton,
    borderWidth: 1,
  },
  boutonPauseTexte: { fontFamily: polices.semiBold, fontSize: 15, color: couleurs.vertFonce },
  boutonTerminer: { backgroundColor: couleurs.vert },
  boutonTerminerTexte: { fontFamily: polices.semiBold, fontSize: 15, color: couleurs.blanc },
  appuye: { opacity: 0.85 },
});
