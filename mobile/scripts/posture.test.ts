/*
 * Tests de src/page/posture.ts : angles, valeurs limites, points manquants,
 * lissage, note, verrouillage du côté, sens du tronc. Ne touche ni à la caméra
 * ni au modèle : c'est le cœur de l'analyse, vérifiable sans téléphone.
 *
 *   npm test
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';

import * as Posture from '../src/page/posture.ts';
import type { Point } from '../src/page/posture.ts';

const { CONFIG, classer, angleCou, angleTronc, analyser, choisirCote } = Posture;

/** Fabrique un point MoveNet. */
const pt = (name: string, x: number, y: number, score = 0.9): Point => ({ name, x, y, score });

/** À 1e-9 près, pour comparer des degrés. */
const presque = (a: number | null | undefined, b: number) =>
  assert.ok(typeof a === 'number' && Math.abs(a - b) < 1e-9, `${a} ≠ ${b}`);

// ---------------------------------------------------------------------------
test('angleCou : 90° quand l’oreille est pile au-dessus de l’épaule', () => {
  presque(angleCou({ x: 100, y: 200 }, { x: 100, y: 100 }), 90);
});

test('angleCou : 0° quand l’oreille est à la hauteur de l’épaule (tête très avancée)', () => {
  presque(angleCou({ x: 100, y: 200 }, { x: 150, y: 200 }), 0);
});

test('angleCou : 45° sur une diagonale, et identique des deux côtés', () => {
  presque(angleCou({ x: 100, y: 200 }, { x: 150, y: 150 }), 45);
  presque(angleCou({ x: 100, y: 200 }, { x: 50, y: 150 }), 45); // oreille à gauche
});

test('angleTronc : 0° quand la hanche est pile sous l’épaule', () => {
  presque(angleTronc({ x: 100, y: 100 }, { x: 100, y: 200 }), 0);
});

test('angleTronc : 45° sur une diagonale, et identique des deux côtés', () => {
  presque(angleTronc({ x: 100, y: 100 }, { x: 200, y: 200 }), 45);
  presque(angleTronc({ x: 100, y: 100 }, { x: 0, y: 200 }), 45);
});

// ---------------------------------------------------------------------------
// Valeurs limites : la zone verte est STRICTE, une valeur pile sur la borne
// tombe en orange. C'est la convention documentée dans posture.ts.
// ---------------------------------------------------------------------------
test('cou (plus grand = mieux) : bornes 50 et 45', () => {
  assert.equal(classer(60, CONFIG.cou), 'vert');
  assert.equal(classer(50.1, CONFIG.cou), 'vert');
  assert.equal(classer(50, CONFIG.cou), 'orange', '50° pile => orange');
  assert.equal(classer(47, CONFIG.cou), 'orange');
  assert.equal(classer(45, CONFIG.cou), 'orange', '45° pile => orange');
  assert.equal(classer(44.9, CONFIG.cou), 'rouge');
  assert.equal(classer(0, CONFIG.cou), 'rouge');
});

test('tronc (plus petit = mieux) : bornes 10 et 20', () => {
  assert.equal(classer(0, CONFIG.tronc), 'vert');
  assert.equal(classer(9.9, CONFIG.tronc), 'vert');
  assert.equal(classer(10, CONFIG.tronc), 'orange', '10° pile => orange');
  assert.equal(classer(15, CONFIG.tronc), 'orange');
  assert.equal(classer(20, CONFIG.tronc), 'orange', '20° pile => orange');
  assert.equal(classer(20.1, CONFIG.tronc), 'rouge');
});

test('angle absent ou non fini => gris, dans les deux sens', () => {
  for (const regle of [CONFIG.cou, CONFIG.tronc]) {
    assert.equal(classer(null, regle), 'gris');
    assert.equal(classer(undefined, regle), 'gris');
    assert.equal(classer(NaN, regle), 'gris');
    assert.equal(classer(Infinity, regle), 'gris');
  }
});

// ---------------------------------------------------------------------------
test('choisirCote : retient le côté le mieux vu', () => {
  const kps = [
    pt('left_ear', 0, 0, 0.9),
    pt('left_shoulder', 0, 0, 0.9),
    pt('left_hip', 0, 0, 0.9),
    pt('right_ear', 0, 0, 0.2),
    pt('right_shoulder', 0, 0, 0.2),
    pt('right_hip', 0, 0, 0.2),
  ];
  assert.equal(choisirCote(Posture.indexerPoints(kps)).cote, 'gauche');

  const inverse = kps.map((k) => ({ ...k, score: k.name?.startsWith('left') ? 0.1 : 0.8 }));
  assert.equal(choisirCote(Posture.indexerPoints(inverse)).cote, 'droite');
});

// ---------------------------------------------------------------------------
test('analyser : posture droite => cou vert, tronc vert', () => {
  // Oreille bien au-dessus et à peine en avant de l'épaule (~76°), hanche
  // presque sous l'épaule (~3°).
  const a = analyser([
    pt('left_ear', 105, 100),
    pt('left_shoulder', 100, 120),
    pt('left_hip', 105, 220),
  ]);
  assert.equal(a.cote, 'gauche');
  assert.equal(a.cou.niveau, 'vert');
  assert.equal(a.tronc.niveau, 'vert');
  assert.match(a.cou.texte, /^Cou : \d+° — bonne position$/);
  assert.equal(a.cou.couleur, Posture.COULEURS.vert);
});

test('analyser : tête très en avant et dos penché => rouge / rouge', () => {
  const a = analyser([
    pt('left_ear', 160, 110), // 20° au-dessus de l'horizontale => rouge
    pt('left_shoulder', 100, 130),
    pt('left_hip', 160, 230), // ~31° de la verticale => rouge
  ]);
  assert.equal(a.cou.niveau, 'rouge');
  assert.equal(a.tronc.niveau, 'rouge');
  assert.match(a.cou.texte, /très mauvaise$/);
});

test('analyser : oreille manquante => cou gris, mais tronc toujours mesuré', () => {
  const a = analyser([pt('left_shoulder', 100, 120), pt('left_hip', 105, 220)]);
  assert.equal(a.cou.niveau, 'gris');
  assert.equal(a.cou.angle, null);
  assert.equal(a.cou.couleur, Posture.COULEURS.gris);
  assert.match(a.cou.texte, /non mesurable/);
  assert.equal(a.tronc.niveau, 'vert');
});

test('analyser : point sous le seuil de confiance => traité comme absent', () => {
  const sousLeSeuil = CONFIG.minKeypointScore - 0.01;
  const a = analyser([
    pt('left_ear', 105, 100, sousLeSeuil),
    pt('left_shoulder', 100, 120, 0.9),
    pt('left_hip', 105, 220, 0.9),
  ]);
  assert.equal(a.cou.niveau, 'gris');
  assert.equal(a.tronc.niveau, 'vert');
});

test('analyser : épaule manquante => les deux mesures en gris', () => {
  const a = analyser([pt('left_ear', 105, 100), pt('left_hip', 105, 220)]);
  assert.equal(a.cou.niveau, 'gris');
  assert.equal(a.tronc.niveau, 'gris');
});

test('analyser : aucun point => gris, sans planter', () => {
  for (const vide of [[], null, undefined]) {
    const a = analyser(vide);
    assert.equal(a.cou.niveau, 'gris');
    assert.equal(a.tronc.niveau, 'gris');
  }
});

test('couleurPoint : l’épaule prend la pire des deux mesures', () => {
  const kps = [
    pt('left_ear', 160, 110), // cou rouge
    pt('left_shoulder', 100, 130),
    pt('left_hip', 102, 230), // tronc vert
  ];
  const a = analyser(kps);
  assert.equal(a.cou.niveau, 'rouge');
  assert.equal(a.tronc.niveau, 'vert');
  const noms = Posture.POINTS_PAR_COTE.gauche;
  const couleur = Posture.couleurPoint(kps[1], a, noms, CONFIG.minKeypointScore);
  assert.equal(couleur, Posture.COULEURS.rouge);
});

// ---------------------------------------------------------------------------
// Lissage (moyenne mobile), ajouté après avoir constaté le tremblement des
// points de MoveNet sur l'iPhone.
// ---------------------------------------------------------------------------
test('lisseur : moyenne les positions sur la fenêtre', () => {
  const l = Posture.creerLisseur(3);
  // 1re image : rien à moyenner, on ressort la position telle quelle.
  presque(l.lisser([pt('left_ear', 100, 100)])[0].x, 100);
  // 2e image : moyenne de 100 et 200 = 150.
  presque(l.lisser([pt('left_ear', 200, 100)])[0].x, 150);
  // 3e image : moyenne de 100, 200, 300 = 200.
  presque(l.lisser([pt('left_ear', 300, 100)])[0].x, 200);
  // 4e image : la fenêtre glisse, 100 sort => moyenne de 200, 300, 400 = 300.
  presque(l.lisser([pt('left_ear', 400, 100)])[0].x, 300);
});

test('lisseur : amortit bien un soubresaut isolé', () => {
  const l = Posture.creerLisseur(3);
  l.lisser([pt('left_ear', 100, 100)]);
  l.lisser([pt('left_ear', 100, 100)]);
  const saut = l.lisser([pt('left_ear', 400, 100)])[0].x; // (100+100+400)/3 = 200
  presque(saut, 200);
  assert.ok(saut < 400, 'le soubresaut doit être amorti, pas suivi');
});

test('lisseur : fenêtre de 1 => aucun lissage', () => {
  const l = Posture.creerLisseur(1);
  presque(l.lisser([pt('left_ear', 100, 100)])[0].x, 100);
  presque(l.lisser([pt('left_ear', 500, 100)])[0].x, 500);
});

test('lisseur : un point peu fiable n’est pas lissé et vide son historique', () => {
  const l = Posture.creerLisseur(3);
  l.lisser([pt('left_ear', 100, 100)]);
  l.lisser([pt('left_ear', 100, 100)]);
  // Point sous le seuil : ressort tel quel, et l'historique est oublié.
  presque(l.lisser([pt('left_ear', 999, 100, 0.01)])[0].x, 999);
  // La position suivante repart de zéro, sans trace des 100 précédents.
  presque(l.lisser([pt('left_ear', 300, 100)])[0].x, 300);
});

test('lisseur : reinitialiser() oublie tout', () => {
  const l = Posture.creerLisseur(3);
  l.lisser([pt('left_ear', 100, 100)]);
  l.lisser([pt('left_ear', 100, 100)]);
  l.reinitialiser();
  presque(l.lisser([pt('left_ear', 400, 100)])[0].x, 400);
});

test('lisseur : conserve le score de l’image courante, pas une moyenne', () => {
  const l = Posture.creerLisseur(3);
  l.lisser([pt('left_ear', 100, 100, 0.9)]);
  const out = l.lisser([pt('left_ear', 200, 100, 0.4)])[0];
  assert.equal(out.score, 0.4);
  assert.equal(out.name, 'left_ear');
});

test('lisseur : tolère une liste vide ou nulle', () => {
  const l = Posture.creerLisseur(3);
  assert.deepEqual(l.lisser([]), []);
  assert.deepEqual(l.lisser(null), []);
});

// ---------------------------------------------------------------------------
// Note continue (score) : 100 en zone verte, 100 -> 60 en orange, 60 -> 0 en
// rouge jusqu'au « zéro ». Aux bornes, elle rejoint les couleurs.
// ---------------------------------------------------------------------------
test('noteMesure cou : 100 en vert, 60 à la borne rouge, 0 au zéro', () => {
  const { noteMesure } = Posture;
  presque(noteMesure(70, CONFIG.cou), 100);
  presque(noteMesure(50, CONFIG.cou), 100);
  presque(noteMesure(47.5, CONFIG.cou), 80);
  presque(noteMesure(45, CONFIG.cou), 60);
  presque(noteMesure(37.5, CONFIG.cou), 30);
  presque(noteMesure(30, CONFIG.cou), 0);
  presque(noteMesure(10, CONFIG.cou), 0);
});

test('noteMesure tronc : 100 en vert, 60 à la borne rouge, 0 au zéro', () => {
  const { noteMesure } = Posture;
  presque(noteMesure(0, CONFIG.tronc), 100);
  presque(noteMesure(10, CONFIG.tronc), 100);
  presque(noteMesure(15, CONFIG.tronc), 80);
  presque(noteMesure(20, CONFIG.tronc), 60);
  presque(noteMesure(30, CONFIG.tronc), 30);
  presque(noteMesure(40, CONFIG.tronc), 0);
  presque(noteMesure(80, CONFIG.tronc), 0);
});

test('scorePosture : moyenne des notes mesurées, null si aucune', () => {
  const { scorePosture } = Posture;
  presque(scorePosture(47.5, 15), 80);
  presque(scorePosture(60, 30), 65);
  presque(scorePosture(null, 15), 80);
  assert.equal(scorePosture(null, null), null);
  assert.equal(Posture.noteMesure(NaN, CONFIG.cou), null);
});

// ---------------------------------------------------------------------------
// Verrouillage du côté : pas de bascule sur un écart bref ou faible.
// ---------------------------------------------------------------------------
const cote = (score: { droite: number; gauche: number }) => [
  pt('right_ear', 0, 0, score.droite),
  pt('right_shoulder', 0, 0, score.droite),
  pt('right_hip', 0, 0, score.droite),
  pt('left_ear', 0, 0, score.gauche),
  pt('left_shoulder', 0, 0, score.gauche),
  pt('left_hip', 0, 0, score.gauche),
];

test('suiveur de côté : ignore une bascule de quelques images', () => {
  const suiveur = Posture.creerSuiveurCote(10, 0.1);
  assert.equal(suiveur.choisir(cote({ droite: 0.9, gauche: 0.4 })), 'droite');
  for (let i = 0; i < 9; i++) {
    assert.equal(suiveur.choisir(cote({ droite: 0.5, gauche: 0.8 })), 'droite');
  }
  // Retour du bon côté : le compteur repart de zéro.
  assert.equal(suiveur.choisir(cote({ droite: 0.9, gauche: 0.4 })), 'droite');
});

test('suiveur de côté : change si l’autre côté est nettement mieux vu assez longtemps', () => {
  const suiveur = Posture.creerSuiveurCote(10, 0.1);
  suiveur.choisir(cote({ droite: 0.9, gauche: 0.4 }));
  let c: string | undefined;
  for (let i = 0; i < 10; i++) c = suiveur.choisir(cote({ droite: 0.5, gauche: 0.8 }));
  assert.equal(c, 'gauche');
});

test('suiveur de côté : un écart sous la marge ne compte pas', () => {
  const suiveur = Posture.creerSuiveurCote(3, 0.1);
  suiveur.choisir(cote({ droite: 0.8, gauche: 0.4 }));
  for (let i = 0; i < 20; i++) {
    assert.equal(suiveur.choisir(cote({ droite: 0.75, gauche: 0.8 })), 'droite');
  }
});

// ---------------------------------------------------------------------------
// Sens du tronc. Coordonnées image : y vers le bas. Personne qui regarde à
// droite (nez à droite de l'oreille).
// ---------------------------------------------------------------------------
test('sensTronc : épaule devant la hanche = penché en avant, derrière = avachi', () => {
  const { sensTronc } = Posture;
  const nez = pt('nose', 120, 90);
  const oreille = pt('right_ear', 100, 95);
  const hanche = pt('right_hip', 100, 300);
  assert.equal(sensTronc(pt('right_shoulder', 140, 150), hanche, nez, oreille), 'avant');
  assert.equal(sensTronc(pt('right_shoulder', 60, 150), hanche, nez, oreille), 'arriere');
  // Personne qui regarde à gauche : tout s'inverse.
  const nezG = pt('nose', 80, 90);
  assert.equal(sensTronc(pt('right_shoulder', 60, 150), hanche, nezG, oreille), 'avant');
  // Nez peu fiable : sens inconnu.
  assert.equal(
    sensTronc(pt('right_shoulder', 140, 150), hanche, pt('nose', 120, 90, 0.1), oreille),
    null,
  );
});

test('analyser renvoie le sens du tronc', () => {
  const kp = [
    pt('nose', 120, 90),
    pt('right_ear', 100, 95),
    pt('right_shoulder', 60, 150),
    pt('right_hip', 100, 300),
  ];
  const a = analyser(kp);
  assert.equal(a.cote, 'droite');
  assert.equal(a.tronc.sens, 'arriere');
  assert.ok((a.tronc.angle ?? 0) > 0);
});
