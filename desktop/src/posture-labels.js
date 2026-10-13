const labels = {good:'Bonne posture', warning:'Posture moyenne', bad:'À corriger', unknown:'Cadrage à vérifier'};
const regionLabels = {good:'Bonne', warning:'Moyenne', bad:'À corriger', unknown:'Non mesurable'};

export function postureLabel(assessment) {
  if (assessment?.state === 'good' && assessment.coverage !== 'full') return 'Zones visibles alignées';
  return labels[assessment?.state] ?? labels.unknown;
}

export function regionLabel(assessment, key) {
  const state = assessment?.regions?.[key] ?? 'unknown';
  const label = regionLabels[state] ?? regionLabels.unknown;
  return state !== 'unknown' && assessment?.regionCoverage?.[key] === 'partial' ? `${label} · partielle` : label;
}
