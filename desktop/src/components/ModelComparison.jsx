import {MODEL_NAMES} from '../inference-client.js';
import {postureLabel, regionLabel} from '../posture-labels.js';
import {coverageLabels} from './assessment-copy.js';

export default function ModelComparison({running, paused, comparing, comparison, selected, onCompare}) {
  return (
    <>
      <div className="comparison-heading">
        <strong>Comparer sur la même image</strong>
        <button onClick={onCompare} disabled={!running || paused || comparing}>
          {comparing ? 'Analyse en cours…' : 'Comparer les 3'}
        </button>
      </div>
      <div className="comparison-list">
        {comparison.length === 0 ? (
          <p>Comparez l’état de la tête et de la nuque avec les trois modèles.</p>
        ) : comparison.map(row => (
          <div
            className={`comparison-item ${selected === row.model ? 'selected' : ''}`}
            key={row.model}
            data-face-available={row.faceAvailable === true}
            data-hands-available={row.handsAvailable === true}
            data-backend={row.backend}
          >
            <strong>{MODEL_NAMES[row.model]}</strong>
            <span className={row.error ? 'bad' : row.state}>
              {row.error ? 'Indisponible' : postureLabel(row)}
            </span>
            <small>
              {row.error ?? `Tête : ${regionLabel(row, 'head')} · Nuque : ${regionLabel(row, 'neck')}`}
            </small>
            {!row.error && <small>{coverageLabels[row.coverage]} · {row.time} ms d’analyse</small>}
          </div>
        ))}
      </div>
    </>
  );
}
