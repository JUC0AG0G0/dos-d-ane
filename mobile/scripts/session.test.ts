/*
 * Tests de l'écran « Session en cours » : lecture des messages de la page,
 * message de la carte de statut et chronomètre.
 *
 *   npm test
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { messagePosture, type Mesure } from '../src/camera/mesure.ts';
import { lireMessagePage } from '../src/page/messages.ts';
import type { Niveau, SensTronc } from '../src/page/posture.ts';
import { formaterDuree } from '../src/utils/duree.ts';

const mesure = (
  cou: Niveau,
  tronc: Niveau,
  score: number | null = null,
  sens: SensTronc = null,
): Mesure => ({
  type: 'mesure',
  personne: true,
  cote: 'gauche',
  score,
  cou: { angle: 50, niveau: cou },
  tronc: { angle: 12, niveau: tronc, sens },
});

const personne: Mesure = { type: 'mesure', personne: false };

test('lireMessagePage : seulement les messages connus de la page', () => {
  assert.deepEqual(lireMessagePage('{"type":"mesure","personne":false}'), {
    type: 'mesure',
    personne: false,
  });
  assert.deepEqual(lireMessagePage('{"type":"erreur","message":"Caméra refusée"}'), {
    type: 'erreur',
    message: 'Caméra refusée',
  });
  assert.equal(lireMessagePage('{"type":"autre"}'), null);
  assert.equal(lireMessagePage('null'), null);
  assert.equal(lireMessagePage('pas du json'), null);
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
  assert.equal(messagePosture(personne).alerte, false);
  assert.equal(messagePosture(mesure('gris', 'gris')).titre, 'Position non mesurable');
});

test('chronomètre', () => {
  assert.equal(formaterDuree(0), '00:00');
  assert.equal(formaterDuree(247), '04:07');
  assert.equal(formaterDuree(3847), '1:04:07');
});
