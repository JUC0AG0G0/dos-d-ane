import { useKeepAwake } from 'expo-keep-awake';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Mesure } from '@/camera/mesure';
import { CameraAnalyse } from '@/composants/CameraAnalyse';
import { IconeFermer } from '@/composants/icones';
import {
  POSTURES_TEST,
  resumerEnregistrement,
  type EchantillonTest,
  type ResumeEnregistrement,
} from '@/donnees/essais';
import { chargerEssais, enregistrerPosture } from '@/donnees/essaisStockage';
import { couleurs, espaces, polices, rayons } from '@/theme';

const PREPARATION_S = 5;
const ENREGISTREMENT_S = 30;

type Phase = 'pret' | 'preparation' | 'enregistrement' | 'resultat';

/**
 * Trace du test dans le terminal du serveur Expo (console.log est relayé par
 * Metro) : permet de suivre le test depuis le PC et d'y garder les résultats.
 * Uniquement le code du participant et des angles, jamais d'image.
 */
function journal(evenement: Record<string, unknown>) {
  console.log(`[TEST] ${JSON.stringify(evenement)}`);
}

/**
 * Enregistrement guidé d'un participant : pour chaque posture, 5 s pour se
 * placer, puis 30 s pendant lesquelles chaque mesure d'angle est gardée.
 */
export default function EnregistrementParticipant() {
  useKeepAwake();
  const { participant } = useLocalSearchParams<{ participant: string }>();
  const code = String(participant);

  const [indice, setIndice] = useState(0);
  const [phase, setPhase] = useState<Phase>('pret');
  const [restant, setRestant] = useState(0);
  const [resume, setResume] = useState<ResumeEnregistrement | null>(null);

  // Refs : lues dans le rappel des mesures, qui doit voir la phase courante.
  const phaseRef = useRef<Phase>('pret');
  const debutRef = useRef(0);
  const echantillons = useRef<EchantillonTest[]>([]);

  const posture = POSTURES_TEST[indice];
  const derniere = indice === POSTURES_TEST.length - 1;

  // Reprend à la première posture pas encore faite par ce participant.
  useEffect(() => {
    chargerEssais().then((e) => {
      const faites = new Set(
        e.enregistrements.filter((x) => x.participant === code).map((x) => x.posture),
      );
      const premiere = POSTURES_TEST.findIndex((p) => !faites.has(p.id));
      setIndice(premiere === -1 ? 0 : premiere);
    });
  }, [code]);

  const changerPhase = useCallback((p: Phase) => {
    phaseRef.current = p;
    if (p === 'preparation') setRestant(PREPARATION_S);
    if (p === 'enregistrement') setRestant(ENREGISTREMENT_S);
    setPhase(p);
  }, []);

  const terminerEnregistrement = useCallback(async () => {
    const enregistrement = {
      participant: code,
      posture: POSTURES_TEST[indice].id,
      debut: debutRef.current,
      echantillons: echantillons.current,
    };
    await enregistrerPosture(enregistrement);
    const resultat = resumerEnregistrement(enregistrement);
    journal({
      evenement: 'fin',
      participant: code,
      posture: POSTURES_TEST[indice].titre,
      numero: indice + 1,
      mesures: resultat.mesures,
      mesurables: resultat.mesurables,
      couMoyen: resultat.cou ? Math.round(resultat.cou.moyenne * 10) / 10 : null,
      troncMoyen: resultat.tronc ? Math.round(resultat.tronc.moyenne * 10) / 10 : null,
      reussitePct: resultat.reussite === null ? null : Math.round(resultat.reussite * 100),
    });
    setResume(resultat);
    changerPhase('resultat');
  }, [code, indice, changerPhase]);

  // Compte à rebours de la préparation puis de l'enregistrement.
  useEffect(() => {
    if (phase !== 'preparation' && phase !== 'enregistrement') return;
    const duree = phase === 'preparation' ? PREPARATION_S : ENREGISTREMENT_S;
    const depart = Date.now();
    if (phase === 'enregistrement') {
      debutRef.current = depart;
      echantillons.current = [];
    }
    const id = setInterval(() => {
      const reste = duree - (Date.now() - depart) / 1000;
      setRestant(Math.max(0, Math.ceil(reste)));
      if (reste <= 0) {
        clearInterval(id);
        if (phase === 'preparation') {
          journal({ evenement: 'debut', participant: code, posture: POSTURES_TEST[indice].titre });
          changerPhase('enregistrement');
        } else void terminerEnregistrement();
      }
    }, 200);
    return () => clearInterval(id);
  }, [phase, code, indice, changerPhase, terminerEnregistrement]);

  function surMesure(m: Mesure) {
    if (phaseRef.current !== 'enregistrement') return;
    const mesurable = m.personne && m.score !== null;
    echantillons.current.push({
      t: Date.now() - debutRef.current,
      mesurable,
      cote: m.personne ? m.cote : null,
      score: m.personne ? m.score : null,
      cou: m.personne ? m.cou : { angle: null, niveau: 'gris' },
      tronc: m.personne ? m.tronc : { angle: null, niveau: 'gris' },
    });
  }

  function suivante() {
    setResume(null);
    if (derniere) {
      router.back();
      return;
    }
    setIndice(indice + 1);
    changerPhase('pret');
  }

  function quitter() {
    if (phase === 'enregistrement' || phase === 'preparation') {
      Alert.alert('Arrêter ?', 'La posture en cours ne sera pas enregistrée.', [
        { text: 'Continuer', style: 'cancel' },
        { text: 'Arrêter', style: 'destructive', onPress: () => router.back() },
      ]);
      return;
    }
    router.back();
  }

  return (
    <SafeAreaView style={styles.ecran} edges={['top', 'bottom']}>
      <View style={styles.barreHaut}>
        <Pressable
          style={styles.boutonRond}
          onPress={quitter}
          accessibilityLabel="Quitter"
          hitSlop={8}
        >
          <IconeFermer couleur={couleurs.texte} />
        </Pressable>
        <View style={styles.titreBloc}>
          <Text style={styles.titre}>{code}</Text>
          <Text style={styles.sousTitre}>
            Posture {indice + 1} / {POSTURES_TEST.length}
          </Text>
        </View>
        <View style={styles.boutonRondFantome} />
      </View>

      <View style={styles.contenu}>
        <CameraAnalyse style={styles.camera} onMesure={surMesure} />

        <View style={styles.carte}>
          <Text style={styles.posture}>{posture.titre}</Text>
          <Text style={styles.consigne}>{posture.consigne}</Text>

          {phase === 'pret' ? (
            <Pressable style={styles.boutonVert} onPress={() => changerPhase('preparation')}>
              <Text style={styles.boutonVertTexte}>Démarrer ({ENREGISTREMENT_S} s)</Text>
            </Pressable>
          ) : null}

          {phase === 'preparation' ? (
            <Text style={styles.compte}>Mettez-vous en place… {restant}</Text>
          ) : null}

          {phase === 'enregistrement' ? (
            <View style={styles.progression}>
              <Text style={styles.compte}>Enregistrement… {restant} s</Text>
              <View style={styles.barreFond}>
                <View
                  style={[
                    styles.barrePleine,
                    { width: `${(100 * (ENREGISTREMENT_S - restant)) / ENREGISTREMENT_S}%` },
                  ]}
                />
              </View>
            </View>
          ) : null}

          {phase === 'resultat' && resume ? (
            <View style={styles.resultat}>
              <Text style={styles.ligneResultat}>
                Cou moyen : {resume.cou ? `${Math.round(resume.cou.moyenne)}°` : '—'} · Tronc moyen
                : {resume.tronc ? `${Math.round(resume.tronc.moyenne)}°` : '—'}
              </Text>
              <Text style={styles.ligneResultat}>
                Détection correcte :{' '}
                {resume.reussite === null ? '—' : `${Math.round(resume.reussite * 100)} %`} (attendu
                : {posture.attendu})
              </Text>
              <Text style={styles.petit}>
                {resume.mesurables} mesures valides sur {resume.mesures}
                {resume.mesurables < resume.mesures / 2
                  ? ' : beaucoup de mesures perdues, vérifiez le placement et refaites.'
                  : '.'}
              </Text>
              <View style={styles.boutons}>
                <Pressable
                  style={[styles.bouton, styles.boutonClair]}
                  onPress={() => changerPhase('pret')}
                >
                  <Text style={styles.boutonClairTexte}>Refaire</Text>
                </Pressable>
                <Pressable style={[styles.bouton, styles.boutonPlein]} onPress={suivante}>
                  <Text style={styles.boutonVertTexte}>
                    {derniere ? 'Terminer' : 'Posture suivante'}
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ecran: { flex: 1, backgroundColor: couleurs.fond },
  barreHaut: {
    height: 48,
    marginVertical: 8,
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
  boutonRondFantome: { width: 40 },
  titreBloc: { alignItems: 'center' },
  titre: { fontFamily: polices.semiBold, fontSize: 15, color: couleurs.texte },
  sousTitre: { fontFamily: polices.regular, fontSize: 12, color: couleurs.texteSecondaire },
  contenu: { flex: 1, paddingHorizontal: espaces.bordEcran, paddingBottom: 10, gap: 14 },
  camera: { flex: 1 },
  carte: {
    backgroundColor: couleurs.carte,
    borderColor: couleurs.bordure,
    borderWidth: 1,
    borderRadius: rayons.carte,
    padding: 16,
    gap: 10,
  },
  posture: { fontFamily: polices.bold, fontSize: 20, color: couleurs.texte },
  consigne: { fontFamily: polices.regular, fontSize: 14, color: couleurs.texte },
  compte: { fontFamily: polices.semiBold, fontSize: 16, color: couleurs.vertFonce },
  progression: { gap: 8 },
  barreFond: {
    height: 8,
    borderRadius: 4,
    backgroundColor: couleurs.vertFondIcone,
    overflow: 'hidden',
  },
  barrePleine: { height: 8, backgroundColor: couleurs.vert },
  resultat: { gap: 6 },
  ligneResultat: { fontFamily: polices.medium, fontSize: 14, color: couleurs.texte },
  petit: { fontFamily: polices.regular, fontSize: 12, color: couleurs.texteSecondaire },
  boutons: { flexDirection: 'row', gap: 12, marginTop: 6 },
  bouton: {
    flex: 1,
    height: 50,
    borderRadius: rayons.bouton,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boutonClair: {
    backgroundColor: couleurs.carte,
    borderColor: couleurs.vertBordureBouton,
    borderWidth: 1,
  },
  boutonClairTexte: { fontFamily: polices.semiBold, fontSize: 15, color: couleurs.vertFonce },
  boutonPlein: { backgroundColor: couleurs.vert },
  boutonVert: {
    height: 50,
    borderRadius: rayons.bouton,
    backgroundColor: couleurs.vert,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boutonVertTexte: { fontFamily: polices.semiBold, fontSize: 15, color: couleurs.blanc },
});
