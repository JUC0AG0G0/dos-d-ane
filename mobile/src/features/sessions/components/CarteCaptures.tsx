import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Carte } from '@/components/elements';
import { couleurs, polices, rayons } from '@/styles/theme';
import { formaterHeure } from '@/utils/duree';

import { NOMBRE_POINTS, phrasePoints } from '../captures';
import { sessionsService } from '../services/sessions.service';
import type { Capture, CaptureSummary } from '../types/sessions.types';
import { MascotteCapture } from './MascotteCapture';

const heure = (iso: string) => formaterHeure(new Date(iso).getTime(), true);

/**
 * Captures envoyées au serveur pendant la session, et l'aperçu de celle qu'on
 * touche (comme la page d'une session terminée sur le site).
 */
export function CarteCaptures({ idSession, total }: { idSession: string; total: number }) {
  const [liste, setListe] = useState<CaptureSummary[] | null>(null);
  const [suivant, setSuivant] = useState<string | null>(null);
  const [erreur, setErreur] = useState(false);
  const [choisie, setChoisie] = useState<string | null>(null);
  const [apercu, setApercu] = useState<Capture | null>(null);
  const [chargePlus, setChargePlus] = useState(false);

  useEffect(() => {
    let actif = true;
    sessionsService.captures(idSession).then(
      (page) => {
        if (!actif) return;
        setListe(page.items);
        setSuivant(page.nextCursor);
        setChoisie(page.items.at(-1)?.id ?? null);
      },
      () => actif && setErreur(true),
    );
    return () => {
      actif = false;
    };
  }, [idSession]);

  useEffect(() => {
    if (!choisie) return;
    let actif = true;
    sessionsService.capture(choisie).then(
      (capture) => actif && setApercu(capture),
      () => undefined,
    );
    return () => {
      actif = false;
    };
  }, [choisie]);

  async function afficherPlus() {
    if (!suivant) return;
    setChargePlus(true);
    try {
      const page = await sessionsService.captures(idSession, suivant);
      setListe((actuelle) => [...(actuelle ?? []), ...page.items]);
      setSuivant(page.nextCursor);
    } catch {
      setSuivant(null);
    } finally {
      setChargePlus(false);
    }
  }

  const affichee = apercu && apercu.id === choisie ? apercu : null;

  return (
    <>
      <Carte style={styles.bloc}>
        <Text style={styles.titre}>Captures</Text>
        <Text style={styles.petit}>
          {total} capture{total > 1 ? 's' : ''}, de la plus ancienne à la plus récente
        </Text>
        {erreur ? (
          <Text style={styles.petit}>Impossible de charger les captures.</Text>
        ) : !liste ? (
          <ActivityIndicator color={couleurs.vert} />
        ) : (
          <View>
            <View style={styles.ligne}>
              <Text style={styles.entete}>Heure</Text>
              <Text style={styles.entete}>Articulations</Text>
            </View>
            {liste.map((c) => (
              <Pressable
                key={c.id}
                onPress={() => setChoisie(c.id)}
                style={[styles.ligne, styles.separation, c.id === choisie && styles.choisie]}
                accessibilityRole="button"
                accessibilityState={{ selected: c.id === choisie }}
                accessibilityLabel={`Capture de ${heure(c.capturedAt)}`}
              >
                <Text style={styles.texte}>{heure(c.capturedAt)}</Text>
                <Text style={styles.texte}>
                  {c.keypointCount} / {NOMBRE_POINTS}
                </Text>
              </Pressable>
            ))}
            {suivant ? (
              <Pressable onPress={afficherPlus} disabled={chargePlus} style={styles.plus}>
                <Text style={styles.plusTexte}>{chargePlus ? 'Chargement…' : 'Afficher plus'}</Text>
              </Pressable>
            ) : null}
          </View>
        )}
      </Carte>

      {choisie ? (
        <Carte style={styles.bloc}>
          <Text style={styles.titre}>
            Aperçu{affichee ? ` · ${heure(affichee.capturedAt)}` : ''}
          </Text>
          <Text style={styles.petit}>
            Positions des articulations seulement : l’image n’est jamais stockée.
          </Text>
          {affichee ? (
            <>
              <MascotteCapture capture={affichee} />
              <Text style={styles.petit}>
                image {affichee.imageWidth} × {affichee.imageHeight}
              </Text>
              <Text style={styles.texte}>{phrasePoints(affichee.keypoints)}</Text>
            </>
          ) : (
            <ActivityIndicator color={couleurs.vert} />
          )}
        </Carte>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: 10 },
  titre: { fontFamily: polices.semiBold, fontSize: 16, color: couleurs.texte },
  petit: { fontFamily: polices.medium, fontSize: 13, color: couleurs.texteSecondaire },
  texte: { fontFamily: polices.regular, fontSize: 14, color: couleurs.texte },
  ligne: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  separation: { borderTopWidth: 1, borderTopColor: couleurs.bordure },
  choisie: { backgroundColor: couleurs.vertFondPastille, borderRadius: rayons.icone / 2 },
  entete: { fontFamily: polices.medium, fontSize: 13, color: couleurs.texteSecondaire },
  plus: { alignItems: 'center', paddingVertical: 10 },
  plusTexte: { fontFamily: polices.semiBold, fontSize: 14, color: couleurs.vertFonce },
});
