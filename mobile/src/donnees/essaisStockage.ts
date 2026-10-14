/**
 * Données du test des postures, gardées sur le téléphone, à part de
 * l'historique des sessions. Uniquement des codes (P01…) et des angles.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { csvMesures, csvResume, type EnregistrementTest, type Essais } from './essais';

const CLE = 'dosdane.essais.v1';

const vide = (): Essais => ({ participants: [], enregistrements: [] });

export async function chargerEssais(): Promise<Essais> {
  try {
    const brut = await AsyncStorage.getItem(CLE);
    if (!brut) return vide();
    const lu = JSON.parse(brut) as Partial<Essais>;
    return { participants: lu.participants ?? [], enregistrements: lu.enregistrements ?? [] };
  } catch {
    return vide();
  }
}

// Écritures l'une après l'autre, comme pour l'historique.
let file: Promise<void> = Promise.resolve();

function modifier(transformer: (e: Essais) => Essais): Promise<void> {
  file = file.then(async () => {
    await AsyncStorage.setItem(CLE, JSON.stringify(transformer(await chargerEssais())));
  });
  return file;
}

export function ajouterParticipant(code: string): Promise<void> {
  return modifier((e) =>
    e.participants.some((p) => p.code === code)
      ? e
      : { ...e, participants: [...e.participants, { code, consentement: true, date: Date.now() }] },
  );
}

/** Enregistre une posture ; refaire une posture remplace l'enregistrement précédent. */
export function enregistrerPosture(enregistrement: EnregistrementTest): Promise<void> {
  return modifier((e) => ({
    ...e,
    enregistrements: [
      ...e.enregistrements.filter(
        (x) =>
          !(x.participant === enregistrement.participant && x.posture === enregistrement.posture),
      ),
      enregistrement,
    ],
  }));
}

export function supprimerParticipant(code: string): Promise<void> {
  return modifier((e) => ({
    participants: e.participants.filter((p) => p.code !== code),
    enregistrements: e.enregistrements.filter((x) => x.participant !== code),
  }));
}

export function effacerEssais(): Promise<void> {
  return modifier(vide);
}

/** Écrit le CSV dans le cache et ouvre la feuille de partage (mail, AirDrop, Fichiers…). */
export async function exporterCsv(type: 'resume' | 'mesures'): Promise<void> {
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('Le partage de fichiers n’est pas disponible sur cet appareil.');
  }
  const essais = await chargerEssais();
  const contenu = type === 'resume' ? csvResume(essais) : csvMesures(essais);
  const date = new Date().toISOString().slice(0, 10);
  const fichier = new File(Paths.cache, `test-postures-${type}-${date}.csv`);
  if (fichier.exists) fichier.delete();
  fichier.create();
  // BOM UTF-8 : Excel affiche alors correctement les accents.
  fichier.write('﻿' + contenu);
  await Sharing.shareAsync(fichier.uri, {
    mimeType: 'text/csv',
    UTI: 'public.comma-separated-values-text',
    dialogTitle: 'Exporter le test des postures',
  });
}
