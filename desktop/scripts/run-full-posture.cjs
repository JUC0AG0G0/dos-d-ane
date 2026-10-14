const {app,BrowserWindow}=require('electron');
for(const flag of ['disable-renderer-backgrounding','disable-background-timer-throttling','disable-backgrounding-occluded-windows'])app.commandLine.appendSwitch(flag);
const fs=require('node:fs/promises'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../output/posture-benchmark-full');
const onlyModel=process.argv.find(arg=>arg.startsWith('--model='))?.split('=')[1]||process.env.FULL_MODEL;
if(onlyModel&&!['mediapipe','movenet','yolo'].includes(onlyModel))throw new Error('Invalid FULL_MODEL');
const models=onlyModel?[onlyModel]:['mediapipe','movenet','yolo'];
const total=models.length*52500,statusFile=onlyModel?`run-status-${onlyModel}.json`:'run-status.json';
app.setPath('userData',path.join(root,onlyModel?`.electron-profile-${onlyModel}`:'.electron-profile'));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function exists(p){try{await fs.access(p);return true;}catch{return false;}}
async function atomic(p,data){const temporary=p+'.'+process.pid+'.tmp';await fs.writeFile(temporary,JSON.stringify(data));await fs.rename(temporary,p);}
async function sourceFiles(directory){
 const files=[];
 for(const entry of await fs.readdir(directory,{withFileTypes:true})){
  const file=path.join(directory,entry.name);
  if(entry.isDirectory())files.push(...await sourceFiles(file));
  else if(/\.(js|jsx)$/.test(entry.name))files.push(file);
 }
 return files.sort();
}
app.whenReady().then(async()=>{
 await fs.mkdir(path.join(root,'results'),{recursive:true});
 const started=Date.now();let done=0;
 const win=new BrowserWindow({show:false,width:1280,height:720,webPreferences:{backgroundThrottling:false}});
 try{
  const desktop=path.resolve(__dirname,'..'),codeHashes={};
  for(const file of [...await sourceFiles(path.join(desktop,'src')),path.join(desktop,'package-lock.json')]){
   codeHashes[path.relative(desktop,file).split(path.sep).join('/')]=crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex');
  }
  const modelHashes={};
  for(const name of ['pose_landmarker_lite.task','face_landmarker.task','yolov8n-pose.onnx']){
   modelHashes[name]=crypto.createHash('sha256').update(await fs.readFile(path.join(desktop,'public','models',name))).digest('hex');
  }
  if(!await exists(path.join(root,'model-hashes.json')))await atomic(path.join(root,'model-hashes.json'),modelHashes);
  const meta={started:new Date().toISOString(),cpu:os.cpus()[0].model,versions:process.versions,protocol:{repeats:1,inputMax:640,imageMode:true,faceShared:true,orderedModels:['mediapipe','movenet','yolo'],source:'Original image bytes from pinned Parquet dataset; pilot used JPEG previews'},codeHashes};
  if(!await exists(path.join(root,'run-metadata.json')))await atomic(path.join(root,'run-metadata.json'),meta);
  for(const model of models){
   await win.loadURL('http://127.0.0.1:5175/benchmark.html');await sleep(3000);
   for(let shard=0;shard<136;shard++){
    const stem=String(shard).padStart(3,'0'),target=path.join(root,'results',`${model}-${stem}.json`);
    if(await exists(target)){const saved=JSON.parse(await fs.readFile(target,'utf8'));done+=saved.results.length;continue;}
    while(!await exists(path.join(root,'manifests',stem+'.json'))){await atomic(path.join(root,statusFile),{phase:'waiting-for-data',model,shard,done,total});await sleep(15000);}
    await atomic(path.join(root,statusFile),{phase:'running',model,shard,done,total,elapsedSeconds:Math.round((Date.now()-started)/1000)});
    const result=await win.webContents.executeJavaScript(`window.runPostureBenchmark(${JSON.stringify({manifestURL:`/full-data/manifests/${stem}.json`,dataPrefix:'/full-data/dataset/',models:[model],repeats:1,retainModels:true,preloadImages:4})})`);
    const errors=result.results.filter(r=>r.error);
    if(errors.length===result.results.length)throw new Error(`All rows failed in ${model}/${stem}: ${errors[0]?.error}`);
    await atomic(target,result);done+=result.results.length;
    console.log(JSON.stringify({model,shard,done,total,errors:errors.length}));
   }
  }
  await atomic(path.join(root,statusFile),{phase:'complete',done,total,finished:new Date().toISOString(),elapsedSeconds:Math.round((Date.now()-started)/1000)});app.exit(0);
 }catch(error){await atomic(path.join(root,statusFile),{phase:'failed',done,error:String(error.stack)});console.error(error);app.exit(1);}
});
