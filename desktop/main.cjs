const {app,BrowserWindow,ipcMain,screen,Notification,protocol,net,Tray,Menu} = require('electron');
const path = require('node:path');
const fs = require('node:fs/promises');
const {pathToFileURL} = require('node:url');

protocol.registerSchemesAsPrivileged([
  {scheme:'dosdane',privileges:{standard:true,secure:true,supportFetchAPI:true}}
]);
if(process.argv.includes('--smoke-models')){
  app.commandLine.appendSwitch('use-fake-device-for-media-stream');
  app.commandLine.appendSwitch('use-fake-ui-for-media-stream');
}

let win;
let tray;
let quitting=false;
function showWindow(){if(!win||win.isDestroyed())createWindow();else{win.show();win.focus();}}
let isExpanded=false;
const SIZE={compact:{width:430,height:138},expanded:{width:430,height:704}};
const trusted=event=>win&&!win.isDestroyed()&&event.sender===win.webContents;

function place(expanded){
  if(!win||win.isDestroyed())return;
  const bounds=win.getBounds();
  const display=screen.getDisplayNearestPoint({x:bounds.x+bounds.width/2,y:bounds.y+bounds.height/2});
  const {x,y,width,height}=display.workArea;
  const desired=expanded?SIZE.expanded:SIZE.compact;
  const actualWidth=Math.min(desired.width,width-24),actualHeight=Math.min(desired.height,height-24);
  win.setBounds({x:x+width-actualWidth-16,y:y+height-actualHeight-16,width:actualWidth,height:actualHeight});
}
function createWindow(){
  win=new BrowserWindow({
    ...SIZE.compact,frame:false,transparent:true,hasShadow:false,resizable:false,
    alwaysOnTop:true,show:false,backgroundColor:'#00000000',
    webPreferences:{preload:path.join(__dirname,'preload.cjs'),contextIsolation:true,nodeIntegration:false,sandbox:true,webSecurity:true,backgroundThrottling:false}
  });
  isExpanded=false;
  if(process.argv.includes('--smoke'))win.setIgnoreMouseEvents(true);
  place(false);
  win.once('ready-to-show',()=>win.show());
  win.on('close',event=>{if(!quitting){event.preventDefault();win.hide();}});
  win.on('hide',()=>win.webContents.send('window:visibility',false));
  win.on('show',()=>win.webContents.send('window:visibility',true));
  const dev=process.argv.includes('--dev');
  if(dev)win.loadURL('http://127.0.0.1:5173');
  else win.loadURL('dosdane://bundle/index.html');
  win.webContents.setWindowOpenHandler(()=>({action:'deny'}));
  win.webContents.on('will-navigate',(event,url)=>{
    if(!url.startsWith('http://127.0.0.1:5173/')&&!url.startsWith('dosdane://bundle/'))event.preventDefault();
  });
}

app.whenReady().then(()=>{
  const distRoot=path.join(__dirname,'dist');
  protocol.handle('dosdane',async request=>{
    const url=new URL(request.url);
    if(url.hostname!=='bundle'||(request.method!=='GET'&&request.method!=='HEAD'))return new Response('Forbidden',{status:403});
    const target=path.resolve(distRoot,'.'+decodeURIComponent(url.pathname));
    const relative=path.relative(distRoot,target);
    if(relative.startsWith('..')||path.isAbsolute(relative))return new Response('Forbidden',{status:403});
    const response=await net.fetch(pathToFileURL(target).toString());
    const headers=new Headers(response.headers);
    headers.set('Cross-Origin-Opener-Policy','same-origin');
    headers.set('Cross-Origin-Embedder-Policy','require-corp');
    headers.set('Cross-Origin-Resource-Policy','same-origin');
    return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
  });
  const mediaAllowed=(contents,permission)=>permission==='media'&&contents===win?.webContents;
  const ses=require('electron').session.defaultSession;
  ses.setPermissionCheckHandler((contents,permission)=>mediaAllowed(contents,permission));
  ses.setPermissionRequestHandler((contents,permission,callback,details)=>{
    callback(Boolean(mediaAllowed(contents,permission)&&details.mediaTypes?.includes('video')&&!details.mediaTypes?.includes('audio')));
  });
  ipcMain.handle('window:resize',(event,expanded)=>{if(trusted(event)){isExpanded=expanded===true;place(isExpanded);return true;}return false;});
  ipcMain.handle('window:close',event=>{if(trusted(event)){win.close();return true;}return false;});
  ipcMain.handle('window:visible',event=>trusted(event)&&win.isVisible());
  ipcMain.handle('notice:show',(event,title,body)=>{
    if(!trusted(event)||typeof title!=='string'||typeof body!=='string')return false;
    if(Notification.isSupported()){const notice=new Notification({title:title.slice(0,80),body:body.slice(0,240)});notice.on('click',showWindow);notice.show();}
    return true;
  });
  createWindow();
  tray=new Tray(path.join(__dirname,'assets','icon.ico'));
  tray.setToolTip('Dos d’âne · suivi de posture');
  tray.setContextMenu(Menu.buildFromTemplate([
    {label:'Ouvrir Dos d’âne',click:showWindow},
    {type:'separator'},
    {label:'Quitter et arrêter la caméra',click:()=>app.quit()}
  ]));
  tray.on('click',showWindow);
  if(process.argv.includes('--smoke')){
    win.webContents.once('did-finish-load',async()=>{
      try{
        const smokeRoot=app.isPackaged?app.getPath('temp'):__dirname;
        await new Promise(resolve=>setTimeout(resolve,700));
        const result=await win.webContents.executeJavaScript(`(async()=>({
          rendered: !!document.querySelector('.shell') && document.body.textContent.includes('Démarrer'),
          mediaPipe: (await fetch('./models/pose_landmarker_lite.task')).ok,
          yolo: (await fetch('./models/yolov8n-pose.onnx')).ok,
          face: (await fetch('./models/face_landmarker.task')).ok,
          wasm: (await fetch('./wasm/mediapipe/vision_wasm_internal.wasm')).ok
        }))()`);
        await fs.writeFile(path.join(smokeRoot,'dosdane-smoke.png'),(await win.webContents.capturePage()).toPNG());
        await win.webContents.executeJavaScript("document.querySelector('.window-button').click()");
        await new Promise(resolve=>setTimeout(resolve,250));
        result.expanded=await win.webContents.executeJavaScript("!!document.querySelector('.shell.expanded #model') && document.querySelectorAll('#model option').length === 3");
        result.noDegrees=await win.webContents.executeJavaScript("!document.body.textContent.includes('°')");
        result.neckRow=await win.webContents.executeJavaScript("[...document.querySelectorAll('.region-row > span')].some(row=>row.textContent==='Nuque')");
        result.isolated=await win.webContents.executeJavaScript("window.crossOriginIsolated");
        result.mascot=await win.webContents.executeJavaScript("document.querySelector('.mascot')?.dataset.ready==='true'");
        await fs.writeFile(path.join(smokeRoot,'dosdane-smoke-expanded.png'),(await win.webContents.capturePage()).toPNG());
        if(process.argv.includes('--smoke-models')){
          await win.webContents.executeJavaScript("window.__smokeHeartbeat={at:performance.now(),gaps:[]};window.__smokeTimer=setInterval(()=>{const now=performance.now();window.__smokeHeartbeat.gaps.push(now-window.__smokeHeartbeat.at);window.__smokeHeartbeat.at=now},20)");
          await win.webContents.executeJavaScript("document.querySelector('.start').click()");
          await new Promise(resolve=>setTimeout(resolve,2500));
          await win.webContents.executeJavaScript("document.querySelector('.comparison-heading button').click()");
          for(let i=0;i<60;i++){
            await new Promise(resolve=>setTimeout(resolve,1000));
            const rows=await win.webContents.executeJavaScript("[...document.querySelectorAll('.comparison-item')].map(row=>({name:row.querySelector('strong')?.textContent,details:[...row.querySelectorAll('small')].map(node=>node.textContent).join(' / '),status:row.querySelector('span')?.textContent,face:row.dataset.faceAvailable,backend:row.dataset.backend}))");
            if(rows.length===3){result.models=rows;break;}
          }
          result.detectors=result.models?.length===3&&result.models.every(row=>row.status!=='Indisponible'&&row.face==='true');
          result.regions=await win.webContents.executeJavaScript("[...document.querySelectorAll('.region-row')].map(row=>({name:row.dataset.region,scope:row.dataset.scope,state:row.querySelector('strong').className,label:row.querySelector('strong').textContent,description:row.querySelector('small')?.textContent}))");
          result.uiTimer=await win.webContents.executeJavaScript("(()=>{clearInterval(window.__smokeTimer);const gaps=window.__smokeHeartbeat.gaps.sort((a,b)=>a-b);return {samples:gaps.length,maxMs:Math.round(gaps.at(-1)||0),p95Ms:Math.round(gaps[Math.floor(gaps.length*.95)]||0)}})()");
          await new Promise(resolve=>setTimeout(resolve,2000));
          const beforeHide=await win.webContents.executeJavaScript("Number(document.querySelector('.shell').dataset.observedAt)");
          await win.webContents.executeJavaScript("document.querySelector('.close-button').click()");
          await new Promise(resolve=>setTimeout(resolve,1800));
          result.hiddenSession=!win.isVisible()&&await win.webContents.executeJavaScript(`document.querySelector('video').srcObject?.active===true && Number(document.querySelector('.shell').dataset.observedAt)>${beforeHide}`);
          showWindow();
          result.trayRestore=win.isVisible()&&!tray.isDestroyed();
          await new Promise(resolve=>setTimeout(resolve,300));
          await fs.writeFile(path.join(smokeRoot,'dosdane-smoke-live.png'),(await win.webContents.capturePage()).toPNG());
          await win.webContents.executeJavaScript("document.querySelector('.small-action').click()");
          await new Promise(resolve=>setTimeout(resolve,200));
          const paused=await win.webContents.executeJavaScript("document.querySelector('video').srcObject===null && document.querySelector('.small-action').textContent==='Reprendre'");
          await win.webContents.executeJavaScript("document.querySelector('.small-action').click()");
          await new Promise(resolve=>setTimeout(resolve,800));
          result.pauseResume=paused&&await win.webContents.executeJavaScript("document.querySelector('video').srcObject?.active===true && document.querySelector('.small-action').textContent==='Pause'");
          await win.webContents.executeJavaScript("document.querySelector('.stop').click()");
          await new Promise(resolve=>setTimeout(resolve,200));
          result.cameraStopped=await win.webContents.executeJavaScript("document.querySelector('video').srcObject===null && !!document.querySelector('.start')");
        }
        console.log('Electron smoke:',JSON.stringify(result));
        await fs.writeFile(path.join(smokeRoot,'dosdane-smoke.json'),JSON.stringify(result,null,2));
        const checks=['rendered','mediaPipe','yolo','face','wasm','expanded','noDegrees','neckRow','mascot'];
        if(process.argv.includes('--smoke-models'))checks.push('detectors','pauseResume','cameraStopped','hiddenSession','trayRestore');
        app.exit(checks.every(key=>result[key]===true)?0:1);
      }catch(error){console.error('Electron smoke failed:',error);console.error(await win.webContents.executeJavaScript('document.body.innerText'));app.exit(1);}
    });
  }
  screen.on('display-metrics-changed',()=>place(isExpanded));
  app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});
});
app.on('before-quit',()=>{quitting=true;});
app.on('window-all-closed',()=>{if(quitting)app.quit();});
