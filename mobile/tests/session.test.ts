/*
 * Tests de l'écran « Session en cours » : lecture des messages de la page,
 * message de la carte de statut et chronomètre.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { lireMessagePage, type EtatTelephone } from '../src/features/analysis/messages.ts';
import type { Niveau, SensTronc } from '../src/features/analysis/posture.ts';
import { messagePosture, type Mesure } from '../src/features/sessions/mesure.ts';
import { formaterDuree } from '../src/utils/duree.ts';

const mesure = (
  cou: Niveau,
  tronc: Niveau,
  sens: SensTronc = null,
  telephone: EtatTelephone = 'stable',
): Mesure => ({
  type: 'mesure',
  personne: true,
  telephone,
  inclinaison: 0,
  cote: 'gauche',
  cou: { angle: 50, niveau: cou },
  tronc: { angle: 12, niveau: tronc, sens },
});

const personne: Mesure = { type: 'mesure', personne: false, telephone: 'stable' };

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

test('titre : vert, orange ou rouge selon le pire des deux angles', () => {
  const vert = messagePosture(mesure('vert', 'vert'));
  assert.equal(vert.titre, 'Bonne posture');
  assert.equal(vert.alerte, false);
  assert.equal(vert.niveau, 'vert');
  const orange = messagePosture(mesure('vert', 'orange'));
  assert.equal(orange.titre, 'Changez légèrement de position');
  assert.equal(orange.niveau, 'orange');
  const rouge = messagePosture(mesure('orange', 'rouge'));
  assert.equal(rouge.titre, 'Veuillez vous asseoir correctement');
  assert.equal(rouge.niveau, 'rouge');
  assert.equal(rouge.alerte, true);
});

test('le conseil nomme l’angle le plus mauvais, le cou d’abord à égalité', () => {
  assert.match(messagePosture(mesure('rouge', 'rouge')).conseil, /^Tête en avant/);
  assert.match(messagePosture(mesure('orange', 'rouge', 'avant')).conseil, /^Buste penché/);
  assert.match(messagePosture(mesure('vert', 'orange', 'arriere')).conseil, /^Dos avachi/);
  assert.match(messagePosture(mesure('orange', 'vert')).conseil, /^Tête en avant/);
});

test('rien de mesurable : pas d’alerte ni de couleur', () => {
  assert.equal(messagePosture(null).alerte, false);
  assert.equal(messagePosture(personne).niveau, null);
  const gris = messagePosture(mesure('gris', 'gris'));
  assert.equal(gris.titre, 'Position non mesurable');
  assert.equal(gris.niveau, null);
});

test('téléphone qui bouge ou trop penché : message avant la posture, sans alerte', () => {
  const bouge = messagePosture(mesure('rouge', 'rouge', null, 'mouvement'));
  assert.equal(bouge.titre, 'Téléphone en mouvement');
  assert.equal(bouge.alerte, false);
  assert.equal(
    messagePosture(mesure('rouge', 'rouge', null, 'penche')).titre,
    'Téléphone trop penché',
  );
  assert.equal(
    messagePosture({ type: 'mesure', personne: false, telephone: 'mouvement' }).titre,
    'Téléphone en mouvement',
  );
  assert.equal(
    messagePosture(mesure('rouge', 'vert', null, 'inconnu')).titre,
    'Veuillez vous asseoir correctement',
  );
});

test('tête en arrière : cou en alerte au-delà de 90°', () => {
  const m = mesure('orange', 'vert');
  if (!m.personne) throw new Error('mesure sans personne');
  const arriere = messagePosture({ ...m, cou: { angle: 100, niveau: 'orange' } });
  assert.match(arriere.conseil, /^Tête en arrière/);
  assert.equal(arriere.alerte, true);
  const avant = messagePosture({ ...m, cou: { angle: 40, niveau: 'rouge' } });
  assert.match(avant.conseil, /^Tête en avant/);
});

test('chronomètre', () => {
  assert.equal(formaterDuree(0), '00:00');
  assert.equal(formaterDuree(247), '04:07');
  assert.equal(formaterDuree(3847), '1:04:07');
});
