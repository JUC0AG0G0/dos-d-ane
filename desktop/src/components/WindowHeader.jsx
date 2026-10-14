import {MODEL_NAMES} from '../inference-client.js';

export default function WindowHeader({expanded, running, selected, onToggleExpanded, onClose}) {
  return (
    <div className="top drag">
      <div className="logo" aria-hidden="true">
        <svg viewBox="0 0 28 28"><path d="M3 21h4L14 7l7 14h4"/></svg>
      </div>
      <div className="top-copy">
        <span>Dos d’âne{running ? ` · ${MODEL_NAMES[selected]}` : ''}</span>
        <strong>Votre posture, au quotidien</strong>
      </div>
      <button
        className="window-button no-drag"
        onClick={onToggleExpanded}
        aria-label={expanded ? 'Réduire la fenêtre' : 'Déplier la fenêtre'}
        title={expanded ? 'Vue compacte' : 'Voir les détails'}
      >
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d={expanded ? 'M6 7l4 4 4-4' : 'M6 12l4-4 4 4'}/>
        </svg>
      </button>
      <button
        className="close-button no-drag"
        onClick={onClose}
        aria-label="Masquer la fenêtre, continuer le suivi"
        title="Masquer · le suivi continue"
      >
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 6l8 8M14 6l-8 8"/></svg>
      </button>
    </div>
  );
}
