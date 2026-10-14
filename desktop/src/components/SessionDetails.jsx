import {MODEL_COUNTS, MODEL_NAMES} from '../inference-client.js';
import {regionLabel} from '../posture-labels.js';
import {coverageLabels, regionNames} from './assessment-copy.js';
import ModelComparison from './ModelComparison.jsx';

export default function SessionDetails({session, showCamera, onShowCameraChange}) {
  const {
    running, paused, elapsed, assessment, visiblePoints, selected, comparing,
    comparison, message, compare, stop, selectModel,
  } = session;

  return (
    <div className="details">
      <div className="session-line">
        <span>Session</span>
        <time>
          {String(Math.floor(elapsed / 60)).padStart(2, '0')}:{String(elapsed % 60).padStart(2, '0')}
        </time>
      </div>
      <div className="region-list">
        {Object.entries(regionNames).map(([key, name]) => (
          <div
            key={key}
            className="region-row"
            data-region={key}
            data-scope={assessment?.regionCoverage?.[key] ?? 'insufficient'}
          >
            <span>{name}</span>
            <strong className={assessment?.regions[key] ?? 'unknown'}>
              {regionLabel(assessment, key)}
            </strong>
            {assessment?.regionReasons?.[key] && <small>{assessment.regionReasons[key]}</small>}
          </div>
        ))}
      </div>
      {running && !paused && (
        <p className={`coverage ${assessment?.coverage ?? 'insufficient'}`}>
          {coverageLabels[assessment?.coverage ?? 'insufficient']}
        </p>
      )}
      <div className="privacy-row">
        <label>
          <input
            type="checkbox"
            checked={showCamera}
            onChange={event => onShowCameraChange(event.target.checked)}
          /> Aperçu caméra
        </label>
        <span>{visiblePoints} / {MODEL_COUNTS[selected]} points du corps</span>
      </div>
      <label className="model-label" htmlFor="model">Modèle de détection</label>
      <select
        id="model"
        value={selected}
        disabled={comparing}
        onChange={event => selectModel(event.target.value)}
      >
        {Object.entries(MODEL_NAMES).map(([key, name]) => <option key={key} value={key}>{name}</option>)}
      </select>
      <p className="model-note">
        La tête et les doigts sont suivis avec les trois modèles. Gardez les coudes et les mains dans le cadre.
      </p>
      <ModelComparison
        running={running}
        paused={paused}
        comparing={comparing}
        comparison={comparison}
        selected={selected}
        onCompare={compare}
      />
      <details className="assessment-help">
        <summary>Comment la posture est évaluée</summary>
        <p>
          Le suivi croise l’orientation de la tête, l’alignement tête–épaules, la nuque et le buste.
          Les points incertains sont écartés et le résultat doit rester stable avant de changer de couleur.
          Une caméra de profil aide à voir la tête avancée. Une partie masquée reste indiquée comme non visible.
        </p>
      </details>
      {message && <p className="message" role="status">{message}</p>}
      <div className="controls">
        {running && <button className="stop" onClick={stop}>Terminer la session</button>}
        <span>Repères de posture indicatifs</span>
      </div>
    </div>
  );
}
