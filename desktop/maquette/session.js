import {createPoseEngine, evaluateLandmarks} from './pose-engine.js';
import {drawPoseOverlay, isVisibleLandmark} from './pose-overlay.js';

const $ = id => document.getElementById(id);
const colors = {good:'#169747', warning:'#b87616', bad:'#cf5943', unknown:'#86998c'};
const names = {good:'Posture stable', warning:'À surveiller', bad:'À ajuster', unknown:'Cadrage à vérifier'};
const regionNames = {good:'Stable', warning:'À surveiller', bad:'À ajuster', unknown:'Non visible'};
const canvas = $('canvas'), ctx = canvas.getContext('2d'), video = $('video');
let mode='idle', startedAt=0, token=0, demoPose='good', demoTimer=null;
let badSince=null, lastFrameAt=0, nextAlertAt=0, systemNotice=null, latestFrame=null;

const engine = createPoseEngine({video, onFrame:handleFrame, onStatus:({phase,message})=>{
  if(mode!=='camera') return;
  if(phase==='running') {
    $('empty').hidden=true;
    $('live-label').hidden=false;
    $('session-status').textContent='Session en cours · analyse automatique';
    $('page-title').textContent='Votre posture en direct';
    setMessage('');
  } else if(phase==='error') {
    finish();
    setMessage(message);
    setMini('Caméra indisponible', 'unknown');
  } else if(phase==='camera'||phase==='model') {
    setMessage(message);
    $('session-status').textContent=message;
    $('state-title').textContent=phase==='camera'?'Autorisez la caméra':'Chargement du suivi…';
    $('state-detail').textContent=phase==='camera'?'Le suivi démarrera automatiquement après votre autorisation.':'Le modèle se prépare. Cela peut prendre quelques instants au premier lancement.';
    setMini(phase==='camera'?'Autorisation caméra':'Chargement…', 'unknown');
  }
}});

function setMessage(text) {
  $('message').textContent=text;
  $('message').hidden=!text;
}
function setMini(text,state) {
  $('mini-status').textContent=text;
  document.querySelector('.mini-dot').style.background=colors[state];
}
function clearAlert() {
  $('notification').hidden=true;
  systemNotice?.close();
  systemNotice=null;
}
function resetRegions() {
  for(const region of ['head','shoulders','torso']) {
    $(region).textContent='—'; $(region).style.color=colors.unknown;
    $(region+'-detail').textContent=region==='shoulders'?'Inclinaison':'Inclinaison latérale';
  }
  $('head-position').textContent='Position par rapport aux épaules';
  $('point-count').textContent='0 / 33 points visibles';
}
function setRunning() {
  startedAt=performance.now();
  $('elapsed').textContent='00:00';
  badSince=null;lastFrameAt=0;nextAlertAt=0;latestFrame=null;
  $('stop').disabled=false;$('start').disabled=true;$('demo').disabled=true;
  $('session-label').textContent=mode==='demo'?'Démonstration · sans caméra':'Session en cours';
  $('mini-label').textContent=mode==='demo'?'Dos d’âne · Démonstration':'Dos d’âne';
  $('page-title').textContent='Votre posture en direct';
  $('result').dataset.state='unknown';
  document.querySelector('.clock').classList.add('active');
  resetRegions();clearAlert();setMessage('');setMini('Démarrage…','unknown');
}
async function startCamera() {
  if(mode!=='idle')return;
  mode='camera';const current=++token;setRunning();
  $('mode-label').textContent='Webcam';$('start').textContent='Connexion à la caméra…';
  try { await engine.start(); }
  catch(error) {
    if(current!==token)return;
    finish();setMessage(error.message);setMini('Caméra indisponible','unknown');
  }
}
function finish() {
  token++;mode='idle';engine.stop();clearInterval(demoTimer);demoTimer=null;
  badSince=null;lastFrameAt=0;latestFrame=null;clearAlert();
  $('stop').disabled=true;$('start').disabled=false;$('demo').disabled=false;
  $('start').textContent='Démarrer une session';$('empty').hidden=false;
  $('demo-controls').hidden=true;$('live-label').hidden=true;
  $('mode-label').textContent='Caméra arrêtée';$('session-label').textContent='Votre espace personnel';
  $('page-title').textContent='Prêt pour une nouvelle session ?';
  $('session-status').textContent='Session terminée · caméra arrêtée';
  $('mini-label').textContent='Dos d’âne';setMini('Session arrêtée','unknown');
  $('result').dataset.state='unknown';$('state-title').textContent='Session terminée';
  $('state-detail').textContent='La caméra est arrêtée. Vous pouvez relancer le suivi quand vous le souhaitez.';
  document.querySelector('.clock').classList.remove('active');
  ctx.clearRect(0,0,canvas.width,canvas.height);resetRegions();setMessage('');
}
function restore() {
  $('app').hidden=false;$('mini').hidden=true;clearAlert();$('minimize').focus();
}
function minimize() {
  $('app').hidden=true;$('mini').hidden=false;$('mini-expand').focus();
}
function notify() {
  const text=(latestFrame?.reason||'Une inclinaison prolongée a été détectée.')+' Prenez un instant pour ajuster votre position.';
  $('alert-detail').textContent=(mode==='demo'?'Exemple simulé : ':'')+text;
  $('notification').hidden=false;
  if('Notification' in window&&Notification.permission==='granted'&&document.hidden) {
    try {
      systemNotice?.close();
      systemNotice=new Notification('Dos d’âne · un petit ajustement ?', {body:$('alert-detail').textContent,tag:'dos-dane-posture'});
      systemNotice.onclick=()=>{window.focus();restore();};
    } catch {setMessage('Les notifications système sont indisponibles. Le rappel reste affiché dans la page.');}
  }
}
function handleFrame(frame) {
  if(mode==='idle')return;
  latestFrame=frame;draw(frame);
  $('result').dataset.state=frame.state;$('state-title').textContent=names[frame.state];
  $('state-detail').textContent=frame.reason;
  for(const region of ['head','shoulders','torso']) {
    const state=frame.regions[region];
    $(region).textContent=regionNames[state];$(region).style.color=colors[state];
  }
  const m=frame.metrics;
  $('head-detail').textContent=Number.isFinite(m?.headTiltAngle)?`Inclinaison latérale : ${Math.round(Math.abs(m.headTiltAngle))}°`:'Inclinaison non mesurable';
  $('head-position').textContent=Number.isFinite(m?.headOffset)?Math.abs(m.headOffset)<.17?'Tête centrée entre les épaules':'Tête décalée sur le côté':'Gardez la tête dans le cadre';
  $('point-count').textContent=`${(frame.landmarks||[]).slice(0,33).filter(isVisibleLandmark).length} / 33 points visibles`;
  for(const [region,metric]of [['shoulders','shoulderAngle'],['torso','torsoAngle']]) {
    $(region+'-detail').textContent=frame.regions[region]==='unknown'?'Points insuffisamment visibles':Number.isFinite(m?.[metric])?`${region==='torso'?'Inclinaison latérale':'Inclinaison'} : ${Math.round(Math.abs(m[metric]))}°`:'Alignement observé';
  }
  setMini(names[frame.state],frame.state);
  const now=performance.now();
  // A gap in observations must not count as a sustained bad posture.
  if(lastFrameAt&&now-lastFrameAt>2000)badSince=null;
  lastFrameAt=now;
  if(frame.state==='bad') {
    badSince??=now;
    if(now-badSince>=Number($('delay').value)*1000&&now>=nextAlertAt) {notify();nextAlertAt=now+60000;}
  } else {badSince=null;clearAlert();}
}

function demoFrame() {
  const p=Array.from({length:33},()=>({x:0,y:0,visibility:0,presence:0}));
  if(demoPose==='unknown')return evaluateLandmarks(p,960,720);
  const shift=demoPose==='bad'?.12:demoPose==='warning'?.06:0;
  const coords={0:[.5+shift,.23],1:[.48+shift,.20],2:[.465+shift,.20],3:[.45+shift,.20],4:[.52+shift,.20],5:[.535+shift,.20],6:[.55+shift,.20],7:[.43+shift,.225],8:[.57+shift,.225],9:[.478+shift,.27],10:[.522+shift,.27],11:[.36,.38],12:[.64,.38+shift*.7],13:[.29,.53],14:[.71,.53],15:[.38,.66],16:[.62,.66],17:[.38,.695],18:[.62,.695],19:[.40,.692],20:[.60,.692],21:[.413,.669],22:[.587,.669],23:[.4,.70],24:[.6,.70],25:[.33,.82],26:[.67,.82],27:[.34,.935],28:[.66,.935],29:[.32,.95],30:[.68,.95],31:[.39,.96],32:[.61,.96]};
  if(demoPose==='head-tilt') {
    const angle=23*Math.PI/180;
    for(let i=0;i<=10;i++) {
      const x=(coords[i][0]-.5)*960,y=(coords[i][1]-.23)*720;
      coords[i]=[.5+(x*Math.cos(angle)-y*Math.sin(angle))/960,.23+(x*Math.sin(angle)+y*Math.cos(angle))/720];
    }
  }
  if(demoPose==='torso-tilt') {
    for(let i=0;i<=22;i++)coords[i][0]+=.10;
  }
  for(const [i,[x,y]]of Object.entries(coords))p[i]={x,y,visibility:1,presence:1};
  return evaluateLandmarks(p,960,720);
}
function startDemo() {
  if(mode!=='idle')return;
  mode='demo';setRunning();$('empty').hidden=true;$('demo-controls').hidden=false;
  $('mode-label').textContent='Image simulée';$('session-status').textContent='Démonstration · aucune caméra activée';
  demoPose='good';updateDemoButtons();handleFrame(demoFrame());
  demoTimer=setInterval(()=>handleFrame(demoFrame()),150);
}
function updateDemoButtons() {
  for(const b of document.querySelectorAll('[data-pose]'))b.setAttribute('aria-pressed',String(b.dataset.pose===demoPose));
}
function dismiss() {clearAlert();nextAlertAt=performance.now()+60000;badSince=null;}

$('start').onclick=startCamera;$('demo').onclick=startDemo;$('stop').onclick=finish;
$('show-video').onchange=()=>{video.style.visibility=$('show-video').checked?'visible':'hidden';if(mode==='demo')handleFrame(demoFrame());};
for(const b of document.querySelectorAll('[data-pose]'))b.onclick=()=>{demoPose=b.dataset.pose;badSince=null;nextAlertAt=0;clearAlert();updateDemoButtons();handleFrame(demoFrame());};
$('minimize').onclick=minimize;$('mini-expand').onclick=restore;$('restore').onclick=restore;$('see').onclick=restore;
$('dismiss').onclick=dismiss;$('snooze').onclick=dismiss;$('delay').onchange=()=>{badSince=null;clearAlert();};
$('notifications').onclick=async()=>{
  if(!('Notification'in window)){setMessage('Les notifications système sont indisponibles ici. Les rappels dans la page restent actifs.');return;}
  try {
    const permission=await Notification.requestPermission();
    $('notifications').textContent=permission==='granted'?'Notifications système activées':'Notifications dans la page uniquement';
    setMessage(permission==='denied'?'Vous pouvez autoriser les notifications système dans les réglages du navigateur.':'');
  } catch {setMessage('Notifications système indisponibles. Utilisez les rappels dans la page.');}
};
setInterval(()=>{
  if(mode==='idle')return;
  const t=Math.floor((performance.now()-startedAt)/1000);
  $('elapsed').textContent=String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0');
},1000);
document.addEventListener('keydown',e=>{if(e.key==='Escape')minimize();});
window.addEventListener('pagehide',finish);

function draw(frame) {
  drawPoseOverlay(canvas,frame,{
    width: mode === 'camera' ? (video.videoWidth||640) : 960,
    height: mode === 'camera' ? (video.videoHeight||480) : 720,
    showIllustration: mode === 'demo' && $('show-video').checked,
  });
}
