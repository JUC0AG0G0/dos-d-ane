import test from 'node:test';
import assert from 'node:assert/strict';
import {createPostureTracker} from '../src/pose.js';

test('an adaptive slow model still rejects a single noisy posture reading', () => {
  const landmarks = Array(33).fill(null);
  for (const [i,x,y] of [[0,.5,.2],[2,.47,.22],[5,.53,.22],[7,.44,.24],[8,.56,.24],[11,.3,.45],[12,.7,.45],[23,.38,.8],[24,.62,.8]]) {
    landmarks[i] = {x,y,visibility:.95};
  }
  const good = {landmarks, model:'yolo', recommendedIntervalMs:1500};
  const altered = landmarks.map(point => point ? {...point} : null);
  altered[5].y = .35;
  const bad = {...good, landmarks:altered};
  const tracker = createPostureTracker({smoothingMs:20});
  assert.equal(tracker.update(good,640,480,0).state,'good');
  assert.equal(tracker.update(bad,640,480,1500).state,'good');
  assert.equal(tracker.update(good,640,480,3000).state,'good');
  assert.equal(tracker.update(bad,640,480,4500).state,'good');
  assert.equal(tracker.update(bad,640,480,6000).state,'bad');
});
