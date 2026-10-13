import test from 'node:test';
import assert from 'node:assert/strict';
import {detectPose,releaseModels} from '../src/inference-client.js';

test('inference transfers one latest snapshot and releases pending work',async t=>{
 const original={Worker:globalThis.Worker,document:globalThis.document,createImageBitmap:globalThis.createImageBitmap};
 const workers=[],snapshots=[];
 class FakeWorker{
  constructor(){this.messages=[];workers.push(this);}
  postMessage(message,transfers){this.messages.push({message,transfers});}
  terminate(){this.terminated=true;}
  finish(frame={landmarks:[]}){this.onmessage({data:{id:this.messages.at(-1).message.id,frame}});}
 }
 globalThis.Worker=FakeWorker;
 globalThis.document={baseURI:'https://local.test/index.html'};
 globalThis.createImageBitmap=async(source,options)=>{const bitmap={source,options,close(){this.closed=true;}};snapshots.push(bitmap);return bitmap;};
 const tick=()=>new Promise(resolve=>setImmediate(resolve));
 try{
  await t.test('a concurrent caller snapshots only after the in-flight result',async()=>{
   const first=detectPose('mediapipe',{name:'live'},1920,1080);
   await tick();
   const second=detectPose('movenet',{name:'latest'},1920,1080);
   await tick();
   assert.equal(snapshots.length,1);
   assert.equal(snapshots[0].options.resizeWidth,480);
   assert.equal(workers[0].messages.length,1);
   assert.equal(workers[0].messages[0].transfers[0],snapshots[0]);
   workers[0].finish({model:'mediapipe'});
   assert.equal((await first).model,'mediapipe');
   await tick();
   assert.equal(snapshots.length,2);
   assert.equal(workers[0].messages.length,2);
   workers[0].finish({model:'movenet'});
   assert.equal((await second).model,'movenet');
  });
  await t.test('stopping cancels both the in-flight and waiting inference',async()=>{
   const first=detectPose('yolo',{},1280,720);
   await tick();
   const second=detectPose('mediapipe',{},1280,720);
   const results=Promise.allSettled([first,second]);
   const count=snapshots.length;
   releaseModels();
   const settled=await results;
   assert.ok(settled.every(result=>result.status==='rejected'&&result.reason.name==='AbortError'));
   assert.equal(workers[0].terminated,true);
   assert.equal(snapshots.length,count);
  });
  await t.test('a fresh session creates a fresh worker and preserves comparison options',async()=>{
   const promise=detectPose('mediapipe',{},640,480,{detail:true,comparison:true});
   await tick();
   assert.equal(workers.length,2);
   assert.equal(workers[1].messages[0].message.comparison,true);
   workers[1].finish({model:'mediapipe'});
   await promise;
  });
 }finally{
  releaseModels();
  for(const [name,value] of Object.entries(original)){if(value===undefined)delete globalThis[name];else globalThis[name]=value;}
 }
});
