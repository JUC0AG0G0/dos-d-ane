import test from 'node:test';
import assert from 'node:assert/strict';
import {fingerCurls,mascotLimbs,LIMB_AXES,wrapAngle} from '../src/mascot-limbs.js';
import {createPostureTracker} from '../src/pose.js';

const hand=(closed=[],x=.65,y=.5)=>{
  const points=[{x,y,z:0}];
  for(let finger=0;finger<5;finger++){
    const bx=x+(finger-2)*.018,by=y-.06;
    const local=closed.includes(finger)?[[0,0],[0,-.035],[.022,-.035],[.022,0]]:[[0,0],[0,-.035],[0,-.06],[0,-.08]];
    points.push(...local.map(([dx,dy])=>({x:bx+dx,y:by+dy,z:0})));
  }
  return {landmarks:points,score:.99,handedness:'Left'};
};
const body=()=>{
  const points=Array(33).fill(null);
  for(const [i,x,y] of [[11,.65,.25],[13,.65,.38],[15,.65,.5],[12,.35,.25],[14,.35,.38],[16,.35,.5]])points[i]={x,y,z:0,visibility:1};
  return points;
};
test('all fingers articulate independently, including a middle finger gesture',()=>{
  const open=fingerCurls(hand().landmarks);
  for(const value of Object.values(open))assert.ok(value<10);
  const fist=fingerCurls(hand([0,1,2,3,4]).landmarks);
  for(const value of Object.values(fist))assert.ok(value>90);
  const middle=fingerCurls(hand([0,1,3,4]).landmarks);
  assert.ok(middle.Middle<10);
  for(const name of ['Thumb','Index','Ring','Pinky'])assert.ok(middle[name]>90);
});
test('the mirrored arm tracks shoulder, elbow and wrist, independently of head visibility',()=>{
  const assessment={state:'unknown',landmarks:body(),hands:[hand([0,1,3,4])],frameSize:{width:640,height:480}};
  const result=mascotLimbs(assessment);
  assert.equal(result.leftArmVisible,1);
  assert.equal(result.leftHandVisible,1);
  assert.equal(Math.abs(result.leftUpper),0);
  assert.equal(Math.abs(result.leftLower),0);
  assert.ok(result.leftMiddle<10&&result.leftIndex>90);
  assert.equal(result.rightHandVisible,0);
  assessment.landmarks[13].x=.8;
  assert.ok(mascotLimbs(assessment).leftUpper>0,'an elbow moving screen-left rotates its downward bone clockwise');
  assert.ok(mascotLimbs(assessment).leftLower<0);
});
test('wrist association prevents handedness label flips and discards unrelated hands',()=>{
  const left=hand([0,1,3,4]),right=hand([], .35);
  left.handedness='Right';right.handedness='Left';
  const assessment={landmarks:body(),hands:[right,left]};
  const result=mascotLimbs(assessment);
  assert.equal(result.leftHandVisible,1);
  assert.equal(result.rightHandVisible,1);
  assert.ok(result.leftIndex>90&&result.rightIndex<10);
  assessment.hands=[hand([], .93,.88)];
  assert.equal(mascotLimbs(assessment).leftHandVisible,0);
  assert.equal(mascotLimbs(assessment).rightHandVisible,0);
});
test('missing, uncertain or offscreen limbs clear rather than preserving a gesture',()=>{
  const assessment={landmarks:body(),hands:[hand()]};
  const hidden=mascotLimbs(assessment,false);
  for(const key of LIMB_AXES)assert.equal(hidden[key],0);
  assessment.hands[0].score=.2;
  assert.equal(mascotLimbs(assessment).leftHandVisible,0);
  assessment.hands[0].score=.9;assessment.hands[0].landmarks[8].x=1.2;
  assert.equal(mascotLimbs(assessment).leftHandVisible,0);
  assessment.landmarks[13]=null;
  assert.equal(mascotLimbs(assessment).leftArmVisible,0);
});
test('close wrists use the best complete matching instead of a greedy swap',()=>{
  const points=body();points[15].x=.52;points[16].x=.60;
  const result=mascotLimbs({landmarks:points,hands:[hand([],.54),hand([0,1,3,4],.35)]});
  assert.equal(result.leftHandVisible,1);
  assert.equal(result.rightHandVisible,1);
  assert.ok(result.leftIndex>90&&result.rightIndex<10);
});
test('hands expire even when the inference worker is stalled',()=>{
  const assessment={landmarks:body(),hands:[hand()],observedAt:100,handsObservedAt:100};
  assert.equal(mascotLimbs(assessment,true,200).leftHandVisible,1);
  assert.equal(mascotLimbs(assessment,true,351).leftHandVisible,0);
  assert.equal(mascotLimbs(assessment,true,701).leftArmVisible,0);
});
test('angular smoothing takes the short path through the 180 degree boundary',()=>{
  assert.equal(wrapAngle(-179-179),2);
  assert.equal(wrapAngle(179-(-179)),-2);
});
test('posture tracker forwards current hands without retaining a lost detection',()=>{
  const tracker=createPostureTracker();
  const first=tracker.update({landmarks:body(),hands:[hand()],handsAvailable:true},640,480,100);
  assert.equal(first.hands.length,1);
  assert.deepEqual(first.frameSize,{width:640,height:480});
  assert.equal(tracker.update({landmarks:body(),hands:[]},640,480,200).hands.length,0);
});
