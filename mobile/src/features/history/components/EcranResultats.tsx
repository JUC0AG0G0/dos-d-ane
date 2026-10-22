import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { AnneauPourcentage } from '@/components/AnneauPourcentage';
import { Carte, Pastille } from '@/components/elements';
import { IconeFlecheDroite, IconeFlecheGauche } from '@/components/icones';
import { Ecran, EnTete } from '@/components/layouts/Ecran';
import { useChargement } from '@/hooks/useChargement';
import { couleurs, polices } from '@/styles/theme';

import { chargerResultats } from '../services/history.service';
import { Repartition } from './Repartition';
import {
  bornes,
  decaler,
  libellePeriode,
  REFERENCE_PRECEDENTE,
  texteDuree,
  texteEcart,
  type Barre,
  type Periode,
  type Resume,
} from '../statistiques';

const PERIODES: { valeur: Periode; libelle: string }[] = [
  { valeur: 'jour', libelle: 'Jour' },
  { valeur: 'semaine', libelle: 'Semaine' },
  { valeur: 'mois', libelle: 'Mois' },
];

const TITRE_GRAPHIQUE: Record<Periode, string> = {
  jour: 'Bonne posture par heure',
  semaine: 'Bonne posture par jour',
  mois: 'Bonne posture par semaine',
};

const LARGEUR_BARRE: Record<Periode, number> = { jour: 20, semaine: 28, mois: 36 };

export function EcranResultats() {
  const [periode, setPeriode] = useState<Periode>('jour');
  const [ref, setRef] = useState(() => new Date());
  const [aujourdhui] = useState(() => new Date());

  const charger = useCallback(() => chargerResultats(periode, ref), [periode, ref]);
  const [etat] = useChargement(charger);

  const estPeriodeCourante = bornes(periode, ref).fin > aujourdhui;

  function choisirPeriode(p: Periode) {
    setPeriode(p);
    setRef(new Date());
  }

  return (
    <Ecran>
      <EnTete titre="Mes résultats" />

      <View style={styles.selecteur}>
        {PERIODES.map(({ valeur, libelle }) => {
          const actif = valeur === periode;
          return (
            <Pressable
              key={valeur}
              style={[styles.option, actif && styles.optionActive]}
              onPress={() => choisirPeriode(valeur)}
              accessibilityRole="button"
              accessibilityState={{ selected: actif }}
            >
              <Text style={actif ? styles.optionTexteActif : styles.optionTexte}>{libelle}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.navigation}>
        <BoutonFleche
          libelle="Période précédente"
          onPress={() => setRef(decaler(periode, ref, -1))}
          gauche
        />
        <Text style={styles.libellePeriode}>{libellePeriode(periode, ref)}</Text>
        <BoutonFleche
          libelle="Période suivante"
          onPress={() => setRef(decaler(periode, ref, 1))}
          desactive={estPeriodeCourante}
        />
      </View>

      {etat.statut === 'chargement' ? (
        <ActivityIndicator color={couleurs.vert} style={styles.chargement} />
      ) : etat.statut === 'erreur' ? (
        <Carte>
          <Text style={styles.petit}>Impossible de charger les résultats : {etat.message}</Text>
        </Carte>
      ) : etat.donnees.bonne === null ? (
        <Carte>
          <Text style={styles.titreCarte}>Aucune session sur cette période</Text>
          <Text style={[styles.petit, styles.espaceHaut]}>
            Démarrez une session pour voir vos résultats apparaître ici.
          </Text>
        </Carte>
      ) : (
        <Contenu resume={etat.donnees} periode={periode} />
      )}
    </Ecran>
  );
}

function Contenu({ resume, periode }: { resume: Resume; periode: Periode }) {
  return (
    <>
      <Carte style={styles.synthese}>
        <AnneauPourcentage valeur={resume.bonne ?? 0} taille={92} />
        <View style={styles.detail}>
          <Text style={styles.petit}>Temps en bonne posture</Text>
          {resume.ecart !== null ? (
            <Pastille texte={texteEcart(resume.ecart, REFERENCE_PRECEDENTE[periode])} />
          ) : null}
          <View style={styles.stats}>
            <Stat valeur={texteDuree(resume.secondes)} libelle="Temps suivi" />
          </View>
        </View>
      </Carte>

      <Carte style={styles.carteGraphique}>
        <Text style={styles.titreCarte}>{TITRE_GRAPHIQUE[periode]}</Text>
        <Graphique barres={resume.barres} largeur={LARGEUR_BARRE[periode]} />
      </Carte>

      {resume.repartition ? <Repartition {...resume.repartition} /> : null}
    </>
  );
}

function Stat({ valeur, libelle }: { valeur: string; libelle: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValeur}>{valeur}</Text>
      <Text style={styles.statLibelle}>{libelle}</Text>
    </View>
  );
}

const HAUTEUR_MAX_BARRE = 93;

function Graphique({ barres, largeur }: { barres: Barre[]; largeur: number }) {
  // Au-delà de 9 heures affichées, les barres s'affinent pour tenir en largeur.
  const l = barres.length > 9 ? Math.max(10, Math.floor((largeur * 9) / barres.length)) : largeur;
  return (
    <View style={styles.barres}>
      {barres.map((b, i) => (
        <View key={`${b.libelle}-${i}`} style={styles.colonne}>
          {b.bonne === null ? (
            <View style={[styles.barreVide, { width: l }]} />
          ) : (
            <View
              accessibilityLabel={`${b.libelle} : ${b.bonne} % en bonne posture`}
              style={[
                styles.barre,
                {
                  width: l,
                  height: Math.max(6, (b.bonne * HAUTEUR_MAX_BARRE) / 100),
                  backgroundColor: b.misEnAvant ? couleurs.vert : couleurs.vertPale,
                },
              ]}
            />
          )}
          <Text style={b.misEnAvant ? styles.libelleBarreActif : styles.libelleBarre}>
            {b.libelle}
          </Text>
        </View>
      ))}
    </View>
  );
}

function BoutonFleche({
  libelle,
  onPress,
  gauche,
  desactive,
}: {
  libelle: string;
  onPress: () => void;
  gauche?: boolean;
  desactive?: boolean;
}) {
  const couleur = desactive ? couleurs.ongletInactif : couleurs.texte;
  return (
    <Pressable
      style={[styles.boutonRond, desactive && styles.desactive]}
      onPress={onPress}
      disabled={desactive}
      accessibilityLabel={libelle}
      hitSlop={8}
    >
      {gauche ? <IconeFlecheGauche couleur={couleur} /> : <IconeFlecheDroite couleur={couleur} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chargement: { marginTop: 40 },
  selecteur: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    borderRadius: 16,
    backgroundColor: couleurs.vertFondIcone,
  },
  option: { flex: 1, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  optionActive: { backgroundColor: couleurs.vert },
  optionTexte: { fontFamily: polices.medium, fontSize: 14, color: couleurs.vertTexte },
  optionTexteActif: { fontFamily: polices.semiBold, fontSize: 14, color: couleurs.blanc },

  navigation: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  boutonRond: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: couleurs.carte,
    borderColor: couleurs.bordure,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  desactive: { opacity: 0.5 },
  libellePeriode: { fontFamily: polices.semiBold, fontSize: 15, color: couleurs.texte },

  synthese: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  detail: { flex: 1, gap: 8, alignItems: 'flex-start' },
  stats: { flexDirection: 'row', gap: 24 },
  stat: { gap: 2 },
  statValeur: { fontFamily: polices.bold, fontSize: 18, color: couleurs.texte },
  statLibelle: { fontFamily: polices.medium, fontSize: 11, color: couleurs.texteSecondaire },

  titreCarte: { fontFamily: polices.semiBold, fontSize: 16, color: couleurs.texte },
  petit: { fontFamily: polices.medium, fontSize: 13, color: couleurs.texteSecondaire },
  espaceHaut: { marginTop: 6 },

  carteGraphique: { gap: 12 },
  barres: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  colonne: { height: 112, alignItems: 'center', justifyContent: 'flex-end', gap: 6 },
  barre: { borderRadius: 8 },
  barreVide: { height: 4, borderRadius: 2, backgroundColor: couleurs.bordure },
  libelleBarre: { fontFamily: polices.medium, fontSize: 11, color: couleurs.texteSecondaire },
  libelleBarreActif: { fontFamily: polices.semiBold, fontSize: 11, color: couleurs.vertFonce },
});
