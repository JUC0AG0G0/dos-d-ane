/*
 * Tests de src/donnees/essais.ts : codes des participants, réussite par
 * posture, moyennes et export CSV du test des postures.
 *
 *   node --test scripts/
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  csvMesures,
  csvResume,
  prochainCode,
  resumerEnregistrement,
  resumerParPosture,
  reussiteGlobale,
} from '../src/donnees/essais.ts';

const ech = (couAngle, couNiveau, troncAngle, troncNiveau, mesurable = true) => ({
  t: 0,
  mesurable,
  cote: 'gauche',
  score: mesurable ? 80 : null,
  cou: { angle: couAngle, niveau: couNiveau },
  tronc: { angle: troncAngle, niveau: troncNiveau },
});

const enr = (participant, posture, echantillons) => ({
  participant,
  posture,
  debut: 0,
  echantillons,
});

test('codes P01, P02… en réutilisant le premier libre', () => {
  assert.equal(prochainCode([]), 'P01');
  assert.equal(prochainCode([{ code: 'P01' }, { code: 'P03' }]), 'P02');
});

test('« bien droit » réussi seulement si cou ET tronc sont verts', () => {
  const r = resumerEnregistrement(
    enr('P01', 'droit', [
      ech(56, 'vert', 6, 'vert'),
      ech(55, 'vert', 12, 'orange'),
      ech(null, 'gris', null, 'gris', false),
    ]),
  );
  assert.equal(r.mesures, 3);
  assert.equal(r.mesurables, 2);
  assert.equal(r.reussite, 0.5);
  assert.equal(r.cou.moyenne, 55.5);
});

test('« tête en avant » réussi si le cou est orange ou rouge', () => {
  const r = resumerEnregistrement(
    enr('P01', 'teteAvant', [
      ech(44, 'rouge', 5, 'vert'),
      ech(50, 'orange', 5, 'vert'),
      ech(55, 'vert', 5, 'vert'),
    ]),
  );
  assert.equal(Math.round(r.reussite * 100), 67);
});

test('moyenne par posture : chaque participant pèse autant', () => {
  const essais = {
    participants: [],
    enregistrements: [
      enr('P01', 'droit', [
        ech(50, 'orange', 5, 'vert'),
        ech(50, 'orange', 5, 'vert'),
        ech(50, 'orange', 5, 'vert'),
      ]),
      enr('P02', 'droit', [ech(60, 'vert', 5, 'vert')]),
    ],
  };
  const droit = resumerParPosture(essais).find((r) => r.posture === 'droit');
  assert.equal(droit.participants, 2);
  assert.equal(droit.couMoyen, 55); // (50 + 60) / 2, pas (50×3 + 60) / 4
  assert.equal(droit.cou.min, 50);
  assert.equal(droit.cou.max, 60);
  assert.equal(droit.reussite, 0.5); // P01 : 0 %, P02 : 100 %
  assert.equal(reussiteGlobale(essais), 0.5);
});

test('CSV : séparateur « ; », virgule décimale, ligne de moyenne', () => {
  const essais = {
    participants: [],
    enregistrements: [enr('P01', 'droit', [ech(55.25, 'vert', 6.5, 'vert')])],
  };
  const mesures = csvMesures(essais).trim().split('\n');
  assert.equal(mesures.length, 2);
  assert.match(mesures[1], /^P01;Bien droit;0,00;oui;gauche;55,3;vert;6,5;vert;;80$/);
  const resume = csvResume(essais);
  assert.match(resume, /\nP01;Bien droit;/);
  assert.match(resume, /\nMOYENNE \(1 pers\.\);Bien droit;/);
});

test('penché / avachi : un sens de tronc contraire est une erreur, inconnu est toléré', () => {
  const avecSens = (sens) => ({
    ...ech(60, 'vert', 28, 'rouge'),
    tronc: { angle: 28, niveau: 'rouge', sens },
  });
  const avachi = resumerEnregistrement(
    enr('P01', 'avachi', [
      avecSens('arriere'),
      avecSens('avant'),
      avecSens(null),
      ech(60, 'vert', 28, 'rouge'),
    ]),
  );
  assert.equal(avachi.reussite, 0.75);
  const penche = resumerEnregistrement(
    enr('P01', 'pencheAvant', [avecSens('avant'), avecSens('arriere')]),
  );
  assert.equal(penche.reussite, 0.5);
});
