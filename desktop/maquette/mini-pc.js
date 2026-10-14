const $=id=>document.getElementById(id);
let running=false,paused=false,state='good',timer=null,snoozedUntil=0;
const states={good:['Posture stable','#179b4b'],bad:['Posture à ajuster','#d66b53'],unknown:['Cadrage à vérifier','#a79362']};
function hideAlert(){clearTimeout(timer);$('notification').hidden=true;}
function closeMenu(){$('menu').hidden=true;$('menu-toggle').setAttribute('aria-expanded','false');}
function render(){const [label,color]=!running?['Prêt pour une session ?','#93a598']:paused?['Session en pause','#93a598']:states[state];$('status').textContent=label;$('dot').style.background=color;$('start').hidden=running;$('menu-toggle').hidden=!running;$('open-web').hidden=!running;$('pause').textContent=paused?'Reprendre la session':'Mettre en pause';document.querySelectorAll('[data-state]').forEach(b=>{b.disabled=!running||paused;b.setAttribute('aria-pressed',String(running&&b.dataset.state===state));});$('test-alert').disabled=!running||paused;}
function showAlert(){if(running&&!paused&&state==='bad'){$('web-note').hidden=true;closeMenu();$('notification').hidden=false;}}
function chooseState(value){state=value;hideAlert();render();if(state==='bad'&&Date.now()>=snoozedUntil)timer=setTimeout(showAlert,3000);}
function openWeb(){hideAlert();closeMenu();$('web-note').hidden=false;$('close-web').focus();}
$('start').onclick=()=>{running=true;paused=false;snoozedUntil=0;chooseState('good');startPreview();$('menu-toggle').focus();};
$('menu-toggle').onclick=()=>{const open=$('menu').hidden;$('menu').hidden=!open;$('menu-toggle').setAttribute('aria-expanded',String(open));$('web-note').hidden=true;if(open)$('pause').focus();};
$('pause').onclick=()=>{paused=!paused;hideAlert();closeMenu();render();if(!paused){chooseState(state);startPreview();}else stopPreview('Pause');$('menu-toggle').focus();};
$('stop').onclick=()=>{running=false;paused=false;stopPreview();hideAlert();closeMenu();$('web-note').hidden=true;render();$('start').focus();};
document.querySelectorAll('[data-state]').forEach(b=>b.onclick=()=>chooseState(b.dataset.state));
$('test-alert').onclick=()=>{chooseState('bad');clearTimeout(timer);showAlert();};
$('dismiss').onclick=()=>{hideAlert();$('menu-toggle').focus();};
$('later').onclick=()=>{hideAlert();snoozedUntil=Date.now()+60000;$('menu-toggle').focus();};
$('open-web').onclick=openWeb;$('see').onclick=openWeb;$('close-web').onclick=()=>{$('web-note').hidden=true;$('open-web').focus();};
$('taskbar-open').onclick=()=>{(running?$('menu-toggle'):$('start')).focus();};
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();$('web-note').hidden=true;hideAlert();(running?$('menu-toggle'):$('start')).focus();}});
document.addEventListener('click',e=>{if(!e.target.closest('.mini'))closeMenu();});
function tick(){$('clock').textContent=new Intl.DateTimeFormat('fr-FR',{hour:'2-digit',minute:'2-digit'}).format(new Date());}tick();setInterval(tick,30000);render();
let previewStream=null,previewGeneration=0;
function stopPreview(label='Caméra'){
 previewGeneration++;previewStream?.getTracks().forEach(t=>t.stop());previewStream=null;
 $('head-video').srcObject=null;$('head-video').hidden=true;$('head-placeholder').hidden=false;
 $('preview-label').textContent=label;$('camera-message').hidden=true;
}
async function startPreview(){
 stopPreview('Connexion');const generation=previewGeneration;
 try{
  const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:640},height:{ideal:480}},audio:false});
  if(generation!==previewGeneration||!running||paused){stream.getTracks().forEach(t=>t.stop());return;}
  previewStream=stream;$('head-video').srcObject=stream;await $('head-video').play();
  if(generation!==previewGeneration)return;
  $('head-video').hidden=false;$('head-placeholder').hidden=true;$('preview-label').textContent='En direct';
 }catch(e){
  if(generation!==previewGeneration)return;
  stopPreview('Indisponible');$('camera-message').textContent='Aperçu caméra indisponible. Autorisez la webcam puis relancez la session. La simulation reste utilisable.';$('camera-message').hidden=false;
 }
}
window.addEventListener('pagehide',()=>stopPreview());
stopPreview();
// The compact and vertical views share the same session and camera stream.
let elapsedSeconds=0;
const originalRender=render;
render=function(){
 originalRender();
 if(!running)elapsedSeconds=0;
 $('mini-elapsed').textContent=String(Math.floor(elapsedSeconds/60)).padStart(2,'0')+':'+String(elapsedSeconds%60).padStart(2,'0');
 const available=running&&!paused&&state!=='unknown';
 $('detail-head').textContent=available?(state==='bad'?'Inclinée · 23°':'Alignée · 0°'):'—';
 $('detail-shoulders').textContent=available?'Stables · 0°':'—';
 $('detail-torso').textContent=available?'Stable · 0°':'—';
 $('detail-head').style.color=available&&state==='bad'?'#bd5944':'#427b55';
 $('mini-advice').textContent=!running?'Démarrez une session pour suivre votre posture.':paused?'Le suivi est en pause. Reprenez quand vous êtes prêt.':state==='unknown'?'Gardez votre tête et vos épaules dans le cadre.':state==='bad'?'Votre tête semble inclinée. Revenez doucement au centre.':'Votre tête et vos épaules sont bien alignées.';
};
$('expand-mini').onclick=()=>{
 const expanded=$('mini-details').hidden;
 $('mini-details').hidden=!expanded;
 document.querySelector('.mini').classList.toggle('expanded',expanded);
 document.body.classList.toggle('mini-expanded',expanded);
 $('expand-mini').setAttribute('aria-expanded',String(expanded));
 $('expand-mini').setAttribute('aria-label',expanded?'Replier la fenêtre':'Déplier la fenêtre vers le haut');
 $('expand-mini').textContent=expanded?'⌄':'⌃';
 closeMenu();$('web-note').hidden=true;render();
};
setInterval(()=>{if(running&&!paused){elapsedSeconds++;render();}},1000);
render();
