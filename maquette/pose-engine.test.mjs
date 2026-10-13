import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateLandmarks, isReliableLandmark } from './pose-engine.js';

function frontFacingPose() {
  const points = Array.from({ length: 33 }, () => ({ x: 0, y: 0, visibility: 0, presence: 0 }));
  const coordinates = {
    0: [.5, .2], 2: [.465, .18], 5: [.535, .18], 7: [.435, .21], 8: [.565, .21],
    11: [.35, .4], 12: [.65, .4], 23: [.4, .8], 24: [.6, .8],
  };
  for (const [index, [x, y]] of Object.entries(coordinates)) points[index] = { x, y, visibility: 1, presence: 1 };
  return points;
}

const evaluate = (points) => evaluateLandmarks(points, 640, 480);

test('an aligned first frame is evaluated immediately without calibration', () => {
  const result = evaluate(frontFacingPose());
  assert.equal(result.state, 'good');
  assert.deepEqual(result.regions, { head: 'good', shoulders: 'good', torso: 'good' });
  assert.deepEqual(result.metrics, { shoulderAngle: 0, headOffset: 0, headTiltAngle: 0, torsoAngle: 0 });
  assert.equal('calibrated' in result, false);
});

test('a shifted head is detected on the first frame, independently of earlier evaluations', () => {
  const pose = frontFacingPose();
  pose[0].x = .6;
  const first = evaluate(pose);
  evaluate(frontFacingPose());
  const repeated = evaluate(pose);
  assert.equal(first.state, 'bad');
  assert.equal(first.regions.head, 'bad');
  assert.deepEqual(first, repeated);
  pose[0].x = .56;
  assert.equal(evaluate(pose).regions.head, 'warning');
  pose[0].x = .4;
  assert.equal(evaluate(pose).regions.head, 'bad');
});

test('tilted shoulders use image angles while centered head and buste remain aligned', () => {
  for (const [angle, expected] of [[5, 'good'], [10, 'warning'], [18, 'bad'], [-18, 'bad']]) {
    const pose = frontFacingPose();
    const verticalDifference = 192 * Math.tan(angle * Math.PI / 180) / 480;
    pose[11].y -= verticalDifference / 2;
    pose[12].y += verticalDifference / 2;
    const result = evaluate(pose);
    assert.equal(result.regions.shoulders, expected);
    assert.equal(result.regions.head, 'good');
    assert.equal(result.regions.torso, 'good');
    assert.ok(Math.abs(result.metrics.shoulderAngle - angle) < 1e-10);
  }
});

test('a visible sideways torso tilt can trigger feedback without a head offset', () => {
  const pose = frontFacingPose();
  pose[23].x += .1;
  pose[24].x += .1;
  const result = evaluate(pose);
  assert.equal(result.state, 'bad');
  assert.equal(result.regions.torso, 'bad');
  assert.equal(result.regions.head, 'good');
  assert.match(result.reason, /buste.*côté/u);
});

test('missing or unreliable required landmarks never count as a stable posture', () => {
  assert.equal(evaluate([]).state, 'unknown');
  for (const index of [0, 11, 12]) {
    for (const failure of [{ visibility: .2 }, { presence: .2 }, { x: NaN }, { y: 1.1 }]) {
      const pose = frontFacingPose();
      pose[index] = { ...pose[index], ...failure };
      assert.equal(evaluate(pose).state, 'unknown');
    }
  }
  const tiltedButHeadMissing = frontFacingPose();
  tiltedButHeadMissing[0].visibility = 0;
  tiltedButHeadMissing[12].y = .65;
  assert.equal(evaluate(tiltedButHeadMissing).state, 'unknown');
});

test('hips outside the seated camera view are unknown instead of invented torso feedback', () => {
  const pose = frontFacingPose();
  pose[23].visibility = 0;
  pose[24].visibility = 0;
  const result = evaluate(pose);
  assert.equal(result.state, 'good');
  assert.equal(result.regions.torso, 'unknown');
  assert.equal(result.metrics.torsoAngle, null);
  assert.match(result.reason, /buste n’est pas visible/u);
});

test('body size and translation do not change the normalized classification', () => {
  const pose = frontFacingPose();
  pose[0].x = .6;
  const transformed = pose.map((point) => ({ ...point, x: .6 + (point.x - .5) * .7, y: .55 + (point.y - .5) * .7 }));
  const original = evaluate(pose), changed = evaluate(transformed);
  assert.deepEqual(changed.regions, original.regions);
  assert.ok(Math.abs(changed.metrics.headOffset - original.metrics.headOffset) < 1e-10);
});

test('widescreen padding preserves physical image angles rather than normalized-coordinate angles', () => {
  const pose = frontFacingPose();
  pose[12].y += .1;
  const padded = pose.map((point) => ({ ...point, x: (point.x * 640 + 320) / 1280 }));
  const original = evaluate(pose), widescreen = evaluateLandmarks(padded, 1280, 480);
  assert.deepEqual(widescreen.regions, original.regions);
  assert.ok(Math.abs(widescreen.metrics.shoulderAngle - original.metrics.shoulderAngle) < 1e-10);
});

test('invalid image dimensions and too-small people produce unknown feedback', () => {
  for (const [width, height] of [[0, 480], [640, 0], [NaN, 480], [640, Infinity]]) {
    assert.equal(evaluateLandmarks(frontFacingPose(), width, height).state, 'unknown');
  }
  const tiny = frontFacingPose();
  tiny[11].x = .48;
  tiny[12].x = .52;
  assert.equal(evaluate(tiny).state, 'unknown');
});

function tiltPair(pose, [a, b], angle) {
  const middleY = (pose[a].y + pose[b].y) / 2;
  const pixelSpan = Math.abs(pose[b].x - pose[a].x) * 640;
  const deltaY = pixelSpan * Math.tan(angle * Math.PI / 180) / 480;
  pose[a].y = middleY - deltaY / 2;
  pose[b].y = middleY + deltaY / 2;
}

test('centered-nose head roll is detected immediately, with positive and negative signed degrees', () => {
  for (const [angle, expected] of [[5, 'good'], [12, 'warning'], [-12, 'warning'], [25, 'bad'], [-25, 'bad']]) {
    const pose = frontFacingPose();
    tiltPair(pose, [2, 5], angle);
    const result = evaluate(pose);
    assert.equal(result.metrics.headOffset, 0);
    assert.ok(Math.abs(result.metrics.headTiltAngle - angle) < 1e-10);
    assert.equal(result.regions.head, expected);
    assert.equal(result.state, expected);
    assert.equal(result.regions.torso, 'good');
    if (expected !== 'good') assert.match(result.reason, /tête paraît inclinée/u);
  }
});

test('head feedback uses the worse of lateral displacement and roll', () => {
  const pose = frontFacingPose();
  pose[0].x = .6;
  tiltPair(pose, [2, 5], 12);
  let result = evaluate(pose);
  assert.equal(result.regions.head, 'bad');
  assert.match(result.reason, /tête est décalée/u);
  pose[0].x = .56;
  tiltPair(pose, [2, 5], 25);
  result = evaluate(pose);
  assert.equal(result.regions.head, 'bad');
  assert.match(result.reason, /tête paraît inclinée/u);
});

test('reliable eye centers take priority, with ears as the fallback', () => {
  const pose = frontFacingPose();
  tiltPair(pose, [2, 5], 12);
  tiltPair(pose, [7, 8], -25);
  assert.ok(Math.abs(evaluate(pose).metrics.headTiltAngle - 12) < 1e-10);
  pose[2].visibility = .2;
  const fallback = evaluate(pose);
  assert.ok(Math.abs(fallback.metrics.headTiltAngle + 25) < 1e-10);
  assert.equal(fallback.regions.head, 'bad');
});

test('unreliable or degenerate face pairs never invent a head angle', () => {
  for (const failure of [{ visibility: .2 }, { presence: .2 }, { x: NaN }, { y: 1.1 }]) {
    const pose = frontFacingPose();
    pose[2] = { ...pose[2], ...failure };
    pose[7] = { ...pose[7], ...failure };
    const result = evaluate(pose);
    assert.equal(result.metrics.headTiltAngle, null);
    assert.equal(result.metrics.headOffset, 0);
    assert.equal(result.regions.head, 'good');
    assert.match(result.reason, /Inclinaison de tête non mesurable/u);
  }
  const pose = frontFacingPose();
  pose[5] = { ...pose[2] };
  pose[8] = { ...pose[7], x: pose[7].x + .001 };
  assert.equal(evaluate(pose).metrics.headTiltAngle, null);
  pose[0].x = .6;
  assert.equal(evaluate(pose).regions.head, 'bad');
  assert.match(evaluate(pose).reason, /tête est décalée/u);
});

test('head roll respects pixel aspect ratio and body scale without any captured baseline', () => {
  const pose = frontFacingPose();
  tiltPair(pose, [2, 5], -25);
  const first = evaluate(pose);
  const padded = pose.map((point) => ({ ...point, x: (point.x * 640 + 320) / 1280 }));
  const widescreen = evaluateLandmarks(padded, 1280, 480);
  const smaller = pose.map((point) => ({ ...point, x: .55 + (point.x - .5) * .7, y: .5 + (point.y - .5) * .7 }));
  const scaled = evaluate(smaller);
  evaluate(frontFacingPose());
  assert.deepEqual(evaluate(pose), first);
  for (const result of [widescreen, scaled]) {
    assert.ok(Math.abs(result.metrics.headTiltAngle + 25) < 1e-10);
    assert.deepEqual(result.regions, first.regions);
  }
});

test('renderer reliability helper matches the evaluator confidence and framing checks', () => {
  assert.equal(isReliableLandmark(undefined), false);
  assert.equal(isReliableLandmark({ x: .5, y: .5, visibility: 1, presence: 1 }), true);
  assert.equal(isReliableLandmark({ x: .5, y: .5, visibility: .6, presence: 1 }), false);
  assert.equal(isReliableLandmark({ x: .5, y: .5, visibility: 1, presence: .6 }), false);
  assert.equal(isReliableLandmark({ x: .995, y: .5, visibility: 1, presence: 1 }), false);
});
