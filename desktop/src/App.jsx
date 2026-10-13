import {useCallback, useEffect, useRef, useState} from 'react';
import {MODEL_NAMES, MODEL_COUNTS, detectPose, releaseModels} from './inference-client.js';
import {evaluate, createPostureTracker, countVisible, drawSkeleton} from './pose.js';
import {postureLabel, regionLabel} from './posture-labels.js';
import PostureMascot from './PostureMascot.jsx';
import {mascotPose} from './mascot-pose.js';
import './mascot.css';
import './posture.css';

const regionNames = {head:'Tête', neck:'Nuque', shoulders:'Épaules'};
const coverageLabels = {full:'Analyse complète', partial:'Analyse partielle', insufficient:'Cadrage insuffisant'};
const errorMessage = error => error?.name === 'NotAllowedError' ? 'Autorisez la caméra dans les paramètres Windows.' :
  error?.name === 'NotFoundError' ? 'Aucune webcam détectée.' :
  error?.name === 'NotReadableError' ? 'La webcam est déjà utilisée par une autre application.' :
  error?.message || 'Le suivi n’a pas pu démarrer.';

export default function App() {
  const [windowVisible,setWindowVisible]=useState(true);
  const visibleRef=useRef(true);
  useEffect(()=>{const update=value=>{visibleRef.current=value;setWindowVisible(value);};const unsubscribe=window.desktop?.onVisibility(update);window.desktop?.isVisible().then(update);return()=>unsubscribe?.();},[]);
  const [expanded, setExpanded] = useState(false), [running, setRunning] = useState(false), [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState('mediapipe'), [assessment, setAssessment] = useState(null);
  const [visiblePoints, setVisiblePoints] = useState(0), [comparison, setComparison] = useState([]), [comparing, setComparing] = useState(false);
  const [busy, setBusy] = useState(false), [message, setMessage] = useState(''), [elapsed, setElapsed] = useState(0), [showCamera, setShowCamera] = useState(true);
  const video = useRef(null), canvas = useRef(null), stream = useRef(null), generation = useRef(0), compareLock = useRef(false);
  const startedAt = useRef(0), elapsedBase = useRef(0), badSince = useRef(null), lastObservation = useRef(0), nextNotice = useRef(0);

  const clearDrawing = useCallback(() => {
    if (canvas.current) canvas.current.getContext('2d').clearRect(0, 0, canvas.current.width, canvas.current.height);
  }, []);
  const stopTracks = useCallback(() => {
    generation.current++;
    stream.current?.getTracks().forEach(track => track.stop()); stream.current = null;
    if (video.current) { video.current.pause(); video.current.srcObject = null; }
    clearDrawing();
  }, [clearDrawing]);
  const startCamera = useCallback(async () => {
    const current = ++generation.current;
    setBusy(true); setMessage('Ouverture de la webcam…');
    try {
      const media = await navigator.mediaDevices.getUserMedia({video:{facingMode:'user', width:{ideal:640}, height:{ideal:480}, frameRate:{ideal:24, max:30}}, audio:false});
      if (current !== generation.current) { media.getTracks().forEach(track => track.stop()); return false; }
      stream.current = media; video.current.srcObject = media; await video.current.play();
      if (current !== generation.current) { media.getTracks().forEach(track => track.stop()); return false; }
      for (const track of media.getVideoTracks()) {
        track.onended = () => {
          if (current !== generation.current) return;
          stopTracks(); releaseModels(); setRunning(false); setPaused(false); setBusy(false);
          setAssessment(null); setVisiblePoints(0); setComparison([]); setComparing(false); setElapsed(0); compareLock.current = false;
          badSince.current = null; lastObservation.current = 0; nextNotice.current = 0;
          setMessage('Connexion à la webcam interrompue.');
        };
      }
      setMessage(''); setBusy(false); return true;
    } catch (error) {
      if (current === generation.current) {
        stream.current?.getTracks().forEach(track => track.stop()); stream.current = null;
        if (video.current) video.current.srcObject = null;
        setBusy(false); setMessage(errorMessage(error));
      }
      return false;
    }
  }, [stopTracks]);
  const start = async () => {
    if (running || busy) return;
    if (await startCamera()) {
      elapsedBase.current = 0; startedAt.current = performance.now();
      setElapsed(0); setRunning(true); setPaused(false); setComparison([]);
    }
  };
  const stop = () => {
    stopTracks(); releaseModels(); setRunning(false); setPaused(false); setBusy(false); setMessage('');
    setAssessment(null); setVisiblePoints(0); setComparison([]); setElapsed(0); setComparing(false); compareLock.current = false;
    badSince.current = null; lastObservation.current = 0; nextNotice.current = 0;
  };
  const togglePause = async () => {
    if (paused) { if (await startCamera()) { startedAt.current = performance.now(); setPaused(false); } return; }
    elapsedBase.current += Math.floor((performance.now() - startedAt.current) / 1000);
    stopTracks(); setPaused(true); setAssessment(null); setVisiblePoints(0); setComparison([]); setComparing(false); compareLock.current = false;
    setMessage('Suivi en pause · caméra arrêtée');
  };
  useEffect(() => () => { stopTracks(); releaseModels(); }, [stopTracks]);
  useEffect(() => {
    if (!running || paused) return;
    const id = setInterval(() => setElapsed(elapsedBase.current + Math.floor((performance.now() - startedAt.current) / 1000)), 1000);
    return () => clearInterval(id);
  }, [running, paused]);

  useEffect(() => {
    if (!running || paused) return;
    let cancelled = false, timer, lastVideoTime = -1, lastUi = 0, uiSignature = '';
    const sessionGeneration = generation.current;
    const tracker = createPostureTracker();
    setAssessment(null); setVisiblePoints(0); clearDrawing(); setMessage(`Préparation de ${MODEL_NAMES[selected]}…`);
    async function loop() {
      if (cancelled) return;
      const frameStart = performance.now(); let interval = 120;
      try {
        const source = video.current;
        if (source?.readyState >= 2 && source.videoWidth && source.currentTime !== lastVideoTime && !compareLock.current) {
          lastVideoTime = source.currentTime;
          const frame = await detectPose(selected, source, source.videoWidth, source.videoHeight);
          if (cancelled || sessionGeneration !== generation.current) return;
          const now = performance.now(), next = tracker.update(frame, source.videoWidth, source.videoHeight, now);
          interval = frame.recommendedIntervalMs ?? Math.max(selected === 'yolo' ? 220 : 100, Math.min(800, (frame.inferenceMs ?? 100) * 1.25));
          if (visibleRef.current && !document.hidden) drawSkeleton(canvas.current, {...frame, landmarks:next.landmarks ?? frame.landmarks, face:next.face}, next.regions, source.videoWidth, source.videoHeight);
          if (now - lastUi >= 250) {
            const signature = JSON.stringify([next.state, next.regions, next.reason, next.coverage, next.regionCoverage, next.regionReasons,Math.round(mascotPose(next).bend/4)]);
            if (signature !== uiSignature) { setAssessment(next); uiSignature = signature; }
            setVisiblePoints(countVisible(next.landmarks ?? frame.landmarks)); lastUi = now;
          }
          setMessage(frame.faceAvailable === false ? 'Le suivi détaillé du visage est indisponible. La posture reste partiellement mesurable.' : '');
          if (lastObservation.current && now - lastObservation.current > 2000) badSince.current = null;
          lastObservation.current = now;
          if (next.state === 'bad') {
            badSince.current ??= now;
            if (now - badSince.current >= 30000 && now >= nextNotice.current) {
              window.desktop?.notify('Dos d’âne · posture à corriger', next.reason); nextNotice.current = now + 60000;
            }
          } else badSince.current = null;
        }
      } catch (error) {
        if (cancelled || sessionGeneration !== generation.current || error?.name === 'AbortError') return;
        uiSignature = ''; badSince.current = null; lastObservation.current = 0;
        setMessage(`${MODEL_NAMES[selected]} : ${errorMessage(error)}`); setAssessment(null); setVisiblePoints(0); clearDrawing(); interval = 1500;
      }
      if (!cancelled) timer = setTimeout(loop, Math.max(20, interval - (performance.now() - frameStart)));
    }
    const freshness = setInterval(() => {
      if (!cancelled && !compareLock.current && lastObservation.current && performance.now() - lastObservation.current > 3000) {
        setAssessment(null); setVisiblePoints(0); clearDrawing(); uiSignature = ''; lastObservation.current = 0;
        setMessage('Le suivi est interrompu. Vérifiez le cadrage et la webcam.');
      }
    }, 500);
    loop();
    return () => { cancelled = true; clearTimeout(timer); clearInterval(freshness); releaseModels(); badSince.current = null; lastObservation.current = 0; };
  }, [running, paused, selected, clearDrawing]);

  const compare = async () => {
    if (!running || paused || comparing || video.current?.readyState < 2 || !video.current?.videoWidth) return;
    compareLock.current = true; setComparing(true); setComparison([]);
    const comparisonGeneration = generation.current, source = video.current, rows = [];
    let failed = false;
    try {
      const snapshot = document.createElement('canvas');
      snapshot.width = source.videoWidth; snapshot.height = source.videoHeight; snapshot.getContext('2d').drawImage(source, 0, 0);
      for (const model of Object.keys(MODEL_NAMES)) {
        if (comparisonGeneration !== generation.current) return;
        setMessage(`Comparaison : ${MODEL_NAMES[model]}…`);
        try {
          const frame = await detectPose(model, snapshot, snapshot.width, snapshot.height, {detail:true, comparison:true});
          rows.push({model, ...evaluate(frame, snapshot.width, snapshot.height), visible:countVisible(frame.landmarks), time:Math.round(frame.inferenceMs), faceAvailable:frame.faceAvailable, backend:frame.backend});
        } catch (error) { rows.push({model, error:errorMessage(error)}); }
        if (comparisonGeneration !== generation.current) return;
        setComparison([...rows]);
      }
    } catch (error) {
      failed = true;
      if (comparisonGeneration === generation.current) setMessage(errorMessage(error));
    } finally {
      if (comparisonGeneration === generation.current) { if (!failed) setMessage(''); setComparing(false); compareLock.current = false; }
    }
  };
  const toggleExpanded = () => { const next = !expanded; setExpanded(next); window.desktop?.resize(next); };
  const close = () => { window.desktop?.close(); };
  const current = paused ? 'En pause' : running ? postureLabel(assessment) : 'Prêt pour une session ?';
  const state = paused ? 'unknown' : assessment?.state ?? 'unknown';
  const previewStatus = busy ? 'Ouverture…' : running && !paused ? 'Caméra active' : paused ? 'En pause' : 'Caméra arrêtée';
  return <div className={`shell ${expanded ? 'expanded' : 'compact'}`} data-observed-at={lastObservation.current}>
    <div className="top drag">
      <div className="logo" aria-hidden="true"><svg viewBox="0 0 28 28"><path d="M3 21h4L14 7l7 14h4"/></svg></div>
      <div className="top-copy"><span>Dos d’âne{running ? ` · ${MODEL_NAMES[selected]}` : ''}</span><strong>Votre posture, au quotidien</strong></div>
      <button className="window-button no-drag" onClick={toggleExpanded} aria-label={expanded ? 'Réduire la fenêtre' : 'Déplier la fenêtre'} title={expanded ? 'Vue compacte' : 'Voir les détails'}><svg viewBox="0 0 20 20" aria-hidden="true"><path d={expanded?'M6 7l4 4 4-4':'M6 12l4-4 4 4'}/></svg></button>
      <button className="close-button no-drag" onClick={close} aria-label="Masquer la fenêtre, continuer le suivi" title="Masquer · le suivi continue"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 6l8 8M14 6l-8 8"/></svg></button>
    </div>
    <div className="preview-row">
      <div className="live-visuals"><div className="camera"><video ref={video} autoPlay muted playsInline style={{visibility:showCamera ? 'visible' : 'hidden'}}/><canvas ref={canvas}/><div className="camera-label">{previewStatus}</div>{!stream.current && <div className="camera-placeholder" aria-hidden="true"><span>◡</span></div>}</div><PostureMascot assessment={assessment} active={running&&!paused} visible={windowVisible}/></div>
      <div className="status"><span className="status-name">{expanded ? 'Posture actuelle' : 'Suivi de posture'}</span><strong><i className={`dot ${state}`}/>{current}</strong>{expanded && <p>{assessment?.reason ?? (paused ? 'Reprenez la session quand vous le souhaitez.' : running ? message || 'Analyse en cours. Gardez la tête et les épaules visibles.' : 'Démarrez pour analyser votre posture.')}</p>}</div>
      {!running ? <button className="primary start" onClick={start} disabled={busy}>{busy ? 'Patientez…' : 'Démarrer'}</button> : expanded ? <button className="small-action" onClick={togglePause} disabled={busy || comparing}>{paused ? 'Reprendre' : 'Pause'}</button> : null}
    </div>
    {expanded && <div className="details">
      <div className="session-line"><span>Session</span><time>{String(Math.floor(elapsed / 60)).padStart(2, '0')}:{String(elapsed % 60).padStart(2, '0')}</time></div>
      <div className="region-list">{Object.entries(regionNames).map(([key, name]) => <div key={key} className="region-row" data-region={key} data-scope={assessment?.regionCoverage?.[key] ?? 'insufficient'}><span>{name}</span><strong className={assessment?.regions[key] ?? 'unknown'}>{regionLabel(assessment,key)}</strong>{assessment?.regionReasons?.[key] && <small>{assessment.regionReasons[key]}</small>}</div>)}</div>
      {running && !paused && <p className={`coverage ${assessment?.coverage ?? 'insufficient'}`}>{coverageLabels[assessment?.coverage ?? 'insufficient']}</p>}
      <div className="privacy-row"><label><input type="checkbox" checked={showCamera} onChange={event => setShowCamera(event.target.checked)}/> Aperçu caméra</label><span>{visiblePoints} / {MODEL_COUNTS[selected]} points du corps</span></div>
      <label className="model-label" htmlFor="model">Modèle de détection</label>
      <select id="model" value={selected} disabled={comparing} onChange={event => { setSelected(event.target.value); setComparison([]); }}>{Object.entries(MODEL_NAMES).map(([key, name]) => <option key={key} value={key}>{name}</option>)}</select>
      <p className="model-note">Le suivi du visage affine la tête pour les trois modèles.</p>
      <div className="comparison-heading"><strong>Comparer sur la même image</strong><button onClick={compare} disabled={!running || paused || comparing}>{comparing ? 'Analyse en cours…' : 'Comparer les 3'}</button></div>
      <div className="comparison-list">{comparison.length === 0 ? <p>Comparez l’état de la tête et de la nuque avec les trois modèles.</p> : comparison.map(row => <div className={`comparison-item ${selected === row.model ? 'selected' : ''}`} key={row.model} data-face-available={row.faceAvailable === true} data-backend={row.backend}><strong>{MODEL_NAMES[row.model]}</strong><span className={row.error ? 'bad' : row.state}>{row.error ? 'Indisponible' : postureLabel(row)}</span><small>{row.error ?? `Tête : ${regionLabel(row,'head')} · Nuque : ${regionLabel(row,'neck')}`}</small>{!row.error && <small>{coverageLabels[row.coverage]} · {row.time} ms d’analyse</small>}</div>)}</div>
      <details className="assessment-help"><summary>Comment la posture est évaluée</summary><p>Le suivi croise l’orientation de la tête, l’alignement tête–épaules, la nuque et le buste. Les points incertains sont écartés et le résultat doit rester stable avant de changer de couleur. Une caméra de profil aide à voir la tête avancée. Une partie masquée reste indiquée comme non visible.</p></details>
      {message && <p className="message" role="status">{message}</p>}
      <div className="controls">{running && <button className="stop" onClick={stop}>Terminer la session</button>}<span>Repères de posture indicatifs</span></div>
    </div>}
    {!expanded && message && <p className="compact-message" role="status">{message}</p>}
  </div>;
}
