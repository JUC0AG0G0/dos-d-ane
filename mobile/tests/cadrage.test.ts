/*
 * Tests du cadrage de la caméra : l'image analysée est toujours au format 3/4,
 * centrée dans la vidéo, quel que soit le format fourni par l'appareil.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { cadrer, RATIO_CAPTURE } from '../src/features/analysis/cadrage.ts';

test('vidéo déjà en 3/4 : rien n’est rogné', () => {
  assert.deepEqual(cadrer(480, 640), { x: 0, y: 0, largeur: 480, hauteur: 640 });
});

test('vidéo paysage 4/3 : bandes rognées à gauche et à droite', () => {
  assert.deepEqual(cadrer(640, 480), { x: 140, y: 0, largeur: 360, hauteur: 480 });
});

test('vidéo portrait 9/16 : bandes rognées en haut et en bas', () => {
  assert.deepEqual(cadrer(720, 1280), { x: 0, y: 160, largeur: 720, hauteur: 960 });
});

test('le cadrage est toujours au format 3/4', () => {
  for (const [l, h] of [
    [640, 480],
    [1280, 720],
    [720, 1280],
    [1920, 1080],
    [1080, 1920],
    [480, 640],
  ]) {
    const c = cadrer(l, h);
    assert.ok(Math.abs(c.largeur / c.hauteur - RATIO_CAPTURE) < 0.01, `${l}×${h}`);
    assert.ok(c.x >= 0 && c.y >= 0 && c.x + c.largeur <= l && c.y + c.hauteur <= h, `${l}×${h}`);
  }
});
