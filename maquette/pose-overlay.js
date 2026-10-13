import {isReliableLandmark} from './pose-engine.js';

const COLORS = {good:'#169747', warning:'#b87616', bad:'#cf5943', unknown:'#86998c', tracked:'#6096ab'};
// MediaPipe's 33 pose landmarks: face, torso, arms, hand tips, legs and feet.
const EDGES = [
  [0,1,'head'],[1,2,'head'],[2,3,'head'],[3,7,'head'],
  [0,4,'head'],[4,5,'head'],[5,6,'head'],[6,8,'head'],[9,10,'head'],
  [11,12,'shoulders'],[11,13,'tracked'],[13,15,'tracked'],
  [15,17,'tracked'],[15,19,'tracked'],[15,21,'tracked'],[17,19,'tracked'],
  [12,14,'tracked'],[14,16,'tracked'],[16,18,'tracked'],[16,20,'tracked'],
  [16,22,'tracked'],[18,20,'tracked'],
  [11,23,'torso'],[12,24,'torso'],[23,24,'torso'],
  [23,25,'tracked'],[24,26,'tracked'],[25,27,'tracked'],[26,28,'tracked'],
  [27,29,'tracked'],[28,30,'tracked'],[29,31,'tracked'],[30,32,'tracked'],
  [27,31,'tracked'],[28,32,'tracked'],
];

export const isVisibleLandmark = isReliableLandmark;

/** Draw only observed points. Limbs are tracked in blue, not posture-scored. */
export function drawPoseOverlay(canvas, frame, {width=960,height=720,showIllustration=false}={}) {
  if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
  const g=canvas.getContext('2d'),p=frame.landmarks||[];
  g.clearRect(0,0,width,height);
  const visible=i=>isVisibleLandmark(p[i]);
  const xy=i=>[p[i].x*width,p[i].y*height];
  const color=region=>region==='tracked'?COLORS.tracked:COLORS[frame.regions[region]||'unknown'];
  const segment=(a,b,stroke,lineWidth,dashed=false)=>{
    g.strokeStyle=stroke;g.lineWidth=lineWidth;g.setLineDash(dashed?[7,6]:[]);
    g.beginPath();g.moveTo(...a);g.lineTo(...b);g.stroke();g.setLineDash([]);
  };
  g.lineCap='round';
  if(showIllustration&&visible(0)&&visible(11)&&visible(12)) {
    g.fillStyle='#fff';g.fillRect(0,0,width,height);
    g.fillStyle='#e1ece5';g.fillRect(width*.10,height*.72,width*.8,height*.018);
    const tilt=(frame.metrics?.headTiltAngle||0)*Math.PI/180;
    g.fillStyle='#c7f4d7';g.beginPath();g.ellipse(...xy(0),width*.075,height*.10,tilt,0,Math.PI*2);g.fill();
    if(visible(23)&&visible(24)) {
      g.beginPath();[11,12,24,23].forEach((id,i)=>i?g.lineTo(...xy(id)):g.moveTo(...xy(id)));g.closePath();g.fill();
    }
    for(const [a,b]of [[11,13],[13,15],[12,14],[14,16],[23,25],[24,26],[25,27],[26,28]]) {
      if(visible(a)&&visible(b))segment(xy(a),xy(b),'#c7f4d7',width*.035);
    }
  }
  // Geometric reference guides, independent of any personal calibration.
  if(visible(11)&&visible(12)) {
    const a=xy(11),b=xy(12),center=[(a[0]+b[0])/2,(a[1]+b[1])/2];
    segment([center[0]-width*.18,center[1]],[center[0]+width*.18,center[1]],'#95b4a3',1.5,true);
    if(visible(23)&&visible(24)) {
      const hipA=xy(23),hipB=xy(24),hip=[(hipA[0]+hipB[0])/2,(hipA[1]+hipB[1])/2];
      segment(hip,[hip[0],center[1]],'#95b4a3',1.5,true);
      segment(hip,center,color('torso'),Math.max(2,width/350));
    }
  }
  const shoulderSpan=visible(11)&&visible(12)?Math.hypot((p[11].x-p[12].x)*width,(p[11].y-p[12].y)*height):0;
  const headPair=[[2,5],[7,8]].find(([a,b])=>visible(a)&&visible(b)&&
    Math.hypot((p[a].x-p[b].x)*width,(p[a].y-p[b].y)*height)>=Math.max(width*.008,shoulderSpan*.08));
  if(headPair&&Number.isFinite(frame.metrics?.headTiltAngle)) {
    const a=xy(headPair[0]),b=xy(headPair[1]),center=[(a[0]+b[0])/2,(a[1]+b[1])/2];
    segment([center[0]-width*.10,center[1]],[center[0]+width*.10,center[1]],'#95b4a3',1.5,true);
    segment(a,b,color('head'),Math.max(2.5,width/280));
  }
  for(const [a,b,region]of EDGES) {
    if(!visible(a)||!visible(b))continue;
    segment(xy(a),xy(b),color(region),Math.max(1.8,width/(region==='head'?420:280)));
  }
  for(let i=0;i<Math.min(33,p.length);i++) {
    if(!visible(i))continue;
    const region=i<=10?'head':i===11||i===12?'shoulders':i===23||i===24?'torso':'tracked';
    g.fillStyle=color(region);g.strokeStyle='#fff';g.lineWidth=1.6;
    g.beginPath();g.arc(...xy(i),width/(i<=10||i>=17&&i<=22||i>=27?225:150),0,Math.PI*2);g.fill();g.stroke();
  }
}
