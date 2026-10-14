import { createHash } from 'node:crypto';
import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, rename, rm, stat } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const target=join(root,'public','models','yolov8n-pose.onnx');
const temp=target+'.download';
const expected='04f6d2416266f2aba6c5ba8b26de33ed9eba3279f972ac02e33f9f1366547586';
const source='https://huggingface.co/Xenova/yolov8-pose-onnx/resolve/main/yolov8n-pose.onnx';
async function sha256(path){
  const hash=createHash('sha256');
  for await(const chunk of createReadStream(path))hash.update(chunk);
  return hash.digest('hex');
}
await mkdir(dirname(target),{recursive:true});
try{
  const existing=await stat(target).catch(()=>null);
  if(existing?.size>1000000&&(await sha256(target))===expected){console.log('YOLO Pose ONNX model already verified.');process.exit(0);}
  const response=await fetch(source,{redirect:'follow'});
  if(!response.ok||!response.body)throw new Error(`Model download failed (${response.status})`);
  await pipeline(Readable.fromWeb(response.body),createWriteStream(temp));
  if((await sha256(temp))!==expected)throw new Error('Model SHA-256 does not match published value.');
  await rename(temp,target);
  console.log(`YOLO Pose model verified: ${target}`);
}catch(error){await rm(temp,{force:true});console.error(error.message);process.exitCode=1;}
