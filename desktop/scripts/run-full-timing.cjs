const {app,BrowserWindow}=require('electron');
const fs=require('node:fs/promises'),path=require('node:path');
const root=path.resolve(__dirname,'../../output/posture-benchmark-full');
app.setPath('userData',path.join(root,'.electron-profile-timing'));
app.whenReady().then(async()=>{
 const win=new BrowserWindow({show:false,width:1280,height:720,webPreferences:{backgroundThrottling:false}});
 try{
  const status=JSON.parse(await fs.readFile(path.join(root,'run-status.json'),'utf8'));
  if(status.phase!=='complete'||status.done!==157500)throw Error('Exhaustive inference not complete');
  await win.loadURL('http://127.0.0.1:5175/benchmark.html');
  await new Promise(r=>setTimeout(r,3000));
  const result=await win.webContents.executeJavaScript(`window.runPostureBenchmark(${JSON.stringify({manifestURL:'/full-data/timing-manifest.json',dataPrefix:'/full-data/dataset/',models:['mediapipe','movenet','yolo'],repeats:3})})`);
  if(result.results.length!==360||result.results.some(r=>r.error))throw Error('Incomplete timing run');
  await fs.writeFile(path.join(root,'timing-results.json'),JSON.stringify(result));
  console.log('Sequential timing completed: 120 images, 3 models, 3 repetitions.');app.exit(0);
 }catch(error){console.error(error);app.exit(1);}
});
