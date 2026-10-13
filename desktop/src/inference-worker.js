import {detectPose,configureModelAssets} from './models.js';

let busy=false;
self.onmessage=async({data})=>{
 const {id,model,bitmap,detail,comparison,baseURL}=data;
 if(busy){bitmap?.close();self.postMessage({id,error:{name:'InferenceBusyError',message:'Analyse déjà en cours.'}});return;}
 busy=true;
 try{
  configureModelAssets(baseURL);
  const frame=await detectPose(model,bitmap,bitmap.width,bitmap.height,{detail,comparison});
  self.postMessage({id,frame});
 }catch(error){self.postMessage({id,error:{name:error.name,message:error.message}});}
 finally{bitmap?.close();busy=false;}
};
