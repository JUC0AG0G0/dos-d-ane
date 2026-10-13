import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluate} from '../src/pose.js';
import {postureLabel,regionLabel} from '../src/posture-labels.js';

test('a cropped frontal skeleton cannot tell the user the whole posture is good', () => {
  const landmarks = Array(33).fill(null);
  for (const [i,x,y] of [[0,.5,.2],[2,.47,.22],[5,.53,.22],[7,.44,.24],[8,.56,.24],[11,.3,.45],[12,.7,.45]]) {
    landmarks[i] = {x,y,visibility:.95};
  }
  const result = evaluate({model:'movenet', landmarks},640,480);
  assert.equal(result.regions.neck, 'good');
  assert.equal(result.regionCoverage.neck, 'partial');
  assert.equal(regionLabel(result,'neck'), 'Bonne · partielle');
  assert.equal(result.regions.torso, 'unknown');
  assert.equal(result.coverage, 'partial');
  assert.equal(postureLabel(result), 'Zones visibles alignées');
  assert.equal(postureLabel({...result, coverage:'full'}), 'Bonne posture');
});
