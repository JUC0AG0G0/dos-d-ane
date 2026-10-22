/*
 * Tests de l'écran « Session en cours » : lecture des messages de la page,
 * message de la carte de statut et chronomètre.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { lireMessagePage, type EtatTelephone } from '../src/features/analysis/messages.ts';
import type { Niveau, SensTronc } from '../src/features/analysis/posture.ts';
import {
  causeDe,
  creerSuiviAlerte,
  messagePosture,
  type Cause,
  type Mesure,
} from '../src/features/sessions/mesure.ts';
import {
  lirePose,
  phrasePoints,
  segmentsVisibles,
  silhouette,
} from '../src/features/sessions/captures.ts';
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

/** Joue `mesures` à raison de 4 par seconde ; renvoie les notifications (instant en s, cause). */
function jouer(...etapes: [secondes: number, mesure: Mesure][]) {
  const suivi = creerSuiviAlerte();
  const alertes: [number, Cause][] = [];
  let instant = 0;
  for (const [secondes, m] of etapes) {
    for (let i = 0; i < secondes * 4; i++) {
      instant += 250;
      const cause = suivi.ajouter(m, instant);
      if (cause) alertes.push([instant / 1000, cause]);
    }
  }
  return alertes;
}

test('causeDe : même cause que le conseil de la carte de statut', () => {
  assert.equal(causeDe(mesure('orange', 'vert')), 'teteAvant');
  assert.equal(causeDe(mesure('vert', 'rouge', 'arriere')), 'avachi');
  assert.equal(causeDe(mesure('vert', 'orange', 'avant')), 'bustePenche');
  assert.equal(causeDe(mesure('vert', 'vert')), null);
  assert.equal(causeDe(personne), null);
});

test('alerte : mauvaise posture depuis 30 s, une seule notification', () => {
  const alertes = jouer([30, mesure('vert', 'vert')], [90, mesure('rouge', 'vert')]);
  assert.equal(alertes.length, 1);
  assert.equal(alertes[0][1], 'teteAvant');
  assert.ok(Math.abs(alertes[0][0] - 60.25) < 0.01, `notifiée à ${alertes[0][0]} s`);
});

test('alerte : moins de 30 s de mauvaise posture, rien', () => {
  assert.deepEqual(jouer([25, mesure('rouge', 'vert')], [30, mesure('vert', 'vert')]), []);
});

test('alerte : un court redressement (< 5 s) ne remet pas le compte à zéro', () => {
  const alertes = jouer(
    [20, mesure('vert', 'rouge', 'avant')],
    [3, mesure('vert', 'vert')],
    [12, mesure('vert', 'rouge', 'avant')],
  );
  assert.deepEqual(
    alertes.map(([, c]) => c),
    ['bustePenche'],
  );
});

test('alerte : un vrai redressement (> 5 s) remet le compte à zéro', () => {
  assert.deepEqual(
    jouer([20, mesure('rouge', 'vert')], [10, mesure('vert', 'vert')], [20, mesure('rouge', 'vert')]),
    [],
  );
});

test('alerte : rappel au plus toutes les 10 min, téléphone qui bouge ignoré', () => {
  assert.deepEqual(
    jouer([12 * 60, mesure('orange', 'vert')]).map(([s]) => Math.round(s)),
    [30, 630],
  );
  assert.deepEqual(jouer([90, mesure('rouge', 'vert', null, 'mouvement')]), []);
});

test('captures : le trait oreille – épaule est tracé, comme sur la vidéo', () => {
  const k = (bodyPart: string, x: number, y: number) => ({ bodyPart, x, y, confidence: 0.8 });
  const traits = segmentsVisibles([k('right_ear', 318, 315), k('right_shoulder', 316, 346), k('right_hip', 320, 502)]);
  assert.deepEqual(
    traits.map(([a, b]) => `${a.bodyPart}-${b.bodyPart}`),
    ['right_ear-right_shoulder', 'right_shoulder-right_hip'],
  );
  assert.deepEqual(segmentsVisibles([k('right_ear', 1, 1)]), []);
});

test('captures : phrase des points envoyés', () => {
  const k = (bodyPart: string) => ({ bodyPart, x: 0, y: 0, confidence: null });
  assert.equal(
    phrasePoints([k('right_ear'), k('right_shoulder'), k('right_hip')]),
    '3 points : oreille droite, épaule droite, hanche droite',
  );
  assert.equal(phrasePoints([]), 'Aucun point détecté');
});

test('aperçu : côté filmé et sens du regard, null s’il manque un point', () => {
  const k = (bodyPart: string, x: number, y: number) => ({ bodyPart, x, y, confidence: 0.8 });
  const droite = lirePose([k('right_ear', 318, 315), k('right_shoulder', 316, 346), k('right_hip', 320, 502)]);
  assert.equal(droite?.sens, 1);
  const gauche = lirePose([k('left_ear', 160, 315), k('left_shoulder', 164, 346), k('left_hip', 160, 502)]);
  assert.equal(gauche?.sens, -1);
  assert.equal(lirePose([k('right_ear', 1, 1), k('right_shoulder', 1, 2)]), null);
});

test('mascotte : tronc et cou inclinés comme mesuré, hanche fixe', () => {
  const droite = silhouette(0, 90);
  assert.ok(Math.abs(droite.epaule.x - droite.hanche.x) < 1e-9, 'tronc droit : épaule au-dessus de la hanche');
  assert.ok(Math.abs(droite.oreille.x - droite.epaule.x) < 1e-9, 'cou à 90° : oreille au-dessus de l’épaule');
  const penche = silhouette(20, 45);
  assert.ok(penche.epaule.x > penche.hanche.x, 'penché en avant : épaule vers le bureau');
  assert.ok(penche.oreille.x > penche.epaule.x, 'tête en avant : oreille devant l’épaule');
  assert.ok(silhouette(-25, 90).epaule.x < droite.hanche.x, 'avachi : épaule vers le dossier');
  assert.deepEqual(penche.hanche, droite.hanche);
});
