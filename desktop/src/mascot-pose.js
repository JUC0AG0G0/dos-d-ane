const clamp=(value)=>Math.max(0,Math.min(100,value));
export function mascotPose(assessment,active=true){
  if(!active||!assessment||assessment.state==='unknown')return {bend:0,tracked:false,caption:active?'En attente du suivi':'Au repos'};
  const m=assessment.metrics??{};
  // A sideways tilt or uneven shoulders must not be drawn as forward slouching.
  const pitch=Number.isFinite(m.headPitch)?clamp((m.headPitch-8)*2.6):0;
  const forward=Number.isFinite(m.neckForward)?clamp(m.neckForward/(m.neckSource==='world'?.45:.75)*100):0;
  const bend=Math.max(pitch,forward);
  return {bend,tracked:true,caption:bend>65?'Tête penchée / avancée':bend>25?'Légère inclinaison':assessment.regions?.shoulders==='bad'?'Épaules à rééquilibrer':assessment.coverage==='full'?'Bien aligné':'Alignement visible'};
}
