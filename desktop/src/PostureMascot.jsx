import {useEffect,useRef,useState} from 'react';
import {Rive,RuntimeLoader,Layout,Fit,Alignment} from '@rive-app/canvas';
import {mascotPose} from './mascot-pose.js';
RuntimeLoader.setWasmUrl(new URL('./wasm/rive/rive.wasm',document.baseURI).href);
RuntimeLoader.setWasmFallbackUrl(new URL('./wasm/rive/rive_fallback.wasm',document.baseURI).href);

export default function PostureMascot({assessment,active,visible}){
  const canvas=useRef(null),instance=useRef(null),current=useRef(0);
  const [ready,setReady]=useState(false),[failed,setFailed]=useState(false);
  const pose=mascotPose(assessment,active);
  useEffect(()=>{
    let disposed=false;
    const rive=new Rive({src:new URL('./mascot/ane.riv',document.baseURI).href,canvas:canvas.current,stateMachines:'Posture',autoBind:true,autoplay:true,
      layout:new Layout({fit:Fit.Contain,alignment:Alignment.Center}),
      onLoad:()=>{if(disposed)return;rive.resizeDrawingSurfaceToCanvas(Math.min(2,window.devicePixelRatio||1));setReady(true);},
      onLoadError:()=>{if(!disposed)setFailed(true);}
    });
    instance.current=rive;
    const observer=new ResizeObserver(()=>{if(!disposed)rive.resizeDrawingSurfaceToCanvas(Math.min(2,window.devicePixelRatio||1));});
    observer.observe(canvas.current);
    return()=>{disposed=true;observer.disconnect();rive.cleanup();instance.current=null;};
  },[]);
  useEffect(()=>{
    if(!ready)return;
    const rive=instance.current,input=rive.viewModelInstance?.number('bend');
    if(!input){setFailed(true);return;}
    if(!visible){rive.stopRendering();return;}
    rive.startRendering();
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const from=current.current,start=performance.now();let frame,stopTimer;
    const tick=now=>{
      const progress=reduced?1:Math.min(1,(now-start)/320);
      current.current=from+(pose.bend-from)*(1-Math.pow(1-progress,3));input.value=current.current;
      if(progress<1)frame=requestAnimationFrame(tick);
      else if(reduced||!active){stopTimer=setTimeout(()=>{if(instance.current===rive)rive.stopRendering();},50);}
    };
    frame=requestAnimationFrame(tick);
    return()=>{cancelAnimationFrame(frame);clearTimeout(stopTimer);};
  },[ready,pose.bend,visible,active]);
  return <figure className={`mascot ${pose.tracked?'tracked':'resting'}`} data-ready={ready&&!failed} data-bend={Math.round(pose.bend)} title="Représentation simplifiée de votre posture">
    <canvas ref={canvas} aria-label={`Petit âne : ${pose.caption}`} role="img"/>
    <figcaption>{failed?'Mascotte indisponible':pose.caption}</figcaption>
  </figure>;
}
