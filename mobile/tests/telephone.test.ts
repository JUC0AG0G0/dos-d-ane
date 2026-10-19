/*
 * Tests de features/sessions/telephone.ts : inclinaison du téléphone d'après
 * la gravité, et détection d'un téléphone qui bouge ou trop penché.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { creerSuiviTelephone, inclinaison } from '../src/features/sessions/telephone.ts';

const rad = (d: number) => (d * Math.PI) / 180;
/** Gravité lue par un téléphone droit penché de `degres` (haut vers la droite si > 0), convention iOS. */
const gravite = (degres: number) => ({ x: Math.sin(rad(degres)), y: -Math.cos(rad(degres)), z: 0 });

test('inclinaison : 0° droit, signe selon le côté, même résultat iOS et Android', () => {
  assert.ok(Math.abs(inclinaison(gravite(0))) < 1e-9);
  for (const d of [-20, -5, 8, 30]) {
    assert.ok(Math.abs(inclinaison(gravite(d)) - d) < 1e-9, `iOS ${d}`);
    const g = gravite(d);
    assert.ok(Math.abs(inclinaison({ x: -g.x, y: -g.y, z: 0 }) - d) < 1e-9, `Android ${d}`);
  }
});

test('téléphone posé : stable, même un peu penché', () => {
  const suivi = creerSuiviTelephone();
  let etat = '';
  for (let t = 0; t <= 2000; t += 100) etat = suivi.mesurer(gravite(6), t).etat;
  assert.equal(etat, 'stable');
});

test('téléphone qui bouge : en mouvement, puis stable 1 s après', () => {
  const suivi = creerSuiviTelephone();
  for (let t = 0; t <= 1500; t += 100) suivi.mesurer(gravite(0), t);
  assert.equal(suivi.mesurer(gravite(5), 1600).etat, 'mouvement');
  assert.equal(suivi.mesurer(gravite(5), 2000).etat, 'mouvement');
  assert.equal(suivi.mesurer(gravite(5), 2700).etat, 'stable');
});

test('secousse sans rotation : en mouvement', () => {
  const suivi = creerSuiviTelephone();
  suivi.mesurer(gravite(0), 0);
  assert.equal(suivi.mesurer({ x: 0, y: -1.3, z: 0 }, 100).etat, 'mouvement');
});

test('trop penché ou à plat : penché', () => {
  const suivi = creerSuiviTelephone();
  for (let t = 0; t <= 1500; t += 100) suivi.mesurer(gravite(35), t);
  assert.equal(suivi.mesurer(gravite(35), 1600).etat, 'penche');

  const aPlat = creerSuiviTelephone();
  assert.equal(aPlat.mesurer({ x: 0.05, y: -0.1, z: -0.99 }, 0).etat, 'penche');
});
