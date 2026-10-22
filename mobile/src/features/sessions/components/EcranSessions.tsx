import { router } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Carte, Pastille } from '@/components/elements';
import { IconeChevron } from '@/components/icones';
import { Ecran, EnTete } from '@/components/layouts/Ecran';
import { libellePeriode, type SessionEnregistree } from '@/features/history';
import { useChargement } from '@/hooks/useChargement';
import { couleurs, polices } from '@/styles/theme';
import { formaterDuree, formaterHeure } from '@/utils/duree';

import { chargerSessions } from '../services/bilan.service';
import { CarteDemarrer } from './CarteDemarrer';

type Probleme = { libelle: string; part: number } | null;

/** Mes sessions : chaque session terminée, avec son bilan (comme « Mes sessions » du site). */
export function EcranSessions() {
  const [etat] = useChargement(chargerSessions);

  return (
    <Ecran>
      <EnTete titre="Mes sessions" sousTitre="Le bilan de chacune de vos sessions" />

      {etat.statut === 'chargement' ? (
        <ActivityIndicator color={couleurs.vert} style={styles.chargement} />
      ) : etat.statut === 'erreur' ? (
        <Carte>
          <Text style={styles.petit}>Impossible de charger les sessions : {etat.message}</Text>
        </Carte>
      ) : etat.donnees.length === 0 ? (
        <>
          <Carte>
            <Text style={styles.titreVide}>Aucune session pour l’instant</Text>
            <Text style={[styles.petit, styles.espaceHaut]}>
              Chaque session terminée apparaîtra ici, avec son bilan.
            </Text>
          </Carte>
          <CarteDemarrer />
        </>
      ) : (
        etat.donnees.map(({ session, probleme }) => (
          <CarteSession key={session.debut} session={session} probleme={probleme} />
        ))
      )}
    </Ecran>
  );
}

function CarteSession({ session, probleme }: { session: SessionEnregistree; probleme: Probleme }) {
  const jour = libellePeriode('jour', new Date(session.debut));
  const bonne = session.bilan?.bonne ?? null;
  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: '/bilan/[debut]', params: { debut: String(session.debut) } })
      }
      style={({ pressed }) => pressed && styles.appuye}
      accessibilityRole="button"
      accessibilityLabel={`Session du ${jour} à ${formaterHeure(session.debut)}`}
    >
      <Carte style={styles.carte}>
        <View style={styles.texte}>
          <Text style={styles.jour}>{jour}</Text>
          <Text style={styles.petit}>
            {formaterHeure(session.debut)} – {formaterHeure(session.fin)} ·{' '}
            {formaterDuree(session.secondes)}
          </Text>
          {probleme ? (
            <Pastille texte={`${probleme.libelle} · ${Math.round(probleme.part * 100)} %`} />
          ) : null}
        </View>
        <View style={styles.score}>
          <Text style={styles.pourcentage}>{bonne === null ? '—' : `${bonne} %`}</Text>
          <Text style={styles.scoreLibelle}>bonne posture</Text>
        </View>
        <IconeChevron couleur={couleurs.ongletInactif} />
      </Carte>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chargement: { marginTop: 40 },
  carte: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  texte: { flex: 1, gap: 4, alignItems: 'flex-start' },
  jour: { fontFamily: polices.semiBold, fontSize: 15, color: couleurs.texte },
  petit: { fontFamily: polices.medium, fontSize: 13, color: couleurs.texteSecondaire },
  score: { alignItems: 'flex-end' },
  pourcentage: { fontFamily: polices.bold, fontSize: 20, color: couleurs.vertFonce },
  scoreLibelle: { fontFamily: polices.medium, fontSize: 11, color: couleurs.texteSecondaire },
  titreVide: { fontFamily: polices.semiBold, fontSize: 16, color: couleurs.texte },
  espaceHaut: { marginTop: 6 },
  appuye: { opacity: 0.85 },
});
