import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluate, createPostureTracker, faceOrientation, normalizeCoco, countVisible, drawSkeleton } from '../src/pose.js';
import { decodeYolo,normalizeFaceLandmarks } from '../src/models.js';

const base=()=>{
  const points=Array(33).fill(null);
  for(const [index,x,y] of [[0,.5,.25],[2,.47,.25],[5,.53,.25],[11,.4,.4],[12,.6,.4],[23,.42,.7],[24,.58,.7]]){
    points[index]={x,y,visibility:.95};
  }
  return points;
};

const front=()=>{
  const points=base();
  points[7]={x:.45,y:.255,visibility:.95};
  points[8]={x:.55,y:.255,visibility:.95};
  return points;
};
const profile=(advance=0,hiddenSide=false)=>{
  const points=Array(33).fill(null);
  for(const [i,x,y] of [[0,.58+advance,.25],[2,.55+advance,.24],[7,.5+advance,.25],[11,.5,.45],[23,.5,.75]]) points[i]={x,y,visibility:.95};
  if(!hiddenSide){points[12]={x:.515,y:.45,visibility:.9};points[24]={x:.515,y:.75,visibility:.9};}
  return points;
};
const rotation=(pitch=0,yaw=0,roll=0)=>{
  const [x,y,z]=[pitch,yaw,roll].map(a=>a*Math.PI/180);
  const cx=Math.cos(x),sx=Math.sin(x),cy=Math.cos(y),sy=Math.sin(y),cz=Math.cos(z),sz=Math.sin(z);
  // Rz * Ry * Rx, packed column-major as returned by MediaPipe JS.
  return {rows:4,columns:4,layout:'column-major',data:[cz*cy,sz*cy,-sy,0,cz*sy*sx-sz*cx,sz*sy*sx+cz*cx,cy*sx,0,cz*sy*cx+sz*sx,sz*sy*cx-cz*sx,cy*cx,0,1,2,-45,1]};
};
const face=(pitch=0,yaw=0,roll=0)=>{
  const landmarks=Array.from({length:478},()=>({x:.5,y:.25,z:0}));
  landmarks[33]={x:.455,y:.24,z:0};landmarks[263]={x:.545,y:.24,z:0};
  landmarks[10]={x:.5,y:.17,z:0};landmarks[152]={x:.5,y:.34,z:0};
  return {landmarks,matrix:rotation(pitch,yaw,roll),ageMs:0};
};
const world=(forward=0)=>{
  const points=Array(33).fill(null);
  for(const [i,x,y,z] of [[0,0,-.51,-.085-forward],[7,-.08,-.52,-.015-forward],[8,.08,-.52,-.015-forward],[11,-.2,-.3,0],[12,.2,-.3,0],[23,-.15,.1,0],[24,.15,.1,0]]) points[i]={x,y,z,visibility:.95};
  return points;
};

test('neutral alignment remains stable and head tilt is measured',()=>{
  const points=base();
  assert.equal(evaluate(points,640,480).state,'good');
  points[5]={x:.53,y:.34,visibility:.95};
  const result=evaluate(points,640,480);
  assert.equal(result.state,'bad');
  assert.equal(result.regions.head,'bad');
  assert.ok(result.metrics.headTilt>18);
});

test('missing or low-confidence points do not produce an invented posture',()=>{
  const points=base();
  points[11].visibility=.1;
  assert.equal(evaluate(points,640,480).state,'unknown');
  assert.equal(countVisible(points),6);
});

test('frontal COCO points never claim to measure forward neck position',()=>{
  const result=evaluate({landmarks:front(),model:'movenet'},640,480);
  assert.equal(result.state,'good');
  assert.equal(result.regions.neck,'good');
  assert.equal(result.regionCoverage.neck,'partial');
  assert.equal(result.measurementCoverage.neckLateral,true);
  assert.equal(result.measurementCoverage.neckForward,false);
  assert.equal(result.coverage,'partial');
  assert.match(result.regionReasons.neck,/avancée de la tête non mesurée/);
  assert.equal(result.metrics.headPitch,null);
});

test('neck advancement is observable in a side view, including an occluded far shoulder',()=>{
  for(const hidden of [false,true]){
    const neutral=evaluate({landmarks:profile(0,hidden),model:'yolo'},640,480);
    assert.equal(neutral.view,'profile');
    assert.equal(neutral.regions.neck,'good');
    assert.equal(neutral.regions.shoulders,'unknown');
    assert.equal(neutral.regions.head,'unknown');
    const advanced=evaluate({landmarks:profile(.11,hidden),model:'yolo'},640,480);
    assert.equal(advanced.regions.neck,'bad');
    assert.equal(advanced.state,'bad');
    assert.equal(advanced.metrics.neckSource,'profile');
    assert.match(advanced.reason,/avancée/);
  }
});

test('a frontal body remains frontal when only the face turns',()=>{
  const result=evaluate({landmarks:front(),face:face(0,58),model:'movenet'},640,480);
  assert.equal(result.view,'front');
  assert.equal(result.measurementCoverage.neckForward,false);
  assert.equal(result.regions.neck,'good');
  assert.equal(result.regionCoverage.neck,'partial');
  assert.equal(result.regions.shoulders,'good');
  assert.equal(result.state,'good');
});

test('dense face rotation detects head pitch separately from neck translation',()=>{
  const result=evaluate({landmarks:front(),face:face(37),model:'mediapipe'},640,480);
  assert.equal(result.regions.head,'bad');
  assert.equal(result.regions.neck,'good');
  assert.equal(result.regionCoverage.neck,'partial');
  assert.ok(Math.abs(result.metrics.headPitch-37)<1e-8);
  assert.equal(result.measurementCoverage.headPitch,true);
  assert.match(result.reason,/penchée/);
  const stale=evaluate({landmarks:front(),face:{...face(37),ageMs:1001}},640,480);
  assert.equal(stale.metrics.headPitch,null);
  assert.equal(stale.state,'good');
  const otherPerson=face(37);otherPerson.landmarks[1]={x:.8,y:.25,z:0};
  assert.equal(evaluate({landmarks:front(),face:otherPerson},640,480).metrics.headPitch,null);
});

test('a visible neck keeps lateral assessment with hips outside the webcam crop',()=>{
  const points=front();points[23]=null;points[24]=null;
  const frame={model:'mediapipe',landmarks:points,worldLandmarks:world(),face:face()};
  const neutral=evaluate(frame,640,480);
  assert.equal(neutral.regions.neck,'good');
  assert.equal(neutral.regionCoverage.neck,'partial');
  assert.equal(neutral.measurementCoverage.neckForward,false);
  assert.equal(neutral.regions.torso,'unknown');
  assert.equal(neutral.coverage,'partial');
  assert.match(neutral.regionReasons.neck,/centrée entre les épaules/);
  assert.match(neutral.regionReasons.neck,/avancée de la tête non mesurée/);
  for(const [offset,expected] of [[.035,'warning'],[.09,'bad']]){
    const shifted=points.map((p,i)=>p?{...p,x:p.x+(i<=8?offset:0)}:null);
    const result=evaluate({model:'mediapipe',landmarks:shifted},640,480);
    assert.equal(result.regions.neck,expected);
    assert.equal(result.regionCoverage.neck,'partial');
    assert.equal(result.regions.head,'good');
  }
  const hiddenHips=points.map(p=>p?{...p}:null);
  hiddenHips[23]={x:.42,y:1.2,visibility:.95};hiddenHips[24]={x:.58,y:1.2,visibility:.95};
  assert.equal(evaluate({...frame,landmarks:hiddenHips},640,480).measurementCoverage.neckForward,false);
  const missingHead=points.map(p=>p?{...p}:null);
  for(const i of [2,5,7,8])missingHead[i].visibility=.1;
  assert.equal(evaluate({...frame,landmarks:missingHead},640,480).regions.neck,'unknown');
});

test('FaceLandmarker points with unsupported zero visibility still provide head orientation',()=>{
  const detected=face(37);
  const sdkPoints=detected.landmarks.map(p=>({...p,visibility:0,presence:0}));
  const corrected={...detected,landmarks:normalizeFaceLandmarks(sdkPoints)};
  const result=evaluate({model:'mediapipe',landmarks:front(),face:corrected},640,480);
  assert.equal(result.measurementCoverage.headPitch,true);
  assert.equal(result.regions.head,'bad');
  assert.ok(Math.abs(result.metrics.headPitch-37)<1e-8);
  const lowConfidence=front();lowConfidence[11].visibility=.1;
  assert.equal(evaluate({model:'mediapipe',landmarks:lowConfidence,face:corrected},640,480).state,'unknown');
});

test('face matrices preserve column-major conventions, reject invalid rotation and remove uniform scale',()=>{
  const matrix=rotation(25,-30,12);
  const result=faceOrientation(matrix);
  assert.ok(Math.abs(result.pitch-25)<1e-8);
  assert.ok(Math.abs(result.yaw+30)<1e-8);
  assert.ok(Math.abs(result.roll-12)<1e-8);
  const scaled={...matrix,data:matrix.data.map((v,i)=>i<12?v*2:v)};
  assert.ok(Math.abs(faceOrientation(scaled).pitch-25)<1e-8);
  assert.equal(faceOrientation({data:Array(16).fill(0)}),null);
  const malformed=rotation();malformed.data[1]=1;
  assert.equal(faceOrientation(malformed),null);
});

test('MediaPipe world estimates add forward neck coverage only when depth landmarks are reliable',()=>{
  const frame={model:'mediapipe',landmarks:front(),worldLandmarks:world(),face:face()};
  const neutral=evaluate(frame,640,480);
  assert.equal(neutral.regions.neck,'good');
  assert.equal(neutral.coverage,'full');
  const advanced=evaluate({...frame,worldLandmarks:world(.16)},640,480);
  assert.equal(advanced.regions.neck,'bad');
  assert.equal(advanced.metrics.neckSource,'world');
  assert.equal(advanced.regions.head,'good');
  const occluded=front();occluded[7].visibility=.55;
  assert.equal(evaluate({...frame,landmarks:occluded},640,480).measurementCoverage.neckForward,false);
  assert.equal(evaluate({...frame,model:'movenet'},640,480).measurementCoverage.neckForward,false);
  const badGeometry=world();badGeometry[12].x=5;
  assert.equal(evaluate({...frame,worldLandmarks:badGeometry},640,480).measurementCoverage.neckForward,false);
});

test('temporal tracking suppresses single-frame jitter and updates a sustained correction without a frame queue',()=>{
  const tracker=createPostureTracker({smoothingMs:20});
  const good={landmarks:front(),model:'mediapipe',face:face()};
  const bad={...good,face:face(40)};
  assert.equal(tracker.update(good,640,480,0).state,'good');
  assert.equal(tracker.update(bad,640,480,100).state,'good');
  assert.equal(tracker.update(good,640,480,200).state,'good');
  for(let t=300;t<=900;t+=100)assert.equal(tracker.update(bad,640,480,t).state,'good');
  assert.equal(tracker.update(bad,640,480,1000).state,'bad');
  assert.equal(tracker.update(good,640,480,1100).state,'bad');
  assert.equal(tracker.update(good,640,480,2100).state,'good');
  tracker.reset();
  assert.equal(tracker.update(good,640,480,2300).state,'good');
  const lost=front();for(const i of [0,2,5,7,8])lost[i]=null;
  assert.equal(tracker.update({landmarks:lost,model:'mediapipe'},640,480,2400).state,'unknown');
});

test('canvas drawing uses a colored neck connector and does not resize an unchanged backing store',()=>{
  const lines=[];let current=null;
  const ctx={clearRect(){},beginPath(){},moveTo(x,y){current={from:[x,y],color:this.strokeStyle};},lineTo(x,y){current.to=[x,y];},stroke(){lines.push(current);},arc(){},fill(){}};
  let widthWrites=0,heightWrites=0;
  const canvas={get width(){return 640;},set width(value){widthWrites++;},get height(){return 480;},set height(value){heightWrites++;},getContext(){return ctx;}};
  drawSkeleton(canvas,{landmarks:front()}, {head:'good',neck:'bad',shoulders:'good',torso:'good'},640,480);
  assert.equal(widthWrites,0);assert.equal(heightWrites,0);
  assert.ok(lines.some(line=>line.color==='#d45d49'&&line.from[0]===320&&line.to[0]===320));
});

test('COCO points and YOLO channels map to the shared posture schema',()=>{
  const coco=Array.from({length:17},()=>({x:320,y:240,score:.8}));
  const mapped=normalizeCoco(coco,640,480);
  assert.equal(mapped[11].x,.5);
  assert.equal(mapped[23].visibility,.8);
  const data=new Float32Array(56);
  data[4]=.9;
  for(let i=0;i<17;i++){
    data[5+i*3]=320;
    data[6+i*3]=240;
    data[7+i*3]=.8;
  }
  const decoded=decodeYolo({dims:[1,56,1],data},{width:640,height:480,scale:1,padX:0,padY:0});
  assert.equal(decoded[11].x,.5);
  assert.equal(countVisible(decoded),17);
});
