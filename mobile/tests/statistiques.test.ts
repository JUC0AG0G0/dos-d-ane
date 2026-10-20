/*
 * Tests de features/history/statistiques.ts et features/advice/exercices.ts :
 * moyenne dans le temps, périodes, répartition, libellés et choix des conseils.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { conseilDuJour, exercicesRecommandes } from '../src/features/advice/exercices.ts';
import type { Niveau, SensTronc } from '../src/features/analysis/posture.ts';
import {
  ajouterEchantillon,
  bornes,
  fusionnerTranches,
  libellePeriode,
  resumer,
  situation,
  texteDuree,
  type Echantillon,
  type Historique,
  type Tranche,
} from '../src/features/history/statistiques.ts';

/** Mercredi 7 octobre 2026, à l'heure locale. */
const le = (j: number, h = 10, m = 0) => new Date(2026, 9, j, h, m);

const echantillon = (
  instant: Date,
  duree: number,
  couNiveau: Niveau = 'vert',
  troncNiveau: Niveau = 'vert',
  sens: SensTronc = null,
): Echantillon => ({
  instant: instant.getTime(),
  duree,
  cou: { angle: 55, niveau: couNiveau },
  tronc: { angle: 8, niveau: troncNiveau, sens },
});

function tranchesDe(...echantillons: Echantillon[]): Tranche[] {
  const m = new Map<number, Tranche>();
  for (const e of echantillons) ajouterEchantillon(m, e);
  return [...m.values()];
}

test('bonne posture : part du temps, pas part des mesures', () => {
  // 30 s en vert puis 10 s en orange : 30 / 40 = 75 % du temps (une mesure sur deux).
  const t = tranchesDe(echantillon(le(7, 10, 0), 30), echantillon(le(7, 10, 5), 10, 'orange'));
  assert.equal(resumer(t, 'jour', le(7)).bonne, 75);
});

test('rien de mesurable : la mesure est ignorée', () => {
  const t = tranchesDe(echantillon(le(7), 5, 'gris', 'gris'));
  assert.equal(t.length, 0);
});

test('répartition : pire niveau des deux mesures, pourcentages qui font 100', () => {
  const t = tranchesDe(
    echantillon(le(7, 10), 60, 'vert', 'vert'),
    echantillon(le(7, 11), 30, 'orange', 'vert'),
    echantillon(le(7, 12), 10, 'vert', 'rouge'),
  );
  const r = resumer(t, 'jour', le(7));
  assert.deepEqual(r.repartition, { bonne: 60, moyenne: 30, ameliorer: 10 });
  assert.equal(r.secondes, 100);
});

test('écart avec la veille, en points de %', () => {
  const t = tranchesDe(
    echantillon(le(6, 10), 60),
    echantillon(le(6, 11), 40, 'orange'),
    echantillon(le(7, 10), 60),
    echantillon(le(7, 11), 20, 'orange'),
  );
  assert.equal(resumer(t, 'jour', le(7)).ecart, 75 - 60);
  assert.equal(resumer(t, 'jour', le(6)).ecart, null);
});

test('barres du jour : de 9h à 17h au moins, la plus récente mise en avant', () => {
  const t = tranchesDe(echantillon(le(7, 9), 60), echantillon(le(7, 14), 60));
  const { barres } = resumer(t, 'jour', le(7));
  assert.equal(barres[0].libelle, '9h');
  assert.equal(barres.at(-1)?.libelle, '17h');
  assert.equal(barres.find((b) => b.misEnAvant)?.libelle, '14h');
  assert.equal(barres.find((b) => b.libelle === '10h')?.bonne, null);
});

test('semaine du lundi au dimanche, mois en semaines S1…S5', () => {
  const { debut, fin } = bornes('semaine', le(7));
  assert.equal(debut.getDate(), 5); // lundi 5 octobre
  assert.equal(fin.getDate(), 12);
  const t = tranchesDe(echantillon(le(7), 60));
  assert.deepEqual(
    resumer(t, 'semaine', le(7)).barres.map((b) => b.libelle),
    ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
  );
  assert.deepEqual(
    resumer(t, 'mois', le(7)).barres.map((b) => b.libelle),
    ['S1', 'S2', 'S3', 'S4', 'S5'],
  );
});

test('fusion : deux sauvegardes de la même heure s’additionnent', () => {
  const a = tranchesDe(echantillon(le(7, 10, 0), 10));
  const b = tranchesDe(echantillon(le(7, 10, 30), 10, 'orange'));
  const f = fusionnerTranches(a, b);
  assert.equal(f.length, 1);
  assert.equal(f[0].secondes, 20);
  assert.equal(resumer(f, 'jour', le(7)).bonne, 50);
});

test('libellés de période, comme dans la maquette', () => {
  assert.equal(libellePeriode('jour', le(7)), 'Mercredi 7 oct. 2026');
  assert.equal(libellePeriode('semaine', le(7)), '5 – 11 oct. 2026');
  assert.equal(libellePeriode('semaine', le(1)), '28 sept. – 4 oct. 2026');
  assert.equal(libellePeriode('mois', le(7)), 'Octobre 2026');
});

test('temps suivi', () => {
  assert.equal(texteDuree(45 * 60), '45 min');
  assert.equal(texteDuree(6 * 3600 + 10 * 60), '6 h 10');
  assert.equal(texteDuree(2 * 3600), '2 h');
  assert.equal(texteDuree(128 * 3600 + 20 * 60), '128 h');
});

test('conseils : la tête en avant fréquente fait passer les exercices du cou en premier', () => {
  const historique: Historique = {
    tranches: tranchesDe(
      echantillon(le(7, 10), 60, 'rouge', 'vert'),
      echantillon(le(7, 11), 20, 'vert', 'vert'),
    ),
    sessions: [],
  };
  const s = situation(historique, le(7, 18));
  assert.equal(s.teteEnAvant, 0.75);
  assert.equal(s.bustePenche, 0);
  assert.equal(exercicesRecommandes(s)[0].cible, 'teteEnAvant');
  assert.match(conseilDuJour(s), /écran/);
  assert.ok(exercicesRecommandes(s, 'dos').every((e) => e.filtre === 'dos'));
});

test('conseils sans données : conseil général, tous les exercices', () => {
  const s = situation({ tranches: [], sessions: [] }, le(7));
  assert.equal(conseilDuJour(s), 'Levez-vous 2 min toutes les heures');
  assert.ok(exercicesRecommandes(s).length >= 7);
});

test('conseils : le dos avachi fait passer ses exercices en premier', () => {
  const historique: Historique = {
    tranches: tranchesDe(
      echantillon(le(7, 10), 60, 'vert', 'rouge', 'arriere'),
      echantillon(le(7, 11), 20, 'vert', 'rouge', 'avant'),
      echantillon(le(7, 12), 20, 'vert', 'vert'),
    ),
    sessions: [],
  };
  const s = situation(historique, le(7, 18));
  assert.equal(s.avachi, 0.6);
  assert.equal(s.bustePenche, 0.2);
  assert.equal(exercicesRecommandes(s)[0].cible, 'avachi');
  assert.match(conseilDuJour(s), /fond de la chaise/);
});

test('anciennes tranches sans troncArriere : comptées comme 0', () => {
  const ancienne = { ...tranchesDe(echantillon(le(7, 10), 60, 'vert', 'rouge'))[0] };
  delete ancienne.troncArriere;
  const fusion = fusionnerTranches(
    [ancienne],
    tranchesDe(echantillon(le(7, 10, 30), 60, 'vert', 'rouge', 'arriere')),
  );
  assert.equal(fusion[0].troncArriere, 60);
  const s = situation({ tranches: [ancienne], sessions: [] }, le(7, 18));
  assert.equal(s.avachi, 0);
  assert.equal(s.bustePenche, 1);
});

test('tête en arrière : en alerte, mais pas comptée comme tête en avant', () => {
  const [t] = tranchesDe({
    ...echantillon(le(7), 10, 'orange'),
    cou: { angle: 100, niveau: 'orange' },
  });
  assert.equal(t.couAlerte, 0);
  assert.equal(t.moyenne, 10);
});
