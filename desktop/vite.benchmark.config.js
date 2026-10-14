import {defineConfig,mergeConfig} from 'vite';
import base from './vite.config.js';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const directory=fileURLToPath(new URL('./output/posture-benchmark/dataset/',import.meta.url));
export default mergeConfig(base,defineConfig({plugins:[{
 name:'local-benchmark-data',
 configureServer(server){server.middlewares.use('/benchmark-data',async(req,res,next)=>{
  const name=(req.url??'').split('?')[0].replace(/^\//,'');
  if(!/^(manifest\.json|\d{5}\.jpg)$/.test(name)){res.statusCode=404;res.end();return;}
  try{const bytes=await readFile(directory+name);res.setHeader('Content-Type',name.endsWith('.json')?'application/json':'image/jpeg');res.end(bytes);}
  catch{res.statusCode=404;res.end('Benchmark data not found');}
 });}
}],server:{hmr:false}}));
