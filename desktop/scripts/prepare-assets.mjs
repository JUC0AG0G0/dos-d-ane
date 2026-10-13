import { copyFile, mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const copyIfPresent=async(source,destination)=>{
  try{await stat(source);await mkdir(dirname(destination),{recursive:true});await copyFile(source,destination);return true;}
  catch(error){if(error.code==='ENOENT')return false;throw error;}
};
const tasksWasm=join(root,'node_modules','@mediapipe','tasks-vision','wasm');
for(const name of await readdir(tasksWasm)){
  if(name.endsWith('.wasm')||name.endsWith('.js'))await copyIfPresent(join(tasksWasm,name),join(root,'public','wasm','mediapipe',name));
  if(name.endsWith('.js')){
    const loader=await readFile(join(tasksWasm,name),'utf8');
    // The classic loader relies on Annex B function hoisting for its logger.
    // Provide the logger explicitly when executing it as a strict ES module.
    await writeFile(join(root,'public','wasm','mediapipe',name.replace(/\.js$/,'.mjs')),`var custom_dbg = (...args) => console.warn(...args);\n${loader}\nexport default ModuleFactory;\n`);
  }
}
const ortDir=join(root,'node_modules','onnxruntime-web','dist');
for(const name of await readdir(ortDir)){
  if(name.startsWith('ort-wasm')&&(name.endsWith('.wasm')||name.endsWith('.mjs')))await copyIfPresent(join(ortDir,name),join(root,'public','wasm','onnx',name));
}
const poseSource=resolve(root,'..','models','pose_landmarker_lite.task');
const poseTarget=join(root,'public','models','pose_landmarker_lite.task');
const poseHash='59929e1d1ee95287735ddd833b19cf4ac46d29bc7afddbbf6753c459690d574a';
async function hashFile(path){
  const hash=createHash('sha256');
  for await(const chunk of createReadStream(path))hash.update(chunk);
  return hash.digest('hex');
}
if((await stat(poseTarget).catch(()=>null))&&(await hashFile(poseTarget))===poseHash){
  console.log('MediaPipe pose model already verified.');
}else if((await stat(poseSource).catch(()=>null))&&(await hashFile(poseSource))===poseHash){
  await copyIfPresent(poseSource,poseTarget);
}else{
  const response=await fetch('https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task');
  if(!response.ok)throw new Error(`MediaPipe model download failed (${response.status})`);
  const bytes=new Uint8Array(await response.arrayBuffer());
  if(createHash('sha256').update(bytes).digest('hex')!==poseHash)throw new Error('MediaPipe model SHA-256 mismatch.');
  await mkdir(dirname(poseTarget),{recursive:true});
  await writeFile(poseTarget,bytes);
}
const faceSource=resolve(root,'..','models','face_landmarker.task');
const faceTarget=join(root,'public','models','face_landmarker.task');
const faceHash='64184e229b263107bc2b804c6625db1341ff2bb731874b0bcc2fe6544e0bc9ff';
if((await stat(faceTarget).catch(()=>null))&&(await hashFile(faceTarget))===faceHash){
  console.log('MediaPipe face model already verified.');
}else if((await stat(faceSource).catch(()=>null))&&(await hashFile(faceSource))===faceHash){
  await copyIfPresent(faceSource,faceTarget);
}else{
  const response=await fetch('https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task');
  if(!response.ok)throw new Error(`MediaPipe face model download failed (${response.status})`);
  const bytes=new Uint8Array(await response.arrayBuffer());
  if(createHash('sha256').update(bytes).digest('hex')!==faceHash)throw new Error('MediaPipe face model SHA-256 mismatch.');
  await mkdir(dirname(faceTarget),{recursive:true});
  await writeFile(faceTarget,bytes);
}
console.log('Desktop model assets prepared.');
for(const name of ['rive.wasm','rive_fallback.wasm'])await copyIfPresent(join(root,'node_modules','@rive-app','canvas',name),join(root,'public','wasm','rive',name));
