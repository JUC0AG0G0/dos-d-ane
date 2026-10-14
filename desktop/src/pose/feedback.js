export const rank = { unknown: -1, good: 0, warning: 1, bad: 2 };
export const regionKeys = ['head', 'neck', 'shoulders', 'torso'];
export const worst = (...states) =>
  states.reduce((a, b) => (rank[a] >= rank[b] ? a : b), 'unknown');
export const stateFor = (value, warning, bad) =>
  value >= bad ? 'bad' : value >= warning ? 'warning' : 'good';

export function regionDescriptions(regions, coverage, metrics, view) {
  const descriptions = {
    head:
      regions.head === 'unknown'
        ? view === 'profile'
          ? 'La rotation précise de la tête reste non mesurable dans cette vue.'
          : 'Visage insuffisamment visible.'
        : regions.head === 'good'
          ? 'Tête bien alignée dans les mouvements observables.'
          : metrics.headPitch !== null && Math.abs(metrics.headPitch) >= 20
            ? 'Votre tête paraît penchée vers le bas ou vers le haut.'
            : 'Votre tête paraît inclinée sur le côté.',
    neck:
      regions.neck === 'unknown'
        ? 'Gardez la tête et les épaules visibles pour analyser la nuque.'
        : regions.neck === 'good'
          ? coverage.neckForward
            ? 'La tête paraît alignée au-dessus des épaules.'
            : 'La tête paraît centrée entre les épaules dans cette vue.'
          : metrics.neckForward !== null &&
              metrics.neckForward >=
                (metrics.neckSource === 'world' ? 0.2 : 0.32)
            ? 'Votre tête paraît avancée par rapport aux épaules.'
            : 'Votre nuque paraît décalée sur le côté.',
    shoulders:
      regions.shoulders === 'unknown'
        ? 'Les deux épaules ne sont pas assez visibles de face.'
        : regions.shoulders === 'good'
          ? 'Épaules sensiblement au même niveau.'
          : 'Vos épaules paraissent déséquilibrées.',
    torso:
      regions.torso === 'unknown'
        ? 'Gardez le buste et les hanches dans le cadre pour les analyser.'
        : regions.torso === 'good'
          ? 'Buste sensiblement droit.'
          : view === 'profile'
            ? 'Votre buste paraît penché vers l’avant ou l’arrière.'
            : 'Votre buste paraît incliné sur le côté.'
  };
  if (regions.neck !== 'unknown' && !coverage.neckForward)
    descriptions.neck +=
      ' Alignement de face ; avancée de la tête non mesurée.';
  if (regions.head !== 'unknown' && !coverage.headPitch)
    descriptions.head += ' Le regard vers le bas reste non mesurable.';
  return descriptions;
}

export function regionCoverageFor(coverage) {
  const scope = (a, b) =>
    a && b ? 'full' : a || b ? 'partial' : 'insufficient';
  return {
    head: scope(coverage.headRoll, coverage.headPitch),
    neck: scope(coverage.neckLateral, coverage.neckForward),
    shoulders: coverage.shoulderLevel ? 'full' : 'insufficient',
    torso: coverage.torsoLean ? 'full' : 'insufficient'
  };
}

export function overallReason(regions, descriptions, coverage) {
  const state = worst(...Object.values(regions));
  if (state === 'unknown')
    return 'Gardez votre tête et vos épaules dans le cadre.';
  const key = ['neck', 'head', 'torso', 'shoulders'].find(
    (k) => regions[k] === state && state !== 'good'
  );
  return key
    ? descriptions[key]
    : coverage === 'full'
      ? 'Votre posture paraît bien alignée.'
      : 'Les zones visibles paraissent bien alignées.';
}
