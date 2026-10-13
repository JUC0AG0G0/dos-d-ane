import {detectPose,releaseModels,configureModelAssets} from './models.js';
import {evaluate} from './pose.js';
window.benchmarkReady=true;
window.runPostureBenchmark=async function({limit=null,repeats=3,manifestURL='/benchmark-data/manifest.json',dataPrefix='/benchmark-data/',models=['mediapipe','movenet','yolo'],retainModels=false,preloadImages=0}={}){
 const manifest=await (await fetch(manifestURL)).json();
 const rows=limit?manifest.rows.slice(0,limit):manifest.rows;
 const results=[]; window.benchmarkProgress={done:0,total:rows.length*models.length};
 async function prepare(row){
  const image=await createImageBitmap(await (await fetch(dataPrefix+row.file)).blob());
  try{
   const scale=Math.min(1,640/image.width,640/image.height);
   const width=Math.round(image.width*scale),height=Math.round(image.height*scale);
   const bitmap=await createImageBitmap(image,{resizeWidth:width,resizeHeight:height,resizeQuality:'high'});
   return {bitmap,width,height};
  }finally{image.close();}
 }
 for(const model of models){
  if(!retainModels)await releaseModels(); configureModelAssets(new URL('/',location.href).href,{imageMode:true});
  const queued=new Map();
  const queue=index=>{if(index<rows.length)queued.set(index,prepare(rows[index]).catch(error=>({error})));};
  for(let index=0;index<Math.min(preloadImages,rows.length);index++)queue(index);
  for(const [index,row] of rows.entries()){
   let bitmap;
   try{
    // Preloading only overlaps I/O and decoding; the pixel transform is identical.
    const prepared=await (preloadImages?queued.get(index):prepare(row));
    queued.delete(index);if(preloadImages)queue(index+preloadImages);
    if(prepared.error)throw prepared.error;
    const {width,height}=prepared;bitmap=prepared.bitmap;
    const measurements=[]; let frame;
    for(let repeat=0;repeat<repeats;repeat++){
     frame=await detectPose(model,bitmap,width,height,{detail:true,comparison:true});
     measurements.push({totalMs:frame.inferenceMs,poseMs:frame.poseMs,loadMs:frame.loadMs});
    }
    const assessed=evaluate(frame,width,height);
    const {landmarks,face,...assessment}=assessed;
    const {landmarks:unused,face:unusedFace,...assessment2d}=evaluate({...frame,worldLandmarks:undefined},width,height);
    results.push({id:row.id,label:row.label,model,width,height,backend:frame.backend,faceAvailable:frame.faceAvailable,landmarks:frame.landmarks,assessment,assessment2d,measurements});
   }catch(error){results.push({id:row.id,label:row.label,model,error:error.stack||String(error)});}
   finally{bitmap?.close();}
   window.benchmarkProgress={done:results.length,total:rows.length*models.length,model,id:row.id};
   document.getElementById('progress').textContent=JSON.stringify(window.benchmarkProgress);
   window.benchmarkPartial=results;
  }
 }
 if(!retainModels)await releaseModels();
 return {manifest:{...manifest,rows:undefined},protocol:{repeats,inputMax:640,imageMode:true,faceShared:true,preloadImages,postureRules:'desktop/src/pose.js, unchanged thresholds',binaryMapping:'01_good vs 02_slouch only; warning+bad => alert; unknown => abstention',notMeasured:'keypoint error (no reference points), clinical validity, webcam temporal stability'},results};
};
