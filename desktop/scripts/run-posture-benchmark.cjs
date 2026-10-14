const {app,BrowserWindow}=require('electron');
const fs=require('node:fs/promises');
const path=require('node:path');
const os=require('node:os');
const output=path.resolve(__dirname,'../output/posture-benchmark');
app.setPath('userData',path.join(output,'.electron-profile'));
app.whenReady().then(async()=>{
 await fs.mkdir(output,{recursive:true});
 const win=new BrowserWindow({show:false,width:1280,height:800,webPreferences:{backgroundThrottling:false}});
 win.webContents.on('console-message',(_event,...args)=>{if(String(args).includes('Error'))console.log('Browser:',...args);});
 try{
  await win.loadURL('http://127.0.0.1:5173/benchmark.html');
  await new Promise(resolve=>setTimeout(resolve,3000));
  console.log('READY',await win.webContents.executeJavaScript('window.benchmarkReady'));
  const wait=setInterval(async()=>{try{console.log(JSON.stringify(await win.webContents.executeJavaScript('window.benchmarkProgress')));}catch{}},15000);
  const result=await win.webContents.executeJavaScript('window.runPostureBenchmark({repeats:3})');
  clearInterval(wait);
  result.environment={date:new Date().toISOString(),platform:process.platform,cpu:os.cpus()[0].model,memoryGB:Math.round(os.totalmem()/2**30),versions:process.versions,gpu:await app.getGPUInfo('basic')};
  await fs.writeFile(path.join(output,'raw-results.json'),JSON.stringify(result,null,2));
  console.log('SAVED',result.results.length,'rows');app.exit(0);
 }catch(error){console.error(error);app.exit(1);}
});
