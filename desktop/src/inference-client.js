export {MODEL_NAMES,MODEL_COUNTS} from './model-info.js';

let worker=null;
let requestId=0;
let generation=0;
let active=null;
const requests=new Map();

function aborted(){return new DOMException('Analyse arrêtée.','AbortError');}
function getWorker(){
 if(worker)return worker;
 worker=new Worker(new URL('./inference-worker.js',import.meta.url),{type:'module',name:'posture-inference'});
 worker.onmessage=({data})=>{
  const pending=requests.get(data.id);
  if(!pending)return;
  requests.delete(data.id);
  if(data.error){const error=new Error(data.error.message);error.name=data.error.name||'Error';pending.reject(error);}
  else pending.resolve(data.frame);
 };
 worker.onerror=event=>{
  const error=new Error(event.message||'Le moteur de détection a été interrompu.');
  for(const pending of requests.values())pending.reject(error);
  requests.clear();worker?.terminate();worker=null;
 };
 return worker;
}

// Snapshot only when the previous inference has finished. No frame queue is kept.
export async function detectPose(model,source,width,height,{detail=true,comparison=false}={}){
 const current=generation;
 if(active)await active.catch(()=>{});
 if(current!==generation)throw aborted();
 if(active){const error=new Error('Analyse déjà en cours.');error.name='InferenceBusyError';throw error;}
 const operation=(async()=>{
  const maxWidth=model==='yolo'?640:480;
  const scale=Math.min(1,maxWidth/width,maxWidth/height);
  const snapshot=await createImageBitmap(source,{resizeWidth:Math.max(1,Math.round(width*scale)),resizeHeight:Math.max(1,Math.round(height*scale)),resizeQuality:'low'});
  if(current!==generation){snapshot.close();throw aborted();}
  const target=getWorker();
  const id=++requestId;
  return await new Promise((resolve,reject)=>{
   requests.set(id,{resolve,reject});
   try{target.postMessage({id,model,bitmap:snapshot,detail,comparison,baseURL:document.baseURI},[snapshot]);}
   catch(error){requests.delete(id);snapshot.close();reject(error);}
  });
 })();
 active=operation;
 try{return await operation;}
 finally{if(active===operation)active=null;}
}

// Termination releases WASM heaps, tensors, GPU contexts and any frame in flight.
export function releaseModels(){
 generation++;
 worker?.terminate();worker=null;
 for(const pending of requests.values())pending.reject(aborted());
 requests.clear();active=null;
}
