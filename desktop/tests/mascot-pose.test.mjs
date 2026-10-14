import test from 'node:test';
import assert from 'node:assert/strict';
import {mascotPose} from '../src/mascot-pose.js';
test('mascot bends with measured forward posture and clears when tracking ends',()=>{
  const frame={state:'bad',metrics:{headPitch:38,neckForward:null},regions:{head:'bad',neck:'unknown'},coverage:'partial'};
  assert.equal(mascotPose(frame).pitch,38);
  assert.equal(mascotPose(frame).forward,0);
  assert.equal(mascotPose(frame,false).tracked,false);
  assert.equal(mascotPose({...frame,state:'unknown'}).bend,0);
});
test('sideways tilt and uneven shoulders do not fabricate a curved back',()=>{
  const frame={state:'bad',metrics:{headPitch:0,headTilt:30,neckLateral:25,shoulderTilt:15},regions:{shoulders:'bad'},coverage:'partial'};
  assert.equal(mascotPose(frame).bend,0);
  assert.equal(mascotPose(frame).roll,-30);
  assert.equal(mascotPose(frame).lateral,-25);
  assert.equal(mascotPose({...frame,metrics:{headPitch:NaN,neckForward:Infinity}}).bend,0);
});
test('head rotation and forward translation remain independent, including looking up',()=>{
  const pose=metrics=>mascotPose({state:'good',metrics});
  assert.equal(pose({headPitch:-25}).pitch,-25);
  assert.equal(pose({headPitch:-25}).forward,0);
  assert.equal(pose({neckForward:.225,neckSource:'world'}).forward,50);
  assert.equal(pose({neckForward:.225,neckSource:'world'}).pitch,0);
  assert.equal(pose({neckForward:.375,neckSource:'profile'}).forward,50);
  assert.equal(pose({headPitch:5}).pitch,5,'small movements are not hidden by a posture threshold');
});
test('face matrix and image-landmark roll use their respective coordinate conventions',()=>{
  const matrixPose=mascotPose({state:'good',metrics:{headTilt:20,headYaw:30},face:{}});
  const landmarkPose=mascotPose({state:'good',metrics:{headTilt:-20}});
  assert.equal(matrixPose.roll,landmarkPose.roll);
  assert.equal(matrixPose.yaw,-30);
  const missing=mascotPose({state:'unknown',metrics:{headPitch:30,neckForward:.4,headTilt:25}});
  for(const key of ['pitch','forward','roll','yaw','lateral'])assert.equal(Math.abs(missing[key]),0);
});
test('live motion does not wait for posture-category hysteresis',()=>{
  const result=mascotPose({state:'unknown',rawState:'good',settling:true,metrics:{headPitch:12}});
  assert.equal(result.tracked,true);
  assert.equal(result.pitch,12);
});
