import {normalizeCoco} from './pose.js';
export {MODEL_NAMES,MODEL_COUNTS} from './model-info.js';

let baseURL;
let independentImages=false;
// Offline benchmark only: prevent temporal tracking between unrelated photos.
// Configure before loading models; live application keeps VIDEO as its default.
export function configureModelAssets(url,{imageMode=false}={}){baseURL=url;independentImages=imageMode;}
const asset=name=>new URL(`./${name}`,baseURL??globalThis.location?.href).href;
let selected=null;
let selectedDetector=null;
let faceDetector=null;
let faceUnavailable=false;
let faceError=null;
let faceCache=null;
let lastFaceAttempt=-Infinity;
let lastMediaPipeTime=0;
let lastFaceTime=0;
let smoothedInferenceMs=0;

const copyLandmarks=points=>points?.map(({x,y,z,visibility,presence})=>({x,y,z,visibility:Math.min(visibility??1,presence??1)}))??[];
// FaceLandmarker gates the whole face, but its JS landmark converter sets
// unsupported per-point visibility/presence fields to zero. They are not
// body-joint confidence scores: retain coordinates for geometric validation.
export const normalizeFaceLandmarks=points=>points?.map(({x,y,z})=>({x,y,z}))??[];
const offscreen=(width,height)=>new OffscreenCanvas(width,height);

async function visionFiles(){
 const {FilesetResolver}=await import('@mediapipe/tasks-vision');
 const vision=await FilesetResolver.forVisionTasks(asset('wasm/mediapipe'));
 // MediaPipe's classic loader gets an ES module boundary wrapper at build time.
 if(typeof document==='undefined'){
  vision.wasmLoaderPath=vision.wasmLoaderPath.replace(/\.js$/,'.mjs');
  globalThis.import=async url=>{const module=await import(/* @vite-ignore */url);globalThis.ModuleFactory=module.default;};
 }
 return vision;
}
async function createVisionTask(Task,vision,options){
 try{return {task:await Task.createFromOptions(vision,{...options,baseOptions:{...options.baseOptions,delegate:'GPU'}}),backend:'WebGL'};}
 catch{return {task:await Task.createFromOptions(vision,{...options,baseOptions:{...options.baseOptions,delegate:'CPU'}}),backend:'CPU'};}
}
async function loadMediaPipe(){
 const {PoseLandmarker}=await import('@mediapipe/tasks-vision');
 const {task,backend}=await createVisionTask(PoseLandmarker,await visionFiles(),{
  baseOptions:{modelAssetPath:asset('models/pose_landmarker_lite.task')},
  runningMode:independentImages?'IMAGE':'VIDEO',numPoses:1,minPoseDetectionConfidence:.5,minPosePresenceConfidence:.5,minTrackingConfidence:.5,
  outputSegmentationMasks:false
 });
 return {backend,run:async source=>{
  lastMediaPipeTime=Math.max(performance.now(),lastMediaPipeTime+1);
  const output=independentImages?task.detect(source):task.detectForVideo(source,lastMediaPipeTime);
  return {landmarks:copyLandmarks(output.landmarks?.[0]),worldLandmarks:copyLandmarks(output.worldLandmarks?.[0])};
 },dispose:()=>task.close()};
}
async function loadFace(){
 const {FaceLandmarker}=await import('@mediapipe/tasks-vision');
 const {task,backend}=await createVisionTask(FaceLandmarker,await visionFiles(),{
  baseOptions:{modelAssetPath:asset('models/face_landmarker.task')},
  runningMode:independentImages?'IMAGE':'VIDEO',numFaces:1,minFaceDetectionConfidence:.5,minFacePresenceConfidence:.5,minTrackingConfidence:.5,
  outputFaceBlendshapes:false,outputFacialTransformationMatrixes:true
 });
 return {backend,run:source=>{
  lastFaceTime=Math.max(performance.now(),lastFaceTime+1);
  const output=independentImages?task.detect(source):task.detectForVideo(source,lastFaceTime);
  if(!output.faceLandmarks?.[0]?.length)return null;
  const matrix=output.facialTransformationMatrixes?.[0];
  return {landmarks:normalizeFaceLandmarks(output.faceLandmarks[0]),matrix:matrix?{data:Array.from(matrix.data),rows:matrix.rows,columns:matrix.columns,layout:'column-major'}:null};
 },dispose:()=>task.close()};
}
async function loadMoveNet(){
 const tf=await import('@tensorflow/tfjs-core');
 await import('@tensorflow/tfjs-backend-webgl');
 await import('@tensorflow/tfjs-backend-cpu');
 try{if(!await tf.setBackend('webgl'))throw new Error('WebGL unavailable');await tf.ready();}
 catch{await tf.setBackend('cpu');await tf.ready();}
 const poseDetection=await import('@tensorflow-models/pose-detection');
 const detector=await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet,{
  modelType:poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,enableSmoothing:!independentImages
 });
 const canvas=offscreen(480,360),context=canvas.getContext('2d');
 return {backend:tf.getBackend()==='webgl'?'WebGL':'CPU',run:async(source,width,height)=>{
  if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
  context.drawImage(source,0,0,width,height);
  if(independentImages)detector.reset();
  const poses=await detector.estimatePoses(canvas,{maxPoses:1,flipHorizontal:false});
  return {landmarks:normalizeCoco(poses?.[0]?.keypoints,width,height)};
 },dispose:()=>detector.dispose()};
}

// YOLOv8n-pose ONNX output: [1, 56, 8400] or [1, 8400, 56].
export function decodeYolo(output,{width,height,scale,padX,padY}){
 const dims=output.dims;
 if(dims.length!==3||dims[0]!==1)throw new Error('Format de sortie YOLO Pose non reconnu.');
 const channelsFirst=dims[1]===56;
 const stride=channelsFirst?dims[2]:dims[1];
 if((channelsFirst?dims[1]:dims[2])!==56)throw new Error('Ce modèle YOLO Pose ne fournit pas 17 articulations.');
 const data=output.data;
 const get=(row,channel)=>channelsFirst?data[channel*stride+row]:data[row*56+channel];
 let best=-1,confidence=.35;
 for(let row=0;row<stride;row++)if(get(row,4)>confidence){confidence=get(row,4);best=row;}
 if(best<0)return [];
 const points=[];
 for(let i=0;i<17;i++){
  const x=(get(best,5+3*i)-padX)/scale,y=(get(best,6+3*i)-padY)/scale;
  const inside=x>=0&&x<=width&&y>=0&&y<=height;
  points.push({x,y,score:inside?get(best,7+3*i):0});
 }
 return normalizeCoco(points,width,height);
}
async function loadYolo(){
 const ort=await import('onnxruntime-web/webgpu');
 ort.env.wasm.wasmPaths=asset('wasm/onnx/');
 ort.env.wasm.numThreads=globalThis.crossOriginIsolated?Math.min(4,navigator.hardwareConcurrency||2):1;
 ort.env.wasm.proxy=false;
 const response=await fetch(asset('models/yolov8n-pose.onnx'));
 if(!response.ok)throw new Error('Modèle YOLO Pose absent. Lancez « npm run model:yolo » dans le dossier desktop.');
 const bytes=new Uint8Array(await response.arrayBuffer());
 let session,backend;
 if(navigator.gpu){
  try{session=await ort.InferenceSession.create(bytes,{executionProviders:['webgpu'],graphOptimizationLevel:'all'});backend='WebGPU';}
  catch{/* This device/model may not support the WebGPU execution provider. */}
 }
 if(!session){session=await ort.InferenceSession.create(bytes,{executionProviders:['wasm'],graphOptimizationLevel:'all'});backend='WASM';}
 const canvas=offscreen(640,640),context=canvas.getContext('2d',{willReadFrequently:true});
 const plane=640*640,values=new Float32Array(3*plane);
 const tensor=new ort.Tensor('float32',values,[1,3,640,640]);
 return {backend,run:async(source,width,height)=>{
  const scale=Math.min(640/width,640/height),targetWidth=Math.round(width*scale),targetHeight=Math.round(height*scale);
  const padX=Math.floor((640-targetWidth)/2),padY=Math.floor((640-targetHeight)/2);
  context.fillStyle='#727272';context.fillRect(0,0,640,640);
  context.drawImage(source,padX,padY,targetWidth,targetHeight);
  const pixels=context.getImageData(0,0,640,640).data;
  for(let index=0;index<plane;index++){
   const sourceIndex=index*4;
   values[index]=pixels[sourceIndex]/255;values[plane+index]=pixels[sourceIndex+1]/255;values[2*plane+index]=pixels[sourceIndex+2]/255;
  }
  const result=await session.run({[session.inputNames[0]]:tensor});
  try{return {landmarks:decodeYolo(result[session.outputNames[0]],{width,height,scale,padX,padY})};}
  finally{for(const output of Object.values(result))output.dispose();}
 },dispose:async()=>{tensor.dispose();await session.release();}};
}
const loaders={mediapipe:loadMediaPipe,movenet:loadMoveNet,yolo:loadYolo};

export async function detectPose(model,source,width,height,{detail=true,comparison=false}={}){
 if(!loaders[model])throw new Error('Modèle inconnu.');
 const loadStart=performance.now();
 let loaded=false;
 if(selected!==model||!selectedDetector){
  await selectedDetector?.dispose();selectedDetector=null;selected=model;
  selectedDetector=await loaders[model]();smoothedInferenceMs=0;loaded=true;
 }
 const faceDue=detail&&(comparison||performance.now()-lastFaceAttempt>=300);
 let faceLoaded=false;
 if(faceDue&&!faceUnavailable&&!faceDetector){
  try{faceDetector=await loadFace();faceLoaded=true;}
  catch(error){faceUnavailable=true;faceCache=null;faceError=error.message||'Analyse du visage indisponible.';}
 }
 // Warm-up excludes load and GPU compilation from reported inference timings.
 if(loaded)await selectedDetector.run(source,width,height);
 if(faceLoaded){
  try{faceDetector.run(source);}
  catch(error){faceUnavailable=true;faceCache=null;faceError=error.message||'Analyse du visage indisponible.';}
 }
 const loadMs=performance.now()-loadStart;
 const started=performance.now();
 const result=await selectedDetector.run(source,width,height);
 let faceMs=0;
 if(faceDue&&faceDetector&&!faceUnavailable){
  lastFaceAttempt=performance.now();
  const faceStart=performance.now();
  try{const face=faceDetector.run(source);faceMs=performance.now()-faceStart;faceCache=face?{...face,capturedAt:performance.now(),inferenceMs:faceMs}:null;}
  catch(error){faceCache=null;faceUnavailable=true;faceError=error.message||'Analyse du visage interrompue.';}
 }
 const inferenceMs=performance.now()-started;
 smoothedInferenceMs=smoothedInferenceMs?smoothedInferenceMs*.8+inferenceMs*.2:inferenceMs;
 const ageMs=faceCache?performance.now()-faceCache.capturedAt:Infinity;
 if(ageMs>900)faceCache=null;
 return {...result,face:detail&&faceCache?{...faceCache,ageMs}:null,faceAvailable:Boolean(detail&&faceDetector&&!faceUnavailable),faceError,
  model,width,height,inferenceMs:Math.round(inferenceMs),poseMs:Math.round(inferenceMs-faceMs),loadMs:loaded?Math.round(loadMs):0,
  backend:selectedDetector.backend,recommendedIntervalMs:Math.max(100,Math.min(1500,Math.round(smoothedInferenceMs*1.3)))};
}
export async function releaseModels(){
 await selectedDetector?.dispose();selectedDetector=null;selected=null;
 faceDetector?.dispose();faceDetector=null;faceCache=null;faceUnavailable=false;faceError=null;
}
