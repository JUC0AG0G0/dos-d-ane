import test from 'node:test';
import assert from 'node:assert/strict';
import {mascotPose} from '../src/mascot-pose.js';
test('mascot bends with measured forward posture and clears when tracking ends',()=>{
  const frame={state:'bad',metrics:{headPitch:38,neckForward:null},regions:{head:'bad',neck:'unknown'},coverage:'partial'};
  assert.ok(mascotPose(frame).bend>70);
  assert.equal(mascotPose(frame,false).tracked,false);
  assert.equal(mascotPose({...frame,state:'unknown'}).bend,0);
});
test('sideways tilt and uneven shoulders do not fabricate a curved back',()=>{
  const frame={state:'bad',metrics:{headPitch:0,headTilt:30,neckLateral:25,shoulderTilt:15},regions:{shoulders:'bad'},coverage:'partial'};
  assert.equal(mascotPose(frame).bend,0);
  assert.equal(mascotPose(frame).caption,'Épaules à rééquilibrer');
  assert.equal(mascotPose({...frame,metrics:{headPitch:NaN,neckForward:Infinity}}).bend,0);
});
