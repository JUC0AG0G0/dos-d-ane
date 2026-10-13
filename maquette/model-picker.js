// Design prototype: these examples represent the same simulated pose, not live inference.
const modelFixtures={
 mediapipe:{name:'MediaPipe',points:33,good:0,bad:23},
 movenet:{name:'MoveNet',points:17,good:2,bad:19},
 yolo:{name:'YOLO Pose',points:17,good:1,bad:26},
};
let selectedModel='mediapipe';
function resultFor(model){
 if(!running)return {state:'idle',label:'En attente',angle:null};
 if(paused)return {state:'paused',label:'En pause',angle:null};
 if(state==='unknown')return {state:'unknown',label:'Hors champ',angle:null};
 return {state,label:state==='bad'?'À ajuster':'Stable',angle:modelFixtures[model][state]};
}
function renderModels(){
 const current=modelFixtures[selectedModel],selectedResult=resultFor(selectedModel);
 const isMeasured=selectedResult.angle!==null;
 document.querySelector('.summary>span').textContent=`Dos d’âne · ${current.name}`;
 $('detail-head').textContent=isMeasured?`${state==='bad'?'Inclinée':'Alignée'} · ${selectedResult.angle}°`:'—';
 $('detail-head').style.color=state==='bad'&&isMeasured?'#bd5944':'#427b55';
 const host=$('model-results');host.replaceChildren();
 for(const [key,model] of Object.entries(modelFixtures)){
  const result=resultFor(key),card=document.createElement('div');
  card.className='model-result';card.dataset.selected=String(key===selectedModel);card.dataset.state=result.state;
  const name=document.createElement('strong');name.textContent=model.name;
  const label=document.createElement('span');label.className='model-state';label.textContent=result.label;
  const detail=document.createElement('small');detail.textContent=result.angle===null?'Angle non disponible':`Tête ${result.angle}° · ${model.points} points possibles`;
  card.append(name,label,detail);host.append(card);
 }
}
$('pose-model').addEventListener('change',event=>{
 selectedModel=event.target.value;
 renderModels();
});
const renderBeforeModels=render;
render=function(){renderBeforeModels();renderModels();};
renderModels();
