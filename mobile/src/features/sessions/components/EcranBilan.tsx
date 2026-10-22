import { router } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnneauPourcentage } from '@/components/AnneauPourcentage';
import { AvertissementSante, Carte } from '@/components/elements';
import { IconeFermer } from '@/components/icones';
import { CarteExercice, raison } from '@/features/advice';
import { libellePeriode, Repartition } from '@/features/history';
import { useChargement } from '@/hooks/useChargement';
import { couleurs, espaces, polices } from '@/styles/theme';
import { formaterDuree, formaterHeure } from '@/utils/duree';

import { chargerBilan } from '../services/bilan.service';
import { CarteCaptures } from './CarteCaptures';

type Bilan = Awaited<ReturnType<typeof chargerBilan>>;

/** Bilan d'une session terminée, comme la page d'une session terminée sur le site. */
export function EcranBilan({ debut }: { debut: number }) {
  const charger = useCallback(() => chargerBilan(debut), [debut]);
  const [etat] = useChargement(charger);

  return (
    <SafeAreaView style={styles.ecran} edges={['top']}>
      <View style={styles.barreHaut}>
        <Pressable
          style={({ pressed }) => [styles.boutonRond, pressed && styles.appuye]}
          onPress={() => router.back()}
          accessibilityLabel="Fermer le bilan"
          hitSlop={8}
        >
          <IconeFermer couleur={couleurs.texte} />
        </Pressable>
        <Text style={styles.titreBarre}>Bilan de la session</Text>
        <View style={styles.boutonRond} />
      </View>

      <ScrollView contentContainerStyle={styles.contenu}>
        {etat.statut === 'chargement' ? (
          <ActivityIndicator color={couleurs.vert} />
        ) : etat.statut === 'erreur' ? (
          <Carte>
            <Text style={styles.petit}>Impossible d’afficher le bilan : {etat.message}</Text>
          </Carte>
        ) : (
          <Contenu bilan={etat.donnees} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Contenu({ bilan }: { bilan: Bilan }) {
  const { session, captures, situation, probleme, conseil, exercices } = bilan;
  const pause = Math.round((session.fin - session.debut) / 1000) - session.secondes;
  const mesure = session.bilan;

  return (
    <>
      <Text style={styles.date}>{libellePeriode('jour', new Date(session.debut))}</Text>

      <View style={styles.tuiles}>
        <Tuile libelle="Début" valeur={formaterHeure(session.debut)} />
        <Tuile libelle="Fin" valeur={formaterHeure(session.fin)} />
        <Tuile
          libelle="Durée active"
          valeur={formaterDuree(session.secondes)}
          detail={pause >= 60 ? `dont ${formaterDuree(pause)} de pause` : undefined}
        />
        <Tuile
          libelle="Captures"
          valeur={captures === null ? '—' : String(captures)}
          detail={captures === null ? 'non envoyées' : 'envoyées au serveur'}
        />
      </View>

      {!mesure || mesure.bonne === null ? (
        <Carte>
          <Text style={styles.titreCarte}>Aucune posture mesurée</Text>
          <Text style={[styles.petit, styles.espaceHaut]}>
            Oreille, épaule et hanche doivent être visibles, le téléphone posé de profil.
          </Text>
        </Carte>
      ) : (
        <>
          <Carte style={styles.synthese}>
            <AnneauPourcentage valeur={mesure.bonne} taille={92} />
            <View style={styles.detail}>
              <Text style={styles.petit}>Temps en bonne posture</Text>
              <Text style={styles.angles}>
                Cou {texteAngle(mesure.anglesMoyens.cou)} · Tronc{' '}
                {texteAngle(mesure.anglesMoyens.tronc)} en moyenne
              </Text>
            </View>
          </Carte>
          {mesure.repartition ? <Repartition {...mesure.repartition} /> : null}
        </>
      )}

      <Carte style={styles.bloc}>
        <Text style={styles.titreCarte}>
          {probleme
            ? `${probleme.libelle} : ${Math.round(probleme.part * 100)} % du temps`
            : 'Aucune mauvaise posture fréquente'}
        </Text>
        <Text style={styles.petit}>{conseil}</Text>
      </Carte>

      {session.serveur && captures ? (
        <CarteCaptures idSession={session.serveur} total={captures} />
      ) : null}

      {exercices.length ? (
        <View style={styles.bloc}>
          <Text style={styles.titreSection}>Exercices conseillés</Text>
          {exercices.map((e) => (
            <CarteExercice key={e.id} exercice={e} raison={raison(e, situation)} />
          ))}
        </View>
      ) : null}

      <AvertissementSante />
    </>
  );
}

const texteAngle = (angle: number | null) => (angle === null ? '—' : `${Math.round(angle)}°`);

function Tuile({ libelle, valeur, detail }: { libelle: string; valeur: string; detail?: string }) {
  return (
    <Carte style={styles.tuile}>
      <Text style={styles.tuileLibelle}>{libelle}</Text>
      <Text style={styles.tuileValeur}>{valeur}</Text>
      {detail ? <Text style={styles.tuileDetail}>{detail}</Text> : null}
    </Carte>
  );
}

const styles = StyleSheet.create({
  ecran: { flex: 1, backgroundColor: couleurs.fond },
  barreHaut: {
    height: 48,
    marginTop: 14,
    paddingHorizontal: espaces.bordEcran,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  boutonRond: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titreBarre: { fontFamily: polices.semiBold, fontSize: 15, color: couleurs.texte },
  appuye: { opacity: 0.85 },
  contenu: {
    paddingHorizontal: espaces.bordEcran,
    paddingVertical: 12,
    paddingBottom: 32,
    gap: espaces.entreCartes,
  },
  date: { fontFamily: polices.bold, fontSize: 20, color: couleurs.texte },
  tuiles: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
  tuile: { width: '48%', padding: 16, gap: 2 },
  tuileLibelle: { fontFamily: polices.medium, fontSize: 12, color: couleurs.texteSecondaire },
  tuileValeur: { fontFamily: polices.bold, fontSize: 20, color: couleurs.texte },
  tuileDetail: { fontFamily: polices.regular, fontSize: 11, color: couleurs.texteSecondaire },
  synthese: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  detail: { flex: 1, gap: 6 },
  angles: { fontFamily: polices.semiBold, fontSize: 14, color: couleurs.texte },
  bloc: { gap: 10 },
  titreCarte: { fontFamily: polices.semiBold, fontSize: 16, color: couleurs.texte },
  titreSection: { fontFamily: polices.semiBold, fontSize: 16, color: couleurs.texte },
  petit: { fontFamily: polices.medium, fontSize: 13, color: couleurs.texteSecondaire },
  espaceHaut: { marginTop: 6 },
});
