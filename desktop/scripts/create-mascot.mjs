// Original vector artwork. Regenerate scene.rml, then compile with the Rive CLI.
import {writeFile} from 'node:fs/promises';
const ink='FF244C40',coat='FF86B99D',light='FFDCECDD',mane='FF41675A',pink='FFDDAF9F';
function shape(name,x,y,w,h,color,{rect=false,rotation=0,id='',radius=8}={}){
  return `<Shape name="${name}" x="${x}" y="${y}" rotation="${rotation}" ${id?`id="0:${id}"`:''}><${rect?'Rectangle':'Ellipse'} width="${w}" height="${h}" originX="0.5" originY="0.5" ${rect?`cornerRadiusTL="${radius}"`:''}/><Fill><SolidColor colorValue="${color}"/></Fill></Shape>`;
}
function key(id,property,value){return `<KeyedObject objectId="0:${id}"><KeyedProperty propertyKey="${property}"><KeyFrameDouble value="${value}"/></KeyedProperty></KeyedObject>`;}
const animations=[[60,'Droit',0,0,-49,0],[61,'Penche',.23,5,-46,.15],[62,'Courbe',.51,12,-39,.3]].map(([id,name,rotation,x,y,head])=>`<LinearAnimation name="${name}" id="0:${id}" duration="240" loopValue="loop">${key(20,15,rotation)}${key(20,13,x)}${key(20,14,y)}${key(21,15,head)}<KeyedObject objectId="0:25"><KeyedProperty propertyKey="17"><KeyFrameDouble value="1"/><KeyFrameDouble value="1" frame="205"/><KeyFrameDouble value="0.12" frame="211"/><KeyFrameDouble value="1" frame="218"/><KeyFrameDouble value="1" frame="240"/></KeyedProperty></KeyedObject></LinearAnimation>`).join('\n');
const scene=`<Rive version="1" kind="fragment">
<Artboard name="Ane" id="0:2" width="240" height="240" styleId="0:3" defaultStateMachineId="0:7" viewModelId="0:40" viewModelInstanceId="0:41">
  <LayoutComponentStyle name="Artboard Style" id="0:3"/>
  <Node name="Assis" x="96" y="171">
    <Node name="Haut du dos" id="0:20" y="-49">
      <Node name="Tete" id="0:21" x="1" y="-36">
        ${shape('Reflet',16,-11,3,4,'FFFFFFFF')}
        ${shape('Oeil',15,-9,7,10,ink,{id:25})}
        ${shape('Narine',40,8,4,5,mane,{rotation:-.3})}
        ${shape('Sourire',32,18,14,3,mane,{rect:true,rotation:.08,radius:2})}
        ${shape('Joue',6,7,10,7,pink)}
        ${shape('Museau',28,11,43,29,light,{rotation:-.15})}
        ${shape('Visage',0,0,49,61,coat,{rotation:-.17})}
        ${shape('Oreille proche interieur',-5,-43,7,31,pink,{rotation:-.14})}
        ${shape('Oreille proche',-5,-42,14,48,coat,{rotation:-.14})}
        ${shape('Oreille loin',-22,-39,12,44,mane,{rotation:-.32})}
        ${shape('Criniere',-22,-3,14,42,mane,{rotation:-.2})}
      </Node>
      ${shape('Patte avant',25,19,13,49,coat,{rect:true,rotation:-.64,radius:7})}
      ${shape('Petit sabot',39,37,19,11,ink,{rect:true,rotation:-.15,radius:5})}
      ${shape('Ventre',17,16,22,51,light,{rotation:.1})}
      ${shape('Poitrine',4,10,53,81,coat,{rotation:.1})}
      ${shape('Dos',-18,7,13,60,mane,{rotation:.06})}
    </Node>
    ${shape('Cuisse',15,1,64,32,coat,{rotation:.03})}
    ${shape('Jambe',42,28,16,51,coat,{rect:true,rotation:.08,radius:8})}
    ${shape('Sabot',51,51,33,14,ink,{rect:true,radius:6})}
    ${shape('Queue',-32,4,32,10,mane,{rect:true,rotation:.4,radius:5})}
    ${shape('Queue bout',-46,-2,16,13,ink,{rotation:.4})}
  </Node>
  ${shape('Assise',106,188,95,9,'FFA9C5B4',{rect:true,radius:4})}
  ${shape('Pied chaise',85,209,7,39,'FFA9C5B4',{rect:true,radius:3})}
  ${shape('Pied chaise droit',138,208,7,37,'FFA9C5B4',{rect:true,radius:3})}
  ${shape('Ombre',118,231,141,9,'1C41675A')}
  <StateMachine name="Posture" id="0:7"><StateMachineLayer name="Posture" id="0:8">
    <AnyState x="400" y="-100"/><ExitState x="600" y="-100"/>
    <EntryState x="0" y="0"><StateTransition stateToId="0:50"/></EntryState>
    <BlendState1DViewModel id="0:50" x="200" y="0"><BindablePropertyNumber><DataBindContext sourcePathIds="0:40-0:45" propertyKey="636"/></BindablePropertyNumber><BlendAnimation1D animationId="0:60" value="0"/><BlendAnimation1D animationId="0:61" value="50"/><BlendAnimation1D animationId="0:62" value="100"/></BlendState1DViewModel>
  </StateMachineLayer></StateMachine>
  ${animations}
</Artboard>
<ViewModel name="Posture" id="0:40" defaultInstanceId="0:41"><ViewModelPropertyNumber name="bend" id="0:45"/><ViewModelInstance exports="true" name="Default" id="0:41"><ViewModelInstanceNumber propertyValue="0" viewModelPropertyId="0:45"/></ViewModelInstance></ViewModel>
</Rive>`;
await writeFile(new URL('../mascot-rive/scene.rml',import.meta.url),scene);
