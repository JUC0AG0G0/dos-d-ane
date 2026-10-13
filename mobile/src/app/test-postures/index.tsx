import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Carte } from '@/composants/elements';
import { IconeChevron, IconeFlecheGauche } from '@/composants/icones';
import {
  NOMBRE_PARTICIPANTS_VISE,
  POSTURES_TEST,
  prochainCode,
  resumerParPosture,
  reussiteGlobale,
  type Essais,
} from '@/donnees/essais';
import {
  ajouterParticipant,
  chargerEssais,
  effacerEssais,
  exporterCsv,
  supprimerParticipant,
} from '@/donnees/essaisStockage';
import { useChargement } from '@/donnees/useChargement';
import { couleurs, espaces, polices, rayons } from '@/theme';

const PROTOCOLE = [
  'Téléphone posé de profil, à hauteur d’épaule, à environ 1,5 m. Même placement pour tous.',
  'Pour chaque participant : 4 postures, 30 secondes chacune, après 5 secondes de préparation.',
  'Seuls un code (P01…) et des angles sont enregistrés : ni nom, ni image.',
];

const pct = (x: number | null) => (x === null ? '—' : `${Math.round(x * 100)} %`);
const deg = (x: number | null | undefined) =>
  x === null || x === undefined ? '—' : `${Math.round(x)}°`;

export default function TestPostures() {
  const charger = useCallback(() => chargerEssais(), []);
  const [etat, recharger] = useChargement(charger);
  const [accord, setAccord] = useState(false);

  const essais: Essais =
    etat.statut === 'ok' ? etat.donnees : { participants: [], enregistrements: [] };
  const code = prochainCode(essais.participants);

  async function commencer() {
    await ajouterParticipant(code);
    // Suivi depuis le terminal du serveur Expo (voir [participant].tsx).
    console.log(`[TEST] ${JSON.stringify({ evenement: 'participant', participant: code })}`);
    setAccord(false);
    router.push({ pathname: '/test-postures/[participant]', params: { participant: code } });
  }

  function supprimer(c: string) {
    Alert.alert(`Supprimer ${c} ?`, 'Ses mesures seront effacées.', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: () => supprimerParticipant(c).then(recharger),
      },
    ]);
  }

  function toutEffacer() {
    Alert.alert(
      'Effacer tout le test ?',
      'Tous les participants et leurs mesures seront supprimés.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Effacer', style: 'destructive', onPress: () => effacerEssais().then(recharger) },
      ],
    );
  }

  async function exporter(type: 'resume' | 'mesures') {
    try {
      await exporterCsv(type);
    } catch (err) {
      Alert.alert('Export impossible', err instanceof Error ? err.message : String(err));
    }
  }

  const fait = (c: string) => essais.enregistrements.filter((e) => e.participant === c).length;
  const parPosture = resumerParPosture(essais);
  const global = reussiteGlobale(essais);

  return (
    <SafeAreaView style={styles.ecran} edges={['top']}>
      <View style={styles.barreHaut}>
        <Pressable
          style={styles.boutonRond}
          onPress={() => router.back()}
          accessibilityLabel="Retour"
          hitSlop={8}
        >
          <IconeFlecheGauche couleur={couleurs.texte} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.contenu}>
        <View>
          <Text style={styles.titre}>Test des postures</Text>
          <Text style={styles.sousTitre}>
            {essais.participants.length} / {NOMBRE_PARTICIPANTS_VISE} participants · 4 postures · 30
            s
          </Text>
        </View>

        <Carte style={styles.bloc}>
          <Text style={styles.titreBloc}>Protocole</Text>
          {PROTOCOLE.map((ligne) => (
            <View key={ligne} style={styles.puceLigne}>
              <View style={styles.puce} />
              <Text style={styles.texte}>{ligne}</Text>
            </View>
          ))}
          <Text style={styles.petit}>
            Postures : {POSTURES_TEST.map((p) => p.titre.toLowerCase()).join(', ')}.
          </Text>
        </Carte>

        <Carte style={styles.bloc}>
          <Text style={styles.titreBloc}>Nouveau participant : {code}</Text>
          <View style={styles.accord}>
            <Switch
              value={accord}
              onValueChange={setAccord}
              trackColor={{ true: couleurs.vert, false: couleurs.bordure }}
            />
            <Text style={[styles.texte, styles.flex]}>
              La personne a été informée et accepte que ses angles soient enregistrés de façon
              anonyme pour ce test.
            </Text>
          </View>
          <Pressable
            style={[styles.boutonVert, !accord && styles.desactive]}
            onPress={commencer}
            disabled={!accord}
          >
            <Text style={styles.boutonVertTexte}>Commencer avec {code}</Text>
          </Pressable>
        </Carte>

        {essais.participants.length ? (
          <Carte style={styles.bloc}>
            <Text style={styles.titreBloc}>Participants</Text>
            {essais.participants.map((p) => (
              <Pressable
                key={p.code}
                style={styles.participant}
                onPress={() =>
                  router.push({
                    pathname: '/test-postures/[participant]',
                    params: { participant: p.code },
                  })
                }
                onLongPress={() => supprimer(p.code)}
              >
                <Text style={styles.code}>{p.code}</Text>
                <Text style={[styles.petit, styles.flex]}>
                  {fait(p.code)} / {POSTURES_TEST.length} postures
                  {fait(p.code) === POSTURES_TEST.length ? ' ✓' : ''}
                </Text>
                <IconeChevron couleur={couleurs.ongletInactif} />
              </Pressable>
            ))}
            <Text style={styles.petit}>Appui long sur un participant pour le supprimer.</Text>
          </Carte>
        ) : null}

        {essais.enregistrements.length ? (
          <Carte style={styles.bloc}>
            <Text style={styles.titreBloc}>Moyenne par posture</Text>
            <View style={styles.ligneTableau}>
              <Text style={[styles.entete, styles.colPosture]}>Posture</Text>
              <Text style={[styles.entete, styles.col]}>Cou</Text>
              <Text style={[styles.entete, styles.col]}>Tronc</Text>
              <Text style={[styles.entete, styles.col]}>Détecté</Text>
            </View>
            {parPosture.map((r) => (
              <View key={r.posture} style={styles.ligneTableau}>
                <Text style={[styles.texte, styles.colPosture]}>
                  {POSTURES_TEST.find((p) => p.id === r.posture)!.titre}
                  <Text style={styles.petit}> ({r.participants})</Text>
                </Text>
                <Text style={[styles.valeur, styles.col]}>{deg(r.couMoyen)}</Text>
                <Text style={[styles.valeur, styles.col]}>{deg(r.troncMoyen)}</Text>
                <Text style={[styles.valeur, styles.col]}>{pct(r.reussite)}</Text>
              </View>
            ))}
            <Text style={styles.petit}>
              Angles : moyenne des participants. « Détecté » : part des mesures où l’app voit bien
              la posture demandée. Réussite globale : {pct(global)}.
            </Text>
          </Carte>
        ) : null}

        {essais.enregistrements.length ? (
          <View style={styles.bloc}>
            <Pressable style={styles.boutonClair} onPress={() => exporter('resume')}>
              <Text style={styles.boutonClairTexte}>Exporter le résumé (CSV)</Text>
            </Pressable>
            <Pressable style={styles.boutonClair} onPress={() => exporter('mesures')}>
              <Text style={styles.boutonClairTexte}>Exporter toutes les mesures (CSV)</Text>
            </Pressable>
            <Text style={styles.lienDanger} onPress={toutEffacer}>
              Effacer toutes les données du test
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ecran: { flex: 1, backgroundColor: couleurs.fond },
  barreHaut: { paddingHorizontal: espaces.bordEcran, paddingVertical: 8 },
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
  contenu: { paddingHorizontal: espaces.bordEcran, paddingBottom: 40, gap: espaces.entreCartes },
  titre: { fontFamily: polices.bold, fontSize: 22, color: couleurs.texte },
  sousTitre: {
    fontFamily: polices.regular,
    fontSize: 13,
    color: couleurs.texteSecondaire,
    marginTop: 2,
  },
  bloc: { gap: 10 },
  titreBloc: { fontFamily: polices.semiBold, fontSize: 16, color: couleurs.texte },
  texte: { fontFamily: polices.regular, fontSize: 14, color: couleurs.texte },
  petit: { fontFamily: polices.regular, fontSize: 12, color: couleurs.texteSecondaire },
  flex: { flex: 1 },
  puceLigne: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  puce: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: couleurs.vert, marginTop: 6 },
  accord: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  boutonVert: {
    height: 50,
    borderRadius: rayons.bouton,
    backgroundColor: couleurs.vert,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boutonVertTexte: { fontFamily: polices.semiBold, fontSize: 15, color: couleurs.blanc },
  desactive: { opacity: 0.4 },
  participant: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: couleurs.bordure,
  },
  code: { fontFamily: polices.bold, fontSize: 15, color: couleurs.texte, width: 44 },
  ligneTableau: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  colPosture: { flex: 1 },
  col: { width: 58, textAlign: 'right' },
  entete: { fontFamily: polices.medium, fontSize: 12, color: couleurs.texteSecondaire },
  valeur: { fontFamily: polices.semiBold, fontSize: 14, color: couleurs.texte },
  boutonClair: {
    height: 50,
    borderRadius: rayons.bouton,
    backgroundColor: couleurs.carte,
    borderColor: couleurs.vertBordureBouton,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boutonClairTexte: { fontFamily: polices.semiBold, fontSize: 15, color: couleurs.vertFonce },
  lienDanger: {
    alignSelf: 'center',
    paddingVertical: 10,
    fontFamily: polices.medium,
    fontSize: 13,
    color: '#B91C1C',
  },
});
