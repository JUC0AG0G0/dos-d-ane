import PostureMascot from '../PostureMascot.jsx';
import {postureLabel} from '../posture-labels.js';

export default function SessionPreview({session, expanded, showCamera, windowVisible}) {
  const {
    running, paused, busy, comparing, message, assessment,
    video, canvas, stream, mascotSample, start, togglePause,
  } = session;
  const current = paused ? 'En pause' : running ? postureLabel(assessment) : 'Prêt pour une session ?';
  const state = paused ? 'unknown' : assessment?.state ?? 'unknown';
  const previewStatus = busy ? 'Ouverture…' : running && !paused ? 'Caméra active' :
    paused ? 'En pause' : 'Caméra arrêtée';
  const explanation = assessment?.reason ?? (
    paused ? 'Reprenez la session quand vous le souhaitez.' :
      running ? message || 'Analyse en cours. Gardez la tête et les épaules visibles.' :
        'Démarrez pour analyser votre posture.'
  );

  return (
    <div className="preview-row">
      <div className="live-visuals">
        <div className="camera">
          <video
            ref={video}
            autoPlay
            muted
            playsInline
            style={{visibility: showCamera ? 'visible' : 'hidden'}}
          />
          <canvas ref={canvas}/>
          <div className="camera-label">{previewStatus}</div>
          {!stream.current && (
            <div className="camera-placeholder" aria-hidden="true"><span>◡</span></div>
          )}
        </div>
        <PostureMascot
          sample={mascotSample}
          assessment={assessment}
          active={running && !paused}
          visible={windowVisible}
        />
      </div>
      <div className="status">
        <span className="status-name">{expanded ? 'Posture actuelle' : 'Suivi de posture'}</span>
        <strong><i className={`dot ${state}`}/>{current}</strong>
        {expanded && <p>{explanation}</p>}
      </div>
      {!running ? (
        <button className="primary start" onClick={start} disabled={busy}>
          {busy ? 'Patientez…' : 'Démarrer'}
        </button>
      ) : expanded ? (
        <button className="small-action" onClick={togglePause} disabled={busy || comparing}>
          {paused ? 'Reprendre' : 'Pause'}
        </button>
      ) : null}
    </div>
  );
}
