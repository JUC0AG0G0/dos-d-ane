import {defineConfig,mergeConfig} from 'vite';
import base from './vite.config.js';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../output/posture-benchmark-full/',import.meta.url));
export default mergeConfig(base,defineConfig({plugins:[{name:'full-benchmark-data',configureServer(server){
 server.middlewares.use('/full-data',async(req,res)=>{
  const name=(req.url??'').split('?')[0].replace(/^\//,'');
  if(!/^(timing-manifest\.json|manifests\/\d{3}\.json|dataset\/\d{5}\.(png|jpg))$/.test(name)){res.statusCode=404;res.end();return;}
  try{res.setHeader('Content-Type',name.endsWith('.json')?'application/json':name.endsWith('.png')?'image/png':'image/jpeg');res.end(await readFile(root+name));}
  catch{res.statusCode=404;res.end();}
 });
}}],server:{port:5175,hmr:false}}));
