/*
 * Tests de src/camera/mesure.ts : message de la carte de statut, score
 * instantané et chronomètre de l'écran « Session en cours ».
 *
 *   node --test scripts/
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  formaterDuree,
  lireMesure,
  messagePosture,
  scoreInstantane,
} from '../src/camera/mesure.ts';

const mesure = (cou, tronc, score = null, sens = null) => ({
  personne: true,
  cote: 'gauche',
  score,
  cou: { angle: 50, niveau: cou },
  tronc: { angle: 12, niveau: tronc, sens },
});

test('lireMesure ne garde que les messages de type mesure', () => {
  assert.deepEqual(lireMesure('{"type":"mesure","personne":false}'), {
    type: 'mesure',
    personne: false,
  });
  assert.equal(lireMesure('{"type":"etat","message":"ok"}'), null);
  assert.equal(lireMesure('pas du json'), null);
});

test('le cou passe avant le tronc dans le message', () => {
  assert.equal(messagePosture(mesure('rouge', 'rouge')).titre, 'Tête en avant détectée');
  assert.equal(messagePosture(mesure('vert', 'orange')).titre, 'Buste penché en avant');
  assert.equal(
    messagePosture(mesure('vert', 'rouge', null, 'avant')).titre,
    'Buste penché en avant',
  );
  assert.equal(
    messagePosture(mesure('vert', 'rouge', null, 'arriere')).titre,
    'Dos avachi détecté',
  );
  assert.equal(messagePosture(mesure('vert', 'vert')).titre, 'Bonne posture');
  assert.equal(messagePosture(mesure('vert', 'vert')).alerte, false);
});

test('rien de mesurable : pas d’alerte', () => {
  assert.equal(messagePosture(null).alerte, false);
  assert.equal(messagePosture({ personne: false }).alerte, false);
  assert.equal(messagePosture(mesure('gris', 'gris')).titre, 'Position non mesurable');
});

test('score instantané : celui de posture.js, arrondi', () => {
  assert.equal(scoreInstantane(mesure('vert', 'orange', 87.6)), 88);
  assert.equal(scoreInstantane(mesure('gris', 'gris', null)), null);
  assert.equal(scoreInstantane({ personne: false }), null);
  assert.equal(scoreInstantane(null), null);
});

test('chronomètre', () => {
  assert.equal(formaterDuree(0), '00:00');
  assert.equal(formaterDuree(247), '04:07');
  assert.equal(formaterDuree(3847), '1:04:07');
});
